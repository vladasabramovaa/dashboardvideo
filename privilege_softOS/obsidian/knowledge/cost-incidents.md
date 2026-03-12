---
type: moc
tags: [knowledge, cost, incidents, budget, pricing, guardrails]
created: 2026-03-07
---

# Cost Incidents & Budget Controls

Encyclopedia of cost incident patterns, pricing gotchas, budget guardrails, and pre-launch checklists.

---

## Incident Patterns & Lessons

| Pattern | What Happened | Lesson |
|---------|---------------|--------|
| Unverified GPU compute pricing | Expected $27, spent $98.78 (+266%) | ALWAYS check real pricing page, never estimate from memory |
| Failed retries billed silently | Failed GPU jobs still charged | Monitor first 2 minutes, check for billing on failures |
| No dashboard check before compute | Launched without checking balance | ALWAYS check dashboard balance before ANY paid compute |
| Disk bloat from verbose logging | 146 GB in 2 weeks from sync logs | Set `log = false`, redirect to `/dev/null`, check for duplicate agents |
| Accumulated dev tool caches | 18.5 GB from IDE caches (DeviceSupport, CoreSimulator) | Periodically clean dev tool caches |
| Auto-healing cost explosion (theoretical) | $1,440+/night from 288 auto-provisioned servers | MUST have provisioning rate limits, max caps, leader election |
| Thundering herd provisioning (theoretical) | 5 agents heal simultaneously = 5x cost | Leader election + CAS retry prevents simultaneous healing |
| Orphaned resources from failed registration | Resource created but not registered = pays forever | CAS retry + cleanup of unregistered resources |
| Compromised cloud provider key | Unlimited financial burn from create/destroy access | Per-node scoped credentials, minimum-permission tokens |
| Lost static IP by releasing it | Static address permanently gone | NEVER release Elastic IP without explicit intent |

---

## Pre-Launch Checklists

### Before ANY paid compute

> Lesson learned from a $98.78 overspend on $27 estimate. NEVER AGAIN.

1. **Check dashboard** -- current balance, state the number out loud
2. **Verify the file is ACTUALLY changed** -- `cat` critical lines, don't assume
3. **Check no running jobs** -- provider dashboard or CLI
4. **Calculate from REAL pricing page** -- visit the page, do NOT guess or estimate from memory
5. **Tell user EXACT price** before launch
6. **One run = one variant** -- verify it works, THEN proceed with others
7. **Monitor first 2 minutes** -- watch for errors, unexpected billing

### Before batch API calls

1. **Estimate total batch cost** BEFORE starting
2. **Start with 1-2 items** as test -- verify cost matches estimate
3. **Show cost estimate to user** and get confirmation
4. **Check API rate limits** per platform -- exceeding = ban + wasted money
5. **Verify proxy requirements** -- some platforms require residential proxies ($7-8/GB), datacenter = instant ban

### Before new cloud resource

1. **Check current monthly spend** across all providers
2. **Verify you need a new resource** -- can an existing one be reused?
3. **Use cheapest tier** that meets requirements (typical: $3.50-5.00/mo for small VPS)
4. **Attach static IP immediately** on AWS -- losing an IP = losing the resource address
5. **Set billing alerts** on the provider
6. **Tag the resource** with project name for cost allocation
7. **Add provisioning rate limits** if auto-provisioning -- max N/day, 1 per 10min, hard cap at 2x target pool size

---

## Pricing Gotchas

### AI Video Generation

- **Audio flag can double cost** -- e.g., `generate_audio=true` doubles video generation cost silently
- **New models may not have pricing yet** -- do not estimate, wait for official pricing
- **Resolution affects price 2-10x** -- always check per-resolution pricing
- **Video cost range: $0.04-2.00/sec** depending on model and resolution

### AI Creative Engine Cost Tiers

| Tier | Verified Cost |
|------|--------------|
| Budget | $3.50-4.00/job |
| Standard | $8.25/job |
| Premium | $25.60/job |

- HITL gate: mandatory approval before expensive generation steps
- CostLimits in config: `max_job_cost`, `cost_tier`, `require_approval`

### Cloud Providers

- **AWS Elastic IP: USE IT or LOSE IT** -- releasing means losing the static address permanently
- **Full-account API keys** -- compromised key = financial burn (create/destroy anything)
- **Oracle Free Tier ARM** -- may have broken API signing, verify before relying on it
- **Cloudflare R2/KV/Workers = FREE tier** -- but CORS misconfiguration can expose data

