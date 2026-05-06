# Reflection

### 1. The Hardest Bug
The hardest bug I hit this week was related to the dynamic form state synchronization with `localStorage`. Because the form allows adding and removing tools from an array, I initially used the array index as the `key` for React components. This caused a bug where removing a tool from the middle of the list would result in the wrong inputs being cleared or updated due to React's reconciliation logic. 
**Debugging**: I formed the hypothesis that the index-based keys were causing state leakage between components. I tried using the tool name as a key, but since users can add the same tool multiple times (e.g., two different Claude accounts), that failed too.
**Solution**: I added a unique `id` (using `nanoid`) to each tool object in the state upon creation. This ensured that every form row had a stable identity, resolving the UI glitches and state persistence issues.

### 2. Decision Reversal
Mid-week, I reversed the decision to use a multi-step "wizard" style form. I originally thought a wizard would be less overwhelming, but after testing it with a peer, I realized that users often want to jump back and forth between tools to compare their entries. The wizard forced too much linear friction. I pivoted back to a single-page "Sleek List" view that uses high-quality animations (Framer Motion) to make the entry feel light rather than tedious. This allowed for a much faster "time-to-value" which is critical for a tool landed on from Twitter or HN.

### 3. Week 2 Roadmap
If I had a second week, I would build:
- **PDF Export**: A high-fidelity, branded PDF report that users can present to their CFOs or managers for budget approval.
- **Benchmark Mode**: Integrating anonymized data to show users where they sit compared to peers (e.g., "Your spend is in the 90th percentile for teams of 5").
- **Browser Extension**: A light extension that detects what AI tools you are logged into and pre-fills the audit form automatically, reducing the friction of manual data entry.

### 4. Use of AI Tools
I used **Claude 3.5 Sonnet** extensively for three main tasks:
1. **Research**: Summarizing the latest pricing changes across the AI landscape (which are frequent and poorly documented).
2. **Boilerplate**: Generating the base TypeScript interfaces and initial CSS Module structures.
3. **Copywriting**: Refining the landing page copy to strike the right balance between "Finance Expert" and "Dev Productivity Advocate."
**What I didn't trust**: I did not trust AI with the audit logic math. Logic errors in financial reasoning would destroy the "defensibility" of the tool. 
**Correction**: At one point, the AI suggested a logic rule that assumed all "Enterprise" plans are always 2x the price of "Business." I caught this because some vendors (like GitHub) have a much smaller gap, and I manually corrected the engine to use verified pricing data.

### 5. Self-Rating
- **Discipline (9/10)**: Stuck to the 7-day log and project scope without scope creep.
- **Code Quality (8/10)**: Clean, typed logic, but could benefit from more robust end-to-end testing.
- **Design Sense (10/10)**: Chose a premium, high-contrast dark mode that feels "state-of-the-art" as requested.
- **Problem Solving (9/10)**: Resolved the form state bug and integrated three different APIs smoothly.
- **Entrepreneurial Thinking (9/10)**: Focused on the "viral loop" and lead magnet aspects (Credex consultation) rather than just building a calculator.
