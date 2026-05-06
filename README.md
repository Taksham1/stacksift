# StackSift

**StackSift** is a professional AI spend audit tool designed for engineering leaders and finance teams. It analyzes your AI tool subscriptions (Cursor, Claude, OpenAI, etc.) and identifies significant overspending, providing a defensible roadmap for immediate savings.

## Screenshots
*Coming soon - visual quality is premium dark mode with glassmorphism.*

## Quick Start
1. **Install**: `npm install`
2. **Run Locally**: `npm run dev`
3. **Deploy**: Push to Vercel (requires `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, and Supabase environment variables).

## Decisions & Trade-offs
1. **Vanilla CSS over Tailwind**: Chose Vanilla CSS with a custom design system to ensure maximum "Rich Aesthetics" control and avoid the generic "Tailwind look," aligning with the premium feel requirement.
2. **Next.js App Router**: Utilized for its robust server-side capabilities (OG tag generation for shareable links) and built-in API handling for LLM integrations.
3. **Hardcoded Audit Math**: Decided against using LLMs for the audit logic itself to ensure 100% accuracy and defensibility. LLMs are used only for generating the narrative summaries.
4. **Supabase for Persistence**: Chose Supabase as it provides a robust PostgreSQL backend with minimal setup, perfect for storing leads and shareable audit snapshots.
5. **Post-Value Lead Capture**: Implemented the "value-first" approach where users see their full savings audit before being asked for an email, increasing trust and conversion quality.

## Live Deployed URL
[https://stacksift.vercel.app](https://stacksift.vercel.app)
