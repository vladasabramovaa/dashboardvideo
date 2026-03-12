---
type: moc
tags: [knowledge, evidence, validation, methodology]
created: 2026-03-07
---

# Evidence Grading -- Scale for Validating Conclusions

Unified scale for marking the reliability of conclusions across all projects and research.

---

## Scale E1-E6

| Grade | Name | Criterion | Examples |
|-------|------|-----------|---------|
| **E1** | Fact | Production-verified OR official source | Cloud GPU pricing from official page [E1]. Live deployed service [E1] |
| **E2** | Verified | Tests pass, benchmarks reproducible, 2+ sources | Inference latency benchmarked [E2]. N tests passing [E2] |
| **E3** | Synthetic | Synthetic data, controlled benchmark | Model accuracy on synthetic test set [E3]. Backtest results on historical data [E3] |
| **E4** | Expert assessment | Analysis without running, literature consensus | Backtest-to-live gap 30-50% [E4-literature]. Audit consensus [E4] |
| **E5** | Hypothesis | Theory, math model, analogy | Yield model estimate [E5-math]. Commercial viability estimate [E5] |
| **E6** | Speculation | Single source, outdated data, guess | Extrapolation from limited data [E6] |

---

## Minimum Grade for Decisions

| Decision Type | Min Grade | Why |
|--------------|-----------|-----|
| Financial (compute spend, purchases) | E1 | Cost overrun incident -- E4 estimate proved false |
| Architectural (stack, protocol) | E2 | Architecture rewrites are expensive |
| Tool selection | E3 | Tools can be replaced later |
| Research direction | E5 | Research IS hypothesis testing |

---

## Example Patterns

### ML Model with Synthetic-to-Real Gap
- Model params and architecture [E2-code verified, tested]
- Evaluation methods [E2-implemented, tested]
- Evasion/accuracy rate on synthetic data [**E3**] -- NOT real-world
- Expected real-world performance [**E5**-estimate with gap]
- Field validation [E5-planned, not started]

### Backtest Illusions
- Strategy theoretical return [**E4**-literature consensus]
- Backtest metrics [**E3**-historical data]
- Expected live metrics [**E4**-expect 30-50% degradation from literature]
- "Profitable strategy" [**E5** until live trading proves E2]

### Audit Findings
- Protocol works [E1-production deployed]
- Security flaw found [E1-code verified]
- Overall readiness estimate [E4-auditor consensus]
- Auto-healing claims [**E6** if docs claim it but code does not implement]

### Pure Theoretical Research
- Mathematical formula [E2-math proven]
- Projected performance [**E5**-model, no implementation]
- System properties [**E5**-depends on unproven assumptions]

### Sourced Facts
- Pricing from official page [E1]
- Performance from multiple independent tests [E2]
- "Best for X use case" [E4-depends on usage pattern]

---

## Grade Promotion/Demotion Rules

```
E6 -> E5: formulate as a testable hypothesis
E5 -> E4: find 2+ independent sources OR peer review
E4 -> E3: run a benchmark/test on real code
E3 -> E2: validate on real data OR 3+ sources agree
E2 -> E1: production deployment OR official source confirmation

Auto-demotion:
- Data >6 months without re-verification -> grade -1
- Single source -> max E4
- Own benchmark without external confirmation -> max E3
```

---

## Related Notes

- wrong-paths -- concrete failures (most were initially E4-E5 when used as E1-E2)
- architecture-decisions -- each decision should reference its evidence grade
- cost-incidents -- cost overruns = E4 estimates used as E1
