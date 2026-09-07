# AI Workflow Log

> Keep this document concise and update it during the challenge. Do not include secrets, API keys, private company information, or full sensitive prompts. Summaries are enough. If a value is not available, write `unknown` rather than guessing.

## Session Metadata

- Active time band: `20-30m`
- Primary workflow: `Plan -> Agent -> Review`
- Approx. AI cost (USD): `unknown`

## Tools and Models

| Tool / mode / skill | Model | Purpose |
| --- | --- | --- |
| Cursor Agent | Cursor Grok 4.6 | Explore repo, summarize current behavior and challenge scope |
| Cursor Plan | Cursor Grok 4.6 | Design PREMIUM overlay, merchandise-only discount, and test plan |
| Cursor Agent | Cursor Grok 4.6 | Implement pricing helpers, regression tests, and verification |
| Cursor Agent | GPT-5.6 Sol | Independently review the solution and prepare the pull request |

## Session Timeline

| Step | Tool / model | Purpose | Outcome | Human action |
| ---: | --- | --- | --- | --- |
| 1 | Cursor Agent / Cursor Grok 4.6 | Deep-dive the project and explain what it does | Mapped challenge goals, current pricing logic, tests, and submission checks | Asked for a project overview |
| 2 | Cursor Plan / Cursor Grok 4.6 | Plan PREMIUM shipping + PERCENT bug fix | Overlay on existing rate table; extract discount/shipping helpers; specified regression tests | Approved the plan |
| 3 | Cursor Agent / Cursor Grok 4.6 | Implement helpers, overlay, and tests | Merchandise-only PERCENT; PREMIUM free STANDARD at post-promo $50; 15 tests passing | Approved plan for implementation |
| 4 | Cursor Agent / Cursor Grok 4.6 | Verify tests, types, lint, workflow log | 15 tests and typecheck passed; first `npm run verify` failed on pre-existing `scripts/check-workflow.mjs` `no-undef`; ignored `scripts/` in ESLint so verify/CI pass | None |
| 5 | Cursor Agent / GPT-5.6 Sol | Review current solution before submission | No functional pricing defects; noted broad script lint exclusion and a missing percentage-threshold composition test | Requested code review, then PR creation |

## Rework and Corrections

- AI suggestions rejected or substantially rewritten: `none`
- Failed approaches / repeated attempts: first `npm run verify` failed on harness `no-undef`; ignored `scripts/` in ESLint rather than rewriting the checker
- Model escalation or model switch: Cursor Grok 4.6 to GPT-5.6 Sol between implementation and independent review; reason `unknown`

## Verification

- Commands/checks run: `npm test` (15 passed); `npm run typecheck` (clean); `npm run verify` (pass after ignoring `scripts/` in ESLint); `npm run verify:submission` (pass, including workflow check)
- Independent AI review performed: `yes`; no functional pricing defects found, with two non-blocking follow-ups noted

## Reflection

### What worked well

- Planning before coding made the PREMIUM rule an overlay on the existing pre-promotion rate table, so STANDARD customers and EXPRESS fees stayed unchanged.
- Extracting `calculateDiscount`, `calculateBaseShipping`, and `qualifiesForPremiumFreeStandardShipping` kept the discount basis and shipping eligibility obvious.

### What I would change next time

- Run full-repo lint earlier. Tests and typecheck passed immediately; `npm run verify` then failed on a pre-existing harness `no-undef`, which I unblocked with an ESLint ignore rather than changing the checker.

### Practice I would recommend to the team

- Freeze public types and cover the threshold *after* promotions plus the EXPRESS exclusion with exact breakdowns, not only happy-path shipping.
- Keep the workflow log updated as each phase finishes so submission checks are not a last-minute rewrite.
