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

Fill this table with actual commit links and session evidence.

| Date | Change | Commit / files | Codex session or other evidence |
| --- | --- | --- | --- |
| 2026-07-19 | Reframed the product around learner ownership and project-based education | Add commit link | Add Codex session ID |
| 2026-07-19 | Implemented the educational Studio MVP | Add commit link | Add Codex session ID |
| 2026-07-19 | Added server-side OpenAI coach and local fallback | Add commit link | Add model and session evidence |
| 2026-07-19 | Added documentation, testing path, and submission materials | Add commit link | Add session evidence |

Change the dates above if the actual commits occur on a different date.

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

- 
pm ci --no-audit --no-fund passed.
- 
pm run typecheck passed.
- 
pm run build passed.
- Vite preview responded with HTTP 200 at http://127.0.0.1:4173.

This validates the exported project state, but the final submission should still include CI and deployment links after the project is pushed to GitHub.

## Verification Evidence

Attach or link:

- [ ] successful `npm run typecheck`;
- [ ] successful `npm run build`;
- [ ] GitHub Actions run;
- [ ] public deployment;
- [ ] OpenAI coach request using the declared model;
- [ ] fallback-coach test;
- [ ] English flow test;
- [ ] Markdown report export;
- [ ] mobile viewport test;
- [ ] sub-three-minute video.

## Integrity Note

This document is intentionally conservative. The strongest submission is one
where a judge can distinguish prior work, Build Week work, AI assistance, human
decisions, and independently verified results.
