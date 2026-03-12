# Claude Code OS

> Язык: ВСЕГДА русский (unless user switches to English).

---

## RULE ZERO — Constructor Pattern

> Кубик = 1 файл, 1 класс, 1 паттерн — самодостаточный, читаемый AI-ассистентом, воспроизводимый.

**Принципы:** примитивность (сложность = композиция простых кубиков), декомпозируемость (любой кубик заменяем), метапозиционность (AI читает и генерирует по аналогии), self-extension (новые кубики по тем же правилам).

**Запрещено:** миксины, абстрактные фабрики, DI-контейнеры, слои абстракции.
**При аудите:** если "проблема" = часть паттерна конструктора — это НЕ проблема.

**Пороги:** функция >30 строк → split. Файл >200 строк → decompose.
**Конфликт с "Don't Rewrite":** Rule Zero для нового кода. Don't Rewrite для существующего, если не блокирует новую фичу.

---

## Core Rules

1. **No Patching / No Overlays** — фиксы В ФОРМУЛЫ КОРНЯ. Если файл вырос вдвое от "фиксов" = overlay
2. **Root Cause** — всегда ищи корень проблемы, не симптом
3. **Don't Rewrite Working Code** — не переписывай работающее без причины
4. **Full Observability** — логируй параметры, без данных нет решений
5. **Single Source of Truth** — типы, роуты, enum в ОДНОМ месте, zero duplications

---

## Project Registry

| Проект | Путь | Docs |
|--------|------|------|
| my-app | `~/Projects/my-app` | 4/4 |
| my-api | `~/Projects/my-api` | 4/4 |
| my-cli | `~/Projects/my-cli` | 3/4 |
| my-website | `~/Projects/my-website` | 4/4 |
| my-ml-project | `~/Projects/my-ml-project` | 1/4 |

> Project constraints, стеки, статусы — в `~/.claude/rules/project-*.md` (загружаются автоматически по glob).

---

## Memory

- **context-store** MCP = PRIMARY persistent memory
- **memory-keeper** MCP = secondary, SQLite-based (`~/mcp-data/memory-keeper/context.db`)
- **ObsidianDB** = knowledge base vault (`~/Projects/ObsidianDB/`)
- При завершении сессии: сохраняй решения (category: "decision"), баги ("bug"), отвергнутые подходы ("rejected")
- При старте: проверяй memory на контекст предыдущих сессий

---

## ObsidianDB — Knowledge Base

Vault: `~/Projects/ObsidianDB/`

**При research/debug/development — СНАЧАЛА проверь vault:**
- `knowledge/wrong-paths.md` — тупики и антипаттерны (не повторяй!)
- `knowledge/code-patterns.md` — проверенные паттерны
- `knowledge/server-ops.md` — серверы, деплой, SSH
- `knowledge/credentials.md` — ключи и доступы
- `knowledge/architecture-decisions.md` — ПОЧЕМУ так сделано
- `knowledge/api-integrations.md` — API лимиты, цены, quirks

**При обнаружении нового знания — ЗАПИСЫВАЙ в vault:**
- Нашёл тупик/антипаттерн → добавь в `knowledge/wrong-paths.md`
- Выбрал архитектуру/стек → добавь в `knowledge/architecture-decisions.md`
- Настроил сервер → добавь в `knowledge/server-ops.md`
- Обнаружил API quirk/лимит → добавь в `knowledge/api-integrations.md`
- Нашёл рабочий паттерн → добавь в `knowledge/code-patterns.md`
- Новый ключ/доступ → добавь ССЫЛКУ в `knowledge/credentials.md`

Формат записи: `- [[project-link]] — конкретный факт`

---

## Reference Files

- Development Workflow: `~/.claude/projects/-Users-$USER/memory/development-workflow.md`

> Add your own project memory references here.
