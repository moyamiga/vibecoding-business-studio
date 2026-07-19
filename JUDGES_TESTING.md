# Judges Testing Guide

## Project

VibeCoding Business Studio

## Track

Education

## Core Claim

AI can accelerate implementation, but learners still need to own scope,
verification, product choices, and reflection.

This prototype makes that ownership visible.

## Fastest Test Path

### 1. Start the application

Open the public demo:

https://vibecoding-business-studio.moyamiga.chatgpt.site

For local review, use:

```bash
npm ci
npm run dev
```

Open the Vite URL shown in the terminal.

### 2. Load the sample

Select **Load sample** in the top navigation.

The sample is a student expense-awareness project. It is deliberately small and
does not require a game, a large codebase, or external accounts.

### 3. Inspect the reality check

Review:

- the one-sentence product;
- the coach challenge;
- the first milestone;
- included work;
- postponed work;
- evidence of success;
- the business and AI-literacy questions.

The important behavior is that the Studio challenges scope instead of praising
every feature.

### 4. Inspect milestones

Open **Milestones**.

Each milestone includes:

- an objective;
- a definition of done;
- tasks;
- a learning concept;
- a product question;
- a status.

Choose a milestone for the build session.

### 5. Inspect the guided Codex session

Open **Build session**.

Review or edit:

- the decision owned by the learner;
- implementation notes;
- expected verification evidence;
- the generated Codex prompt.

The prompt tells Codex to:

- propose the smallest verifiable change;
- preserve scope guardrails;
- stop when a product, cost, privacy, or risk decision belongs to the learner;
- run checks;
- report files, evidence, assumptions, and one understanding question.

### 6. Complete the reflection

Open **Reflection** and answer at least:

- What did you build?
- What decision did you make?
- How do you know it works?

### 7. Export evidence

Open **Evidence**.

Download the Markdown report or copy it to the clipboard.

The report should make it possible to distinguish:

- what the learner decided;
- what AI accelerated;
- what was verified;
- what remains unclear;
- what the next milestone is.

## OpenAI Coach Test

The application works without an API connection by using local coaching rules.

To test the OpenAI path on a serverless deployment, configure:

```bash
OPENAI_API_KEY=...
OPENAI_MODEL=...
```

Then create a new project and select **Challenge my scope**.

The scope page labels the result as one of:

- generated with the OpenAI coach;
- generated with the local fallback coach;
- loaded from the sample project.

## Build Validation

```bash
npm run typecheck
npm run build
```

Expected result: both commands complete successfully.

## Privacy Check

Confirm that:

- the API key is only read by `api/coach.mjs`;
- no `VITE_OPENAI_API_KEY` variable exists;
- the browser can run without a key;
- local storage is used only for prototype project data;
- the interface warns against entering credentials or identifying data about
  minors.

## What Not to Evaluate

This is not intended to be:

- a finished LMS;
- an automated grader;
- a commercial classroom administration system;
- a game;
- a replacement for teachers or mentors.

Evaluate the clarity and usefulness of the learning workflow.
