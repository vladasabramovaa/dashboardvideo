---
type: moc
tags: [knowledge, templates, boilerplate, setup]
created: 2026-03-07
---

# Project Templates

Boilerplate structures for new projects following Constructor Pattern.

---

## Standard Files (every project)

Every project MUST have these files at the root:

| File | Purpose | When to update |
|------|---------|----------------|
| `CLAUDE.md` | Architecture, constraints, build commands, known issues | Any architecture change |
| `DECISIONS.md` | WHY each non-trivial decision was made | Every architectural choice |
| `HOTPATHS.md` | Critical code paths requiring double audit on change | New critical path or hotfix |
| `TODO.md` | Current tasks with priorities | Task added/completed |
| `.gitignore` | Exclude .env, .venv, node_modules, build artifacts | New artifact type |
| `.env.example` | Template for required env vars (NO real secrets) | New env var added |

**Optional but recommended:**

| File | When needed |
|------|------------|
| `pyproject.toml` / `go.mod` / `Package.swift` / `pubspec.yaml` | Always (dependency manifest) |
| `Dockerfile` | Deployable service |
| `docker-compose.yml` | Local dev with databases/queues |
| `.github/workflows/test.yml` | CI pipeline |
| `Makefile` or `scripts/` | Complex build steps |

---

## Constructor Pattern Setup Steps

For ANY new project, regardless of stack:

```
1. Create project directory in ~/Projects/{project-name}/
2. Initialize git: git init
3. Create CLAUDE.md with:
   - Project name and one-line description
   - Architecture overview
   - Build/run commands
   - Critical constraints
4. Create DECISIONS.md (empty template)
5. Create TODO.md with initial tasks
6. Create .gitignore (stack-specific)
7. Create .env.example
8. Define types/interfaces BEFORE implementation
9. First commit: "feat: project scaffold"
```

**Constructor Pattern rules for every file:**
- 1 file = 1 class = 1 responsibility
- Function > 30 lines --> split
- File > 200 lines --> decompose into 2+ kubiks
- No mixins, no abstract factories, no DI containers

---

## FastAPI Project

```
project/
  CLAUDE.md
  DECISIONS.md
  HOTPATHS.md
  TODO.md
  .env                      # secrets (never committed)
  .env.example              # template with placeholder values
  .gitignore
  .python-version           # pin Python version (e.g., "3.12")
  pyproject.toml            # dependencies + build config
  config.yaml               # static config (committed)
  docker-compose.yml        # local PostgreSQL
  docker-compose.prod.yml   # production compose
  Dockerfile                # multi-stage build
  alembic/                  # DB migrations
    alembic.ini
    versions/
  src/
    __init__.py
    config.py               # Pydantic Settings + .env + YAML loader
    models.py               # Pydantic domain models (shared types)
    utils.py                # shared helpers
    db/
      __init__.py
      engine.py             # SQLAlchemy engine + session factory
      models.py             # ORM models (1 file if <200 lines)
      repository.py         # DB queries (1 file per entity if large)
    providers/
      __init__.py
      base.py               # BaseProvider ABC
      registry.py           # ProviderRegistry (auto-discovery)
      github.py             # 1 file = 1 provider
      apify_linkedin.py
    pipeline/
      __init__.py
      pipeline.py           # orchestrator
      normalizer.py         # data normalization
    ai/
      __init__.py
      agent.py              # AI enrichment logic
    web/
      __init__.py
      app.py                # FastAPI app factory
      auth.py               # auth middleware
      deps.py               # dependency injection (get_db, get_config)
      rate_limit.py         # SlowAPI rate limiting
      templating.py         # Jinja2 setup
      routes/
        __init__.py
        dashboard.py        # 1 file = 1 route group
        candidates.py
        auth.py
        settings.py
  tests/
    __init__.py
    conftest.py             # fixtures (db session, client, mocks)
    test_pipeline.py
    test_repository.py
    test_routes.py
```

**Key patterns:**
- Config split: secrets in `.env`, static in `config.yaml`
- Pydantic Settings loads both `.env` and `config.yaml`
- Provider pattern: `BaseProvider` ABC + `ProviderRegistry` for pluggable data sources
- DB: SQLAlchemy 2.0 async + Alembic migrations + asyncpg
- Web: Jinja2 + HTMX for server-rendered UI (no SPA complexity for internal tools)
- Docker: multi-stage build, `python:3.12-slim`

