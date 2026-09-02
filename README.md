# Mritunjay Kumar — Portfolio & Engineering Platform

Modern, high-performance developer portfolio and web engineering platform built with **React 19**, **TypeScript**, **Vite**, **Framer Motion**, and **Vercel Serverless Functions**.

---

## 🌟 Features & Highlights

- **Adaptive Vesper Aesthetics**: Dark & Light mode design system with liquid metal buttons, frosted glass panels, and smooth micro-animations.
- **Prince AI Assistant**: Conversational AI assistant with streaming OpenRouter / Gemini completions and contextual prompt retrieval.
- **Domain Registrar & WHOIS Checker** *(New)*:
  - Real-time domain registrar, registration date, expiry countdown, and nameserver lookup via official **IANA RDAP** (RFC 7480–7484) with WhoisXML API fallback support.
  - **In-Memory 1-Hour Caching**: High-efficiency caching eliminates repeated upstream registry requests.
  - **IP Rate Limiting**: Enforced rate limiting (30 req/min per IP) protects upstream endpoints.
  - **Single & Bulk Lookup**: Look up individual domains or batch up to 10 domains with sequential execution and exportable JSON results.
  - **Search History**: Client-side storage of the last 10 successful lookups in `localStorage`.
- **Interactive AI Playground**: Suite of 6 developer utilities (Email generator, Text summarizer, SQL query builder, ATS resume analyzer, and UX auditor).
- **SEO & Social Metadata**: Dynamic document titles, meta descriptions, OpenGraph tags, and JSON-LD schema per route.

---

## 🚀 API Endpoints

### `POST /api/domain-lookup`
Performs an authoritative WHOIS / RDAP lookup for a given domain name.

#### Request Body
```json
{
  "domain": "example.com"
}
```

#### Response Format
```json
{
  "domain": "example.com",
  "registrar": "Example Registrar, LLC",
  "registrationDate": "1995-08-14T04:00:00Z",
  "expiryDate": "2025-08-13T04:00:00Z",
  "updatedDate": "2024-08-14T07:00:00Z",
  "nameservers": [
    "a.iana-servers.net",
    "b.iana-servers.net"
  ],
  "status": [
    "clientDeleteProhibited",
    "clientTransferProhibited"
  ],
  "cached": false
}
```

#### Rate Limiting & Error Codes
- `200 OK`: Successful domain lookup (includes `"cached": true` if retrieved from 1-hour cache).
- `400 Bad Request`: Invalid domain format or missing body parameter.
- `404 Not Found`: Domain is unregistered or not found in authoritative registry.
- `405 Method Not Allowed`: Request method other than POST.
- `429 Too Many Requests`: IP rate limit exceeded (30 requests per minute).
- `504 Gateway Timeout`: Upstream registry query timed out (8s limit).

---

## ⚙️ Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenRouter / LLM Streaming (Prince AI)
VITE_OPENROUTER_API_KEY=your-openrouter-api-key

# Optional WHOIS / RDAP API Key (Fallback for WhoisXML API)
WHOISXML_API_KEY=your-whoisxml-api-key
```

> **Note:** The Domain Registrar Checker functions out of the box using public IANA RDAP bootstrap servers. Setting `WHOISXML_API_KEY` is optional for extended WhoisXML fallback resolution.

---

## 🛠️ Development & Building

```bash
# Install dependencies
npm install

# Start local development server (with Vite dev API middleware)
npm run dev

# Run TypeScript check & production build
npm run build

# Preview production build
npm run preview
```

---

## 📄 License

MIT © [Mritunjay Kumar](https://mritify.online/)
