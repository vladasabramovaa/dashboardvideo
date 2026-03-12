# Stack Compatibility Matrix

## Verified Stack Combinations

### Fullstack TypeScript
```
Frontend:  Next.js 14+ (App Router) + React 18+ + Zustand + Tailwind CSS
Backend:   NestJS 10+ + Prisma ORM + PostgreSQL + Redis
Queue:     BullMQ + Redis
Bot:       Grammy (Telegram)
Storage:   MinIO (S3-compatible)
Auth:      NextAuth 5 / Passport.js
Search:    pgvector (vector similarity)
Deploy:    Docker Compose + nginx reverse proxy + certbot SSL
```

### AI/ML Stack
```
API:       OpenAI SDK + Anthropic SDK + Google Generative AI
Embeddings: text-embedding-3-small (OpenAI) / pgvector storage
RAG:       Custom chunking + embeddings + vector search
Images:    fal.ai image generation APIs
Batch:     Anthropic Batch API (max_tokens=8192, batch_size=25)
```

### Game Dev Stack
```
Engine:    Phaser 3.90 + TypeScript + Vite
Assets:    AI image generation (sprites) + procedural generation
```

### Systems Programming Stack
```
Kernel:    C + eBPF
Userspace: Go
Training:  Python + PyTorch
Pattern:   Event Stream → Ring Buffer → Feature Extraction → Inference → Decision
```

## Technology Compatibility Rules

### Node.js Version Constraints
| Package | Min Node | Notes |
|---------|----------|-------|
| Next.js 14+ | 18.17+ | App Router requires 18.17+ |
| NestJS 10+ | 16+ | |
| Prisma 5+ | 16.13+ | |
| BullMQ 5+ | 18+ | |
| Grammy 1.x | 16+ | |

### Database Compatibility
| ORM | PostgreSQL | MySQL | SQLite | MongoDB |
|-----|-----------|-------|--------|---------|
| Prisma | Full | Full | Full | Full |
| TypeORM | Full | Full | Full | Full |
| Drizzle | Full | Full | Full | No |
| Sequelize | Full | Full | Full | No |
| Knex | Full | Full | Full | No |

### pgvector Requirements
- PostgreSQL 15+ recommended (14+ minimum)
- Prisma: use `$queryRawUnsafe` for `::vector` cast (not `$queryRaw`)
- Index type: IVFFlat (fast, approximate) or HNSW (slower build, faster query)
- Dimension limit: 2000 (OpenAI ada-002 = 1536, text-embedding-3-small = 1536)

### Next.js + NestJS Integration Rules
1. `NEXT_PUBLIC_*` vars baked at BUILD time — not runtime
2. Docker Compose reads `.env` NOT `.env.production`
3. Behind nginx: set `AUTH_TRUST_HOST=true` for NextAuth
4. API routes: `export const dynamic = "force-dynamic"` (no DB at build)
5. Mixed content: always use domain URL, never IP:port

### Docker Networking
- Shared network: all services can resolve by container name
- Port mapping: `host:container` — host port must be free
- DNS: container names as hostnames (e.g., `app-postgres`, `app-redis`)
- Health checks: always add for DB and Redis before app starts

### CSS Framework Compatibility
| Framework | React | Vue | Svelte | Angular |
|-----------|-------|-----|--------|---------|
| Tailwind CSS | Full | Full | Full | Full |
| styled-components | Full | No | No | No |
| Emotion | Full | No | No | No |
| CSS Modules | Full | Full | Full | Full |

## Anti-Compatible Combinations (DO NOT MIX)

| Bad Combo | Why | Use Instead |
|-----------|-----|-------------|
| TypeORM + Prisma in same project | Conflicting migration systems | Pick one ORM |
| Express + NestJS (raw) | NestJS wraps Express internally | Use NestJS decorators |
| Redux + Zustand in same project | Two state managers fighting | Pick one |
| Mongoose + Prisma MongoDB | Two ODMs, schema conflicts | Pick one |
| Webpack + Vite in same project | Two bundlers | Vite (modern) or Webpack (legacy) |
| npm + pnpm in same project | Lock file conflicts | Pick one package manager |
| .env.local + .env.production + .env | Loading order confusion | Use `.env` only in Docker |

## Migration Paths

### Express → NestJS
1. Create NestJS project alongside
2. Move routes → controllers one by one
3. Move middleware → guards/interceptors
4. Move services → injectable providers
5. Test each migration step

### Redux → Zustand
1. Create Zustand store matching Redux state shape
2. Replace `useSelector` → Zustand selectors
3. Replace `dispatch(action)` → store methods
4. Remove Redux boilerplate (reducers, action creators)

### Pages Router → App Router (Next.js)
1. Move `pages/api/*` → `app/api/*/route.ts`
2. Move `pages/*.tsx` → `app/*/page.tsx`
3. Add `'use client'` to interactive components
4. Replace `getServerSideProps` → server components
5. Replace `getStaticProps` → `generateStaticParams`

## Version Lock Warnings

When you see these in package.json, flag immediately:
- `"react": "^17"` with Next.js 14+ → needs React 18+
- `"prisma": "^4"` with Node 20+ → upgrade to Prisma 5+
- `"next-auth": "^4"` with App Router → consider NextAuth 5 beta
- `"bullmq": "^3"` with Redis 7+ → upgrade to BullMQ 5+
- Any `"*"` version → pin immediately
