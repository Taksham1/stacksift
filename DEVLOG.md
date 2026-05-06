# Developer Log

## Day 1 — 2026-04-30
**Hours worked:** 4
**What I did:** Scoped the project requirements and researched the AI tool pricing landscape. Drafted the initial audit engine logic on paper.
**What I learned:** Pricing for AI tools is increasingly complex, moving from simple seat caps to usage-based credits (e.g., Cursor and GitHub Copilot transitions).
**Blockers:** None.
**Plan for tomorrow:** Initialize the Next.js project and build the core audit logic.

## Day 2 — 2026-05-01
**Hours worked:** 5
**What I did:** Initialized the project with Next.js and TypeScript. Implemented the base `audit-engine.ts` and wrote initial test cases.
**What I learned:** Pure logic for financial audits is much more reliable and "defensible" than using an LLM for math.
**Blockers:** Hit some npm naming restriction issues during setup.
**Plan for tomorrow:** Build the spend input form.

## Day 3 — 2026-05-02
**Hours worked:** 6
**What I did:** Created the multi-tool spend input form. Implemented `localStorage` persistence so users don't lose progress on reload.
**What I learned:** Managing dynamic form arrays in React can get messy; decided to use a flat state structure with index-based updates.
**Blockers:** Styling complex form grids for mobile required several iterations.
**Plan for tomorrow:** Design the results page and hero section.

## Day 4 — 2026-05-03
**Hours worked:** 5
**What I did:** Designed the results page with a focus on "Rich Aesthetics." Implemented the hero savings card and the per-tool breakdown cards.
**What I learned:** Glassmorphism looks great but requires careful attention to accessibility (contrast ratios).
**Blockers:** CSS backdrop-filter performance issues on some mobile browsers.
**Plan for tomorrow:** Integrate the AI summary via Anthropic.

## Day 5 — 2026-05-04
**Hours worked:** 6
**What I did:** Set up the Anthropic API integration. Wrote the system prompts in `PROMPTS.md`. Implemented fallback logic for API failures.
**What I learned:** Claude 3.5 Sonnet is exceptionally good at following word count constraints in financial contexts.
**Blockers:** Getting the prompt "tone" right took multiple iterations (initially too friendly, then too robotic).
**Plan for tomorrow:** Backend integration (Supabase + Resend).

## Day 6 — 2026-05-05
**Hours worked:** 7
**What I did:** Integrated Supabase for lead storage and audit snapshots. Set up Resend for transactional emails. Built the shareable public URL route.
**What I learned:** Stripping PII from the public URL is critical for user privacy.
**Blockers:** Resend domain verification took longer than expected.
**Plan for tomorrow:** Testing, documentation, and final polish.

## Day 7 — 2026-05-06
**Hours worked:** 8
**What I did:** Wrote automated tests for the audit engine. Finalized all documentation files (`GTM.md`, `ECONOMICS.md`, etc.). Polished UI animations.
**What I learned:** The "viral loop" through shareable URLs depends heavily on good OG tags.
**Blockers:** Fixed a bug in the shareable URL data fetching where some fields were missing.
**Plan for tomorrow:** Submission!
