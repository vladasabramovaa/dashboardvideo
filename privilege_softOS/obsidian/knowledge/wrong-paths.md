---
type: moc
tags: [knowledge, wrong-paths, anti-patterns]
created: 2026-03-07
---

# Wrong Paths — what does NOT work

Cross-project encyclopedia of failed approaches, dead ends, and anti-patterns.

---

## Servers and Infrastructure

- **Cloud provider API requests sent WITHOUT authentication**. All methods return 401. Dead code that looks functional
- **`.env` with production credentials in git history**. All keys in plaintext require full credential rotation
- **Terraform state local, without encryption**. Plaintext SSH keys in state file
- **Ansible vault NOT encrypted**. Secrets in plaintext in the repository
- **Docker install via `curl | sh`**. Supply chain attack vector
- **Elastic IP lost after instance replacement**. Without Elastic IP, instance swap = lost IP. Always allocate static/elastic IPs for all cloud instances
- **Duplicate LaunchAgents** (two agents doing the same job) = double I/O load, root cause of disk bloat
- **Sync tool log grew to 146 GB** in 2 weeks. Cause: verbose mode + launchd redirect stdout to file + `log=true` in config. Fix: `-silent`, `/dev/null`, `log = false`
- **Xcode DeviceSupport and CoreSimulator** caches are safe to clean (12+6.5 GB) but grow silently
- **Shared server instance with 5+ services**. One compromised service = access to all via shared Docker network

---

## ML and AI

- **All extensions of a working mechanism worsened results**. 4 extensions in a row degraded output. Ceiling reached. Lesson: 4 negative experiments in a row = stop signal
- **Extending a working mechanism =/= improving it** -- gradient competition in constrained parameter space. Larger dimensions performed worse -- the bottleneck is a feature, not a size issue
- **Circular evaluation inflated accuracy**. Training and testing on the same data. Fix: real train/test split
- **Training features =/= production features** (CRITICAL). Training on continuous [0,1] features, production uses different encoding = useless model. Fix: make training data generation mirror production feature extraction
- **Class imbalance**: training 40/60, real distribution 99/1. Model trained on unrealistic distribution
- **Cloud compute cost overrun**. Estimated $27, spent $98.78. Causes: unverified prices, failed retries, unrecorded changes, no dashboard check
- **OOM on GPU with large batch sizes**. Attention scores = O(bs x heads x seq^2) per layer. Fix: reduce batch size to sweet spot for model size
- **Time estimates for ML training are systematically 3x too low**. Not accounting for DataLoader overhead, attention quadratic cost, setup time. Rule: benchmark 1 epoch, then extrapolate
- **Package manager conflicts with manual installs**. Apt package for security rules conflicts with git-cloned rules (duplicate IDs). Solution: only use one installation method
- **ALWAYS run ML training with `-u` (unbuffered stdout)**. Without it, Python buffers stdout and you get 1.5 hours of blind waiting
- **Backtest-to-live gap**: metrics drop 30-50% going from backtest to live. Backtests are an illusion factory (lookahead bias, survivorship bias, overfitting, zero commissions)

---

## Security

- **Ed25519 signing completely disabled**. Public key = placeholder, verification returns `true` unconditionally. Any config accepted without signature verification
- **Config cache in plaintext UserDefaults**. Credentials stored in plaintext plist. Keychain not used at all
- **Config written to /tmp without protection**. Predictable filename, permissions 0644, not deleted after use
- **No Certificate Pinning**. Using default URLSession without custom delegate
- **CAS retry loop not implemented**. Plain `Write()` fails on conflict. With multiple agents, most heartbeats are lost every cycle
- **All credentials stored on every server**. One compromised server = ALL cloud provider credentials leaked
- **Credential chain**: compromised 1 server = full compromise of entire infrastructure
- **Hardcoded API keys in source code**. Credentials in plaintext
- **Timing attack in API key comparison** (`!=` instead of constant-time compare)
- **Default SECRET_KEY "change-me-in-production"** -- no hard fail on default value = session forgery
- **No CSRF token validation** on POST forms. `endswith` check is bypassable
- **Rate limiting configured but NOT applied** to routes. Per-instance, not global
- **Stored XSS** via AI-generated HTML rendered with `| safe` without sanitization
- **N+1 queries** in paginated search (no selectinload/joinedload)
- **Predictable temp file** (`/tmp/app-swap-%d.ext`) -- symlink/TOCTOU attack. Fix: `os.CreateTemp()`
- **No auth on hot-swap endpoint**. Any client could POST and replace resources. Fix: localhost-only check

