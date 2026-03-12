---
name: project-onboard
description: Onboard a project into ObsidianDB vault — audit docs, create missing CLAUDE/DECISIONS/HOTPATHS/TODO, sync to vault, update knowledge MOCs. Use when bringing a project into the knowledge base or auditing project documentation. Triggers on "project-onboard", "onboard project", "подключи проект", "приведи в порядок".
argument-hint: <project-path>
---

# Project Onboard Skill

Bring project at $ARGUMENTS into full documentation and vault sync.

## Phase 1: Audit

Read the project directory structure and understand:
1. `ls` project root — file structure
2. Check for: CLAUDE.md, DECISIONS.md, HOTPATHS.md, TODO.md
3. Check for: docs/, research/, audit/, tests/
4. Read existing CLAUDE.md if present
5. Read key source files to understand architecture, stack, patterns
6. Count: files, lines of code, tests

Output: audit summary of what exists and what's missing.

## Phase 2: Create Missing Docs (in project)

For EACH missing doc, READ THE CODE FIRST to extract real information:

### CLAUDE.md (if missing)
Read main source files, configs, package manifests. Extract:
- Project purpose (1-2 sentences)
- Architecture (layers, patterns)
- Stack (languages, frameworks, DBs)
- Constraints (things that MUST NOT change)
- Known issues
- Key commands (build, test, deploy)

### DECISIONS.md (if missing)
Read code structure, config choices, dependencies. Extract:
- Why this stack was chosen
- Key architectural decisions visible from code
- Trade-offs implied by the structure

### HOTPATHS.md (if missing)
Identify critical code paths:
- Main entry point → output flow
- Data pipeline stages
- Security-sensitive code
- Performance-critical paths

### TODO.md (if missing)
Read existing issues, FIXMEs in code, incomplete features:
- grep for TODO, FIXME, HACK, XXX in source
- Check for incomplete implementations
- List obvious next steps

### DEVPLAN.md (if missing)
Analyze TODO.md, existing plans in docs/plans/, and project state to create:
- Current phase (what's being worked on NOW)
- Phases with milestones (DONE / IN PROGRESS / PLANNED)
- Dependencies between phases
- Blockers and constraints
Format: phases with checkbox milestones, not essays

## Phase 3: Sync to ObsidianDB Vault

Vault path: `~/Projects/ObsidianDB/`

### Create/Update hub note: `projects/{project-name}.md`
```yaml
---
tags: [project, {stack-tags}]
status: active
path: {project-path}
created: {DATE}
---
```
Include: summary, key links to vault notes, stack, constraints.

### Copy research/docs to vault:
- research/*.md → `research/{project}/` with frontmatter
- DECISIONS.md → `decisions/{project}-decisions.md`
- Audit files → `audits/{project}-*.md`

### Add [[wikilinks]] between:
- Hub note ↔ all copied docs
- Hub note ↔ relevant knowledge MOCs
- Copied docs ↔ cross-project references

## Phase 4: Update Knowledge MOCs

Read each knowledge MOC and ADD new findings:
- `knowledge/code-patterns.md` — new patterns found in this project
- `knowledge/wrong-paths.md` — any dead ends visible in code/comments
- `knowledge/api-integrations.md` — any new APIs used
- `knowledge/server-ops.md` — any deployment config
- `knowledge/credentials.md` — any credential references
- `knowledge/architecture-decisions.md` — key decisions
- `knowledge/debugging-playbook.md` — any error handling patterns
- `knowledge/toolchain.md` — any new tools required
- `knowledge/security-checklist.md` — any security patterns
- `knowledge/cost-incidents.md` — any cost-related code

Format for new entries: `- [[{project}]] — specific fact`

## Phase 5: Verify

1. All [[wikilinks]] in hub note resolve to real files
2. Hub note listed in Dashboard.md
3. CLAUDE.md, DECISIONS.md, HOTPATHS.md, TODO.md exist in project
4. Print summary:
```
Project onboarded: {name}
- Docs created: X
- Vault notes: Y
- Knowledge MOC updates: Z
- Wikilinks added: N
```

## Rules
- READ CODE before writing docs — never guess or hallucinate
- Don't overwrite existing docs — only create missing ones
- Keep docs concise — CLAUDE.md < 100 lines, DECISIONS.md = key decisions only
- Use Constructor Pattern naming conventions
- Every fact must trace to real code or config
