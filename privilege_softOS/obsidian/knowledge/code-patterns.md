---
type: moc
tags: [knowledge, patterns, code, architecture]
created: 2026-03-07
---

# Code Patterns

Cross-project encyclopedia of proven code patterns and architecture approaches.

---

## Constructor Pattern (Rule Zero)

The foundational pattern across all projects. Every new file, class, and module follows these rules.

**Core Principle:** Kubik = 1 file, 1 class, 1 pattern -- self-contained, readable by Brain, reproducible.

**Rules:**
- Primitiveness: complexity = composition of simple kubiks
- Decomposability: any kubik is replaceable
- Meta-positionality: Brain reads and generates by analogy
- Self-extension: new kubiks follow the same patterns as existing ones
- Function >30 lines -> split
- File >200 lines -> decompose into 2+ kubiks

**Banned:** mixins, abstract factories, DI containers, abstraction layers.

**Conflict resolution:** Rule Zero applies to new code. "Don't Rewrite Working Code" applies to existing code unless it blocks a new feature.

**Anti-pattern (Architecture Overlay Incident):** `model_brain.py` grew from 227 to 354 lines from "audit fixes" = overlay. Fix: changes go into root formulas, not wrappers on top.

---

## Architecture Patterns

### Clean Architecture + Feature-First

- Flutter + Riverpod + Supabase
- Feature-First directory structure (each feature = self-contained module)
- Clean Architecture layers within each feature

### Consent-First Pipeline

```
discover -> normalize -> dedup -> enrich (Claude) -> save
```

- FastAPI + SQLAlchemy + PostgreSQL
- Cascade dedup: profile_url -> email -> linkedin -> name+city
- GDPR-aware: consent tracking, anonymize function, retention cleanup
- Config split: secrets in .env, static in config.yaml

### Event-Driven Architecture (Trading Systems)

Research finding -- dominant pattern for trading systems:
- Event bus (Kafka/NATS) for market data + order events
- Actor model for per-entity state isolation
- Monolith for critical path, microservices for ancillary
- CQRS for separating write-model (orders) from read-model (reports)
- Event Sourcing for audit trail + backtest replay

### AI-as-Router Architecture

- Claude = Router + Orchestrator (no hardcoded routes/switches)
- Provider Plugin System: `DataProvider` interface -> `ProviderRegistry` -> auto-discovery
- AI tools = provider tools (dynamic) + internal tools
- UI Block Renderer: AI returns `ui_blocks` -> mapped to React components

### Cascaded Voice Pipeline

- Pipecat framework for audio pipeline orchestration
- STT -> LLM -> TTS (cascaded, not speech-to-speech)
- Strategy pattern for channel abstraction (VoIP/WhatsApp/Telegram)
- BaseChannel ABC + CallSession dataclass
- Target end-to-end latency: <800ms

### Async Flow Pattern

```
POST -> request_id -> poll status -> fetch response_url
```

Used for long-running async tasks (image generation, video processing, API calls).

### Provider Plugin Pattern

- `DataProvider` interface -> `ProviderRegistry` -> auto-discovery
- AI tools = provider tools (dynamic) + internal tools

### BaseScraper Pattern

- BaseScraper pattern -- all new scrapers inherit from it
- Tier system: Tier 1 (FREE), Tier 2 (open-source), Tier 3 (paid fallback)
- Output: `UnifiedProfile` / `UnifiedContent` via `normalize()`
- Normalizer pattern: 1 file = 1 platform = 1 cube

### Unified Schema Pattern (Scrapers)

```typescript
interface UnifiedProfile {
  platform: 'youtube' | 'linkedin' | 'instagram' | 'facebook' | 'xing' | 'telegram';
  name, username, avatarUrl, bio, url;
  followersCount, followingCount, postsCount;
  email, phone, website, location;
  company, jobTitle, industry;
  rawData: Record<string, unknown>;
}
```

---

## State Management

### Streamlit

Hard-learned rules:

1. **ALL widgets need explicit `key=`** -- without key, Streamlit caches by label text, not by `value=`. On rerun, cached value wins.
2. **Preset switching**: callback MUST clear all session_state keys (except own selectbox key)
3. **`on_change` callback**: new value already committed BEFORE callback, so own key cannot be deleted
4. **Layout**: cannot re-enter `with col1:` after full-width content (visual order breaks). Use separate `st.columns()` for each row
5. **Percentage inputs**: NEVER `st.slider` + `int()` for % -- precision loss (1.5% -> 1%). Always `st.number_input` + `round(val*100, 1)` + `step=0.5`
6. **Error container**: `st.container()` placeholder at top of page works, but no auto-scroll

### SwiftUI + AppKit Hybrid (macOS Menubar)

- macOS menubar pattern: `.regular` -> NSStatusItem -> `.accessory`
- SwiftUI popover with AppKit shell
- `MenuBarExtra` SwiftUI does NOT work with SPM executables

### AI SDK v6 State

Key differences from v4/v5:
- `useChat` uses `transport` param, NOT `api` directly
- `TextStreamChatTransport` with `toTextStreamResponse()` on server
- Status: `'submitted' | 'streaming' | 'ready' | 'error'`
- Messages use `parts` array (not string content)
- Tool results in `message.parts` with `type: 'tool-invocation'`, `state: 'result'`
- `tool()` function has strict overloads -- use plain objects with `zodSchema()` wrapper

---

## API Patterns

### FastAPI

- FastAPI + WebSocket + Dashboard
- Pydantic Settings + TOML + env vars
- 4 AI providers: Anthropic, OpenAI, DeepSeek, Ollama
- Integration protocol: `IntegrationClient` (authenticate, fetch, push, health)
- Config split: secrets in .env, static in config.yaml (Pydantic Settings + YAML loader)
- Session auth: bcrypt + itsdangerous
- GIN index on skills with @> operator