---

## API and Integrations

- **Image generation API: guidance_scale does NOT exist** on some providers. They are ZERO-CONFIG. Do not attempt to pass unsupported parameters
- **API prompt length limits** (e.g. 2500 chars). Exceeding = silent truncation or error
- **AI SDK breaking changes across major versions**: transport layer changes, array-based content instead of strings, tool result format changes. Always check migration guides
- **Dynamic tool definitions require wrapper functions** (e.g. `zodSchema()` for runtime tools). Multi-step tool use may be client-side only
- **Missing quotes in dict access** (e.g. `item[key]` instead of `item["key"]`) -> NameError
- **Hardcoded max_tokens too low for batch operations** -> batch needs Nx tokens -> loses 60%+ data
- **Cloud provider SDK without proper authentication** -> all requests 401. Dead code

---

## UI and Frontend

- **`st.slider` + `int()` for percentages = precision loss**. 1.5% -> 1%. Always use `st.number_input` + `round(val*100, 1)` + `step=0.5`
- **Streamlit widgets without explicit `key=`** are cached by label. `value=` parameter is ignored on rerun. ALL widgets must have unique keys
- **Re-entering `with col:` after full-width content** -> content goes to ORIGINAL column position, not after full-width = broken visual order. Solution: separate `st.columns()` for each row
- **Preset switching callback MUST clear ALL session_state keys** (except own selectbox key)
- **`MenuBarExtra` SwiftUI does NOT work with SPM** executables. Pattern: `.regular` -> NSStatusItem -> `.accessory` (otherwise invisible)
- **MacBook with notch: menubar overflow** hides new icons (systemic macOS issue)
- **God Object files (700+ lines)** violate single-responsibility. Each should be decomposed to <200 lines

---

## DevOps and Development Process

- **Architecture Overlay Incident**: file grew from 227 to 354 lines from "audit fixes" = overlay, not root fix. Fixes must go INTO ROOT FORMULAS, not patch on top
- **File grew >30%? Wrapper on top? If/else workaround? Compatibility layer?** = you are building an overlay. Change the root
- **2 attempts on an approach -> reconsider architecture**. Do not repeat a failed approach. 3 consecutive failures -> full stop -> root cause analysis
- **"Will write tests later" = never**. No tests = auditor blocks. Every bugfix = new test for that bug
- **No structured logging** -- plain Printf throughout. No metrics/observability endpoints
- **Monolithic files (1000+ lines)** with unused imports and silenced exceptions
- **Test coverage ~10-40%** (unit only, no integration). Insufficient for production

---

## Architecture

- **Zero credential isolation**. Each node = full access to everything. Provisioning/signing/destruction should be in a separate protected control plane
- **Config trust model broken**. Signing disabled + no cert pinning + long cache = persistent MITM
- **Rotation completely unimplemented**. Identifiers, paths, keys -- all static in code. Docs describe rotation, code does not implement it
- **Forking upstream libraries = merge hell**. Instead use wrapper/adapter pattern -- zero merge conflicts, upstream updates trivial, clean separation
- **Library version memory leaks**. When planning mobile clients, pin versions above known-buggy releases
- **Unnecessary atomics on per-CPU data structures**. Per-CPU maps have no cross-CPU contention. Simple increment is sufficient

---

## Finance and Business Risks

- **Cloud compute cost overrun**. Rule: NEVER compute without dashboard check, "ballpark" estimates, parallel runs without verification
- **Cost explosion loop in auto-provisioning**: resource blocked -> system creates replacement -> blocks again -> repeat. Without rate limit and max cap = unlimited cost overnight
- **Float for money = catastrophe**. 0.1 + 0.2 = 0.30000000000000004. ONLY Decimal/BigNumber
- **Alpha decay**: strategies expire over time. HFT strategies live days-weeks, momentum 3-6 months

---

## Rejected Approaches (consciously rejected)

- **eBPF for early phases**. Userspace achieves sufficient throughput for initial deployment. eBPF has limited stack, no float, kernel constraints. Defer to later phases
- **Full transformer / attention upgrade for small models**. Overkill when there is no sequence. Deferred indefinitely
- **Large ML models (768-dim, 12 layers, ~MB) for real-time inference**. Too heavy. Microscale models (16-dim, 1-2 layers) are sufficient
