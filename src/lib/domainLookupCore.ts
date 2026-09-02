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

export class DomainLookupError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = 'DomainLookupError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

// 1-Hour in-memory cache with timestamp
interface CacheEntry {
  data: DomainLookupResult;
  timestamp: number;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour (3,600,000 ms)
const domainCache = new Map<string, CacheEntry>();

/**
 * Clean up expired cache entries periodically to avoid memory growth
 */
function cleanupExpiredCache() {
  const now = Date.now();
  for (const [key, entry] of domainCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL_MS) {
      domainCache.delete(key);
    }
  }
}

// In-Memory Rate Limiter per IP (30 requests / 60 seconds)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

/**
 * Enforce rate limiting per client IP
 */
export function checkRateLimit(
  ip: string = 'unknown',
  limit: number = MAX_REQUESTS_PER_WINDOW,
  windowMs: number = RATE_LIMIT_WINDOW_MS
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];

  // Filter out timestamps older than the window
  const validTimestamps = timestamps.filter(t => now - t < windowMs);

  if (validTimestamps.length >= limit) {
    const oldestTimestamp = validTimestamps[0];
    const resetTime = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetTime: Math.max(resetTime, 1),
    };
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);

  // Periodically clean up stale IPs
  if (rateLimitMap.size > 5000) {
    for (const [key, list] of rateLimitMap.entries()) {
      const recent = list.filter(t => now - t < windowMs);
      if (recent.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, recent);
      }
    }
  }

  return {
    allowed: true,
    remaining: limit - validTimestamps.length,
    resetTime: Math.ceil(windowMs / 1000),
  };
}

/**
 * Structured request logging for API monitoring
 */
export function logDomainLookup(
  domain: string,
  ip: string,
  statusCode: number,
  durationMs: number,
  cached: boolean = false,
  error?: string
) {
  const time = new Date().toISOString();
  if (error) {
    console.warn(`[DomainLookup] ${time} | IP: ${ip} | Domain: "${domain}" | Status: ${statusCode} | Error: ${error} | ${durationMs}ms`);
  } else {
    console.log(`[DomainLookup] ${time} | IP: ${ip} | Domain: "${domain}" | Status: ${statusCode} | Cached: ${cached} | ${durationMs}ms`);
  }
}

/**
 * Sanitize and validate domain format
 */
