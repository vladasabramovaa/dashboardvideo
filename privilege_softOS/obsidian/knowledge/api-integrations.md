---
type: moc
tags: [knowledge, api, integrations, pricing]
created: 2026-03-07
---

# API Integrations

Cross-project encyclopedia of external API integrations, their quirks, limits, and pricing.

---

## AI Image Generation

### fal.ai

**Auth:** `FAL_KEY` in `.env`, never in chat. Python: `fal_client.run()`. REST: `Authorization: Key $FAL_KEY`.

#### Image Models

| Model | Endpoint | Price | Use Case |
|-------|----------|-------|----------|
| Recraft V3 `handmade_3d` | `fal-ai/recraft/v3/text-to-image` | $0.04 | 3D icons |
| Recraft V4 Vector | `fal-ai/recraft/v4/text-to-vector` | $0.08 | SVG icons |
| FLUX.2 Pro | `fal-ai/flux-2-pro` | $0.03-0.045/MP | Hero images (premium) |
| FLUX.1 Dev | `fal-ai/flux/dev` | $0.025/MP | Backgrounds, hero (budget) |
| FLUX Kontext Pro | `fal-ai/flux-pro/kontext` | $0.04 | Style transfer |
| Bria RMBG 2.0 | `fal-ai/bria/background/remove` | $0.018 | Background removal |

#### Quirks & Constraints

- **Budget for a full website:** $2-10 (20 icons + hero + backgrounds + processing)
- `image_size: "square_hd"` for consistent results
- `colors` param accepts `[{"r": 124, "g": 58, "b": 237}]` for brand consistency

---

## AI / LLM APIs

### Anthropic (Claude)

- **Quirk:** `max_tokens=8192` hardcoded was too small for batch_size=100 (needs ~20K) -- lost 60% of data. Fix: `max(4096, len(candidates) * 200)`

### OpenAI

- **AI SDK v6:** `transport` param instead of direct fetch, `TextStreamChatTransport`, `parts` array instead of content string

---

## VoIP & Communication

### Pipecat (Daily)

- Dominant open-source voice AI framework
- Handles audio pipeline orchestration (STT -> LLM -> TTS)
- Target end-to-end latency: <800ms
- Factory pattern for STT and TTS providers

---

## Cloud & Infrastructure

### AWS

#### Quirks & Issues

- EC2 Instance Connect requires pushing SSH public key with 60s validity window
- Elastic IP can be lost if released -- always attach to production instances

### Cloudflare

#### Useful Permissions for API Token

- Account > Workers KV Storage > Edit
- Account > Workers R2 Storage > Edit
- Account > Workers Scripts > Edit
- Account > Cloudflare Pages > Edit
- Account > Zone > Edit (for adding new zones!)
- Zone > DNS > Edit
- Zone > Zone > Read
- Zone > Zone Settings > Edit
- Zone > SSL and Certificates > Edit

### Oracle Cloud

- Free ARM tier available
- OCI Signature V1 required for API calls

---

## Crypto Exchange APIs

### Rate Limits

| Exchange | REST | WebSocket | Quirks |
|----------|------|-----------|--------|
| Binance | 6,000 weight/min | 5 msg/sec, 1024 streams | Weight-based, IP ban on violation |
| Bybit | 600 req/5 sec | 500 connections/5 min | Separate limits |
| OKX | Per-endpoint | 3 req/sec public | Trading shares REST+WS limits |

### Fees

| Exchange | Spot Maker | Spot Taker | Futures Maker | Futures Taker |
|----------|-----------|-----------|---------------|---------------|
| Binance (Regular) | 0.100% | 0.100% | 0.020% | 0.050% |
| Binance (VIP 9) | 0.011% | 0.023% | **0.000%** | 0.017% |
| OKX (Top-tier) | **-0.005% (rebate!)** | 0.015% | -- | -- |
| Hyperliquid | 0.015% | 0.045% | -- | **No gas fees** |

### WebSocket Best Practices

1. Exponential backoff reconnection (1s, 2s, 4s, max 30s)
2. Heartbeat every 15-30 sec
3. State recovery: resync order book snapshot on reconnect
4. Dual WebSocket (primary + backup)
5. Sequence number tracking
6. Block trading on stale data

### CCXT vs Native

- CCXT: 100+ exchanges, unified API, ~45ms signing overhead (0.05ms with Coincurve)
- Native: max performance, all exchange features
- Use CCXT for research/prototyping, native for production HFT

---

## Email & Outreach

### Resend

- Email sending service for campaigns
- Webhook endpoint for tracking

### Hunter.io

- Tools: `find_email`, `verify_email`, `domain_search`

### Apollo.io

- Tools: `search_people`, `enrich_person`, `search_companies`

---

## Other APIs

### GitHub API

- **GraphQL API:** Free, good for data discovery
- **REST events API:** Used for metadata extraction from GitHub activity

### Google Maps API

- Tools: `search_businesses`, `get_place_details`

### Zoom API

- S2S OAuth (Server-to-Server)
- Recordings + transcripts integration
- 4-6 week approval for new integrations

---

## Cost Control Rules

### Rules Before Any Paid API Call
1. Check dashboard -- current balance, state the number
2. Verify the file is ACTUALLY changed -- `cat` critical lines
3. Check no running jobs
4. Calculate from REAL pricing page, do NOT guess
5. Tell user the EXACT price before running
6. One run = one variant -- verify, then proceed
7. Monitor first 2 minutes

---

## Legal & Compliance

| Case | Year | Outcome |
|------|------|---------|
| hiQ v. LinkedIn | 2019-2022 | CFAA doesn't apply to public data scraping |
| Meta v. Bright Data | 2024 | Meta LOST. Public data scraping OK without login |

**GDPR:** profiles = personal data. Strict jurisdictions may impose per-user compensation for unauthorized scraping.
