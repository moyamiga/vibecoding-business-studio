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

Official rules reference:

- https://openai.devpost.com/rules
- Submission deadline: July 21, 2026 at 5:00 PM Pacific Time.
- The demo video must be under three minutes, publicly visible on YouTube, include audio, and explain how Codex and GPT-5.6 were used.
- The README must describe Codex collaboration, human product and engineering decisions, and how GPT-5.6 and Codex contributed.

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
| 2026-07-19 | Added documentation, testing path, CI, and submission materials | Files: `README.md`, `JUDGES_TESTING.md`, `DEVPOST_SUBMISSION.md`, `.github/workflows/ci.yml` | CI run: https://github.com/moyamiga/vibecoding-business-studio/actions/runs/29699072262 |
| 2026-07-19 | Deployed the public demo with OpenAI Sites | Public URL: https://vibecoding-business-studio.moyamiga.chatgpt.site | Verified with HTTP 200 for the page and JavaScript asset on 2026-07-19 |
| 2026-07-19 | Expanded the learning model beyond coding to include prompt-writing feedback, business reasoning, team roles, and roadmap permissions | Files: `src/main.ts`, `src/report.ts`, `src/sample.ts`, `README.md`, `DEVPOST_SUBMISSION.md`, `LEARNING_METHOD.md`, `JUDGES_TESTING.md` | Added after human product-owner clarification that learners should practice writing, business planning, and collaboration while building |

## OpenAI Evidence

Before submission, record:

- **Codex session ID:** `TODO - obtain by running /feedback in the primary Codex project thread`
- **Primary session:** `TODO - paste the returned Codex session reference`
- **Exact GPT-5.6 model identifier:** `TODO - paste the exact model identifier used by the submitted session or configured API request`
- **Where the model was used:** Codex was used to refocus the project, implement the Studio workflow, remove the game-centered product surface, add the OpenAI coach endpoint, validate builds, deploy the public demo, and prepare judging materials. Runtime OpenAI API use is not yet verified in this repository because no `OPENAI_API_KEY` or `OPENAI_MODEL` value is configured in the checked local environment.
- **How the response was verified:** Codex-generated implementation changes were verified with TypeScript checks, production builds, GitHub Actions, public Sites deployment, and HTTP checks. A GPT-5.6 API coach response still requires one configured request before it can be claimed as verified.

Do not claim GPT-5.6 API use solely because the code supports it. Record evidence
from an actual configured and tested request.

### Current GPT-5.6 Evidence Status

Verified:

- The project includes a server-side OpenAI Responses API endpoint at `api/coach.mjs`.
- The browser never receives an API key.
- The public OpenAI Sites deployment remains usable through the local fallback coach.
- Build and deployment evidence is available through GitHub commits, CI, and the public demo URL.

Not yet verified:

- A live GPT-5.6 API coach request.
- The exact GPT-5.6 model identifier used in the submitted Codex session.
- The `/feedback` Codex Session ID required by Devpost.

Submission-safe wording until the missing evidence is added:

> The project was built with Codex during OpenAI Build Week. The application includes a server-side OpenAI coach endpoint designed for GPT-5.6, with a transparent local fallback for judge testing. The exact `/feedback` Codex Session ID and model evidence should be attached in Devpost before final submission.

## Human Product Decisions

The following product decisions should remain attributable to the human project
owner:

- The game prototype was removed from the product experience.
- The learner, not the generated artifact, became the center of the product.
- The first MVP focuses on idea, scope, milestones, Codex preparation,
  reflection, and evidence.
- The Studio now treats prompt writing, team roles, and business decisions as
  first-class learning moments, not side notes.
- The sample project is a sneaker-company game because games can carry real
  lessons about marketing, hiring, taxes, accounting, leadership, and teamwork.
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
- Public OpenAI Sites demo responded with HTTP 200 at `https://vibecoding-business-studio.moyamiga.chatgpt.site`.
- Public JavaScript asset responded with HTTP 200.

This validates the exported project state. GitHub CI also passed on the pushed branch:

- https://github.com/moyamiga/vibecoding-business-studio/actions/runs/29699072262

## Verification Evidence

Attach or link:

- [x] successful `npm run typecheck`;
- [x] successful `npm run build`;
- [x] GitHub Actions run;
- [x] public deployment;
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
