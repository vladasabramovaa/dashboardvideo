---
name: debug-deep
description: Deep debugging using multi-agent analysis and error pattern matching. Use when user reports a bug, error, crash, or unexpected behavior. Triggers on "баг", "ошибка", "не работает", "debug", "fix", "broken", "crash", "error".
argument-hint: <error description or paste>
---

# Deep Debug — Holographic Error Analysis

Error: $ARGUMENTS

## Phase 0: Check Error Patterns

FIRST — read error-patterns.json if it exists:
```
$HOME/error-patterns.json
```

Check for matching patterns with frequency="recurring" or severity="critical".
If match found — apply known fix immediately with note "Known pattern: [id]".

## Phase 0.5: Load Architecture Rules

Read `~/.claude/skills/architecture-rules/references/antipatterns.md` and `~/.claude/skills/architecture-rules/references/stack-compat.md` — the bug may be caused by a known anti-pattern or stack incompatibility.

## Phase 1: Parallel Diagnosis (3 agents)

### Agent 1: Stack Trace Analyzer
- Parse the error message/stack trace
- Identify the exact file:line where error originates
- Trace the call chain backwards
- Read all relevant source files
- Return: root cause hypothesis + files involved

### Agent 2: Context Investigator
- Check git history — what changed recently?
- Check if similar errors in git log messages
- Look at related tests — are they passing?
- Check dependencies — version mismatches?
- Return: timeline of changes + correlation

### Agent 3: Pattern Matcher
- Search codebase for similar patterns that work
- Compare working vs broken code
- Check if it's a known anti-pattern
- Search web for this specific error message
- Return: similar working patterns + external solutions

## Phase 2: Root Cause Analysis

After agents return:
1. Cross-reference all 3 analyses
2. Identify ROOT cause (not symptom!)
3. Rate confidence: X%

```
## Root Cause Analysis

### Error Chain:
[symptom] ← [intermediate cause] ← [ROOT CAUSE]

### Root Cause: [description]
Confidence: X%

### Evidence:
- Agent 1 found: [...]
- Agent 2 found: [...]
- Agent 3 found: [...]

### Why previous fixes failed (if applicable):
[They fixed symptoms, not root cause]
```

## Phase 3: Fix Options

Present 2-3 fix approaches:

### Fix A: Architectural (correct)
Changes the structure to prevent the class of error

### Fix B: Targeted (quick)
Minimal change that fixes this specific instance

### Recommendation: [A or B] with reasoning

## Phase 4: Implement & Verify

1. Apply chosen fix
2. Run relevant tests
3. Verify fix doesn't break other things
4. Check for similar vulnerable patterns elsewhere

## Phase 5: Log Error Pattern

MANDATORY — after every fix, log to error patterns:

File: `$HOME/error-patterns.json`

```json
{
  "id": "[category]-[number]",
  "name": "[short pattern name]",
  "trigger": "[when this happens]",
  "wrongApproach": "[what was tried incorrectly]",
  "correctApproach": "[actual fix]",
  "severity": "critical|high|medium",
  "frequency": "recurring|very-common|common|occasional",
  "occurrences": 1,
  "lastSeen": "[today's date]"
}
```

Also update development-learnings.md with session log.

## Rules
- NEVER patch symptoms — find root cause
- Architecture fix > external fix
- Don't rebuild what works
- Verify every fact — no hallucinations
- Log EVERY error to patterns file
