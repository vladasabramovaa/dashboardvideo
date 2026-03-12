---
type: moc
tags: [knowledge, debugging, bugs, fixes, gotchas, lookup-table]
created: 2026-03-07
---

# Debugging Playbook

Cross-project lookup table: symptom --> root cause --> fix. When you see an error, check here first.

---

## Python / FastAPI / Streamlit

### Streamlit Widget Values Ignored on Rerun

**Symptom:** `st.slider` or `st.text_input` with `value=X` shows stale value after rerun, ignoring `value=` param.
**Root cause:** Widget has no explicit `key=` param. Streamlit caches widget state by label text, not by `value=`. On rerun, cached value wins.
**Fix:** Add unique `key="widget_name"` to EVERY widget. No exceptions.

### Preset/Selectbox Switching Doesn't Reset Other Widgets

**Symptom:** Selecting a different preset in `st.selectbox` does not update related widgets to new preset values.
**Root cause:** `on_change` callback doesn't clear session_state keys. Old cached keys override new preset values.
**Fix:** In `on_change` callback, `del st.session_state[key]` for ALL related keys EXCEPT the selectbox's own key. The selectbox's own key already has the new value committed before the callback runs -- deleting it snaps to index=0.

### st.slider + int() Loses Percentage Precision

**Symptom:** Setting 1.5% on a slider shows 1% after rounding. Half-percent values disappear.
**Root cause:** `st.slider` returns float, `int()` truncates. 1.5 --> 1.
**Fix:** Use `st.number_input` with `round(val*100, 1)`, `step=0.5`, `format="%.1f"`. Never `st.slider + int()` for percentages.

### Streamlit Layout: Content Appears in Wrong Position

**Symptom:** After rendering full-width content, re-entering `with col1:` puts content back at the original column position, not below the full-width block.
**Root cause:** Streamlit columns are a single layout context. Re-entering the same column after full-width breaks visual order.
**Fix:** Create separate `st.columns()` for each row. Never reuse column contexts after full-width content.

### FastAPI: Claude Enrichment Loses Data

**Symptom:** Batch enrichment with Claude returns incomplete results. Most items missing from output.
**Root cause:** `max_tokens` hardcoded too small for large batches. Response truncated silently.
**Fix:** `max_tokens = max(4096, len(items) * 200)` -- scale with batch size.

### Python: NameError on Dictionary Access

**Symptom:** `NameError: name 'publicIdentifier' is not defined` when accessing dict.
**Root cause:** `item[publicIdentifier]` instead of `item['publicIdentifier']` -- missing quotes around string key.
**Fix:** Always use quotes for string dict keys: `item['publicIdentifier']`.

### Python: datetime.utcnow() Deprecation

**Symptom:** `DeprecationWarning: datetime.utcnow()` or timezone-naive datetime comparisons fail.
**Root cause:** `datetime.utcnow()` returns naive datetime (no timezone info). Deprecated since Python 3.12.
**Fix:** `datetime.now(timezone.utc)`.

### Python asyncio + run_in_executor: Memory Leak

**Symptom:** Long-running app memory grows steadily, crashes after 7-17 hours.
**Root cause:** `run_in_executor` tasks accumulate without cleanup in long-running asyncio loops.
**Fix:** Monitor with `tracemalloc`, `mprof`. Add watchdog with auto-restart. Explicit cleanup of completed futures.

### Floating Point for Money = Silent Corruption

**Symptom:** Financial calculations off by fractions of a cent. `0.1 + 0.2 != 0.3`.
**Root cause:** IEEE 754 float cannot represent decimal fractions exactly. `0.1 + 0.2 = 0.30000000000000004`.
**Fix:** Use `Decimal` (Python), `BigNumber` (JS), or integer microdollars. NEVER float/double for money.

---

## Go

### crypto/rand.Read() Bottleneck on Hot Path

**Symptom:** Packet throughput drops to ~175 pkt/s. CPU spends most time in syscalls.
**Root cause:** `crypto/rand.Read()` calls OS entropy pool (`getrandom` syscall) for every packet. Syscall overhead dominates.
**Fix:** Use ChaCha8 PRNG seeded from HMAC. Cryptographically strong, stdlib (Go 1.22+), orders of magnitude faster (~500ns vs ~5.7ms).

### int8(float) Truncation in Go

**Symptom:** Cross-language inference results differ between Go and Python. int8 values off by 1.
**Root cause:** Go `int8(floatValue)` truncates toward zero. Python `int()` rounds differently.
**Fix:** Use `int8(math.Round(floatValue))` for consistent rounding.

### Unnecessary Atomic on eBPF PERCPU_ARRAY Map

