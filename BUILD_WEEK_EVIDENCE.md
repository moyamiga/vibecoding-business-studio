# Build Week Evidence

This file separates prior work from the educational product created during OpenAI Build Week. It records only claims that can be tied to repository history, the primary Codex session, CI, or the public deployment.

## Submission Evidence

- **Track:** Education
- **Public demo:** https://vibecoding-business-studio.moyamiga.chatgpt.site
- **Repository:** https://github.com/moyamiga/vibecoding-business-studio
- **Primary `/feedback` Codex Session ID:** `019f2a76-e8c6-77c0-adc4-67efd2e87a`
- **Build-time model:** GPT-5.6 through Codex
- **Primary CI run:** https://github.com/moyamiga/vibecoding-business-studio/actions/runs/29699072262

## How Codex and GPT-5.6 Were Used

The majority of the current educational product was developed in the Codex session identified above. Codex with GPT-5.6 was used as a development partner to:

- refocus the repository from a game-centered experiment into an educational product;
- define the six-stage learning workflow;
- design the TypeScript domain model;
- implement the browser application;
- add scope coaching, milestone generation, prompt-writing review, team roles, reflection, and report export;
- create the optional server-side OpenAI coach endpoint;
- remove the former game and Unity prototype from the product surface;
- debug and revise the implementation;
- prepare the README, judging guide, evidence log, and Devpost material;
- run and interpret type-check, build, CI, deployment, and HTTP verification results.

The human product owner made the central product decisions. GPT-5.6 and Codex accelerated reasoning, implementation, revision, and verification, but did not choose the final product direction independently.

## Runtime AI Clarification

The public OpenAI Sites demo currently remains fully testable through a transparent local coaching fallback. The repository also contains a server-side OpenAI Responses API endpoint at `api/coach.mjs`.

The build-time use of GPT-5.6 through Codex is separate from runtime API use inside the public demo. This repository does **not** claim that every public demo interaction calls GPT-5.6. A live runtime API model should only be claimed after `OPENAI_API_KEY` and `OPENAI_MODEL` are configured and a request is verified.

## Prior Work

The repository began as a game-building experiment. That work helped reveal a broader educational problem: AI can accelerate implementation, but learners still need help with writing, scope, product judgment, verification, teamwork, business tradeoffs, and reflection.

The former TempleFall prototype remains available in Git history at:

```text
13a96227666b438cd59377517d79b6bdae1e620e
```

The game is not part of the current product claim.

## Build Week Product Work

| Date | Change | Evidence |
| --- | --- | --- |
| 2026-07-19 | Reframed the product around learner ownership and project-based education | Pull request: https://github.com/moyamiga/vibecoding-business-studio/pull/1 |
| 2026-07-19 | Implemented the educational Studio MVP | Commit: https://github.com/moyamiga/vibecoding-business-studio/commit/ba005d7f41bb95cefff392ea0845852cb89a2bb3 |
| 2026-07-19 | Added the server-side OpenAI coach and local fallback | `api/coach.mjs`, `src/coach.ts` |
| 2026-07-19 | Added documentation, testing, CI, and submission materials | `README.md`, `JUDGES_TESTING.md`, `DEVPOST_SUBMISSION.md`, `.github/workflows/ci.yml` |
| 2026-07-19 | Deployed the public demo with OpenAI Sites | https://vibecoding-business-studio.moyamiga.chatgpt.site |
| 2026-07-19 | Expanded the learning model to include writing, business reasoning, team roles, and decision boundaries | Commit: https://github.com/moyamiga/vibecoding-business-studio/commit/6f899b80c51d769ce9d1bf20028d7a5101ea9c86 |

## Human Product Decisions

The following decisions belong to Moy as the project owner:

- The game prototype was removed from the product experience.
- The learner, not the generated artifact, became the center of the product.
- The MVP focuses on idea definition, writing clarity, scope, milestones, Codex preparation, reflection, and evidence.
- Prompt writing, business reasoning, team roles, and roadmap ownership became first-class learning moments.
- The sneaker-company game remains only as a sample learning context.
- Authentication, payments, classroom administration, native apps, real-time collaboration, and complex permissions were postponed.
- API credentials remain server-side.
- The application remains usable through a visible local fallback.

## Verification Log

Verified:

- [x] Primary `/feedback` Codex Session ID recorded
- [x] GPT-5.6 build-time use through Codex documented
- [x] `npm ci --no-audit --no-fund`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] GitHub Actions CI
- [x] Public OpenAI Sites deployment
- [x] Public page and JavaScript asset returned HTTP 200
- [x] Fallback coach path
- [x] English judging flow

Still required before final Devpost submission:

- [ ] Public YouTube demo video under three minutes with voiceover
- [ ] Confirm the video explicitly explains what was built and how Codex with GPT-5.6 was used
- [ ] Confirm Markdown report download in the public demo
- [ ] Confirm the mobile viewport path
- [ ] Press final **Submit** rather than leaving the entry as a draft

## Integrity Note

The strongest submission is one where judges can distinguish prior work, Build Week work, AI assistance, human decisions, build-time model use, runtime behavior, and independently verified results.