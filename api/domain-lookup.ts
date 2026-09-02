// Authoritative WHOIS / RDAP Domain Lookup Serverless Function for Vercel

export interface DomainLookupResult {
  domain: string;
  registrar: string;
  registrationDate: string | null;
  expiryDate: string | null;
  updatedDate: string | null;
  nameservers: string[];
  status: string[];
  cached?: boolean;
}

// In-Memory Cache for warm serverless instances (1 hour)
const domainCache = new Map<string, { data: DomainLookupResult; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000;

// Rate limiter per IP (30 req / 60s)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    const oldest = timestamps[0];
    const resetTime = Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, remaining: 0, resetTime: Math.max(resetTime, 1) };
  }

  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return { allowed: true, remaining: MAX_REQUESTS - timestamps.length, resetTime: 60 };
}

function sanitizeDomain(input: unknown): string {
  if (typeof input !== 'string') throw new Error('Domain name must be a string.');
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//i, '').split(/[/?#:]/)[0].replace(/^\.+|\.+$/g, '');
  if (domain.startsWith('www.')) domain = domain.substring(4);

  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9-]{2,63}$/i;
  if (!domain || domain.length > 253 || !domainRegex.test(domain)) {
    throw new Error(`"${input}" is not a valid domain name (e.g. example.com).`);
  }
  return domain;
}

function extractRegistrar(entities: any[] = []): string {
  if (!Array.isArray(entities)) return 'Unknown Registrar';
  const registrarEntity = entities.find((e: any) =>
    Array.isArray(e?.roles) && (e.roles.includes('registrar') || e.roles.includes('sponsor'))
  ) || entities[0];

  if (!registrarEntity) return 'Unknown Registrar';

  if (Array.isArray(registrarEntity.vcardArray) && Array.isArray(registrarEntity.vcardArray[1])) {
    const fnProp = registrarEntity.vcardArray[1].find((prop: any) => Array.isArray(prop) && prop[0] === 'fn');
    if (fnProp && typeof fnProp[3] === 'string' && fnProp[3].trim()) {
      return fnProp[3].trim();
    }
  }

  if (registrarEntity.name && typeof registrarEntity.name === 'string') return registrarEntity.name.trim();
  if (registrarEntity.handle && typeof registrarEntity.handle === 'string') return registrarEntity.handle.trim();
  if (Array.isArray(registrarEntity.publicIds) && registrarEntity.publicIds[0]?.identifier) {
    return `IANA ID ${registrarEntity.publicIds[0].identifier}`;
  }
  return 'Unknown Registrar';
}

function extractDates(events: any[] = []): { registrationDate: string | null; expiryDate: string | null; updatedDate: string | null } {
  let registrationDate: string | null = null;
  let expiryDate: string | null = null;
  let updatedDate: string | null = null;

  if (Array.isArray(events)) {
    for (const ev of events) {
      const action = (ev?.eventAction || '').toLowerCase();
      const date = ev?.eventDate || null;
      if (!date) continue;

      if (action.includes('registration') || action.includes('create') || action === 'registered') {
        if (!registrationDate) registrationDate = date;
      } else if (action.includes('expiration') || action.includes('expire') || action === 'expired') {
        if (!expiryDate) expiryDate = date;
      } else if (action.includes('last changed') || action.includes('update') || action === 'last update') {
        if (!updatedDate) updatedDate = date;
      }
    }
  }
  return { registrationDate, expiryDate, updatedDate };
}

function extractNameservers(nameservers: any[] = []): string[] {
  if (!Array.isArray(nameservers)) return [];
  const list: string[] = [];
  for (const ns of nameservers) {
    if (typeof ns === 'string' && ns.trim()) list.push(ns.trim().toLowerCase());
    else if (ns && typeof ns.ldhName === 'string' && ns.ldhName.trim()) list.push(ns.ldhName.trim().toLowerCase());
    else if (ns && typeof ns.unicodeName === 'string' && ns.unicodeName.trim()) list.push(ns.unicodeName.trim().toLowerCase());
  }
  return Array.from(new Set(list));
}

async function queryRDAP(domain: string): Promise<DomainLookupResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    const primaryUrl = `https://rdap.org/domain/${encodeURIComponent(domain)}`;
    let res: Response;
    try {
      res = await fetch(primaryUrl, {
        signal: controller.signal,
        headers: { 'Accept': 'application/rdap+json, application/json', 'User-Agent': 'DomainChecker/1.0' },
        redirect: 'follow',
      });
    } catch {
      const tld = domain.split('.').pop() || '';
      const fallbackUrl = (tld === 'com' || tld === 'net')
        ? `https://rdap.verisign.com/${tld}/v1/domain/${encodeURIComponent(domain)}`
        : `https://rdap.publicinterestregistry.org/rdap/domain/${encodeURIComponent(domain)}`;

      res = await fetch(fallbackUrl, {
        signal: controller.signal,
        headers: { 'Accept': 'application/rdap+json, application/json' },
        redirect: 'follow',
      });
    }

    clearTimeout(timeout);

    if (res.status === 404) {
      throw new Error(`Domain "${domain}" is not registered or WHOIS data is unavailable.`);
    }

    if (!res.ok) {
      throw new Error(`RDAP registry returned status ${res.status}`);
    }

    const data = await res.json() as any;
    const registrar = extractRegistrar(data?.entities);
    const { registrationDate, expiryDate, updatedDate } = extractDates(data?.events);
    const nameservers = extractNameservers(data?.nameservers);
    const status = Array.isArray(data?.status) ? data.status.map(String) : ['active'];

    return {
      domain,
      registrar,
      registrationDate,
      expiryDate,
      updatedDate,
      nameservers,
      status,
    };
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      throw new Error('Lookup request timed out from upstream WHOIS registry. Please try again.');
    }
    throw err;
  }
}

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      error: 'METHOD_NOT_ALLOWED',
      message: 'Method Not Allowed. Use POST.',
    });
  }

  const clientIp = (req.headers?.['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1';
  const rate = checkRateLimit(clientIp);

  res.setHeader('X-RateLimit-Limit', '30');
  res.setHeader('X-RateLimit-Remaining', String(rate.remaining));
  res.setHeader('X-RateLimit-Reset', String(rate.resetTime));

  if (!rate.allowed) {
    return res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      message: `Rate limit exceeded. Please wait ${rate.resetTime}s before trying again.`,
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'INVALID_JSON', message: 'Malformed JSON payload.' });
      }
    }

    const rawDomain = body?.domain;
    if (!rawDomain) {
      return res.status(400).json({ error: 'MISSING_DOMAIN', message: 'Missing required field "domain".' });
    }

    const domain = sanitizeDomain(rawDomain);

    // Cache check
    const cached = domainCache.get(domain);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.status(200).json({ ...cached.data, cached: true });
    }

    const result = await queryRDAP(domain);
    domainCache.set(domain, { data: result, timestamp: Date.now() });

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({
      error: 'LOOKUP_FAILED',
      message: err.message || 'An unexpected error occurred during domain lookup.',
    });
  }
}