### Scraping Cost Optimization

| Platform | Cheapest Option | Monthly Cost (1K items) |
|----------|----------------|----------------------|
| YouTube | YouTube Data API v3 (**FREE**) | $0 |
| Instagram | Open-source tools (<1K/day) or budget actors | $0-0.50 |

**Total moderate usage: $50-100/mo** (vs $200+ on single-vendor)

### Trading Infrastructure

- **Proximity VPS: from $40/mo** -- colocation hosting for exchanges
- **Colocation: $20K+/mo** -- only for institutional HFT
- **Enterprise TSDB: $250-500K/year** -- overkill for retail
- **Knight Capital: $440M lost in 45 minutes** -- dead code activated, no kill switch, 97 alerts ignored
- **AI bot decimal point error: $250K lost** -- sent 52.43M tokens instead of 52,439
- **Backtest-to-live gap**: Sharpe falls 30-50%, Win Rate -10-20pp -- backtest is a factory of illusions
- **Float for money = catastrophe** -- 0.1 + 0.2 = 0.30000000000000004, ONLY Decimal/BigNumber

### Legal/Compliance Costs

- **BGH Germany (Nov 2024): scraping = 100 EUR GDPR compensation PER USER** -- at scale this is existential
- **Security audit (Cure53/Trail of Bits): $30-50K** -- required for B2B licensing
- **US provisional patent: $2-3K** -- full patent: $60-100K for US+EU

### Fal.ai Budget Reference

**Full website assets budget: $2-10**

| Asset Type | Model | Unit Price | Qty x20 |
|-----------|-------|-----------|---------|
| 3D icons | Recraft V3 `handmade_3d` | $0.04 | $0.80 |
| Hero images | FLUX.2 Pro | $0.03-0.045/MP | $0.22 |
| Backgrounds | FLUX.1 Dev | $0.025/MP | $0.25 |
| BG removal | Bria RMBG 2.0 | $0.018 | $0.63 |
| Upscale | Recraft Crisp | $0.004 | $0.14 |
| Iterations x2 multiplier | | | x2 |
| **Total** | | | **~$4-8** |

---

## Cost Control Patterns

### Microdollar Tracking

- Track every API call cost at microdollar precision
- FSM with cost tracking per stage
- CostLimits in config: `max_job_cost`, `cost_tier`, `require_approval`
- HITL gate: mandatory human approval before expensive generation steps

### Cost Tiers with Approval Gates

- Budget tier: $3.50-4.00/job (auto-approved)
- Standard tier: $8.25/job (configurable approval)
- Premium tier: $25.60/job (always requires approval)
- `require_approval` flag per config

### Auto-Provisioning Rate Limits

Without limits: unlimited cost from runaway auto-healing.

**Required controls:**
- Max N provisions/day (counter in shared state)
- Rate limit: 1 provision per 10 minutes (timestamp check)
- Hard cap: 2 * TargetPoolSize (absolute maximum)
- Create only 1 resource per heal cycle (prevent thundering herd)
- Leader election for healing decisions (prevent N-way duplication)
- Count "Provisioning" status resources as active (prevent re-creation)

### API Cost Guard (Global Rule)

Applies to ALL projects before ANY paid compute:

```
1. Dashboard check -- balance, state the number
2. File verification -- cat critical lines, don't assume
3. Running jobs check -- no orphaned processes
4. REAL pricing page -- visit it, don't guess
5. EXACT price communicated to user
6. One variant at a time -- verify, then proceed
7. Monitor first 2 minutes
```

### Error Budget (Development)

- 2 attempts on an approach -> rethink architecture
- 0 silent retries -- every failure logged
- 3 consecutive failures -> full stop -> root cause analysis
- Multiple negative experiments in a row = STOP signal

---

## Credential Blast Radius (Financial Impact)

| Credential Type | Financial Risk |
|----------------|---------------|
| SSH Private Key (root) | Root on all servers -> all provider keys -> unlimited financial burn |
| Cloud Provider Key | Create/Destroy ANY instance -> direct $ impact |
| Full-account API Key | All resources + DNS + billing |
| Storage Access Key | Inject fake data -> trigger provisioning -> cost explosion |
| Scraping Platform Token | Run actors on your credit -> burn through credits |
