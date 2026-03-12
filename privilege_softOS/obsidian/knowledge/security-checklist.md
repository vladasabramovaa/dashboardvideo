---
type: moc
tags: [knowledge, security, checklist, audit]
created: 2026-03-07
---

# Security Checklist

Cross-project security findings, vulnerabilities, and checklists.

---

## Pre-Deploy Security Checklist

### Credentials
- [ ] No secrets in source code (grep for API keys, passwords, private keys)
- [ ] No `.env` files in git history (`git log --all -p -- .env`)
- [ ] All API keys use minimum required permissions (not full account access)
- [ ] Credential isolation: each service/node has ONLY its own credentials
- [ ] Signing keys stored ONLY on protected control plane, never on edge nodes
- [ ] `SECRET_KEY` / `API_KEY` must hard-fail if set to default or empty value
- [ ] All credentials rotated if ANY were ever exposed in git history
- [ ] Secrets stored in Keychain / Vault / encrypted storage, NOT plaintext files

### Authentication
- [ ] Ed25519 / JWT / HMAC verification enabled (no placeholder keys)
- [ ] Certificate pinning for HTTPS connections to own infrastructure
- [ ] CSRF tokens on all state-changing endpoints
- [ ] Rate limiting applied to all public endpoints (not just configured)
- [ ] API key comparison uses constant-time function (no `!=` / `!==`)
- [ ] Auth middleware fails closed (empty API_KEY = reject, not bypass)
- [ ] Login rate limiting enabled
- [ ] Session tokens have proper entropy and expiration

### Network
- [ ] TLS enabled on all endpoints (no plaintext HTTP for config/data)
- [ ] CORS restricted to specific origins (no `Access-Control-Allow-Origin: *`)
- [ ] Certificate auto-renewal configured (certbot timer/cron)
- [ ] PostgreSQL connections use `sslmode=require` or higher
- [ ] Unnecessary ports closed in firewall
- [ ] SSH: key-based only, root login disabled (`PermitRootLogin no`)
- [ ] SSH key rotation policy defined and enforced

### Client Security (Desktop/Mobile)
- [ ] Kill switch enabled BEFORE tunnel start, disabled ONLY on explicit disconnect
- [ ] Config signature verified before applying (Ed25519)
- [ ] Sensitive data in Keychain/SecureStorage, NOT UserDefaults/plaintext
- [ ] Temp files use unpredictable names, 0600 permissions, cleaned up after use
- [ ] Code signing enforced (no DEBUG bypass in production builds)
- [ ] XPC/IPC path validation (no path traversal)
- [ ] Binary integrity verification (SHA256 checksum pinning)
- [ ] IPv6 leak prevention
- [ ] DNS leak prevention

### Infrastructure
- [ ] Services run as non-root user with minimal capabilities (`CAP_NET_BIND_SERVICE`)
- [ ] Terraform state encrypted and stored remotely (not local plaintext)
- [ ] Ansible vault encrypted (`ansible-vault encrypt`)
- [ ] Downloaded binaries verified against checksums (no `curl | sh`)
- [ ] Separate Docker networks for separate trust boundaries
- [ ] CI/CD pipeline runs tests before deploy
- [ ] Structured logging (no sensitive data in logs: tokens, passwords, keys)

### Cost Protection
- [ ] Hard cap on resource provisioning (max nodes, max per day)
- [ ] Rate limiting on provisioning (1 per 10 min)
- [ ] Budget alerts configured on cloud providers
- [ ] CAS retry with exponential backoff (prevents thundering herd)
- [ ] Quorum required for destructive actions (2+ agents confirm)

---

## Common Vulnerability Patterns

These patterns have been found across multiple projects. Check for them in every audit.

### Critical Patterns

