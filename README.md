# VibeCoding Business Studio

> **AI helps learners build. The Studio teaches them to write, plan, collaborate, and own decisions.**

VibeCoding Business Studio is an AI-guided project learning workspace. It helps learners turn an idea they care about into a small, testable project while developing vibe coding, clearer writing, product judgment, business thinking, teamwork, verification skills, and responsible AI use.

[Live Demo](https://vibecoding-business-studio.moyamiga.chatgpt.site) |
[Devpost Draft](./DEVPOST_SUBMISSION.md) |
[Judges Testing Guide](./JUDGES_TESTING.md) |
[Build Week Evidence](./BUILD_WEEK_EVIDENCE.md)

## Origin

The project began when my children saw me building software with AI and asked whether they could use it to create a game of their own.

I first created a private development environment where they could experiment with Codex. As we worked, it became clear that the most important learning was not only writing code. They also needed to explain ideas clearly, decide what to build first, divide responsibilities, verify results, connect technical choices to business consequences, and understand which decisions still belonged to them.

The original game experiment gradually became an educational workspace. The game was only the starting context; the learning process became the product.

## The Problem

AI can make implementation much faster, but speed alone does not teach a learner:

- who the product is for;
- which problem matters;
- how to write a clear request;
- how to reduce a large idea;
- what should be built first;
- how teammates should divide responsibility;
- how to verify AI-generated work;
- how technical decisions affect cost, privacy, customers, or maintenance;
- what was learned and what remains unclear.

VibeCoding Business Studio places those decisions back in the learner's hands.

## What the Prototype Demonstrates

The MVP includes a complete browser-based learning loop:

1. **Idea** — define the project, user, problem, motivation, timebox, and current experience.
2. **Reality check** — challenge the ambition and identify the smallest useful milestone.
3. **Milestones** — create buildable stages with definitions of done, activities, learning concepts, and product questions.
4. **Guided Codex session** — improve the learner's request, record the learner-owned decision, connect one business tradeoff, define team roles, and generate a structured Codex prompt.
5. **Reflection** — explain what changed, what was decided, how it was verified, what was learned, and what remains unclear.
6. **Learning evidence** — export a Markdown report for a learner, teacher, mentor, parent, or portfolio.

The application stores project data in the browser and remains usable when the optional OpenAI endpoint is unavailable.

## How Codex and GPT-5.6 Were Used

The majority of the current product was developed with **Codex using GPT-5.6**.

**Primary `/feedback` Codex Session ID:**

```text
019f2a76-e8c6-77c0-adc4-67efd2e87a
```

Codex with GPT-5.6 was used as a development partner to:

- transform the original game-centered experiment into an educational product;
- define the six-stage learning workflow;
- design the TypeScript domain model;
- implement the browser application;
- build scope coaching and milestone generation;
- add prompt-writing review, business reasoning, team roles, reflection, and report export;
- create the optional server-side OpenAI coach endpoint;
- remove the former game and Unity prototype from the product surface;
- debug and revise the implementation;
- prepare the README, evidence log, judging guide, and Devpost material;
- validate the project through type-checking, production builds, CI, deployment, and HTTP checks.

The human product owner made the central product decisions. Codex and GPT-5.6 accelerated reasoning, implementation, revision, and verification, but did not independently decide the final product direction.

### Build-time model use vs. runtime AI

The public OpenAI Sites demo currently uses a transparent local coaching fallback so judges can test the complete workflow without credentials.

The repository also includes a server-side OpenAI Responses API endpoint at `api/coach.mjs`. Runtime API use is separate from the verified build-time use of GPT-5.6 through Codex. The project does not claim that every public demo interaction calls GPT-5.6.

## Sample Learning Context

The included sample is **Sneaker Studio Tycoon**, a small sneaker-company game concept.

The game is not the product. It is a context where learners can practice:

- writing a clearer build request;
- assigning design, testing, business, and roadmap responsibilities;
- choosing one small playable milestone;
- postponing excessive features;
- connecting gameplay choices to marketing, customer value, hiring, taxes, accounting, operations, and leadership;
- explaining how the result was verified.

## Judge Path

A reviewer can understand the prototype in under three minutes:

1. Open the [live demo](https://vibecoding-business-studio.moyamiga.chatgpt.site).
2. Select **Load sample**.
3. Review the scope challenge, included work, and postponed features.
4. Open **Milestones** and inspect the definition of done.
5. Open **Build session** and review writing feedback, the learner decision, business lens, team roles, and generated Codex prompt.
6. Inspect or complete the reflection.
7. Export the learning report.

See [`JUDGES_TESTING.md`](./JUDGES_TESTING.md) for the detailed path.

## Product Principles

### The learner owns decisions

AI may accelerate implementation, explanation, debugging, and documentation. It should not silently decide scope, priorities, money, privacy, publication, or other high-risk choices.

### Small evidence beats large ambition

A working, testable milestone is more valuable than a long feature list with no proof.

### Verification is part of learning

The learner should be able to answer:

- What changed?
- Why was this approach selected?
- How was it tested?
- What evidence exists?
- What remains uncertain?

### Collaboration needs roles

A designer may own visual direction without silently changing the roadmap. A tester may record bugs without redefining product priorities. A business lead may propose marketing, pricing, hiring, or partnership ideas while major scope decisions remain visible to the project owner and team.

### AI output is not automatically correct

The Studio asks learners to identify what they inspected themselves instead of accepting a result merely because AI produced it.

## Technology

- TypeScript
- Vite
- browser `localStorage`
- optional server-side OpenAI Responses API endpoint
- OpenAI Sites deployment
- GitHub Actions for type-checking and build validation
- Vercel-compatible serverless function

The frontend has no runtime UI framework dependency.

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

## Optional Runtime OpenAI Coach

The browser never receives the API key. The frontend sends the project brief to `/api/coach`, and the server-side function calls the OpenAI Responses API.

Configure a local or deployed environment with:

```bash
OPENAI_API_KEY=...
OPENAI_MODEL=...
```

Never place the OpenAI API key in a `VITE_` variable, because Vite client variables are included in browser code.

When the endpoint is unavailable, the application uses transparent local coaching rules and labels the source in the interface.

## Deployment

### OpenAI Sites

Primary public demo:

https://vibecoding-business-studio.moyamiga.chatgpt.site

### Vercel

The repository includes `api/coach.mjs` and `vercel.json`.

1. Import the repository into Vercel.
2. Add `OPENAI_API_KEY`.
3. Add `OPENAI_MODEL`.
4. Deploy.
5. Verify `/api/coach` through the application.

### Static hosting

The frontend can also be deployed to GitHub Pages, Netlify, Cloudflare Pages, or another static host. In that mode, the local fallback remains functional.

## Privacy and Safety

- Do not enter API keys, credentials, or private chats into a project brief.
- Do not publish identifying information about minors.
- Require mentor or adult approval for money, publication, legal, privacy, external accounts, and irreversible changes.
- Treat generated plans and code as suggestions that require inspection.
- The browser prototype stores project data locally; it is not a classroom records system.

## What the MVP Intentionally Does Not Include

- authentication;
- classroom rosters;
- payments;
- grading automation;
- native mobile applications;
- automated role permissions;
- real-time collaboration;
- parent or teacher dashboards;
- repository write access;
- a full learning management system.

These features are postponed until the central learning loop is validated.

## Prior Work Disclosure

The repository began as a game-building experiment. That work helped reveal the educational method, but it is not the current product.

The original TempleFall prototype remains available in Git history at:

```text
13a96227666b438cd59377517d79b6bdae1e620e
```

See [`BUILD_WEEK_EVIDENCE.md`](./BUILD_WEEK_EVIDENCE.md) for the detailed separation between prior work, Build Week work, human decisions, Codex assistance, and verified results.

## Submission Track

Recommended OpenAI Build Week category: **Education**.

The strongest claim is not that AI can build software quickly. It is that a structured workflow can help learners retain ownership of judgment while AI accelerates execution.

## License

MIT. See [`LICENSE`](./LICENSE) and [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md).