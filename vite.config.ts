import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { lookupDomain, DomainLookupError, checkRateLimit, logDomainLookup } from './src/lib/domainLookupCore.ts'

function domainLookupDevPlugin(): Plugin {
  return {
    name: 'domain-lookup-api-middleware',
    configureServer(server) {
      server.middlewares.use('/api/domain-lookup', async (req, res) => {
        const startTime = Date.now();
        const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.statusCode = 200;
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.setHeader('Allow', 'POST');
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 405;
          logDomainLookup('', clientIp, 405, Date.now() - startTime, false, 'Method not allowed');
          res.end(JSON.stringify({ error: 'METHOD_NOT_ALLOWED', message: 'Method Not Allowed. Use POST.' }));
          return;
        }

        // Rate Limiting (30 requests/min)
        const rateLimitStatus = checkRateLimit(clientIp, 30, 60000);
        res.setHeader('X-RateLimit-Limit', '30');
        res.setHeader('X-RateLimit-Remaining', String(rateLimitStatus.remaining));
        res.setHeader('X-RateLimit-Reset', String(rateLimitStatus.resetTime));

        if (!rateLimitStatus.allowed) {
          res.setHeader('Retry-After', String(rateLimitStatus.resetTime));
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 429;
          logDomainLookup('', clientIp, 429, Date.now() - startTime, false, 'Rate limit exceeded');
          res.end(JSON.stringify({
            error: 'RATE_LIMIT_EXCEEDED',
            message: `Rate limit exceeded. Please wait ${rateLimitStatus.resetTime}s before trying again.`
          }));
          return;
        }

        let bodyRaw = '';
        req.on('data', chunk => {
          bodyRaw += chunk;
        });

        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');

          let domain = '';
          try {
            let body: any = {};
            if (bodyRaw) {
              try {
                body = JSON.parse(bodyRaw);
              } catch {
                res.statusCode = 400;
                logDomainLookup('', clientIp, 400, Date.now() - startTime, false, 'Invalid JSON body');
                res.end(JSON.stringify({ error: 'INVALID_JSON', message: 'Malformed JSON payload in request body.' }));
                return;
              }
            }

            domain = body?.domain || '';
            if (!domain) {
              res.statusCode = 400;
              logDomainLookup('', clientIp, 400, Date.now() - startTime, false, 'Missing domain');
              res.end(JSON.stringify({ error: 'MISSING_DOMAIN', message: 'Missing required field "domain" in request body.' }));
              return;
            }

            const result = await lookupDomain(domain);
            res.statusCode = 200;
            logDomainLookup(result.domain, clientIp, 200, Date.now() - startTime, !!result.cached);
            res.end(JSON.stringify(result));
          } catch (err: any) {
            if (err instanceof DomainLookupError) {
              res.statusCode = err.statusCode;
              logDomainLookup(domain, clientIp, err.statusCode, Date.now() - startTime, false, err.message);
              res.end(JSON.stringify({ error: err.code, message: err.message }));
            } else {
              res.statusCode = 500;
              logDomainLookup(domain, clientIp, 500, Date.now() - startTime, false, err.message);
              res.end(JSON.stringify({ error: 'INTERNAL_SERVER_ERROR', message: err.message || 'An unexpected error occurred.' }));
            }
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), domainLookupDevPlugin()],
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react')) return 'vendor-react';
          if (id.includes('node_modules/gsap')) return 'vendor-gsap';
        },
      },
    },
  },
})

