import type { Milestone, StudioState } from './types';

function valueOrDash(value: string): string {
  return value.trim() || '-';
}

function list(items: string[]): string {
  return items.length > 0
    ? items.map((item) => `- ${item}`).join('\n')
    : '- -';
}

function statusLabel(status: Milestone['status']): string {
  if (status === 'done') return 'Done';
  if (status === 'in-progress') return 'In progress';
  return 'Not started';
}

export function buildCodexPrompt(state: StudioState): string {
  const milestone =
    state.milestones.find(
      (item) => item.id === state.buildSession.milestoneId
    ) ?? state.milestones[0];

  if (!milestone || !state.plan) {
    return 'Generate a plan and select a milestone first.';
  }

  return `# Guided Codex session - ${state.project.title}

Act as a technical build partner and coach. Accelerate implementation without taking ownership of product decisions away from the learner.

## Product context

- User: ${state.project.audience}
- Problem: ${state.project.problem}
- One-sentence product: ${state.plan.oneSentencePitch}
- Available time: ${state.project.timebox}
- Current level: ${state.project.skillLevel}

## Current milestone

- Title: ${milestone.title}
- Objective: ${milestone.objective}
- Done when: ${milestone.doneWhen}
- Learning concept: ${milestone.learningConcept}
- Product question: ${milestone.productQuestion}

## Learner writing draft

${valueOrDash(state.buildSession.writingDraft)}

## Writing clarity feedback

${valueOrDash(state.buildSession.writingFeedback)}

## Decision owned by the learner

${valueOrDash(state.buildSession.learnerDecision)}

## Business or real-world lens

${valueOrDash(state.buildSession.businessDecision)}

## Team roles and permissions

${valueOrDash(state.buildSession.teamRoles)}

## Implementation notes

${valueOrDash(state.buildSession.implementationNotes)}

## Scope guardrails

Include only:
${list(state.plan.included)}

Do not build yet:
${list(state.plan.postponed)}

## Working method

1. Before changing code, summarize your understanding and identify contradictions.
2. If the learner request is unclear, point out the writing issue and suggest a clearer version before implementing.
3. Respect team roles and do not let one teammate silently change another teammate's area or the project roadmap.
4. Propose the smallest verifiable change; do not expand scope.
5. Explain which files you will modify and why.
6. When a product, cost, privacy, teamwork, business, or risk decision appears, stop and present options to the learner.
7. Run the available checks.
8. At the end, report:
   - files changed;
   - what works;
   - how it was verified;
   - assumptions;
   - debt or risks;
   - writing or collaboration issues noticed;
   - business or real-world tradeoff practiced;
   - one question that checks learner understanding.
9. Never expose credentials, private chats, or identifying information about minors.

## Expected evidence

${valueOrDash(state.buildSession.verificationEvidence)}
`;
}

export function buildLearningReport(state: StudioState): string {
  const plan = state.plan;

  return `# Learning report - ${valueOrDash(state.project.title)}

Generated: ${new Date().toLocaleString('en-US')}

## 1. Project context

- **Idea:** ${valueOrDash(state.project.idea)}
- **User:** ${valueOrDash(state.project.audience)}
- **Problem:** ${valueOrDash(state.project.problem)}
- **Motivation:** ${valueOrDash(state.project.motivation)}
- **Available time:** ${valueOrDash(state.project.timebox)}
- **Starting experience:** ${state.project.skillLevel}

## 2. Scope decision

- **One-sentence product:** ${plan ? plan.oneSentencePitch : '-'}
- **Coach challenge:** ${plan ? plan.challenge : '-'}
- **First milestone:** ${plan ? plan.firstMilestone : '-'}
- **Evidence of success:** ${plan ? plan.successEvidence : '-'}

### Included

${plan ? list(plan.included) : '- -'}

### Postponed

${plan ? list(plan.postponed) : '- -'}

## 3. Milestone progress

${state.milestones.length > 0
  ? state.milestones
      .map(
        (milestone, index) => `### ${index + 1}. ${milestone.title}

- **Status:** ${statusLabel(milestone.status)}
- **Objective:** ${milestone.objective}
- **Done when:** ${milestone.doneWhen}
- **Learning concept:** ${milestone.learningConcept}
- **Product question:** ${milestone.productQuestion}`
      )
      .join('\n\n')
  : '-'}

## 4. Build evidence

- **Learner writing draft:** ${valueOrDash(state.buildSession.writingDraft)}
- **Writing clarity feedback:** ${valueOrDash(state.buildSession.writingFeedback)}
- **Learner decision:** ${valueOrDash(state.buildSession.learnerDecision)}
- **Business or real-world lens:** ${valueOrDash(state.buildSession.businessDecision)}
- **Team roles and permissions:** ${valueOrDash(state.buildSession.teamRoles)}
- **Implementation notes:** ${valueOrDash(state.buildSession.implementationNotes)}
- **Verification evidence:** ${valueOrDash(state.buildSession.verificationEvidence)}

## 5. Reflection

- **What I built:** ${valueOrDash(state.reflection.built)}
- **Decision I made:** ${valueOrDash(state.reflection.decision)}
- **How I know it works:** ${valueOrDash(state.reflection.verification)}
- **Product or business lesson:** ${valueOrDash(state.reflection.businessLesson)}
- **What I understand now:** ${valueOrDash(state.reflection.learned)}
- **What remains unclear:** ${valueOrDash(state.reflection.unclear)}
- **Next small milestone:** ${valueOrDash(state.reflection.nextStep)}

## 6. AI use and ownership

- AI may accelerate planning, implementation, explanation, and debugging.
- AI may also help learners improve writing clarity, grammar, business reasoning, and role planning.
- The learner retains scope, acceptance, and priority decisions.
- Team members should keep written ownership areas and ask before changing another person's work or the roadmap.
- Verification must rely on observable evidence rather than automatic trust.
- Money, publication, privacy, external accounts, and irreversible changes require supervision.

## 7. Coach questions

- **Business:** ${plan ? plan.businessQuestion : '-'}
- **AI literacy:** ${plan ? plan.aiLiteracyQuestion : '-'}
`;
}

export function downloadMarkdown(filename: string, content: string): void {
  const blob = new Blob([content], {
    type: 'text/markdown;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function reportFilename(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${slug || 'project'}-learning-report.md`;
}