**Symptom:** Performance degradation on eBPF packet counter. No actual contention.
**Root cause:** `__sync_fetch_and_add(val, 1)` used on PERCPU_ARRAY -- per-CPU maps have no cross-CPU contention by design.
**Fix:** Simple `(*val)++` -- no atomic needed for per-CPU maps.

### Predictable Temp File Path (Go)

**Symptom:** Security vulnerability: symlink/TOCTOU attack on temp files.
**Root cause:** `fmt.Sprintf("/tmp/app-swap-%d.ext", index)` -- predictable filename.
**Fix:** `os.CreateTemp("", "app-swap-*.ext")` + `defer os.Remove()`.

### CAS (Compare-And-Swap) Conflicts: 80% Writes Lost

**Symptom:** At 5 concurrent agents, 4 out of 5 writes lost every cycle. Nodes appear dead after ~3 minutes.
**Root cause:** Plain `Write()` to shared state without conflict handling. Multiple agents overwrite each other.
**Fix:** ReadModifyWrite pattern with exponential backoff + jitter (5 retries). Use `If-None-Match: *` for first write.

### Go God Object: File >600 Lines

**Symptom:** Large files (600+ lines) -- hard to maintain, test, debug.
**Root cause:** Violates Constructor Pattern (Rule Zero: file >200 lines = decompose).
**Fix:** Split into separate cubes by responsibility. Each cube: 1 file, 1 concern, <200 lines.

### Timing Attack in API Key Comparison

**Symptom:** API key comparison uses `!=` (Go) or `!==` (JS). Vulnerable to timing side-channel.
**Root cause:** String comparison short-circuits on first mismatch, leaking key length/prefix via timing.
**Fix:** Use `subtle.ConstantTimeCompare()` (Go) or `crypto.timingSafeEqual()` (Node.js).

---

## Swift / SPM / macOS

### MenuBarExtra SwiftUI Does NOT Work with SPM

**Symptom:** SwiftUI `MenuBarExtra` shows nothing when built as SPM executable.
**Root cause:** `MenuBarExtra` requires the full SwiftUI app lifecycle, which SPM executables don't provide.
**Fix:** Use AppKit pattern: start as `.regular` --> create `NSStatusItem` --> switch to `.accessory`. Manual NSMenu/NSPopover.

### SPM Linker Arguments: Each Needs `-Xlinker`

**Symptom:** Build fails with linker errors when embedding Info.plist into SPM executable.
**Root cause:** SPM requires each linker argument as a separate `-Xlinker` flag. Cannot combine them.
**Fix:** `-Xlinker -sectcreate -Xlinker __TEXT -Xlinker __info_plist -Xlinker path` -- each arg gets its own `-Xlinker`.

### macOS .app Bundle Must Be Code-Signed

**Symptom:** App crashes on launch or macOS refuses to open it.
**Root cause:** Missing code signature on .app bundle.
**Fix:** `codesign --force --sign -` for ad-hoc signing. Required for .app bundles.

### MacBook Notch Hides Menubar Icons

**Symptom:** Menubar app icon not visible on MacBook with notch.
**Root cause:** macOS menubar overflow: when too many items, new icons are hidden behind the notch. System limitation.
**Fix:** No programmatic fix. Reduce number of menubar items, or accept that some users won't see it.

### NSPrincipalClass Missing in Info.plist

**Symptom:** Menubar app doesn't receive events or behaves as background-only app.
**Root cause:** `NSPrincipalClass=NSApplication` not set in Info.plist.
**Fix:** Add `NSPrincipalClass` key with value `NSApplication` to Info.plist.

### Config Written to Predictable /tmp Path

**Symptom:** Credentials readable by any local user.
**Root cause:** Config written to `/tmp/app-config.json` with 0644 permissions, predictable name, not deleted after use.
**Fix:** Use unique temp name + 0600 permissions + `defer` cleanup after use. Better: use Keychain.

### Credentials in UserDefaults (Plaintext Plist)

**Symptom:** Credentials visible in `~/Library/Preferences/com.app.plist`.
**Root cause:** Using `UserDefaults` for sensitive data instead of macOS Keychain.
**Fix:** Migrate secrets to macOS Keychain. UserDefaults is for preferences, not credentials.

### XPC DEBUG Bypass: Any Process Gets Root

**Symptom:** In DEBUG builds, any process can send XPC commands to privileged helper.
**Root cause:** `#if DEBUG return true` bypasses XPC sender validation.
**Fix:** Remove DEBUG bypass. Use code signing validation for all builds.

### No Kill Switch: VPN Crash = Traffic Leak

**Symptom:** When VPN process crashes, all traffic goes through unencrypted direct connection.
**Root cause:** No packet filter rules activated before tunnel starts.
**Fix:** PF (Packet Filter) based kill switch via XPC. Enable BEFORE `startTunnel`, disable ONLY on explicit disconnect.