**pyproject.toml template:**
```toml
[project]
name = "project-name"
version = "0.1.0"
description = "One-line description"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115",
    "uvicorn[standard]>=0.34",
    "pydantic>=2.0",
    "pydantic-settings>=2.0",
    "sqlalchemy[asyncio]>=2.0",
    "asyncpg>=0.30",
    "alembic>=1.14",
    "httpx>=0.28",
    "python-dotenv>=1.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0",
    "pytest-asyncio>=0.24",
    "pytest-mock>=3.14",
]

[tool.pytest.ini_options]
asyncio_mode = "auto"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

**Dockerfile template (multi-stage):**
```dockerfile
FROM python:3.12-slim AS builder
WORKDIR /app
COPY pyproject.toml uv.lock* README.md ./
COPY src/ src/
RUN pip install --no-cache-dir uv && uv pip install --system --no-cache "."

FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY src/ src/
COPY alembic/ alembic/
COPY alembic.ini config.yaml pyproject.toml ./
EXPOSE 8000
CMD ["uvicorn", "src.web.app:app", "--host", "0.0.0.0", "--port", "8000"]
```

**docker-compose.yml template:**
```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: ${PROJECT}-postgres
    environment:
      POSTGRES_DB: ${PROJECT}
      POSTGRES_USER: ${PROJECT}
      POSTGRES_PASSWORD: ${PROJECT}_dev
    ports:
      - "5433:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${PROJECT}"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  pgdata:
```

---

## Flutter Project

```
project/
  CLAUDE.md
  DECISIONS.md
  TODO.md
  .gitignore
  pubspec.yaml              # dependencies
  pubspec.lock              # ALWAYS committed
  analysis_options.yaml     # lint rules
  lib/
    main.dart
    app.dart                # MaterialApp / router setup
    core/
      constants.dart        # app-wide constants
      theme.dart            # ThemeData
      router.dart           # GoRouter / auto_route
    features/               # Feature-First structure
      weather/
        data/
          models/           # data classes (fromJson/toJson)
          repositories/     # API calls
          datasources/      # remote + local sources
        domain/
          entities/          # domain models
          repositories/      # abstract repos
          usecases/          # business logic
        presentation/
          screens/
          widgets/
          providers/         # Riverpod providers
      spots/
        data/
        domain/
        presentation/
    shared/
      widgets/              # reusable widgets
      utils/                # formatters, helpers
      providers/            # global Riverpod providers
  test/
    features/
      weather/
        weather_test.dart
  ios/
  android/
  web/
  macos/
```

**Key patterns:**
- Clean Architecture + Feature-First + Riverpod
- Each feature = self-contained module with data/domain/presentation layers
- Supabase for backend (auth + storage without custom server)
- Web deploy: `flutter build web` --> AWS S3 + Cloudflare CDN
- Pre-commit: `flutter analyze` + `flutter test`
- Lock file (`pubspec.lock`) ALWAYS in git

---

## Swift SPM Project (macOS Menubar)

```
project/
  CLAUDE.md
  DECISIONS.md
  TODO.md
  .gitignore
  Package.swift             # SPM manifest
  build.sh                  # build + codesign script
  Info.plist                # NSPrincipalClass=NSApplication
  Sources/
    AppName/
      main.swift            # entry point: NSApp + NSStatusItem
      AppDelegate.swift     # lifecycle, menubar setup
      ContentView.swift     # SwiftUI popover content
      SyncService.swift     # core logic (1 kubik)
      ConfigManager.swift   # settings persistence
  Tests/
    AppNameTests/
```

**Key patterns:**
- SPM (no Xcode project file) -- `Package.swift` as manifest
- `MenuBarExtra` SwiftUI does NOT work with SPM executables
- Pattern: `.regular` --> create NSStatusItem --> switch to `.accessory`
- `NSPrincipalClass=NSApplication` in Info.plist MANDATORY
- Linker flags for Info.plist: `-Xlinker -sectcreate -Xlinker __TEXT -Xlinker __info_plist -Xlinker path` (each arg via -Xlinker)
- `codesign --force --sign -` for .app bundle

**Package.swift template:**
```swift
// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "AppName",
    platforms: [.macOS(.v13)],
    targets: [
        .executableTarget(
            name: "AppName",
            path: "Sources/AppName",
            linkerSettings: [
                .unsafeFlags([
                    "-Xlinker", "-sectcreate",
                    "-Xlinker", "__TEXT",
                    "-Xlinker", "__info_plist",
                    "-Xlinker", "Info.plist"
                ])
            ]
        )
    ]
)
```

---

## Python CLI / Library Project

```
project/
  CLAUDE.md
  DECISIONS.md
  HOTPATHS.md
  TODO.md
  .gitignore
  .python-version
  pyproject.toml
  requirements.txt          # optional, for non-pyproject envs
  src/
    __init__.py
    config.py               # constants, settings
    models.py               # data classes / types
    engine_a.py             # 1 file = 1 engine/concern
    engine_b.py
    utils.py
  scripts/
    run_pipeline.py         # CLI entry points
    export.py
  tests/
    __init__.py
    conftest.py
    test_engine_a.py
    test_engine_b.py
    test_integration.py
  data/                     # input data, models, weights
  research/                 # research docs (if applicable)
