# Devpost Submission Draft

## Project Title

VibeCoding Business Studio

## Tagline

AI helps learners build. The Studio teaches them to write, plan, collaborate, and own decisions.

## Elevator Pitch

VibeCoding Business Studio is an AI-guided project studio where students turn their own ideas into small, testable projects with Codex while learning coding, clearer writing, planning, teamwork, business thinking, verification, and decision ownership.

## Track

Education

## Public Demo

https://vibecoding-business-studio.moyamiga.chatgpt.site

## Repository

https://github.com/moyamiga/vibecoding-business-studio

## `/feedback` Codex Session ID

```text
019f2a76-e8c6-77c0-adc4-67efd2e87a
```

## Project Story

### Inspiration

VibeCoding Business Studio began with my children.

They had seen me build software with AI and wanted to learn how to use it themselves. One day, they asked me a simple question:

> Can we use AI to create our own game?

At first, I thought the project would only be about giving them a safe place to experiment with Codex. I created a private development server and helped them begin turning their ideas into something they could actually build.

But as we worked together, I noticed something important.

The difficult part was not only writing code. They also needed to learn how to explain an idea clearly, decide what to build first, divide responsibilities, verify that something worked, and avoid adding endless features before finishing the first version.

They wanted to build with friends, so new questions appeared:

- Who owns the project roadmap?
- What should the designer be responsible for?
- What should the tester verify?
- Who can propose new features?
- How should business ideas be discussed?
- Which decisions need help from a parent, teacher, or mentor?

Little by little, the original game experiment became something much broader: an AI-guided learning environment where students can build projects they care about while practicing coding, writing, planning, teamwork, leadership, and business thinking.

That became VibeCoding Business Studio.

### What It Does

VibeCoding Business Studio guides a learner or small team through a structured project-building process.

First, students describe what they want to create, who it is for, what problem it solves, and how much time they have.

The Studio then challenges the scope. Instead of simply praising every idea, it helps the learner identify the smallest useful version that can be built and tested. It separates what should be included now from what should be postponed.

Next, the project is divided into milestones with:

- a clear objective;
- a definition of done;
- specific activities;
- a learning concept;
- a product or business question;
- evidence that can prove progress.

Students can also define roles such as project owner, designer, tester, developer, or business lead. Each role has responsibilities and decision boundaries, helping friends collaborate without everyone changing the roadmap independently.

Before asking Codex to implement something, students write what they want to build. The Studio helps them improve the clarity, grammar, specificity, context, and verification criteria of their request.

Codex can then act as both a technical build partner and a learning coach. It can help implement, explain, debug, and document the project, while returning important decisions about scope, priorities, risk, privacy, cost, or business strategy to the learner.

At the end of a milestone, the student completes a reflection and generates a learning report showing:

- what was built;
- what the learner decided;
- what Codex helped with;
- which roles participated;
- how the result was verified;
- what was learned;
- what remains unclear;
- what should happen next;
- where adult or mentor guidance is still needed.

### How We Built It

We built VibeCoding Business Studio with TypeScript and Vite as a browser-based application.

The current prototype includes:

- a project brief workflow;
- AI-assisted scope coaching;
- milestone generation;
- prompt-writing feedback;
- team-role documentation;
- business and product questions;
- structured Codex prompts;
- learner reflection;
- local browser persistence;
- downloadable Markdown learning reports.

The majority of the current product was developed with Codex using GPT-5.6 in session:

```text
019f2a76-e8c6-77c0-adc4-67efd2e87a
```

Codex with GPT-5.6 was used to:

- transform the original game-centered experiment into an educational product;
- define the learning workflow;
- design the TypeScript model;
- implement and revise the browser application;
- add scope coaching, milestones, writing feedback, business questions, roles, reflection, and reports;
- create the optional server-side OpenAI coach;
- remove the former game from the product surface;
- debug the implementation;
- prepare documentation and judging material;
- validate builds, CI, deployment, and public availability.

The human product owner made the central decisions about the educational direction, the learning experience, the role of the game example, the MVP scope, and the features that should be postponed.

The public OpenAI Sites demo uses a transparent local coaching fallback, allowing judges to test the complete workflow without credentials. The repository also includes an optional server-side OpenAI Responses API endpoint. Build-time GPT-5.6 use through Codex is distinct from runtime API use in the public demo.

### Challenges We Faced

