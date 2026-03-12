---
type: moc
tags: [knowledge, architecture, decisions]
created: 2026-03-07
---

# Architecture Decisions

Cross-project encyclopedia of WHY things were built the way they are.

---

## Universal Stack Selection Principles

When choosing a stack, the decision should be driven by these factors:

| Factor | Rationale |
|--------|-----------|
| Constructor Pattern fit | 1 file = 1 class = 1 responsibility. Avoid DI containers, abstract factories |
| Local-first vs server | SQLite eliminates server dependency for local tools. PostgreSQL for relational multi-user data |
| Server-rendered vs SPA | HTMX avoids SPA complexity for internal tools. SPA only when offline/interactivity is critical |
| Native vs cross-platform | Native frameworks (Swift/AppKit) for platform-specific apps. Cross-platform (Flutter) when mobile reach matters |
| AI pipeline | Cascaded (STT->LLM->TTS) > native speech-to-speech for control, cost, debuggability |
| Scraper tiers | Free official APIs first, then open-source, then paid services as last resort |
| Financial output | openpyxl for .xlsx (industry standard). Streamlit for fast parameter iteration UI |
| Sync tools | unison for bidirectional sync with conflict resolution. BUT: `log = false` is MANDATORY (146 GB incident) |

---

## Data Storage Decisions

- **Shared state with CAS (Compare-And-Swap)** for coordination without a central server. ReadModifyWrite pattern is mandatory. Quorum required for healing decisions
- **Config hierarchy: Settings class + config files + env vars**. Declarative config for pipelines (TOML/YAML DAGs map naturally to sections)
- **Timeline as single source of truth** for all array lengths. One master variable determines every schedule array. Prevents array length mismatches
- **JSONB for raw external data** alongside structured schema. Structured fields for core entities, JSONB for raw provider responses
- **Columnar DB for time-series data** (e.g. QuestDB over InfluxDB). SQL-compatible, 10x faster inserts for append-heavy workloads
- **unison with `log = false` is MANDATORY**. Verbose logging + redirect + `log=true` produced 146 GB in 2 weeks. Two duplicate agents compounded the problem. Root cause fix: single agent, `-silent`, stdout to `/dev/null`

---

## Deployment and Infrastructure

- **Multi-provider infrastructure**: no single provider dependency. If one provider's IPs get blocked, others continue. Auto-provision new nodes when IPs are blocked
- **Native desktop client is a strategic choice** when the primary value is server-side. Cross-platform strategy: generate config/subscription links for third-party clients
- **Dual license AGPL + Commercial** following Redis/MongoDB/Elastic model. AGPL for open-source credibility. Commercial license for enterprise users who fear AGPL obligations
- **Cloud is sufficient for mid-frequency operations (100ms+)**. Bare metal only needed for ultra-low-latency (<1ms). Choose cloud regions closest to target infrastructure
- **Terraform state must be remote with encryption**. Local state with plaintext SSH keys is a MEDIUM risk
- **CI/CD must cover full pipeline**, not just server-side tests. Desktop/client apps need integration tests too

---

## Constructor Pattern Decisions

- **1 file = 1 output unit** (e.g. 1 file per Excel tab, 1 file per platform normalizer). Orchestrator file composes them
- **Each component is an independent cube** (replaceable, testable, composable). No monolithic panels. Trade-off: more files, but each under 200 lines

---

## Trade-offs Log (Universal Patterns)

| Decision | Pro | Con |
|----------|-----|-----|
| Wrapper pattern over library fork | Zero merge conflicts, clean separation, testable | No access to library internals |
| Native client (single platform) | Best performance, no framework overhead | Excludes majority of users on other platforms |
| AGPL + Commercial dual license | Open-source credibility + enterprise revenue | Community may distrust commercial intent |
| Cascaded AI pipeline over end-to-end | More control, cheaper, debuggable | Higher latency |
| Server-rendered (HTMX) over SPA | Simpler, no build step, faster dev | Less interactivity, no offline |
| SQLite over PostgreSQL for local tools | Zero config, portable | No concurrent multi-user access |
| Columnar DB over general-purpose for time-series | SQL-compatible, 10x faster inserts | Smaller ecosystem |
| Fast iteration UI (Streamlit) over custom | Built-in widgets, rapid prototyping | Widget state quirks, no mobile |
| Bidirectional sync (unison) over one-way (rclone) | Conflict resolution | Verbose logging can cause disk bloat |

---

## Anti-Patterns Discovered

| Anti-Pattern | What Happened | Lesson |
|-------------|---------------|--------|
| Overlay patching | File grew 227->354 lines from "audit fixes" | Fixes go into root formulas, not overlays. If file doubled from fixes = overlay |
| Compute cost blind spot | Estimated $27, spent $98.78 | ALWAYS check dashboard, verify prices on pricing page, one run at a time |
| Hardcoded credentials | API keys, private keys in source code | Secret management from day 1, not "later" |
| Duplicate system agents | Two agents = double disk I/O = 146 GB logs | Single source of truth for system services |
| Slider for percentages | `st.slider + int()` loses 0.5% precision | Always `number_input + round() + step=0.5` |
| Extending a working mechanism | 4 extensions all worsened results | 4 negative experiments in a row = stop signal |
