---
name: competitor-analysis
description: Use when analyzing competitors — WebSearch, scrape, comparison matrix, SWOT
arguments:
  - name: product
    description: Your product/project name
    required: true
  - name: competitors
    description: "Comma-separated competitor names (or 'auto' to find them)"
    required: false
---

# Competitor Analysis Workflow

## Step 1: Identify Competitors
- If competitors provided: use them
- If "auto" or not specified:
  - WebSearch for "[product type] alternatives"
  - WebSearch for "[product type] vs"
  - Identify top 3-5 direct competitors

## Step 2: Research Each Competitor
For each competitor, gather via WebSearch + WebFetch:
- **Product:** core features, pricing, target audience
- **Tech stack:** (if discoverable) frameworks, hosting, APIs
- **Positioning:** tagline, value proposition, messaging
- **Strengths:** what they do well, user praise
- **Weaknesses:** complaints, missing features, bad reviews
- **Pricing:** free tier, paid plans, enterprise

## Step 3: Comparison Matrix
Create table:
| Feature | Your Product | Competitor A | Competitor B | Competitor C |
|---------|-------------|--------------|--------------|--------------|
| Feature 1 | status | status | status | status |

Use: present / absent / partial / superior

## Step 4: SWOT Analysis
For YOUR product relative to competitors:
- **Strengths:** where you're better
- **Weaknesses:** where competitors are better
- **Opportunities:** gaps none of them fill
- **Threats:** competitive risks, market trends

## Step 5: Strategic Recommendations
- Top 3 differentiators to emphasize in marketing
- Top 3 features to build/improve based on competitive gaps
- Positioning statement suggestion
- Pricing strategy insights
