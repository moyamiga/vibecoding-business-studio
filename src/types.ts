export type Language = 'en';

export type StudioStep =
  | 'idea'
  | 'scope'
  | 'plan'
  | 'build'
  | 'reflect'
  | 'report';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type MilestoneStatus = 'not-started' | 'in-progress' | 'done';

export interface ProjectInput {
  title: string;
  idea: string;
  audience: string;
  problem: string;
  motivation: string;
  timebox: string;
  skillLevel: SkillLevel;
}

export interface ScopePlan {
  oneSentencePitch: string;
  challenge: string;
  firstMilestone: string;
  included: string[];
  postponed: string[];
  successEvidence: string;
  businessQuestion: string;
  aiLiteracyQuestion: string;
  risks: string[];
}

export interface Milestone {
  id: string;
  title: string;
  objective: string;
  doneWhen: string;
  tasks: string[];
  learningConcept: string;
  productQuestion: string;
  status: MilestoneStatus;
}

export interface BuildSession {
  milestoneId: string;
  learnerDecision: string;
  implementationNotes: string;
  verificationEvidence: string;
}

export interface Reflection {
  built: string;
  decision: string;
  verification: string;
  businessLesson: string;
  learned: string;
  unclear: string;
  nextStep: string;
}

export interface CoachMeta {
  source: 'openai' | 'local' | 'sample';
  model?: string;
  warning?: string;
  generatedAt: string;
}

export interface StudioState {
  version: 2;
  language: Language;
  currentStep: StudioStep;
  project: ProjectInput;
  plan: ScopePlan | null;
  milestones: Milestone[];
  buildSession: BuildSession;
  reflection: Reflection;
  coach: CoachMeta | null;
  updatedAt: string;
}

export const STEP_ORDER: StudioStep[] = [
  'idea',
  'scope',
  'plan',
  'build',
  'reflect',
  'report'
];

export function createEmptyState(language: Language): StudioState {
  return {
    version: 2,
    language,
    currentStep: 'idea',
    project: {
      title: '',
      idea: '',
      audience: '',
      problem: '',
      motivation: '',
      timebox: '2 weeks',
      skillLevel: 'beginner'
    },
    plan: null,
    milestones: [],
    buildSession: {
      milestoneId: '',
      learnerDecision: '',
      implementationNotes: '',
      verificationEvidence: ''
    },
    reflection: {
      built: '',
      decision: '',
      verification: '',
      businessLesson: '',
      learned: '',
      unclear: '',
      nextStep: ''
    },
    coach: null,
    updatedAt: new Date().toISOString()
  };
}
