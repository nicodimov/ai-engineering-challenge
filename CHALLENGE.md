# AI-Assisted Engineering Challenge

## Goal

This is an asynchronous engineering exercise designed to help the team identify repeatable AI-assisted development practices that maximize software quality while minimizing unnecessary AI cost, rework, and developer effort.

This is **not a competition** and there is no single winner. The useful output is the set of practices we should adopt as a team.

## Expected effort

Approximately **20 minutes of active work** with AI assistance. Complete it whenever it fits your schedule during the challenge window. Active time is self-reported only as a rough context signal; it is not a race.

## Scenario

You are working on a small order-pricing module. Implement the following change request:

### 1. Feature

`PREMIUM` customers receive **free STANDARD shipping** when their merchandise subtotal **after promotions** is at least **$50.00**.

- The threshold is evaluated after the promotion is applied.
- `EXPRESS` shipping is never made free by this PREMIUM benefit.
- Existing shipping behavior for other customers must remain unchanged.

### 2. Bug fix

Percentage promotions currently reduce the shipping fee as well as merchandise. A percentage promotion must apply to **merchandise only**. Shipping must never be included in the percentage-discount basis.

### 3. Tests and refactor

Add regression protection for the behavior above and refactor the affected pricing logic where appropriate so that discount basis and shipping eligibility are clear and maintainable.

Do not change the public `Order`, `Promotion`, or `PriceBreakdown` shapes.

## Submission

1. Create a branch named `challenge/<your-name>` from `main`.
2. Work however you normally would with Cursor and any AI workflow you prefer: built-in Cursor tools, rules, skills, Superpowers, multiple models, subagents, or a combination.
3. Keep `AI_WORKFLOW.md` up to date while you work. The repository's Cursor rule explains what must be recorded.
4. Run `npm run verify:submission` before submitting.
5. Open a pull request back to `main` using the provided PR template.
6. Do not inspect another participant's challenge PR until your own PR has been submitted.
