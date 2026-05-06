# Automated Tests

This project uses **Vitest** for unit testing the core audit engine.

## Test Suite: Audit Engine
**Filename**: `src/lib/audit-engine.test.ts`
**Coverage**:
- **Optimal Stack**: Verifies that users on low-spend or efficient plans get 0 savings and "Keep current plan" recommendations.
- **Cursor Overspend**: Tests the logic for downgrading Business to Pro for small teams.
- **Claude Team Overkill**: Verifies that solo users on Team plans are moved to Pro.
- **Startup Credits**: Tests that high-spend API users (> $500/mo) are flagged for credits.
- **Math Accuracy**: Ensures total annual savings is exactly 12x monthly savings.

## How to Run
```bash
npm test
```

## Results (Latest Run)
- ✓ Audit Logic: Optimal stack results in 0 savings
- ✓ Audit Logic: Cursor Business with 1 seat recommends Pro
- ✓ Audit Logic: Claude Team with 1 seat recommends Pro
- ✓ Audit Logic: High API spend flags startup credits
- ✓ Audit Logic: Annual savings calculation
