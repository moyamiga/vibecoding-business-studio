import type { Language, StudioStep } from './types';

const copy = {
  en: {
    appName: 'VibeCoding Business Studio',
    tagline:
      'AI helps learners build; the Studio teaches them to write, plan, collaborate, and own decisions.',
    localFirst: 'Private by default · Saved in this browser',
    newProject: 'New project',
    loadSample: 'Load sample',
    language: 'Language',
    steps: {
      idea: '1. Idea',
      scope: '2. Scope',
      plan: '3. Milestones',
      build: '4. Build session',
      reflect: '5. Reflection',
      report: '6. Evidence'
    },
    ideaTitle: 'Start with a real idea',
    ideaIntro:
      'Describe something you care about. The Studio will challenge scope, clarify writing, surface business tradeoffs, and prepare team roles instead of praising everything.',
    projectTitle: 'Project name',
    projectTitleHint: 'Example: Sneaker Studio Tycoon',
    ideaLabel: 'What do you want to build?',
    ideaHint: 'Describe the product or outcome, not the technology.',
    audienceLabel: 'Who is it for?',
    audienceHint: 'Be specific enough to picture one real user.',
    problemLabel: 'What problem does that person have?',
    problemHint: 'Describe the current difficulty, not your solution.',
    motivationLabel: 'Why do you care about this project?',
    motivationHint: 'Personal motivation helps the learner persist.',
    timeboxLabel: 'Time available',
    skillLabel: 'Current experience',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    generateScope: 'Challenge my scope',
    generating: 'Thinking through the smallest useful milestone…',
    required: 'Complete the project name, idea, audience, and problem first.',
    scopeTitle: 'Reality check',
    scopeIntro:
      'The goal is not to shrink the ambition forever. It is to find the smallest milestone that can produce evidence.',
    pitch: 'One-sentence product',
    challenge: 'Coach challenge',
    firstMilestone: 'First milestone',
    included: 'Included now',
    postponed: 'Explicitly postponed',
    evidence: 'Evidence of success',
    businessQuestion: 'Business question',
    aiQuestion: 'AI literacy question',
    risks: 'Risks to discuss with a mentor',
    regenerate: 'Regenerate scope',
    continuePlan: 'Create milestones',
    coachOpenAI: 'Generated with the OpenAI coach',
    coachLocal: 'Generated with the local fallback coach',
    coachSample: 'Loaded from the sample project',
    planTitle: 'A buildable learning plan',
    planIntro:
      'Each milestone combines an output, a definition of done, a learning concept, and a product decision.',
    objective: 'Objective',
    doneWhen: 'Done when',
    tasks: 'Tasks',
    learningConcept: 'Learning concept',
    productQuestion: 'Product question',
    useMilestone: 'Use in build session',
    markDone: 'Mark done',
    markInProgress: 'Mark in progress',
    buildTitle: 'Prepare a guided Codex session',
    buildIntro:
      'Codex can implement faster, but the learner should clarify the request, assign roles, state business tradeoffs, and define evidence.',
    currentMilestone: 'Current milestone',
    writingDraft: 'Learner prompt or project request',
    writingDraftHint:
      'Write the request in your own words. The Studio can point out unclear wording before Codex builds from it.',
    reviewWriting: 'Review writing',
    writingFeedback: 'Writing clarity feedback',
    writingFeedbackEmpty:
      'Write a project request and select Review writing to get clarity, grammar, and specificity feedback.',
    learnerDecision: 'Decision the learner owns',
    learnerDecisionHint:
      'Example: We will use local storage because this milestone validates the workflow, not accounts.',
    businessDecision: 'Business or real-world lens',
    businessDecisionHint:
      'Example: In our sneaker company game, we will test marketing before adding taxes, accountants, international partners, or a CEO role.',
    teamRoles: 'Team roles and permissions',
    teamRolesHint:
      'Example: Owner controls roadmap. Designer owns visuals. Tester logs bugs. Business lead proposes marketing and cost ideas.',
    implementationNotes: 'Implementation notes',
    implementationNotesHint:
      'What should Codex change? What should remain outside scope?',
    verificationEvidence: 'Verification evidence',
    verificationEvidenceHint:
      'Tests, screenshots, user walkthrough, build result, or another observable check.',
    codexBrief: 'Codex session brief',
    copyPrompt: 'Copy Codex prompt',
    copied: 'Copied',
    completeMilestone: 'Complete milestone',
    reflectTitle: 'Turn activity into learning',
    reflectIntro:
      'Reflection separates “the AI made it work” from understanding, judgment, and ownership.',
    reflectionBuilt: 'What did you build?',
    reflectionDecision: 'What decision did you make?',
    reflectionVerification: 'How do you know it works?',
    reflectionBusiness:
      'What writing, teamwork, product, or business lesson appeared?',
    reflectionLearned: 'What do you understand now?',
    reflectionUnclear: 'What remains unclear?',
    reflectionNext: 'What is the next small milestone?',
    saveReflection: 'Save and create evidence',
    reportTitle: 'Learning evidence',
    reportIntro:
      'Export a report that a learner, mentor, parent, or teacher can inspect without reading the entire codebase.',
    exportMarkdown: 'Download Markdown report',
    copyReport: 'Copy report',
    emptyPlan: 'Generate a scope plan first.',
    emptyMilestones: 'Create milestones first.',
    privacyNote:
      'Do not enter secrets, API keys, private chats, or identifying information about minors.',
    offlineWarning:
      'The OpenAI endpoint was unavailable, so the Studio used its local coaching rules. The workflow remains testable.',
    resetConfirm: 'Delete the project saved in this browser and start over?',
    sampleName: 'Sneaker Studio Tycoon',
    next: 'Next',
    back: 'Back'
  }
} as const;

export type AppCopy = (typeof copy)[Language];

export function getCopy(language: Language): AppCopy {
  return copy[language];
}

export function stepLabel(language: Language, step: StudioStep): string {
  return copy[language].steps[step];
}