---

## TypeScript / Next.js / AI SDK

### AI SDK v6: useChat Doesn't Stream

**Symptom:** `useChat` hook doesn't receive streaming responses. No data appears.
**Root cause:** AI SDK v6 changed API: `useChat` now uses `transport` param, not `api` directly. Old pattern silently fails.
**Fix:** Use `TextStreamChatTransport` with `toTextStreamResponse()` on server. Pass via `transport` param in `useChat`.

### AI SDK v6: Message Content is Empty String

**Symptom:** `message.content` returns empty string even though AI responded.
**Root cause:** AI SDK v6 moved from string content to `parts` array. `message.content` is deprecated/empty.
**Fix:** Use `message.parts.filter(p => p.type === 'text')` to get text content. Tool results: `parts` with `type: 'tool-invocation'`, `state: 'result'`.

### AI SDK v6: tool() Function Type Errors

**Symptom:** TypeScript errors when defining dynamic tools with `tool()` function.
**Root cause:** `tool()` has strict overloads in v6. Previous patterns don't match.
**Fix:** Use plain objects with `zodSchema()` wrapper for dynamic tools. `streamText()` has no `maxSteps` -- multi-step is client-side via `maxSteps` in `useChat`.

---

## Infrastructure / Ops

### Unison Log File Grows to 146 GB

**Symptom:** Disk full. Log file is enormous.
**Root cause:** Three factors combined: (1) verbose mode, (2) LaunchAgent redirects stdout to file, (3) `log = true` in profile.
**Fix:** Set `log = false` in profile, use `-silent` flag, redirect stdout to `/dev/null`. Check for duplicate LaunchAgents.

### Duplicate LaunchAgents = Double Load + Disk Bloat

**Symptom:** Disk usage growing fast, sync running twice as often as expected.
**Root cause:** Two LaunchAgents doing the same job.
**Fix:** Remove the duplicate. Keep single agent. Audit with `launchctl list | grep <name>`.

### Xcode DeviceSupport / CoreSimulator Eating Disk

**Symptom:** 12-18 GB of disk space used by Xcode caches that grow silently.
**Root cause:** Xcode accumulates device support files and simulator data without cleanup.
**Fix:** Safe to delete periodically: `~/Library/Developer/Xcode/iOS DeviceSupport/` and `~/Library/Developer/CoreSimulator/`.

### AWS Elastic IP Lost on Instance Termination

**Symptom:** Server IP changed after instance replacement. Old IP is dead.
**Root cause:** Elastic IP was released (or never attached). Without Elastic IP, new instance = new IP.
**Fix:** Attach Elastic IPs to ALL production instances. Never release without confirming DNS is updated.

### Certbot No Auto-Renewal = 90-Day Outage

**Symptom:** TLS certificate expires, HTTPS stops working.
**Root cause:** Certbot installed but no renewal timer/cron configured.
**Fix:** Configure `certbot renew` via systemd timer or cron. Test with `--dry-run`.

### Docker Install via curl | sh = Supply Chain Risk

**Symptom:** Not a runtime error, but a security vulnerability at install time.
**Root cause:** `curl https://get.docker.com | sh` trusts the remote server completely.
**Fix:** Download script first, review, then execute. Or use distro package manager.

### .env with Production Secrets in Git History

**Symptom:** Credentials exposed even after `.gitignore` fix. Old commits still contain secrets.
**Root cause:** `.env` was committed before being gitignored. Git history preserves it.
**Fix:** Rotate ALL leaked credentials. Clean git history with `git filter-repo`. Add `.env` to `.gitignore` from the start.

### Ed25519 Signing Returns True for Everything

**Symptom:** Any config is accepted by client. No signature validation errors ever.
**Root cause:** Public key is placeholder, verification function returns `true` unconditionally.
**Fix:** Replace placeholder with real public key. Remove dev bypass. Actually verify signatures.

### API_KEY Bypass When Env Not Set

**Symptom:** API endpoints accessible without authentication.
**Root cause:** Auth middleware skips validation when `API_KEY` environment variable is empty/unset.
**Fix:** `log.Fatal()` if `API_KEY` is not set. Never start server without auth configured.

### PostgreSQL DSN sslmode=disable

**Symptom:** Database connections are unencrypted. Credentials visible on network.
**Root cause:** `sslmode=disable` hardcoded in DSN string.
**Fix:** Use `sslmode=require` or `sslmode=verify-full` in production.

### Shared Instance: One Compromised Service = Access to All

**Symptom:** Security breach in one Docker container exposes all co-hosted services.
**Root cause:** Multiple services sharing Docker network on same instance. Network isolation insufficient.
**Fix:** Separate instances for security-critical services, or use proper Docker network isolation + resource limits.