export function sanitizeAndValidateDomain(input: unknown): string {
  if (typeof input !== 'string') {
    throw new DomainLookupError('Domain name must be a string.', 400, 'INVALID_DOMAIN');
  }

  let domain = input.trim().toLowerCase();

  // Strip protocol if supplied (http://, https://, etc.)
  domain = domain.replace(/^https?:\/\//i, '');

  // Strip path, query params, hash
  domain = domain.split(/[/?#]/)[0];

  // Strip port if present
  domain = domain.split(':')[0];

  // Strip trailing/leading dots
  domain = domain.replace(/^\.+|\.+$/g, '');

  // Strip leading www. if present for root registrar check, but allow subdomains
  if (domain.startsWith('www.')) {
    domain = domain.substring(4);
  }

  if (!domain || domain.length > 253) {
    throw new DomainLookupError('Invalid domain length.', 400, 'INVALID_DOMAIN');
  }

  // Domain Regex:
  // - Labels must be 1-63 chars long
  // - Labels cannot start or end with hyphen
  // - Must have at least one dot separating domain and TLD
  // - TLD must be at least 2 alphabetic chars or punycode xn--
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9]{2,59})$/i;

  if (!domainRegex.test(domain)) {
    throw new DomainLookupError(
      `"${input}" is not a valid domain format. Example valid domain: example.com`,
      400,
      'INVALID_DOMAIN'
    );
  }

  return domain;
}

/**
 * Extract registrar name from RDAP entity array
 */
function extractRegistrarFromEntities(entities: any[] = []): string {
  if (!Array.isArray(entities)) return 'Unknown Registrar';

  // 1. Look for entity with role 'registrar' or 'sponsor'
  const registrarEntity = entities.find((e: any) =>
    Array.isArray(e?.roles) && (e.roles.includes('registrar') || e.roles.includes('sponsor'))
  ) || entities[0];

  if (!registrarEntity) return 'Unknown Registrar';

  // 2. Try vCard FN (Formatted Name)
  if (Array.isArray(registrarEntity.vcardArray) && Array.isArray(registrarEntity.vcardArray[1])) {
    const vcardProps = registrarEntity.vcardArray[1];
    const fnProp = vcardProps.find((prop: any) => Array.isArray(prop) && prop[0] === 'fn');
    if (fnProp && typeof fnProp[3] === 'string' && fnProp[3].trim()) {
      return fnProp[3].trim();
    }
  }

  // 3. Try entity handle, name or publicIds
  if (registrarEntity.name && typeof registrarEntity.name === 'string') {
    return registrarEntity.name.trim();
  }

  if (registrarEntity.handle && typeof registrarEntity.handle === 'string') {
    return registrarEntity.handle.trim();
  }

  if (Array.isArray(registrarEntity.publicIds) && registrarEntity.publicIds[0]?.identifier) {
    return `IANA ID ${registrarEntity.publicIds[0].identifier}`;
  }

  return 'Unknown Registrar';
}

/**
 * Extract dates from RDAP events array
 */
function extractDatesFromEvents(events: any[] = []): {
  registrationDate: string | null;
  expiryDate: string | null;
  updatedDate: string | null;
} {
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

/**
 * Extract nameservers from RDAP nameservers array
 */
function extractNameservers(nameservers: any[] = []): string[] {
  if (!Array.isArray(nameservers)) return [];
  const nsList: string[] = [];

  for (const ns of nameservers) {
    if (typeof ns === 'string' && ns.trim()) {
      nsList.push(ns.trim().toLowerCase());
    } else if (ns && typeof ns.ldhName === 'string' && ns.ldhName.trim()) {
      nsList.push(ns.ldhName.trim().toLowerCase());
    } else if (ns && typeof ns.unicodeName === 'string' && ns.unicodeName.trim()) {
      nsList.push(ns.unicodeName.trim().toLowerCase());
    }
  }

  return Array.from(new Set(nsList));
}

/**
 * Extract status array from RDAP status field
 */
function extractStatus(status: any): string[] {
  if (Array.isArray(status)) {
    return status.map(s => String(s).trim()).filter(Boolean);
  }
  if (typeof status === 'string' && status.trim()) {
    return [status.trim()];
  }
  return ['active'];
}

/**
 * Perform WHOIS lookup via WhoisXML API
 */
async function fetchFromWhoisXML(domain: string, apiKey: string): Promise<DomainLookupResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const url = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${encodeURIComponent(apiKey)}&domainName=${encodeURIComponent(domain)}&outputFormat=JSON`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });

    clearTimeout(timeoutId);

    if (res.status === 404) {
      throw new DomainLookupError(`Domain "${domain}" was not found.`, 404, 'DOMAIN_NOT_FOUND');
    }

    if (!res.ok) {
      throw new DomainLookupError(`WhoisXML API returned status ${res.status}`, 502, 'UPSTREAM_ERROR');
    }

    const data = (await res.json()) as any;
    const record = data?.WhoisRecord;

    if (!record || record.dataError === 'MISSING_WHOIS_DATA') {
      throw new DomainLookupError(`Domain "${domain}" is not registered or WHOIS data is unavailable.`, 404, 'DOMAIN_NOT_FOUND');
    }

    const registrar = record.registrarName || record.registryData?.registrarName || 'Unknown Registrar';
    const registrationDate = record.createdDate || record.registryData?.createdDate || null;
    const expiryDate = record.expiresDate || record.registryData?.expiresDate || null;
    const updatedDate = record.updatedDate || record.registryData?.updatedDate || null;
    const rawNs = record.nameServers?.hostNames || record.registryData?.nameServers?.hostNames || [];
    const nameservers = Array.isArray(rawNs) ? rawNs.map((n: string) => String(n).toLowerCase()) : [];
    const rawStatus = record.status || record.registryData?.status || 'active';
    const status = Array.isArray(rawStatus) ? rawStatus : [String(rawStatus)];

    return {
      domain,
      registrar,
      registrationDate,
      expiryDate,
      updatedDate,
      nameservers,
      status
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new DomainLookupError('Lookup request timed out. Please try again.', 504, 'UPSTREAM_TIMEOUT');
    }
    if (err instanceof DomainLookupError) {
      throw err;
    }
    throw new DomainLookupError(err.message || 'Error contacting WhoisXML API', 502, 'UPSTREAM_ERROR');
  }
}

/**
 * Perform WHOIS lookup via RDAP (IANA Bootstrap / RDAP.org resolver)
 */
async function fetchFromRDAP(domain: string): Promise<DomainLookupResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    // Primary RDAP endpoint via rdap.org (which proxies to authoritative IANA bootstrap servers)
    const primaryUrl = `https://rdap.org/domain/${encodeURIComponent(domain)}`;
    
    let res: Response;
    try {
      res = await fetch(primaryUrl, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/rdap+json, application/json',
          'User-Agent': 'MritunjayPortfolio-DomainChecker/1.0'
        },
        redirect: 'follow'
      });
    } catch {
      // Fallback: If rdap.org fails network, try public verisign or dns bootstrap directly
      const tld = domain.split('.').pop() || '';
      const fallbackUrl = (tld === 'com' || tld === 'net')
        ? `https://rdap.verisign.com/${tld}/v1/domain/${encodeURIComponent(domain)}`
        : `https://rdap.publicinterestregistry.org/rdap/domain/${encodeURIComponent(domain)}`;

      res = await fetch(fallbackUrl, {
        signal: controller.signal,
        headers: { 'Accept': 'application/rdap+json, application/json' },
        redirect: 'follow'
      });
    }

    clearTimeout(timeoutId);

    if (res.status === 404) {
      throw new DomainLookupError(`Domain "${domain}" is not registered or not found in registry.`, 404, 'DOMAIN_NOT_FOUND');
    }

    if (!res.ok) {
      throw new DomainLookupError(`Upstream RDAP server returned status ${res.status}`, 502, 'UPSTREAM_ERROR');
    }

    const rdapData = (await res.json()) as any;

    const registrar = extractRegistrarFromEntities(rdapData?.entities);
    const { registrationDate, expiryDate, updatedDate } = extractDatesFromEvents(rdapData?.events);
    const nameservers = extractNameservers(rdapData?.nameservers);
    const status = extractStatus(rdapData?.status);

    return {
      domain,
      registrar,
      registrationDate,
      expiryDate,
      updatedDate,
      nameservers,
      status
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new DomainLookupError('RDAP lookup request timed out from upstream registry.', 504, 'UPSTREAM_TIMEOUT');
    }
    if (err instanceof DomainLookupError) {
      throw err;
    }
    throw new DomainLookupError(err.message || 'Failed to query upstream RDAP server.', 502, 'UPSTREAM_ERROR');
  }
}

