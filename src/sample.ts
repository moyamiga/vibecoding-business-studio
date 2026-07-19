import { buildMilestones } from './coach';
import {
  createEmptyState,
  type Language,
  type ScopePlan,
  type StudioState
} from './types';

export function createSampleState(language: Language): StudioState {
  const state = createEmptyState(language);

  state.project = {
    title: 'Student Spending Compass',
    idea:
      'A simple application for recording expenses and showing which categories consume money during the week.',
    audience:
      'High-school or university students managing a small budget for the first time',
    problem:
      'They record expenses inconsistently and cannot see which habits consumed their money at the end of the week.',
    motivation:
      'I want a small tool to support better decisions without connecting bank accounts.',
    timebox: '2 weeks',
    skillLevel: 'beginner'
  };

  const plan: ScopePlan = {
    oneSentencePitch:
      'Student Spending Compass helps students with a small budget understand their weekly spending.',
    challenge:
      'Bank connections, predictions, and accounts would distract from the first question: does recording and summarizing expenses support one better weekly decision?',
    firstMilestone:
      'Let a learner record amount, category, and note, then show a weekly summary by category.',
    included: [
      'Amount, category, and note form',
      'Recorded-expense list',
      'Weekly category summary',
      'Local storage',
      'One test with a student'
    ],
    postponed: [
      'Bank connections',
      'Sign-in',
      'AI predictions',
      'Payments and subscriptions',
      'Native mobile application'
    ],
    successEvidence:
      'One student records five expenses without help, identifies the largest category, and explains one decision for the next week.',
    businessQuestion:
      'What would need to happen for a student to return to the tool every week?',
    aiLiteracyQuestion:
      'Which validations did you inspect yourself, and which did you accept only because Codex proposed them?',
    risks: [
      'Collecting identifiable financial information',
      'Confusing a prototype with financial advice',
      'Adding predictions before validating manual entry'
    ]
  };

  state.plan = plan;
  state.milestones = buildMilestones(state.project, plan, language);
  state.milestones[0].status = 'done';
  state.milestones[1].status = 'in-progress';
  state.buildSession = {
    milestoneId: 'core-flow',
    learnerDecision:
      'We will use local storage because the first milestone validates the workflow, not accounts or infrastructure.',
    implementationNotes:
      'Create the form, list, and summary. Do not add authentication, complex charts, or bank connections.',
    verificationEvidence: ''
  };
  state.coach = {
    source: 'sample',
    generatedAt: new Date().toISOString()
  };
  state.currentStep = 'scope';
  return state;
}
