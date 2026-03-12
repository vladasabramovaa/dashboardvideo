---
name: landing-page
description: Use when creating a landing page — copy, assets, implement, SEO optimization
arguments:
  - name: product
    description: Product/service name and brief description
    required: true
  - name: goal
    description: "Page goal: signups, downloads, waitlist, sales"
    required: false
---

# Landing Page Workflow

## Step 1: Research
- Understand the product: features, audience, value proposition
- Check competitors via WebSearch (3-5 similar products)
- Identify differentiators and key messaging angles

## Step 2: Page Structure
Define sections (typical landing page flow):
1. Hero — headline, subheadline, CTA, hero image/visual
2. Problem — what pain point does this solve?
3. Solution — how the product solves it (3 features max)
4. Social proof — testimonials, metrics, logos
5. How it works — 3-step process
6. Pricing (if applicable)
7. FAQ (3-5 questions)
8. Final CTA — repeat main conversion action

## Step 3: Copywriting
- Headline: benefit-driven, <10 words
- Subheadline: clarify what + for whom
- CTAs: action verbs, contrasting color
- Features: benefit first, feature second
- Write for scanning: short paragraphs, bullet points

## Step 4: Implementation
- Use project's stack (Next.js, HTML, etc.)
- Invoke `frontend-design` skill for implementation
- Mobile-first responsive design
- Performance: lazy load images, minimize JS

## Step 5: SEO
- Title tag: <60 chars, keyword + brand
- Meta description: <155 chars, include CTA
- H1 = headline, proper heading hierarchy
- Alt text for all images
- Schema markup (Product, FAQ, Organization)
- OG/Twitter meta tags for social sharing

## Step 6: Verify
- Check all links work
- Test on mobile viewport
- Lighthouse score >90 for performance
- All CTAs have clear destinations
