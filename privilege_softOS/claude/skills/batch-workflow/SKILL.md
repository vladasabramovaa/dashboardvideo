---
name: batch-workflow
description: Use when running multi-skill pipelines — new-feature, marketing-launch, design-to-code workflows
arguments:
  - name: workflow
    description: "Workflow name: new-feature, marketing-launch, design-to-code, full-audit"
    required: true
  - name: context
    description: Additional context for the workflow
    required: false
---

# Batch Workflow — Multi-Skill Pipelines

## Available Workflows

### new-feature
Full feature development pipeline:
1. `/brainstorming` — explore requirements and design
2. `/test-gen` — write tests for the feature (TDD)
3. Implementation (manual or via `/quick-api` for API features)
4. `/refactor` — if code needs restructuring
5. `/pr-review` — self-review before committing
6. `doc-writer` agent — update docs

### marketing-launch
Product launch content pipeline:
1. `/competitor-analysis` — understand the landscape
2. `/landing-page` — create product landing page
3. `/content-pipeline` — write launch blog post
4. `/social-post platform=all` — create social media posts
5. `/email-sequence type=launch` — create launch email sequence
6. `/seo-audit` — audit the landing page

### design-to-code
Design implementation pipeline:
1. `/figma-to-code` — convert Figma design to code
2. `/design-system` — extract/create tokens if needed
3. `/ui-component` — build reusable components
4. `/responsive-audit` — verify responsiveness

### full-audit
Comprehensive project audit:
1. `/perf-audit target=full` — performance check
2. `/seo-audit` — SEO check (if web project)
3. `/responsive-audit` — responsive check (if web project)
4. `auditor` agent — Constructor Pattern audit

## Execution
- Present the workflow steps to user BEFORE starting
- Execute skills sequentially, passing context between them
- After each skill: report results, ask if user wants to continue or skip
- Track progress in TODO tasks