---

## Testing Patterns

### Test-First / TDD

- Critical paths: TDD (test BEFORE code)
- Business logic: test TOGETHER with code
- No tests = Auditor blocks
- Every bug fix = new test for that bug
- 2 attempts on an approach -> rethink architecture

### Multi-Agent Audit Pattern

Deep audit using multiple parallel agents with confidence scoring:
- 5 agents independently audit the same codebase
- Findings confirmed by N/5 agents with confidence %
- Eliminates false positives from single-agent review

### Agent Swarm for Development

| Role | N | Task | When |
|------|---|------|------|
| Research | 2 | Analogues, stack, conflicts | Always first |
| Architect | 1 | File plan, types, interfaces | After research |
| Builder | 1-4 | Implement kubiks | After architect |
| Auditor | 1-2 | Verify after builder | After each builder |
| Docs | 1 | DECISIONS.md, TODO.md, CLAUDE.md | At end |

---

## Synchronization Patterns

### CAS (Compare-And-Swap) via ETags

- Shared state with optimistic locking (e.g., R2, S3)
- ReadModifyWrite pattern with exponential backoff + jitter (5 retries)
- `If-None-Match: *` for first write
- Without CAS retry: 80% writes lost at 5 concurrent agents

---

## Security Patterns

### Ed25519 Config Signing

- Config -> sign -> verify -> deliver to client
- Without signature: any config accepted = full MITM
- Critical finding: placeholders in production (verification returned `true` unconditionally)

### Credential Isolation Pattern

Lesson learned from audit: zero credential isolation = catastrophic blast radius.
- Each VPS should have ONLY its own credentials
- Signing key ONLY on protected config server
- Provider keys ONLY on matching VPS

---

## File/Project Structure

### Standard Project Layout

```
project/
  CLAUDE.md       -- architecture, constraints, known issues
  DECISIONS.md    -- WHY each decision was made
  HOTPATHS.md     -- critical paths requiring double audit
  TODO.md         -- current tasks with priorities
  src/            -- source code (Constructor Pattern kubiks)
  tests/          -- tests alongside code
  docs/           -- deep research, verified API docs
```

---

## Naming Conventions

### Commit Messages (Semantic)

```
feat(scope):       new functionality
fix(scope):        bug fix
refactor(scope):   change without behavior change
docs(scope):       documentation
test(scope):       tests
checkpoint:        rollback point
chore(scope):      deps, config, CI
```

---

## Configuration Patterns

### Pydantic Settings + Environment

- Pydantic Settings + TOML + env vars
- Config sections: server, kernel, ai, redis, llm

### Config Split: .env + YAML

- Secrets in `.env` (never committed)
- Static config in `config.yaml`

### Single Source of Truth

- One master timeline/dimension determines ALL array lengths
- All other engines derive their dimensions from it

---

## Deployment Patterns

### Docker + Nginx Reverse Proxy

- Docker on shared network
- Nginx reverse proxy for port mapping
- Shared PostgreSQL through Docker network

### macOS Menubar App (SPM)

- SPM executables: `-Xlinker` for each linker argument
- `codesign --force --sign -` mandatory for .app bundle
- Pattern: `.regular` -> NSStatusItem -> `.accessory` (otherwise invisible)
- `NSPrincipalClass=NSApplication` in Info.plist required
- MacBook notch: menubar overflow hides new icons

### LaunchAgent Best Practices

- Use `-silent` flag, redirect stdout to `/dev/null`, NO log files
- `log = false` in config -- MANDATORY (incident: 146 GB log file in 2 weeks)
- Duplicate LaunchAgents = root cause of disk bloat

---

## ML/AI Patterns

### FiLM Modulation

- `x = (1+gamma)*x + beta` -- multiplicative modulation outperforms additive injection (6.5x better)
- Bottleneck (32d) = feature, not bug -- forces compression to essentials
- GRU recurrence = key ingredient for cross-layer state
- Extending a working mechanism does NOT guarantee improvement (gradient competition)
- 4 negative experiments in a row = stop signal

---

## Cost Control Patterns

### API Cost Guard (Rule One)

> Lost money on cloud compute. NEVER AGAIN.

Before EVERY paid compute:
1. Check dashboard -- current balance, state the number
2. Verify file ACTUALLY changed -- `cat` critical lines
3. Check no running jobs
4. Calculate from REAL prices (visit pricing page, don't guess)
5. Tell user EXACT price before launch
6. One run = one variant -- verify, then others
7. Monitor first 2 minutes

### Cost Tracking in Microdollars

- Track every API call cost at microdollar precision
- CostLimits in config: max_job_cost, cost_tier, require_approval
- HITL gate: mandatory approval before expensive generation steps

### Provisioning Cost Protection

- Max 10 provisions/day
- Rate limit 1 provision per 10 minutes
- Hard cap: 2 * TargetPoolSize
- Without limits: $1,440+ per night from runaway healing loop

---

## Anti-Patterns (Documented Failures)

### Architecture Overlay

File grows >30% from "fixes" = overlay. Diagnose: wrapper over code? if/else workaround? compatibility layer? If yes -> modify root, don't add layers.

### Circular Evaluation

Training and evaluation used the same data, inflating metrics to 100%. Fixed with real train/test split.

### Duplicate LaunchAgents

Two LaunchAgents doing the same thing = double disk I/O. Incident: 146 GB log file in 2 weeks.

### GRU Sequential Dependency

GRU breaks pipeline parallelism on inference -- architectural dead-end for production LLMs.
