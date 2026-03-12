---
name: research
description: Deep research on any topic using parallel agents, web search, and cross-referencing. Use when user asks to research, investigate, or deeply analyze a topic, technology, library, or concept. Triggers on keywords like "исследуй", "изучи", "research", "deep dive", "find out everything about".
argument-hint: <topic or question>
---

# Deep Research Skill

You are conducting deep research on: $ARGUMENTS

## Process

### Phase 0: Check ObsidianDB Vault

Before web search, check existing knowledge:
1. Read `~/Projects/ObsidianDB/knowledge/` MOC notes for relevant existing findings
2. Search `~/Projects/ObsidianDB/research/` for related prior research
3. Check `~/Projects/ObsidianDB/knowledge/wrong-paths.md` for known dead ends on this topic
4. Use findings to focus web search on GAPS, not re-research known facts

### Phase 1: Parallel Discovery (3-5 agents)

Launch parallel agents with different research angles:

1. **Agent: Web Researcher** — Use WebSearch + WebFetch to find latest articles, docs, repos, benchmarks. Return top 10 findings with URLs.

2. **Agent: Code Explorer** — If topic relates to code/library, search the codebase and npm/pypi/github for implementations, examples, patterns. Use Explore agent.

3. **Agent: Critic** — Search for criticisms, limitations, known issues, alternatives. Find "X vs Y" comparisons, migration guides, deprecation notices.

4. **Agent: Practical Examples** — Find real-world usage examples, case studies, production stories. Check GitHub issues, Stack Overflow, blog posts.

5. **Agent: Documentation** — If a library/framework, fetch official docs. Use Context7 MCP if available for versioned docs.

### Phase 2: Cross-Reference & Validate

After agents return:
1. Cross-reference findings — what do multiple sources agree on?
2. Flag contradictions between sources
3. Identify gaps — what wasn't found?
4. Check dates — is information current?
5. Rate confidence for each finding (high/medium/low)

### Phase 3: Structured Report

Present findings as:

```
## Research: [Topic]

### Summary (2-3 sentences)

### Key Findings
1. [Finding] — confidence: X% — [source]
2. ...

### Architecture/How It Works
[If applicable — diagrams, data flow]

### Pros & Cons
| Pros | Cons |
|------|------|
| ... | ... |

### Alternatives Compared
| Feature | Option A | Option B | Option C |
|---------|----------|----------|----------|

### Recommendations
[Based on findings, what's the best path]

### Sources
- [URL] — [what was found]
```

### Phase 4: Save to ObsidianDB + Memory

If research reveals important patterns or decisions:
- Save full research to `~/Projects/ObsidianDB/research/{topic}/` with YAML frontmatter and [[wikilinks]]
- Update relevant MOC notes in `~/Projects/ObsidianDB/knowledge/`:
  - New dead end → `wrong-paths.md`
  - New pattern → `code-patterns.md`
  - API finding → `api-integrations.md`
  - Architecture insight → `architecture-decisions.md`
- Save key findings to memory topic file
- Update MEMORY.md index if new project/technology

## Rules
- NEVER present unverified claims as facts
- Always cite sources
- Flag when information might be outdated
- Present multiple viewpoints, not just one
- Confidence percentage for each major claim