---

## ML / Training

### Training Features != Production Features (CRITICAL)

**Symptom:** ML model performs perfectly in tests but useless in production.
**Root cause:** Training uses continuous [0,1] features normalized one way. Production computes features differently. Different encoding = model never saw real feature distribution.
**Fix:** Rewrite training data generation to exactly mirror production feature extraction. Validate bit-identical features cross-platform.

### Circular Evaluation Inflates Metrics to 100%

**Symptom:** Attack success rate or accuracy shows 100%. Suspiciously perfect.
**Root cause:** Training and evaluation use the same data. Model memorized, not generalized.
**Fix:** Real train/test split. Never evaluate on training data.

### Per-Packet Inference = 78% CPU at 1 Gbps

**Symptom:** CPU maxed out. System unusable at high throughput.
**Root cause:** Running ML inference on every single packet.
**Fix:** Batch inference (every N items) reduces CPU dramatically.

### OOM on GPU: Attention is O(seq^2)

**Symptom:** `CUDA out of memory` on A100 40GB with large batch + sequence.
**Root cause:** Attention scores = O(bs * heads * seq^2) per layer.
**Fix:** Reduce batch size. On 8GB Mac: MAX_SEQ_LEN=256 + bs=16.

### GPU Training Time Estimate Was 10x Off

**Symptom:** Estimated "3-5 minutes on A100" for large dataset. Actual: ~10 minutes per epoch.
**Root cause:** Estimate ignored DataLoader overhead, attention quadratic complexity, dataset preparation time.
**Fix:** Always benchmark 1 epoch first, then extrapolate. Never estimate GPU time without a real run.

### 4 Negative Experiments = Stop Signal

**Symptom:** Each extension/improvement attempt makes results worse.
**Root cause:** Mechanism has reached its local optimum. Extensions compete for gradient in constrained space.
**Fix:** Stop after 4 consecutive negative experiments. The mechanism is maxed out. Pivot or close the research line.

---

## Scraping / External APIs

### Instagram: Datacenter IPs Blocked Instantly

**Symptom:** Instagram scraper works once, then all requests fail. 429/403 errors.
**Root cause:** Meta blocks datacenter IP ranges. Only residential proxies work.
**Fix:** Residential proxies MANDATORY for Instagram. Max ~100 profiles/run without auth, ~200 with auth.

### LinkedIn Cookie-Based Scrapers = Ban Risk

**Symptom:** LinkedIn account banned after scraping.
**Root cause:** Cookie scrapers use real session cookies. LinkedIn detects automated patterns.
**Fix:** Never use main account. Max 500 profiles/day. Prefer no-cookie actors that scrape Google-indexed public profiles.

### Telegram Paid Scrapers Are Pointless

**Symptom:** Paying for Telegram scraping that open-source does for free.
**Root cause:** Telegram is the only major platform where official API allows mass data collection.

---

## Cost / Compute Incidents

### Runaway Healing Loop: $1,440+/Night

**Symptom:** Cloud bill explodes overnight. Hundreds of VPS instances provisioned.
**Root cause:** No rate limit on provisioning. Blocker triggers replacement in a loop.
**Fix:** Max 10 provisions/day, rate limit 1 per 10 minutes, hard cap 2x target pool size.

## Security Patterns (Quick Reference)

### Default SECRET_KEY in Production

**Symptom:** Session forgery possible. Anyone can create valid session tokens.
**Root cause:** `secret_key="change-me-in-production"` with no startup check.
**Fix:** Hard fail (crash) if secret key equals default value. Never start with default secrets.

### Stored XSS via AI-Generated HTML

**Symptom:** JavaScript injection through user-facing content.
**Root cause:** `| safe` in Jinja2 template renders AI-generated HTML without sanitization.
**Fix:** Sanitize AI output before storing. Use allowlist of safe HTML tags. Never `| safe` on untrusted content.

### All Credentials on Every Server

**Symptom:** One compromised server = total infrastructure destruction.
**Root cause:** Every server deployed with ALL cloud provider credentials in environment.
**Fix:** Per-node credential isolation. Each server gets ONLY its own credentials. Signing keys ONLY on control plane.

### No Auth on Internal Endpoint

**Symptom:** Any client can POST to internal endpoint and replace critical data/models.
**Root cause:** Endpoint has no authentication check.
**Fix:** Localhost-only check: verify `127.0.0.1` or `::1` from remote address.

---

## Cross-References

- code-patterns -- proven patterns across projects
- wrong-paths -- full list of failed approaches and anti-patterns
- server-ops -- server errors and operational fixes
- api-integrations -- API quirks and constraints
- architecture-decisions -- WHY things are built the way they are
