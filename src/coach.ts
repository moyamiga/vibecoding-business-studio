import type {
  Language,
  Milestone,
  ProjectInput,
  ScopePlan,
  SkillLevel
} from './types';

export interface CoachResult {
  plan: ScopePlan;
  source: 'openai' | 'local';
  model?: string;
  warning?: string;
}

interface CoachApiResponse {
  plan?: unknown;
  model?: unknown;
  error?: unknown;
}

const REQUEST_TIMEOUT_MS = 18_000;

function asNonEmptyString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : null;
}

function asStringArray(value: unknown, minimum = 1): string[] | null {
  if (!Array.isArray(value)) return null;

  const items = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length >= minimum ? items : null;
}

function parseScopePlan(value: unknown): ScopePlan | null {
  if (!value || typeof value !== 'object') return null;

  const candidate = value as Record<string, unknown>;
  const oneSentencePitch = asNonEmptyString(candidate.oneSentencePitch);
  const challenge = asNonEmptyString(candidate.challenge);
  const firstMilestone = asNonEmptyString(candidate.firstMilestone);
  const included = asStringArray(candidate.included, 2);
  const postponed = asStringArray(candidate.postponed, 2);
  const successEvidence = asNonEmptyString(candidate.successEvidence);
  const businessQuestion = asNonEmptyString(candidate.businessQuestion);
  const aiLiteracyQuestion = asNonEmptyString(candidate.aiLiteracyQuestion);
  const risks = asStringArray(candidate.risks, 1);

  if (
    !oneSentencePitch ||
    !challenge ||
    !firstMilestone ||
    !included ||
    !postponed ||
    !successEvidence ||
    !businessQuestion ||
    !aiLiteracyQuestion ||
    !risks
  ) {
    return null;
  }

  return {
    oneSentencePitch,
    challenge,
    firstMilestone,
    included,
    postponed,
    successEvidence,
    businessQuestion,
    aiLiteracyQuestion,
    risks
  };
}

function shorten(value: string, maximum = 120): string {
  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized.length <= maximum
    ? normalized
    : `${normalized.slice(0, maximum - 1).trim()}...`;
}

function levelText(level: SkillLevel): string {
  if (level === 'advanced') return 'advanced';
  if (level === 'intermediate') return 'intermediate';
  return 'beginner';
}

function localPlan(project: ProjectInput): ScopePlan {
  const audience = shorten(project.audience || 'a specific user', 80);
  const problem = shorten(project.problem || project.idea, 120);
  const idea = shorten(project.idea, 120);
  const timebox = project.timebox || 'two weeks';
  const level = levelText(project.skillLevel);

  return {
    oneSentencePitch: `${project.title} helps ${audience} address ${problem}.`,
    challenge:
      `The idea can still expand beyond ${timebox}. At a ${level} level, the first milestone should prove one useful user action before adding accounts, advanced automation, or infrastructure.`,
    firstMilestone:
      `Build a small version in which one person can complete the core "${idea}" workflow and the learner can explain how it was verified.`,
    included: [
      'A clear brief with a user, problem, and expected outcome',
      'One core workflow that can be tested from start to finish',
      'Sample data or local storage when that is enough',
      'One observable test with a real person or realistic scenario',
      'A written reflection about decisions and limits'
    ],
    postponed: [
      'Authentication, profiles, and complex permissions',
      'Payments, marketplaces, or automated monetization',
      'External integrations that do not prove the core value',
      'Scaling, native apps, and premature optimization',
      'Features added only because the AI can build them'
    ],
    successEvidence:
      'One person can complete the core workflow without step-by-step explanation, and the learner can show the test, explain the main decision, and name what remains unclear.',
    businessQuestion:
      `What behavior would prove that ${audience} receives real value rather than merely finding the demo interesting?`,
    aiLiteracyQuestion:
      'Which part of the result did you personally verify instead of assuming it was correct because an AI produced it?',
    risks: [
      'The scope may expand again during implementation',
      'The learner may accept code without understanding the decision',
      'The test may prove that something works but not that it is useful',
      'Personal data or credentials may be entered accidentally'
    ]
  };
}

export async function requestScopePlan(
  project: ProjectInput,
  language: Language
): Promise<CoachResult> {
  const controller = new AbortController();
  const timeout = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  try {
    const response = await fetch('/api/coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ project, language }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Coach endpoint returned ${response.status}`);
    }

    const data = (await response.json()) as CoachApiResponse;
    const plan = parseScopePlan(data.plan);

    if (!plan) {
      throw new Error('Coach response did not match the expected shape');
    }

    return {
      plan,
      source: 'openai',
      model: typeof data.model === 'string' ? data.model : undefined
    };
  } catch (error) {
    return {
      plan: localPlan(project),
      source: 'local',
      warning:
        error instanceof Error ? error.message : 'OpenAI coach unavailable'
    };
  } finally {
    window.clearTimeout(timeout);
  }
}

export function buildMilestones(
  project: ProjectInput,
  plan: ScopePlan,
  _language?: Language
): Milestone[] {
  return [
    {
      id: 'brief',
      title: 'Align the problem and scope',
      objective: `Turn "${project.title}" into a brief that another person can understand.`,
      doneWhen:
        'The user, problem, core workflow, included work, and postponed work are written without contradictions.',
      tasks: [
        'Review the one-sentence product',
        'Confirm one primary user',
        'Accept or edit the postponed-feature list',
        'Define evidence for the first milestone'
      ],
      learningConcept: 'Product scope and acceptance criteria',
      productQuestion: plan.businessQuestion,
      status: 'not-started'
    },
    {
      id: 'core-flow',
      title: 'Build the core workflow',
      objective: plan.firstMilestone,
      doneWhen:
        'The core workflow can be completed from start to finish with sample data and without postponed features.',
      tasks: [
        'Prepare a structured Codex prompt',
        'Implement the smallest verifiable change',
        'Run the available build or check',
        'Record files, decisions, and limitations'
      ],
      learningConcept: 'Iterative implementation and verification',
      productQuestion:
        'Which part of the workflow removes the most friction for the primary user?',
      status: 'not-started'
    },
    {
      id: 'user-test',
      title: 'Test usefulness, not only function',
      objective:
        'Observe one person or realistic scenario attempting the workflow.',
      doneWhen:
        'There is one concrete observation, one detected difficulty, and one decision about what to change or preserve.',
      tasks: [
        'Prepare a short test task',
        'Observe without explaining every step',
        'Record where the person stops or hesitates',
        'Choose one evidence-backed change'
      ],
      learningConcept: 'User testing and evidence of value',
      productQuestion:
        'Did the person complete the goal because the product was clear or because they received help?',
      status: 'not-started'
    },
    {
      id: 'reflection',
      title: 'Explain and document the learning',
      objective:
        'Produce evidence of decisions, verification, understanding, and the next step.',
      doneWhen:
        'The report makes it possible to distinguish what the learner decided, what AI accelerated, and what remains unclear.',
      tasks: [
        'Complete the reflection',
        'Connect one technical decision to product or business',
        'Name one real uncertainty',
        'Export the learning report'
      ],
      learningConcept: 'Ownership, metacognition, and communication',
      productQuestion: plan.aiLiteracyQuestion,
      status: 'not-started'
    }
  ];
}
