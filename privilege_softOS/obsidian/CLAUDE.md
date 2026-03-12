# Knowledge Base -- ObsidianDB

> Vault for all research, decisions, audits, and project knowledge.

## Structure

```
ObsidianDB/
  projects/          <- hub notes for projects (entry points)
  research/          <- deep research by topic
  decisions/         <- architectural decisions (WHY)
  audits/            <- security/perf/code audits
  claude-memory/     <- copies from Claude persistent memory
  daily/             <- daily notes
```

## Conventions

- **Hub notes** (projects/*.md) -- entry point for each project, contain links to all related notes
- **YAML frontmatter** -- every file has `tags`, `source`, `created`
- **Cross-references** -- use internal links for cross-references between notes
- **Naming**: `{project}-{topic}.md` for uniqueness (e.g., `myproject-decisions.md`)
- **Tags**: `[project-name, domain, type]`

## Working with this vault

- When adding new research -- create a file in `research/{project}/` and add a link to the hub note
- When making a decision -- record it in `decisions/{project}-decisions.md`
- When auditing -- create a file in `audits/{project}-{audit-name}.md`
- Cross-project links are the main value of the vault

## Sources

Original files remain in their original locations. The vault contains COPIES.
When updating -- update both the original and the vault copy.