| Pattern | Description | Fix |
|---------|-------------|-----|
| Placeholder crypto verification | Signature verification returns `true` always (placeholder key) | Use real Ed25519 public key, fail closed |
| Secrets in git history | `.env` with production secrets committed at some point | Rotate ALL credentials, add `.env` to `.gitignore` |
| Hardcoded credentials | API keys, private keys in source code | Move to `.env` or Keychain/Vault |
| Shared credentials across nodes | One compromised node = total destruction | Per-node scoped credentials |
| Full-account API tokens | Provider PATs have billing/destroy access | Minimum-permission scoped tokens |
| No credential rotation | Credentials never rotated | Define and enforce rotation policy |
| Default SECRET_KEY in production | Session forgery possible | Hard-fail if SECRET_KEY equals default |
| XSS via unescaped AI output | `| safe` filter on AI-generated HTML | Sanitize AI output before rendering |

### High Patterns

| Pattern | Description | Fix |
|---------|-------------|-----|
| CSRF bypass via string endswith | Origin check uses `endswith`, not strict comparison | Strict origin comparison |
| Rate limiting configured but not applied | Middleware exists but not mounted on routes | Verify routes actually use the middleware |
| API key bypass when empty | Auth middleware skips if env var not set | Fail closed: empty key = reject all |
| No input validation on imports | Unsanitized user data passes through | Validate and sanitize all inputs |
| XPC/IPC DEBUG bypass | `#if DEBUG return true` allows any process access | Remove DEBUG bypasses in production |
| XPC path traversal | Arbitrary path passed to privileged helper | Validate and restrict paths |
| No kill switch for VPN | Process crash = traffic bypasses tunnel | PF-based kill switch, enable before tunnel |

### Medium Patterns

| Pattern | Description | Fix |
|---------|-------------|-----|
| Timing attack in key comparison | Using `!=` / `!==` for API key check | Use constant-time comparison |
| Sensitive data in plaintext storage | UserDefaults, plist, `/tmp/` with 0644 | Keychain, `os.CreateTemp` with 0600 |
| CORS wildcard on sensitive endpoints | `Access-Control-Allow-Origin: *` | Restrict to specific origins |
| Services running as root | RCE = instant root shell | Non-root user with `CAP_NET_BIND_SERVICE` |
| `curl | sh` for installs | No integrity verification | Download + verify checksum, then execute |
| Tokens/passwords in logs | Sensitive data in error messages or stdout | Structured logging with redaction |
| LIKE injection | `%` `_` not escaped in SQL LIKE queries | Escape special LIKE characters |
| Missing CSP headers | No Content-Security-Policy | Add restrictive CSP headers |

---

## Credential Management Rules

### Storage Rules

| DO | DON'T |
|----|-------|
| Store secrets in `.env` (never committed) | Hardcode secrets in source code |
| Use Keychain / encrypted storage on clients | Store in UserDefaults / plaintext plist |
| Use `os.CreateTemp()` with 0600 permissions | Use predictable `/tmp/` paths with 0644 |
| Per-node scoped credentials | Same credentials on all nodes |
| Minimum-permission API tokens | Full-account personal access tokens |
| Rotate credentials on schedule | No rotation policy whatsoever |
| Encrypt Terraform state remotely | Local plaintext state with SSH keys |
| Encrypt Ansible vault | Leave vault.yml unencrypted |

### Credential Blast Radius Analysis

When assessing credential compromise impact, map the full chain:

| Credential Type | Typical Blast Radius |
|----------------|---------------------|
| SSH Private Key (root) | Root on all servers -> all provider keys -> all cloud accounts -> all user traffic |
| Cloud Storage Key (R2/S3) | Read/Write shared state, all node IPs, inject fake data |
| Cloud Provider Key (AWS/Vultr/etc) | Create/Destroy ANY instance, financial burn |
| Signing Private Key | Sign ANY config, MITM all downstream consumers |
| Mesh/Worker Auth Token | Push malicious config to edge/CDN |

---

## Authentication Patterns

### Proven Patterns

