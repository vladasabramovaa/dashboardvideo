---
name: session-budget
description: Use when tracking token/cost budget per session — monitors API usage and compute costs
arguments:
  - name: action
    description: "Action: start, check, report, set-limit"
    required: true
  - name: limit
    description: "Budget limit in USD (for set-limit action)"
    required: false
---

# Session Budget Tracker

## Actions

### start
Initialize budget tracking for this session:
- Note session start time
- Record any known API costs
- Set default limit: $5 unless overridden

### check
Before any paid API call:
- Calculate estimated cost of the operation
- Compare against remaining budget
- If over budget: WARN user and ask for confirmation
- If under budget: proceed and log the cost

### report
Generate session cost report:
- List all API calls made and their costs
- Total spend this session
- Remaining budget
- Comparison to previous sessions (if available in memory)

### set-limit
Set custom budget limit for the session:
- Store limit value
- Warn at 80% usage
- Block at 100% unless user overrides

## Cost Reference (approximate)
| Service | Unit | Cost |
|---------|------|------|
| Claude API (Opus) | per 1M tokens | ~$75 input / ~$150 output |
| Claude API (Sonnet) | per 1M tokens | ~$3 input / ~$15 output |
| OpenAI GPT-4o | per 1M tokens | ~$2.50 input / ~$10 output |
| fal.ai (image gen) | per image | $0.03-0.10 |
| Cloud GPU (A10G) | per hour | ~$1.10 |
| Cloud GPU (A100) | per hour | ~$3.70 |

## Integration
- Works with api-cost-guard rule (validates before compute)
- Saves session summary to context-store at session end
