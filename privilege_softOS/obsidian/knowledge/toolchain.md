---
type: moc
tags: [knowledge, toolchain, setup, versions]
created: 2026-03-07
---

# Toolchain

Complete inventory of development tools, versions, and configurations.

---

## Languages & Runtimes

| Tool | Version | Installed Via |
|------|---------|--------------|
| Python | 3.14.3 (system), 3.13 (brew) | brew (`python@3.13`, `python@3.14`) |
| Node.js | v24.12.0 | system/nvm |
| Go | 1.26.0 darwin/arm64 | brew |
| Swift | 5.9+ (Xcode) | Xcode |
| Ruby | brew formula | brew |
| Deno | installed | brew |
| Flutter/Dart | installed (check `flutter --version`) | manual/fvm |

> Note: Several version checks were blocked during this inventory. Run `flutter --version`, `swift --version`, `rustc --version`, `docker --version`, `gh --version` manually to fill exact versions.

---

## CLI Tools

| Tool | Purpose | Installed Via |
|------|---------|--------------|
| awscli | AWS API (EC2, S3, Lightsail, Instance Connect) | brew |
| gh | GitHub CLI (PRs, issues, releases) | brew |
| ffmpeg | Video/audio processing | brew |
| yt-dlp | Video downloading (v2026.03.03) | brew |
| railway | Railway.app deployment CLI | brew |
| sshpass | Non-interactive SSH password auth | brew |
| cocoapods | iOS/macOS dependency manager (Flutter, Swift) | brew |
| protobuf | Protocol Buffers compiler | brew |
| openssl@3 | TLS/crypto toolkit | brew |
| sqlite | Embedded database CLI | brew |
| pnpm | Fast Node.js package manager | brew |
| lame | MP3 encoder (ffmpeg dep) | brew |
| x264 / x265 | H.264/H.265 video codecs (ffmpeg deps) | brew |
| svt-av1 | AV1 encoder (ffmpeg dep) | brew |
| libvpx | VP8/VP9 codec (ffmpeg dep) | brew |
| opus | Audio codec (ffmpeg dep) | brew |
| sdl2 | Multimedia library | brew |
| lima | Linux VMs on macOS | brew |

---

## GUI Apps (brew cask)

| App | Purpose |
|-----|---------|
| Obsidian | Knowledge base / PKM |

> Additional non-brew apps (Xcode, VS Code / Cursor, browsers, etc.) not tracked by brew. Check `/Applications/` for full list.

---

## Package Managers

- **brew** (Homebrew) -- primary macOS package manager for CLI and GUI tools
- **pip** / **pip3** -- Python packages (per-project venvs recommended)
- **pnpm** -- Node.js package manager (preferred over npm for monorepos)
- **npm** -- Node.js (ships with Node, used by some projects)
- **CocoaPods** (`pod`) -- iOS/macOS native dependencies (Flutter plugins)
- **SPM** (Swift Package Manager) -- Swift native packages
- **pub** -- Dart/Flutter packages

---

## IDE & Editors

- **Xcode** -- Swift/SPM development, iOS/macOS builds, codesigning
- **Obsidian** -- Knowledge management
- **Claude Code** -- AI-assisted development (CLI agent)

> Check `/Applications/` for VSCode, Cursor, or other editors if installed.

---

## Key Configurations

### Python Virtual Environments
- Per-project `.venv/` directories (standard pattern)

### Node.js Project Managers
- pnpm preferred for monorepos and strict dependency resolution
- npm also works for simpler projects

---

## Media & Encoding Stack

ffmpeg is installed with full codec support:

| Codec/Lib | Purpose |
|-----------|---------|
| x264 | H.264 encoding |
| x265 | H.265/HEVC encoding |
| svt-av1 | AV1 encoding (modern, efficient) |
| libvpx | VP8/VP9 (WebM) |
| opus | Audio codec (VoIP quality) |
| lame | MP3 encoding |
| dav1d | AV1 decoding |
| libtiff / jpeg-turbo | Image formats |

---

## Infrastructure Tools

| Tool | Purpose |
|------|---------|
| awscli | EC2, S3, Lightsail, Instance Connect |
| Docker | Containerized deployment |
| wrangler (npx) | Cloudflare Workers deploy |
| Terraform | Infrastructure as Code |
| Ansible | Server configuration |
| ssh / EC2 Instance Connect | Server access |
| Tailscale | Zero-config VPN for server access |

---

## External AI/Compute Services (no local install)

| Service | Interface | Notes |
|---------|-----------|-------|
| fal.ai | REST API (`FAL_KEY`) | Image/video/3D generation |
| Anthropic (Claude) | API | AI reasoning, enrichment |
| OpenAI | API | `gpt-4o-mini` and others |
| Deepgram | API | Nova-3 STT |
| Cartesia | API | Sonic TTS |
| Supabase | API | Auth + storage backend |

---

## Verified Versions (2026-03-07)

| Tool | Exact Version |
|------|---------------|
| Python | 3.14.3 |
| Node.js | v24.12.0 |
| Go | 1.26.0 darwin/arm64 |
| yt-dlp | 2026.03.03 |
| macOS | Darwin 25.1.0 (arm64) |

> TODO: fill remaining versions (flutter, swift, rustc, docker, gh, deno, pnpm, ruby, awscli) -- run individual `--version` commands.