| Pattern | Details |
|---------|---------|
| bcrypt + itsdangerous sessions | Session auth with safe YAML loading, parameterized SQL |
| Ed25519 config signing | Config -> sign -> verify -> deliver |
| HMAC-SHA256 derived markers | Per-instance derived markers, no static fingerprints |
| EC2 Instance Connect | Push ed25519 pubkey, valid 60s window |
| Tailscale-only SSH | Port 22 closed to public, zero inbound rules |
| X-API-Key middleware | MUST hard-fail if key empty |
| CAS with exponential backoff | ReadModifyWrite with jitter for distributed coordination |

### Known Auth Anti-Patterns

- Placeholder key returning `true` -- any data accepted without verification
- Auth bypass when env var empty -- middleware skips all auth
- Default `SECRET_KEY` -- allows session forgery
- CSRF check using `endswith` -- bypassable with crafted origin
- `#if DEBUG return true` -- allows any process privileged access in debug builds

---

## Security Best Practices

| Practice | Details |
|----------|---------|
| bcrypt password hashing | Use bcrypt, never MD5/SHA for passwords |
| `yaml.safe_load` (not `yaml.load`) | Prevents arbitrary code execution |
| Parameterized SQL queries (no string concat) | Prevents SQL injection |
| GIN index with `@>` operator (not LIKE) | Safe array containment queries |
| GDPR consent tracking + anonymize function | Required for EU compliance |
| Tailscale-only SSH (port 22 closed) | Zero public attack surface |
| EC2 Instance Connect (60s key validity) | Minimal SSH key exposure window |
| Security Group with zero inbound rules | Default-deny network policy |
| `strict_route: true` for VPN | Prevents traffic leak |
| `os.CreateTemp` + `defer os.Remove` | Safe temp file handling |
| Localhost-only bind for admin endpoints | No external access to admin APIs |
| Cross-language test vectors | Bit-identical behavior across implementations |
| Multi-agent audit pattern | Multiple agents with confidence scoring |
| `If-None-Match: *` for CAS first write | Atomic distributed state init |
| ReadModifyWrite with exponential backoff + jitter | Reliable distributed coordination |

---

## Attack Chain Patterns

These are generalized attack chain patterns observed across projects.

### Chain: Total System Compromise via Single Node
```
RCE on any node
  -> root shell
  -> config file (all provider keys + storage + signing key)
  -> MITM all clients + destroy all nodes + financial burn
```
**Fix:** Credential isolation + signing key only on protected control plane + non-root services.

### Chain: MITM via Config Poisoning
```
DNS spoofing OR auth token leak
  -> push malicious config to CDN/edge (no signature check on PUT)
  -> client accepts (verification disabled or placeholder)
  -> cached for days
  -> PERSISTENT MITM
```
**Fix:** Real signature verification in client, signature check on config PUT.

### Chain: Cost Explosion via Auto-Healing
```
External trigger (e.g., IP block)
  -> agent marks resource blocked immediately (no quorum)
  -> multiple agents heal simultaneously (thundering herd)
  -> new resource also blocked -> repeat
  -> unlimited financial burn
```
**Fix:** Max resource cap + global rate limit + CAS retry + quorum for healing decisions.

### Chain: User De-anonymization
```
Open port scan OR unauthenticated endpoint OR CORS exploit
  -> discover all node IPs
  -> block all + timing correlation attack
```
**Fix:** Auth on all endpoints, CORS restriction, indirect monitoring.

### Chain: Local Privilege Escalation
```
Local malware
  -> IPC/XPC debug bypass
  -> path traversal to privileged helper
  -> arbitrary config as root
  -> root network control
```
**Fix:** Remove DEBUG bypasses, path validation, binary integrity check.

### Chain: Data Exposure via Web Vulnerabilities
```
Default SECRET_KEY
  -> session forgery
  -> access all data
  + no CSRF -> any action via forged requests
  + Stored XSS -> steal sessions
```
**Fix:** Hard-fail on default SECRET_KEY, add CSRF tokens, sanitize all rendered output.

---

