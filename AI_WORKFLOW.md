# AI Workflow Log

> Keep this document concise and update it during the challenge. Do not include secrets, API keys, private company information, or full sensitive prompts. Summaries are enough. If a value is not available, write `unknown` rather than guessing.

## Session Metadata

- Active time band: `<20m` <!-- <20m | 20-30m | 30-45m | >45m -->
- Primary workflow: `Ask -> Plan -> TDD implementation -> Verify` <!-- e.g. Explore -> Plan -> Implement -> Test -> Review -->
- Approx. AI cost (USD): `unknown` <!-- optional if Cursor makes it practical to isolate -->

## Tools and Models

| Tool / mode / skill | Model | Purpose |
| --- | --- | --- |
| Cursor Ask | unknown | Understand the implemented pricing domain and current behavior |
| Cursor Plan + Superpowers brainstorming | unknown | Design the pricing pipeline, regression coverage, and scope |
| Cursor Agent + Superpowers executing-plans/TDD | GPT-5.6 Sol | Implement the approved plan with test-first verification |
| Cursor Agent + Superpowers systematic-debugging | GPT-5.6 Sol | Diagnose and correct the submission lint failure |
| Cursor general-purpose review | GPT-5.6 Sol | Independently review requirements, correctness, tests, and scope |

## Session Timeline

| Step | Tool / model | Purpose | Outcome | Human action |
| ---: | --- | --- | --- | --- |
| 1 | Cursor Ask / unknown | Explore pricing code and tests | Identified shipping tiers, promotion rules, and unused PREMIUM tier | Requested a solution plan |
| 2 | Cursor Plan + brainstorming / unknown | Plan the challenge changes | Approved a merchandise-first pricing pipeline and focused regression suite | Chose a fresh independent run and code/tests/workflow scope |
| 3 | Cursor Agent + executing-plans/TDD / GPT-5.6 Sol | Establish implementation baseline | Confirmed `challenge/enrique` is clean and all 4 baseline tests pass | Approved the attached plan |
| 4 | Cursor Agent + TDD / GPT-5.6 Sol | Add regression coverage before implementation | Added 8 scenarios; 5 failed for the expected percent-basis and PREMIUM-benefit gaps | None |
| 5 | Cursor Agent + TDD / GPT-5.6 Sol | Implement and test the pricing pipeline | Percent discounts now use merchandise only; PREMIUM standard shipping uses post-promotion merchandise; all 12 tests pass | None |
| 6 | Cursor Agent + systematic-debugging / GPT-5.6 Sol | Diagnose submission verification failure | Reproduced missing Node globals in the unchanged workflow script and scoped ESLint globals to `scripts/**/*.mjs` | None |
| 7 | Cursor Agent + independent review / GPT-5.6 Sol | Review the final diff against challenge requirements | Functional requirements and regression coverage approved; reviewer requested this final workflow-log update | Applied the review finding |
| 8 | Cursor Agent / GPT-5.6 Sol | Commit, push, and open the challenge PR | Branch `challenge/enrique` submitted to `main` | Requested commit, push, and PR |

## Rework and Corrections

- AI suggestions rejected or substantially rewritten: Planned task order was adjusted to write and observe failing regression tests before production changes, following TDD.
- Failed approaches / repeated attempts: First `npm run verify:submission` reached lint and failed because the base ESLint flat config did not declare Node globals for `scripts/check-workflow.mjs`; added the smallest file-scoped language configuration before retrying.
- Model escalation or model switch: Prior planning model was not visible; implementation continued with GPT-5.6 Sol after the session transition.

## Verification

- Commands/checks run: Baseline `npm test` (4 passed); RED `npm test -- tests/pricing.test.ts` (5 expected failures, 7 passed); GREEN same command (12 passed); `git diff --check` (passed); IDE lint diagnostics (none); first `npm run verify:submission` exposed 5 missing-global lint errors; targeted ESLint check and repeated `npm run verify:submission` passed (12 tests, typecheck, lint, workflow check).
- Independent AI review performed: `yes` — functional requirements and tests approved; one workflow-log correction applied.

## Reflection

### What worked well

- Planning the pricing pipeline as subtotal, discount, post-promotion merchandise, shipping, tax, and total made the dependency change explicit.
- Running the regression suite before implementation confirmed five tests exercised the missing behavior.

### What I would change next time

- State the interaction between the existing $75 free-shipping tier and the PREMIUM benefit explicitly in the initial requirements review.

### Practice I would recommend to the team

- For pricing changes, encode boundary cases and unaffected customer/shipping controls before restructuring the calculation pipeline.
