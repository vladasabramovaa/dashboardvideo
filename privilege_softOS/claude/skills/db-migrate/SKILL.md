---
name: db-migrate
description: Use when creating database migrations — auto-detect ORM, generate, types, test up+down, safety check
disable-model-invocation: true
arguments:
  - name: change
    description: "Description of schema change, e.g. 'add email_verified column to users'"
    required: true
---

# Database Migration Workflow

## Step 1: Detect ORM/Migration Tool
- Auto-detect from project:
  - Python: Alembic (alembic.ini), Django migrations, SQLAlchemy
  - JS/TS: Drizzle (drizzle.config), Prisma (schema.prisma), Knex, TypeORM
  - Flutter: Drift (database.dart, tables)
  - Go: goose, golang-migrate

## Step 2: Review Current Schema
- Read latest migration files
- Read current model/schema definitions
- Check for pending migrations not yet applied
- Understand relationships and constraints

## Step 3: Plan Migration
- Define exact schema change
- Consider:
  - Is this additive (safe) or destructive (needs data migration)?
  - Does it need a default value for existing rows?
  - Does it affect indexes?
  - Does it break existing queries?

## Step 4: Generate Migration
- Use the project's migration tool to generate:
  - Alembic: `alembic revision --autogenerate -m "$change"`
  - Drizzle: `npx drizzle-kit generate`
  - Prisma: `npx prisma migrate dev --name $change`
  - Drift: manual migration in database.dart
- Review generated SQL — don't blindly trust autogenerate

## Step 5: Update Types
- Update model/schema types to match migration
- Ensure SSOT: schema definition → migration → types all consistent

## Step 6: Test
- Test UP migration (apply)
- Test DOWN migration (rollback) if supported
- Run existing tests — no regressions
- Test queries that use changed tables

## Step 7: Safety Check
- Production-safe? (no DROP without confirmation, no ALTER on large tables without plan)
- Backward compatible? (old code works until deployed)
- Data loss risk? (DROP COLUMN, type narrowing)

## Step 8: Commit
- `feat: migrate — $change`
