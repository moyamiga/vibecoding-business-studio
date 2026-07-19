# Devpost Submission Draft

## Project Title

VibeCoding Business Studio

## Tagline

AI helps learners build. The Studio teaches them to write, plan, collaborate, and own decisions.

## Public Demo

https://vibecoding-business-studio.moyamiga.chatgpt.site

## Track

Education

## Elevator Pitch

VibeCoding Business Studio is an AI-guided project learning workspace where
learners turn their own ideas into small, testable projects while developing
vibe coding, clearer writing, product judgment, business thinking, teamwork,
role ownership, verification skills, and responsible AI use.

The product does not begin with syntax lessons or a fixed tutorial project. It
begins with something the learner cares about, challenges the scope, creates
milestones, reviews the learner's writing, assigns collaboration roles, prepares
a guided Codex session, and turns the work into evidence of learning.

## Inspiration

AI makes it possible for learners and nontraditional builders to create software
faster than ever. But a working application does not prove that someone
understands:

- who the user is;
- why the product matters;
- what should be built first;
- how to verify the result;
- how to express the request clearly enough for AI and teammates;
- what decision belongs to the learner;
- which teammate owns design, testing, business ideas, or roadmap decisions;
- how a technical choice affects cost, privacy, adoption, or maintenance.

We wanted an experience that uses AI speed without giving away learner
ownership.

## What It Does

VibeCoding Business Studio guides a learner or small team through six stages:

1. **Idea** — define the project, user, problem, motivation, time, and current
   experience.
2. **Scope** — challenge the ambition and identify the smallest useful
   milestone.
3. **Milestones** — create stages with definitions of done, tasks, learning
   concepts, and product questions.
4. **Build session** — record the learner's decision, scope guardrails, and
   verification evidence, then generate a structured Codex prompt.
5. **Reflection** — explain what changed, what was decided, how it was verified,
   and what remains unclear.
6. **Evidence** — export a learning report for a mentor, teacher, parent,
   portfolio, or the learner.

The application is English-only for judging, stores project data locally, and
has a transparent local fallback when the OpenAI endpoint is unavailable.

The sample project is a sneaker-company game. The game is not the product; it is
the learning context. Learners can practice coding a playable decision while
also discussing marketing, customer value, hiring, taxes, accounting,
international relationships, leadership, and team permissions. The Studio asks
them to improve the prompt before Codex builds from it, then records who owns
design, testing, business ideas, and roadmap decisions.

## How We Built It

The frontend uses TypeScript and Vite with no runtime UI framework. The project
state is stored in browser local storage.

The optional AI coach is implemented as a server-side endpoint that calls the
OpenAI Responses API. The API key never enters browser code. The deployed
`OPENAI_MODEL` value should be set to the exact GPT-5.6 model identifier enabled
for the OpenAI project.

Codex was used as a development partner to:

- turn the learning idea into a structured product workflow;
- challenge the original game-centered direction;
- design the domain model;
- build and type-check the application;
- create the English judging interface;
- write the server-side coach;
- create the guided Codex session prompt;
- add writing clarity review, business lens, and team-role capture;
- document the method and judging flow.

Before submission, add the exact Codex session ID and model evidence to
`BUILD_WEEK_EVIDENCE.md`.

## What Makes It Different

Many AI education products teach through answers, quizzes, or generated code.
VibeCoding Business Studio focuses on **project ownership across disciplines**.

The learner must make scope visible, state a decision, define evidence, and
reflect. In team projects, friends can participate without everyone having the
same authority: one learner may own design, another testing, another business
ideas, while the project owner protects the roadmap. The AI is allowed to
accelerate work, but it is not allowed to silently own the project.

The core question is not:

> Can AI build this?

It is:

> Can the learner explain what was built, why it was scoped this way, how it was
> verified, who owned which role, what business idea was practiced, and what
> should happen next?

## Challenges

- The repository began as a game-building experiment, so the product had to be
  separated from the example artifact.
- The workflow had to remain useful when no API key or network endpoint is
  available.
- The OpenAI integration had to remain server-side.
- The product needed to challenge unrealistic scope without discouraging the
  learner.
- The Studio needed to support games as learning contexts without becoming a
  game-only product.
- Collaboration needed to be lightweight enough for kids and friends, but clear
  enough to protect roadmap ownership.
- Reflection had to produce concrete evidence rather than generic journaling.

## Accomplishments

- Reframed the product around a repeatable educational method.
- Built a complete idea-to-evidence workflow.
- Added an English-only judging flow.
- Added a server-side OpenAI coach with a visible local fallback.
- Created structured milestone and Codex session generation.
- Added prompt-writing review, business-learning prompts, and team-role
  guardrails.
- Added local persistence and Markdown report export.
- Added CI for type-checking and production builds.
- Clearly separated prior work from the Build Week product direction.

## What We Learned

AI-assisted building becomes more educational when the system makes judgment
visible.

A learner does not need to memorize every line generated by AI, but they should
be able to explain:

- the user and problem;
- the clarity of the prompt they wrote;
- the current scope;
- the decision they own;
- the role each teammate owns;
- the business or real-world tradeoff they practiced;
- the evidence that the result works;
- the limits and uncertainty;
- the next small milestone.

We also learned that postponing features is a skill. It is how learners protect a
testable project from an exciting but unfinished vision.

## What's Next

- Validate the workflow with learners and mentors.
- Add editable scope and milestone feedback.
- Add mentor comments without turning the product into a full LMS.
- Add parent or teacher summaries covering progress, risks, role ownership, and
  next steps.
- Add mobile-first collaboration through tools such as Telegram so learners can
  participate from their phones.
- Add role-based access so teammates can contribute according to their job
  description without silently changing the roadmap.
- Add a real-time project activity page where the team and mentor can see
  changes, decisions, and evidence.
- Connect completed Codex sessions to evidence automatically.
- Add optional rubric scoring.
- Support project templates for different age groups and learning contexts.
- Evaluate privacy-preserving classroom storage only after the local workflow is
  validated.

## Suggested Demo Video

### 0:00–0:20 — Problem

AI can generate code quickly, but learners can finish without understanding
scope, decisions, verification, or business consequences.

### 0:20–0:45 — Idea

Create or load the Sneaker Studio Tycoon project.

### 0:45–1:15 — Reality Check

Show the first milestone, included work, and postponed work.

### 1:15–1:40 — Milestones

Show the definition of done, learning concept, and product question.

### 1:40–2:10 — Guided Codex Session

Show the learner-owned decision and copy the structured Codex prompt.

### 2:10–2:40 — Reflection

Explain what was built and how it was verified.

### 2:40–3:00 — Evidence

Export the learning report.

## Submission Checklist

- [x] Public application URL: https://vibecoding-business-studio.moyamiga.chatgpt.site
- [ ] Public YouTube video URL under three minutes with voiceover
- [ ] `/feedback` Codex session ID from the primary build thread
- [ ] Exact GPT-5.6 model identifier used
- [ ] Build Week commit links
- [ ] Clear prior-work disclosure
- [ ] No private data, credentials, or identifying information about minors
- [ ] `npm ci` and `npm run build` passing in CI