```

**pyproject.toml template (library/CLI):**
```toml
[project]
name = "project-name"
version = "0.1.0"
description = "One-line description"
requires-python = ">=3.12"
dependencies = [
    # core deps only
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0",
    "pytest-cov>=4.1",
]

[tool.pytest.ini_options]
testpaths = ["tests"]
pythonpath = ["."]

[build-system]
requires = ["setuptools>=69.0"]
build-backend = "setuptools.build_meta"

[tool.setuptools.packages.find]
include = ["src*"]
```

---

## Go Project

```
project/
  CLAUDE.md
  DECISIONS.md
  HOTPATHS.md
  TODO.md
  .gitignore
  go.mod
  go.sum                    # ALWAYS committed
  main.go                   # entry point
  cubes/                    # Constructor Pattern: 1 file = 1 cube
    node.go
    node_test.go
    tunnel.go
    tunnel_test.go
    monitor.go
    monitor_test.go
    config.go
    config_test.go
  providers/                # 1 file = 1 external integration
    provider.go             # Provider interface + Registry
    aws.go
    vultr.go
    upcloud.go
  delivery/                 # 1 file = 1 delivery channel
    cf_worker.go
    direct.go
    telegram.go
  cmd/                      # sub-commands (if multi-binary)
    publish/main.go
    sign/main.go
```

**Key patterns:**
- Constructor Pattern: `cubes/` directory, 1 file = 1 self-contained cube
- Provider pattern: interface + registry + 1 file per provider
- Tests co-located: `node.go` + `node_test.go` in same directory
- No frameworks -- stdlib `net/http` + manual routing for small APIs
- `go:embed` for embedding static assets (weights, configs)
- Build: `go build -o binary-name .`

---

## Next.js / TypeScript Project

```
project/
  CLAUDE.md
  DECISIONS.md
  TODO.md
  .gitignore
  .env.local                # secrets (never committed)
  .env.example
  package.json
  pnpm-lock.yaml            # ALWAYS committed (pnpm preferred)
  tsconfig.json
  tailwind.config.ts
  drizzle.config.ts         # if using Drizzle ORM
  next.config.ts
  app/
    layout.tsx
    page.tsx
    globals.css
    api/                    # API routes
      generate/route.ts     # 1 file = 1 endpoint
      status/route.ts
    dashboard/
      page.tsx
    components/
      ui/                   # shadcn/ui components
      feature-specific/     # per-feature components
  lib/
    db/
      schema.ts             # Drizzle schema (single file if <200 lines)
      index.ts              # DB connection
    providers/              # 1 file = 1 AI/external provider
      kling.ts
      flux.ts
      elevenlabs.ts
    types.ts                # shared TypeScript types
    constants.ts            # shared constants
    utils.ts
  public/
    assets/                 # static assets
```

**Key patterns:**
- Next.js 16 + TypeScript + Tailwind 4 + shadcn/ui
- Drizzle ORM + SQLite for local-first apps
- Drizzle ORM + PostgreSQL + Redis for server apps
- Provider pattern: 1 file = 1 AI provider (kling.ts, flux.ts, elevenlabs.ts)
- Async flow: POST --> request_id --> poll status --> fetch response_url
- pnpm preferred over npm (faster, strict)

---

## Cloudflare Worker Project

```
worker/
  wrangler.toml             # CF Worker config
  src/
    index.ts                # main handler
  package.json
```

**Deploy:** `cd worker && npx wrangler deploy`

**Key patterns:**
- Minimal footprint -- single `index.ts` for small workers
- KV binding for state, R2 binding for objects
- CORS headers must be explicit
- Auth via custom headers (X-API-Key, Authorization)

---

## Multi-Language Project

```
project/
  CLAUDE.md                 # top-level architecture
  DECISIONS.md
  HOTPATHS.md
  TODO.md
  desktop/                  # Swift SPM (macOS client)
    Package.swift
    Sources/
    build.sh
  control/                  # Go (server agent)
    go.mod
    main.go
    cubes/
    providers/
  api/                      # Go (REST API)
    go.mod
    main.go
  worker/                   # TypeScript (CF Worker)
    wrangler.toml
    src/index.ts
  server/                   # Infrastructure
    terraform/
    ansible/
    setup.sh
  scripts/                  # Cross-language utilities
    generate-keys.sh
  docs/                     # Deep research (if applicable)
  audit/                    # Audit reports
