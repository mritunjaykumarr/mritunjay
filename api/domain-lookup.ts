import { lookupDomain, DomainLookupError, checkRateLimit, logDomainLookup } from '../src/lib/domainLookupCore.ts';

export default async function handler(req: any, res: any) {
  const startTime = Date.now();
  
  // Extract Client IP
  const forwardedFor = req.headers?.['x-forwarded-for'];
  const clientIp = (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : '') ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  // CORS & Preflight Handling
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    logDomainLookup('', clientIp, 405, Date.now() - startTime, false, 'Method not allowed');
    return res.status(405).json({
      error: 'METHOD_NOT_ALLOWED',
      message: 'Method Not Allowed. Use POST.'
    });
  }

  // Rate Limiting (30 req / min per IP)
  const rateLimitStatus = checkRateLimit(clientIp, 30, 60000);
  res.setHeader('X-RateLimit-Limit', '30');
  res.setHeader('X-RateLimit-Remaining', String(rateLimitStatus.remaining));
  res.setHeader('X-RateLimit-Reset', String(rateLimitStatus.resetTime));

  if (!rateLimitStatus.allowed) {
    res.setHeader('Retry-After', String(rateLimitStatus.resetTime));
    logDomainLookup('', clientIp, 429, Date.now() - startTime, false, 'Rate limit exceeded');
    return res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      message: `Rate limit exceeded. Please wait ${rateLimitStatus.resetTime}s before trying again.`
    });
  }

  let domain = '';
  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        logDomainLookup('', clientIp, 400, Date.now() - startTime, false, 'Invalid JSON body');
        return res.status(400).json({
          error: 'INVALID_JSON',
          message: 'Malformed JSON payload in request body.'
        });
      }
    }

    domain = body?.domain || '';

    if (!domain) {
      logDomainLookup('', clientIp, 400, Date.now() - startTime, false, 'Missing domain');
      return res.status(400).json({
        error: 'MISSING_DOMAIN',
        message: 'Missing required field "domain" in request body.'
      });
    }

    const result = await lookupDomain(domain);
    logDomainLookup(result.domain, clientIp, 200, Date.now() - startTime, !!result.cached);
    return res.status(200).json(result);
  } catch (err: any) {
    if (err instanceof DomainLookupError) {
      logDomainLookup(domain, clientIp, err.statusCode, Date.now() - startTime, false, err.message);
      return res.status(err.statusCode).json({
        error: err.code,
        message: err.message
      });
    }

    logDomainLookup(domain, clientIp, 500, Date.now() - startTime, false, err.message);
    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred while processing domain lookup.'
    });
  }
}
