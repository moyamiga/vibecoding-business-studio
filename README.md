# VibeCoding Business Studio

An AI-assisted learning model where students build real software projects while
learning product thinking, business decisions, teamwork, and execution.

This repository includes a playable prototype, a game design process, a team
coordination model, and submission materials for OpenAI Build Week. The current
demo project is **TempleFall**, a mobile-first battle royale prototype used as
the learning vehicle.

## One-Sentence Pitch

VibeCoding Business Studio turns a private project or classroom into a small
AI-powered product studio where learners use Codex to build, test, make business
decisions, assign roles, and ship a working prototype.

## Why This Is Education

Most coding lessons teach syntax first. This project teaches learners to behave
like builders:

- define a product idea;
- scope it down to a playable version;
- use AI coding tools without losing ownership of decisions;
- learn business basics through the project itself;
- invite teammates and assign roles;
- document decisions, progress, and what was learned;
- test and iterate instead of just talking about ideas.

The game is not the final educational product. The repeatable method is.

## The Learning Model

The model has four layers:

1. **Vibe coding**: learners describe what they want, inspect the result, and
   iterate with Codex.
2. **Business coaching**: every technical decision is tied to business reality:
   customers, cost, pricing, marketing, retention, competition, legal risk, and
   team incentives.
3. **Team roles**: students can join as designers, gameplay planners, testers,
   marketers, programmers, writers, or producers.
4. **Evidence of learning**: progress, decisions, coordination, and concepts are
   tracked as the project evolves.

This can be used for:

- private learning projects;
- school clubs;
- entrepreneurship classes;
- after-school coding programs;
- project-based AI literacy workshops.

## Demo: TempleFall

TempleFall is a mobile-first game prototype used to demonstrate the model.

The current prototype includes:

- a vertical mobile Phaser game shell;
- a jungle battle royale theme;
- a start menu;
- tap/click movement;
- bots;
- loot;
- health and shield;
- ammo;
- a shrinking safe zone represented by invasive vegetation;
- temple objectives;
- a secret-room reward loop;
- a basic economy using relics;
- a simple vending machine mechanic.

The long-term game vision is larger than this prototype. The educational method
teaches the learner to reduce that vision into a testable vertical slice before
investing in expensive technology.

## How Codex Was Used

Codex was used as the build partner and technical coach:

- turning learner ideas into structured product requirements;
- translating ideas into TypeScript and Phaser code;
- debugging runtime and mobile layout issues;
- converting vague game ideas into smaller buildable steps;
- drafting game design documents;
- creating a team coordination process;
- preparing Devpost-ready documentation;
- keeping build verification part of the workflow.

The learner remains the product owner. Codex accelerates execution, but the
student makes the core creative and product decisions.

## What Was Built During OpenAI Build Week

This project existed before Build Week as a small game-learning repository. The
Build Week extension reframed it into a broader educational model and added
substantial new work:

- the TempleFall battle royale direction;
- a playable mobile-first Phaser prototype;
- bot, loot, safe-zone, temple, and relic mechanics;
- a 3D bot-AI planning prototype for a future engine path;
- a clearer classroom/private-project learning method;
- Devpost submission materials;
- updated documentation for judges and educators.

## Running The Project

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

The project is configured for a mobile-first browser experience. It can be tested
in a desktop browser with mobile device emulation or on a phone if the server is
reachable from the device.

## Testing Notes

The latest verification performed:

```bash
npm run build
```

Result: successful build.

For a shorter judge-focused test path, see `JUDGES_TESTING.md`.

## Tech Stack

- TypeScript
- Phaser
- Vite
- Capacitor Android
- Git and GitHub

## Submission Track

Recommended OpenAI Build Week category: **Education**.

Reason: the strongest part of the project is not only the game prototype. It is
the repeatable AI-assisted project studio method for students, teachers, and
private learning teams.

## Privacy and Safety

For public demos and judging:

- do not include private chats;
- do not expose tokens or credentials;
- avoid showing minors' personal data;
- present the learner as a student founder or project owner;
- keep the submission focused on the repeatable method.

## Roadmap

Short term:

- record a sub-3-minute demo video;
- publish or share the repository for judges;
- add a concise educator-facing walkthrough;
- test the prototype on a phone.

Next:

- add teacher/admin prompts;
- add student role templates;
- turn the coordination process into a reusable dashboard;
- add progress rubrics for coding, product, business, and teamwork;
- evaluate a 3D engine path for the TempleFall vertical slice.