/**
 * Main domain lookup executor with caching
 */
export async function lookupDomain(rawDomain: unknown): Promise<DomainLookupResult> {
  const cleanDomain = sanitizeAndValidateDomain(rawDomain);

  // Check in-memory cache
  cleanupExpiredCache();
  const cached = domainCache.get(cleanDomain);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return {
      ...cached.data,
      cached: true
    };
  }

  // Check if WhoisXML API key is available in environment (server-side only)
  const globalProc = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } })?.process;
  const whoisXmlKey = 
    globalProc?.env?.WHOISXML_API_KEY ||
    globalProc?.env?.VITE_WHOISXML_API_KEY ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_WHOISXML_API_KEY) ||
    '';

  let result: DomainLookupResult;

  if (whoisXmlKey && whoisXmlKey.trim().length > 5) {
    try {
      result = await fetchFromWhoisXML(cleanDomain, whoisXmlKey.trim());
    } catch (whoisErr: any) {
      // If WhoisXML fails or reaches quota, fallback gracefully to RDAP
      if (whoisErr.statusCode === 404) throw whoisErr;
      result = await fetchFromRDAP(cleanDomain);
    }
  } else {
    result = await fetchFromRDAP(cleanDomain);
  }

  // Store in cache
  domainCache.set(cleanDomain, {
    data: result,
    timestamp: Date.now()
  });

  return {
    ...result,
    cached: false
  };
}
