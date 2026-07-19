# Build Week Evidence

This file separates prior work from the educational product created during
OpenAI Build Week.

Only add evidence that can be verified. Do not invent dates, sessions, model use,
or development history.

## Verified Submission Requirements

Based on the official OpenAI Build Week Devpost rules checked on 2026-07-19, the submission needs:

- a working project in the Education track;
- meaningful Codex and GPT-5.6 use;
- a public YouTube demo video under three minutes with voiceover;
- a repository URL judges can access;
- README documentation of Codex collaboration, human decisions, and GPT-5.6 usage;
- a `/feedback` Codex Session ID from the primary build thread;
- evidence distinguishing prior work from Build Week work.

## Prior Work

The repository began as a game-building experiment. That experiment helped
surface a broader learning problem: AI can accelerate implementation, but
learners still need help with scope, product judgment, verification, business
tradeoffs, and reflection.

The former TempleFall prototype remains available in Git history at:

```text
13a96227666b438cd59377517d79b6bdae1e620e
```

The game is not part of the current product claim.

## Current Product Direction

VibeCoding Business Studio is now an AI-guided project learning workspace.

The Build Week product should be evidenced through dated commits and Codex
sessions covering:

- the project brief workflow;
- scope coaching;
- milestone generation;
- the guided Codex session brief;
- learner reflection;
- report export;
- English-only judging experience;
- server-side OpenAI integration;
- build validation and deployment.

## Evidence Table

| Date | Change | Commit / files | Codex session or other evidence |
| --- | --- | --- | --- |
| 2026-07-19 | Reframed the product around learner ownership and project-based education | Pull request: https://github.com/moyamiga/vibecoding-business-studio/pull/1 | Add `/feedback` Codex session ID before Devpost submission |
| 2026-07-19 | Implemented the English-only educational Studio MVP | Commit: https://github.com/moyamiga/vibecoding-business-studio/commit/ba005d7f41bb95cefff392ea0845852cb89a2bb3 | Built in this Codex task; add official session ID before submission |
| 2026-07-19 | Added server-side OpenAI coach and local fallback | Files: `api/coach.mjs`, `src/coach.ts` | Model evidence still requires a configured GPT-5.6 request |
| 2026-07-19 | Added documentation, testing path, CI, and submission materials | Files: `README.md`, `JUDGES_TESTING.md`, `DEVPOST_SUBMISSION.md`, `.github/workflows/ci.yml` | CI run: https://github.com/moyamiga/vibecoding-business-studio/actions/runs/29697764605 |

## OpenAI Evidence

Before submission, record:

- **Codex session ID:** `TODO`
- **Primary session:** `TODO`
- **Exact GPT-5.6 model identifier:** `TODO`
- **Where the model was used:** `TODO`
- **How the response was verified:** `TODO`

Do not claim GPT-5.6 API use solely because the code supports it. Record evidence
from an actual configured and tested request.

## Human Product Decisions

The following product decisions should remain attributable to the human project
owner:

- The game prototype was removed from the product experience.
- The learner, not the generated artifact, became the center of the product.
- The first MVP focuses on idea, scope, milestones, Codex preparation,
  reflection, and evidence.
- Authentication, payments, classroom administration, native apps, and complex
  integrations were postponed.
- The API key remains server-side.
- The application remains testable through a transparent local fallback.

## Local Validation Log

2026-07-19, local temporary copy:

- `npm ci --no-audit --no-fund` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- Vite preview responded with HTTP 200 at `http://127.0.0.1:4173`.

This validates the exported project state. GitHub CI also passed on the pushed branch:

- https://github.com/moyamiga/vibecoding-business-studio/actions/runs/29697764605

## Verification Evidence

Attach or link:

- [x] successful `npm run typecheck`;
- [x] successful `npm run build`;
- [x] GitHub Actions run;
- [ ] public deployment;
- [ ] OpenAI coach request using the declared model;
- [x] fallback-coach test;
- [x] English flow test;
- [ ] Markdown report export;
- [ ] mobile viewport test;
- [ ] sub-three-minute video.

## Integrity Note

This document is intentionally conservative. The strongest submission is one
where a judge can distinguish prior work, Build Week work, AI assistance, human
decisions, and independently verified results.