```

**Key patterns:**
- Each language component = separate directory with its own manifest
- Top-level CLAUDE.md describes the full system
- Each component can be built independently
- Shared types defined in docs or generated, NOT duplicated across languages

---

## Configuration Templates

### .env.example template

```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/dbname

# AI Providers (get keys from respective dashboards)
ANTHROPIC_API_KEY=sk-ant-xxx
OPENAI_API_KEY=sk-xxx

# External APIs
GITHUB_TOKEN=ghp_xxx
APIFY_TOKEN=apify_api_xxx
FAL_KEY=xxx

# App
SECRET_KEY=change-me-in-production
DEBUG=true
```

**Rules:**
- NEVER commit `.env` with real values
- `.env.example` committed with placeholder values
- Hard fail if `SECRET_KEY` equals default value in production

### CLAUDE.md template

```markdown
# Project Name -- One-Line Description

## Architecture
- [describe layers/components]
- Constructor Pattern: 1 file = 1 class = 1 responsibility

## Build
\```bash
# Dev
command to run locally

# Test
command to run tests

# Deploy
command to deploy
\```

## Critical Constraints
- [hard API limits, incompatibilities, things that WILL break if violated]

## Project Structure
\```
project/
  src/          -- [what's here]
  tests/        -- [what's here]
\```
```

### DECISIONS.md template

```markdown
# Decisions

## D-001: [Decision Title]
**Date:** YYYY-MM-DD
**Context:** [what problem we faced]
**Decision:** [what we chose]
**Why:** [reasoning]
**Trade-offs:** [pro vs con]
**Alternatives rejected:** [what we considered and why not]
```

### Docker setup template

```yaml
# docker-compose.yml -- local development
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${PROJECT}
      POSTGRES_USER: ${PROJECT}
      POSTGRES_PASSWORD: ${PROJECT}_dev
    ports:
      - "5433:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${PROJECT}"]
      interval: 5s
      timeout: 3s
      retries: 5

  redis:  # only if needed (queues, caching)
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

### .gitignore templates

**Python:**
```
.venv/
__pycache__/
*.pyc
.env
*.egg-info/
dist/
build/
.pytest_cache/
.coverage
*.db
```

**Go:**
```
*.exe
*.test
*.out
.env
vendor/
```

**Swift SPM:**
```
.build/
.swiftpm/
*.xcodeproj
.DS_Store
```

**Node.js:**
```
node_modules/
.env
.env.local
dist/
.next/
*.db
```

### GitHub Actions CI template

**Python + Go (multi-language):**
```yaml
name: Tests
on: [push, pull_request]
jobs:
  python:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -e ".[dev]"
      - run: pytest tests/

  go:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '1.26'
      - run: cd go && go test -race ./...
      - run: cd go && go build ./cmd/...
```

---

## Dependency Patterns

| Stack | Package Manager | Lock File | Manifest | Notes |
|-------|----------------|-----------|----------|-------|
| Python | pip / uv | `uv.lock` | `pyproject.toml` | uv preferred for speed; `requirements.txt` as fallback |
| Go | go mod | `go.sum` | `go.mod` | ALWAYS commit `go.sum` |
| Swift SPM | SPM | `Package.resolved` | `Package.swift` | Resolved file auto-generated |
| Flutter/Dart | pub | `pubspec.lock` | `pubspec.yaml` | ALWAYS commit lock file |
| Node.js | pnpm | `pnpm-lock.yaml` | `package.json` | pnpm preferred; npm `package-lock.json` also OK |

**Rules:**
- Lock files ALWAYS in git (reproducible builds)
- Pin major versions in manifest, let lock file pin exact
- `[dev]` / `[test]` dependencies separate from production
- Check stack compatibility BEFORE adding new dependency

---

## Related Notes

- Proven patterns and architecture approaches
- WHY things were built the way they are
- Installed tools, versions, package managers
- Full dev workflow protocol
- What NOT to do (anti-patterns, failures)
- Budget controls and pre-launch checklists
- Where secrets are stored
- Deployment and infrastructure
