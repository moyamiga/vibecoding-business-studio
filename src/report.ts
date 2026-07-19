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

## Decision owned by the learner

${valueOrDash(state.buildSession.learnerDecision)}

## Implementation notes

${valueOrDash(state.buildSession.implementationNotes)}

## Scope guardrails

Include only:
${list(state.plan.included)}

Do not build yet:
${list(state.plan.postponed)}

## Working method

1. Before changing code, summarize your understanding and identify contradictions.
2. Propose the smallest verifiable change; do not expand scope.
3. Explain which files you will modify and why.
4. When a product, cost, privacy, or risk decision appears, stop and present options to the learner.
5. Run the available checks.
6. At the end, report:
   - files changed;
   - what works;
   - how it was verified;
   - assumptions;
   - debt or risks;
   - one question that checks learner understanding.
7. Never expose credentials, private chats, or identifying information about minors.

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

- **Learner decision:** ${valueOrDash(state.buildSession.learnerDecision)}
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
- The learner retains scope, acceptance, and priority decisions.
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
