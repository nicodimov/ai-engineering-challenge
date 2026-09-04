# AI Workflow Log

> Keep this document concise and update it during the challenge. Do not include secrets, API keys, private company information, or full sensitive prompts. Summaries are enough. If a value is not available, write `unknown` rather than guessing.

## Session Metadata

- Active time band: `20-30m`
- Primary workflow: `Explore -> TDD -> Implement -> Verify -> PR`
- Approx. AI cost (USD): `unknown`

## Tools and Models

| Tool / mode / skill | Model | Purpose |
| --- | --- | --- |
| Cursor Agent | Cursor Grok 4.6 | Read challenge spec, implement pricing changes, tests, and submission |
| Superpowers TDD | Cursor Grok 4.6 | Red-green-refactor for bug fix and PREMIUM shipping feature |
| Superpowers verification-before-completion | Cursor Grok 4.6 | Run `npm run verify:submission` before claiming done |

## Session Timeline

| Step | Tool / model | Purpose | Outcome | Human action |
| ---: | --- | --- | --- | --- |
| 1 | Cursor Agent / Cursor Grok 4.6 | Read README, CHALLENGE.md, pricing module, existing tests | Confirmed two behaviors: percent discount must be merchandise-only; PREMIUM free STANDARD shipping at $50 after promotions | Requested performing the challenge |
| 2 | Cursor Agent / Cursor Grok 4.6 | Create `challenge/kike` from `main` | Branch created | none |
| 3 | Cursor Agent / Cursor Grok 4.6 | TDD red: percent promotion includes shipping | Test failed with discount 3.5 vs expected 3 | none |
| 4 | Cursor Agent / Cursor Grok 4.6 | TDD green: apply percent to merchandise only | Percent test passed | none |
| 5 | Cursor Agent / Cursor Grok 4.6 | TDD red/green: PREMIUM free STANDARD shipping at $50 after promo | Failed with shipping 5, then passed after eligibility check | none |
| 6 | Cursor Agent / Cursor Grok 4.6 | Add regressions (after-promo threshold, EXPRESS, STANDARD, existing $75 free ship) and extract helpers | 10 tests passed; mutation check confirmed after-promo test catches pre-promo subtotal | none |
| 7 | Cursor Agent / Cursor Grok 4.6 | `npm run verify:submission` and open PR | Tests 10/10, typecheck, lint, and workflow check passed | none |

## Rework and Corrections

- AI suggestions rejected or substantially rewritten: `none`
- Failed approaches / repeated attempts: `npm run verify:submission` failed on lint for `scripts/check-workflow.mjs` Node globals; same failure exists on `main`. Added an ESLint globals override for `scripts/**/*.mjs` so submission verification can pass.
- Model escalation or model switch: `none`
- Human decisions or manual corrections: `none`

## Verification

- Commands/checks run: `npm test` (10 passed); `npm run typecheck`; `npm run lint`; `npm run workflow:check`; `npm run verify:submission` (exit 0 after ESLint globals fix)
- Independent AI review performed: `self-review against CHALLENGE.md; no other challenge PRs inspected`

## Reflection

### What worked well

- Reading the spec and existing tests before coding made the discount-basis vs shipping-eligibility split obvious.
- Watching the percent-discount and PREMIUM shipping tests fail first confirmed they targeted the real bugs, not already-correct behavior.

### What I would change next time

- I skipped a written design doc because CHALLENGE.md already specified the change and creating extra files requires approval. For a larger change I would pause for a short plan before TDD.

### Practice I would recommend to the team

- Keep pricing rules in named helpers with explicit inputs (merchandise subtotal vs merchandise after promotions) so tests can pin each rule without coupling to the whole breakdown.