The biggest challenge was separating the example project from the actual product.

The repository originally focused on building a game. Over time, we realized that the game was only the learning context. The real product was the process around the project: defining the idea, improving the writing, reducing the scope, assigning roles, making decisions, verifying the result, and reflecting on what was learned.

Another challenge was balancing AI assistance with learner ownership.

It would have been easy to create a system where the student enters one sentence and AI makes every decision. However, that could produce software without necessarily producing learning.

We designed the Studio so AI can accelerate execution without silently taking control of the project. Decisions about scope, priorities, business, privacy, publication, money, and risk remain visible and attributable to the learner or mentor.

We also had to keep the prototype realistic. Features such as authentication, real-time collaboration, classroom administration, automatic repository access, payments, and advanced role permissions were intentionally postponed. We focused first on validating the central learning loop.

### What We Learned

We learned that AI literacy is not only about knowing how to write a prompt.

A learner also needs to understand:

- what they are asking the AI to do;
- whether the request is clear;
- which decision belongs to them;
- how to inspect the result;
- how to prove that it works;
- what assumptions the AI made;
- what should not be built yet.

We also learned that project-based learning can teach much more than programming.

A student building a game about running a sneaker company can practice coding, but also writing, product design, marketing, customer value, operating costs, teamwork, leadership, and business decision-making.

The most important lesson was that students do not need to write every line of code themselves to own a project. But they should be able to explain what was built, why it was built that way, how it was verified, what they decided, and what should happen next.

### What's Next

Our next step is to test the workflow with more learners, parents, teachers, and mentors.

Future versions may include:

- mentor comments;
- parent and teacher summaries;
- reusable project templates;
- more structured role descriptions;
- role-based collaboration;
- project activity history;
- automatic connection between Codex sessions and learning evidence;
- age-appropriate learning rubrics;
- privacy-preserving classroom storage.

The long-term vision is to help students build projects with AI without surrendering their curiosity, judgment, creativity, or responsibility.

**AI can help build the project. VibeCoding Business Studio helps the student own it.**

## Demo Video Script

Hi, I'm Moy, and this is VibeCoding Business Studio.

AI can help students build software quickly. But generating code is not the same as learning how to define a problem, choose what to build first, work with a team, or verify that something really works.

VibeCoding Business Studio turns the building process itself into a learning experience.

Imagine a group of students wants to create a project about running a sneaker store. With Codex, they turn the idea into a clear project brief: who the user is, how the business works, and what the smallest useful version should include.

Next, the Studio helps them create milestones and define clear roles, responsibilities, and decision boundaries for the team.

Then they begin building. Students describe what they want, and Codex helps make each request clearer, more specific, and easier to verify before anything is implemented.

Codex can write code, but it also acts as a learning coach. It asks: What should we build first? What can wait? How will we test it? What will it cost to grow? And which decisions still belong to the students?

As the project evolves, the team records changes, decisions, verification, and each member's contribution.

At the end, a teacher, mentor, or parent receives a learning report showing what was built, who did what, what Codex helped with, what the students understood, what was verified, and where adult guidance is still needed.

I used Codex with GPT-5.6 as my development partner. It helped me transform the original game experiment into an educational product, design the learning workflow, implement the TypeScript application, debug the project, and prepare the final documentation.

The public demo includes an optional server-side OpenAI coach and a local fallback so judges can test the complete workflow without an API key.

VibeCoding Business Studio is not just about coding with AI. It helps students practice product thinking, writing, planning, business, leadership, and teamwork by building something they care about.

AI can help write the code. VibeCoding Business Studio teaches students to own the project.

## Final Submission Checklist

- [x] Public application URL: https://vibecoding-business-studio.moyamiga.chatgpt.site
- [x] Public repository URL
- [x] Education category selected
- [x] `/feedback` Codex Session ID recorded
- [x] README explains how Codex and GPT-5.6 were used
- [x] Prior work is distinguished from Build Week work
- [x] Build Week commit links are recorded in `BUILD_WEEK_EVIDENCE.md`
- [x] `npm ci`, type-check, and production build passed in CI
- [x] No API key is exposed in browser code
- [ ] Public YouTube demo video is under three minutes and includes voiceover
- [ ] YouTube link has been added to the Devpost form
- [ ] All team members, if any, have accepted their invitations
- [ ] Final submission is submitted and not left as a draft