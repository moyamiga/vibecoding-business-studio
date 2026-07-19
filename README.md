# VibeCoding Business Studio

> **AI helps learners build. The Studio teaches them to write, plan, collaborate, and own decisions.**

VibeCoding Business Studio is an AI-guided project learning workspace. It helps
learners turn an idea they care about into a small, testable project while
developing vibe coding, clearer writing, product judgment, business thinking,
teamwork, role ownership, verification skills, and responsible AI use.

[Live Demo](https://vibecoding-business-studio.moyamiga.chatgpt.site) |
[Submission Draft](./DEVPOST_SUBMISSION.md) |
[Judges Testing Guide](./JUDGES_TESTING.md)

This repository no longer treats any single game or artifact as the product.
The product is the learning workflow around **ideas, writing, scope, milestones,
business decisions, team roles, verification, reflection, and evidence**.

## Why It Exists

AI makes implementation much faster, but speed alone does not teach someone:

- who a product is for;
- which problem matters;
- how to reduce a large idea;
- how to write a clear request before asking AI or teammates to act;
- what evidence would prove progress;
- how to verify AI-generated work;
- when a decision has business, privacy, or safety consequences;
- how to assign roles so friends can collaborate without taking over the
  roadmap;
- how to explain what was learned.

VibeCoding Business Studio places those decisions back in the learner's hands.

## What the Prototype Demonstrates

The current MVP includes a complete browser-based learning loop:

1. **Project brief** — the learner defines an idea, user, problem, motivation,
   timebox, and experience level.
2. **Reality check** — an OpenAI-powered or local fallback coach challenges the
   scope and proposes the smallest useful milestone.
3. **Milestone plan** — the Studio generates buildable stages with definitions
   of done, learning concepts, and product questions.
4. **Guided Codex session** - the learner reviews prompt clarity, records the
   decision they own, connects one business or real-world tradeoff, assigns team
   roles, defines evidence, and exports a structured prompt for Codex.
5. **Reflection** - the learner explains what changed, what they decided, how
   they verified it, what writing, teamwork, product, or business lesson
   appeared, and what remains unclear.
6. **Learning evidence** — the Studio exports a Markdown report for a learner,
   mentor, parent, teacher, or portfolio.

The application is English-only for judging, stores projects locally in the
browser, and remains usable when the optional OpenAI endpoint is unavailable.

## Judge Path

A reviewer can understand the prototype in under three minutes:

1. Open the application.
2. Select **Load sample**.
3. Review the scope challenge and postponed features for the sample sneaker
   company game.
4. Open **Milestones** and inspect the definition of done.
5. Open **Build session**, review writing feedback, inspect team roles, and copy
   the generated Codex prompt.
6. Complete or inspect the reflection.
7. Export the learning report.

See [`JUDGES_TESTING.md`](./JUDGES_TESTING.md) for the detailed path.

## Build Week Submission Essentials

OpenAI Build Week submissions close on **July 21, 2026 at 5:00 PM Pacific Time**. Before submitting, verify these items against the official Devpost rules:

- working public demo URL: <https://vibecoding-business-studio.moyamiga.chatgpt.site>;
- public YouTube demo video under three minutes with voiceover;
- repository URL for judging and testing;
- README explanation of how Codex and GPT-5.6 were used;
- `/feedback` Codex Session ID from the primary build thread;
- exact GPT-5.6 model evidence;
- clear distinction between prior work and Build Week work.

## Product Principles

### The learner owns decisions

Codex may accelerate implementation, debugging, and explanation. It should not
silently decide scope, product priorities, cost, privacy, publication, or other
high-risk choices.

### Small evidence beats large ambition

A working, testable milestone is more valuable than a long feature list with no
proof.

### Verification is part of learning

The learner should be able to answer:

- What changed?
- Why was this approach selected?
- How was it tested?
- What evidence exists?
- What remains uncertain?

### AI output is not automatically correct

The Studio asks the learner to identify what they inspected themselves instead
of accepting a result because an AI produced it.

### Collaboration needs roles

Learners can invite friends, but each teammate should have a written area of
ownership. A designer can own visuals without changing the roadmap. A tester can
log bugs without redefining scope. A business lead can propose marketing, taxes,
accounting, hiring, or partnership ideas without silently taking over the
project.

### Games can teach real-world thinking

A learner may build a game, but the lesson can go beyond the game. A sneaker
company game can introduce marketing, customer value, hiring, taxes, accounting,
international relationships, leadership, and planning while the team implements
small playable decisions.

## Technology

- TypeScript
- Vite
- browser `localStorage`
- optional server-side OpenAI Responses API endpoint
- OpenAI Sites deployment
- GitHub Actions for type-checking and build validation
- Vercel-compatible serverless function

The frontend has no runtime framework dependency. This keeps the MVP small and
makes the educational flow easier to inspect.

## Run Locally

Requirements:

- Node.js 20 or newer
- npm

Install and run:

```bash
npm ci
npm run dev
```

Open the Vite URL printed in the terminal.

Validate the project:

```bash
npm run typecheck
npm run build
npm run preview
```

## Optional OpenAI Coach

The browser never receives the API key. The frontend sends the project brief to
`/api/coach`, and the server-side function calls the OpenAI Responses API.

Create a local or deployment environment using:

```bash
OPENAI_API_KEY=...
OPENAI_MODEL=...
```

Use the exact GPT-5.6 API model identifier enabled for your OpenAI project. The `.env.example` file intentionally uses a placeholder; record the deployed model and one verified request in `BUILD_WEEK_EVIDENCE.md`.

When the endpoint is missing, not configured, or unavailable, the application
uses transparent local coaching rules. The UI clearly labels whether a plan came
from OpenAI, the local fallback, or the sample project.

### Security rule

Never use a `VITE_` variable for the OpenAI API key. Vite client variables are
included in browser code.

## Deployment

### OpenAI Sites

The primary public demo is deployed with OpenAI Sites:

<https://vibecoding-business-studio.moyamiga.chatgpt.site>

This deployment runs the full browser workflow and uses the transparent local
coach fallback when the optional OpenAI endpoint is not configured.

### Vercel

The repository includes `api/coach.mjs` and `vercel.json`.

1. Import the repository into Vercel.
2. Add `OPENAI_API_KEY`.
3. Add `OPENAI_MODEL`.
4. Deploy.
5. Confirm `/api/coach` responds through the application.

### Static hosting

The frontend can also be deployed to GitHub Pages, Netlify, Cloudflare Pages, or
another static host. In that mode, the local fallback coach remains functional.
To use OpenAI, point the frontend to a secure server-side endpoint rather than
placing credentials in the browser.

## Repository Structure

```text
.
|-- api/
|   `-- coach.mjs
|-- src/
|   |-- coach.ts
|   |-- i18n.ts
|   |-- main.ts
|   |-- report.ts
|   |-- sample.ts
|   |-- storage.ts
|   |-- styles.css
|   `-- types.ts
|-- vite/
|   |-- config.dev.mjs
|   `-- config.prod.mjs
|-- .github/workflows/ci.yml
|-- BUILD_WEEK_EVIDENCE.md
|-- DEVPOST_SUBMISSION.md
|-- JUDGES_TESTING.md
|-- LEARNING_METHOD.md
|-- package-lock.json
`-- README.md
```

## Privacy and Safety

- Do not enter API keys, credentials, or private chats into a project brief.
- Do not publish identifying information about minors.
- Use mentor or adult approval for money, publication, legal, privacy, external
  accounts, and irreversible changes.
- Treat generated plans and code as suggestions that require inspection.
- The browser prototype stores its project in local storage; it is not a
  classroom records system.
- The current prototype is educational software, not legal, medical, or
  financial advice.

## What This MVP Intentionally Does Not Include

- authentication;
- classroom rosters;
- payments;
- grading automation;
- native mobile applications;
- complex automated team permissions;
- repository write access;
- a full learning management system.

Those features are postponed until the learning loop itself is validated.

## Historical Note

The repository began as a small game-building experiment. That experiment helped
surface the educational method, but it is not the product.

The original TempleFall prototype remains available in Git history at commit:

```text
13a96227666b438cd59377517d79b6bdae1e620e
```

See [`BUILD_WEEK_EVIDENCE.md`](./BUILD_WEEK_EVIDENCE.md) for the distinction
between prior work and the current educational product.

## Submission Track

Recommended OpenAI Build Week track: **Education**.

The strongest claim is not that AI can build software quickly. It is that a
structured workflow can help learners keep ownership of judgment while AI
accelerates execution.

## License

MIT. See [`LICENSE`](./LICENSE) and
[`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md).
