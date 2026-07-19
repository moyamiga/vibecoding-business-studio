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
    title: 'Sneaker Studio Tycoon',
    idea:
      'A small management game where players run a sneaker company, design shoes, choose marketing moves, and react to business events.',
    audience:
      'Kids building with friends who enjoy games but are also ready to practice planning, writing, teamwork, and business decisions',
    problem:
      'They want to build an exciting game, but they often add features without clear roles, roadmap control, writing clarity, or business reasoning.',
    motivation:
      'I want learners to build something fun while practicing real-world decisions about marketing, operations, hiring, taxes, and teamwork.',
    timebox: '2 weeks',
    skillLevel: 'beginner'
  };

  const plan: ScopePlan = {
    oneSentencePitch:
      'Sneaker Studio Tycoon helps a team learn coding, writing, teamwork, and business thinking by building a small sneaker-company game.',
    challenge:
      'A full business game could expand forever. The first milestone should prove one playable business decision and one clear team workflow before adding complex finance, international operations, hiring systems, or a large economy.',
    firstMilestone:
      'Let a player choose one sneaker design, select one marketing action, and see a simple outcome while the team documents who owns design, roadmap, testing, and business ideas.',
    included: [
      'One sneaker design choice',
      'One marketing decision',
      'Simple revenue or popularity outcome',
      'Team roles with roadmap permissions',
      'Prompt-writing feedback before asking Codex to build'
    ],
    postponed: [
      'Full hiring system',
      'Taxes and accountants simulation',
      'International partnerships',
      'CEO and executive management tree',
      'Large economy or multiplayer marketplace'
    ],
    successEvidence:
      'A player can complete one sneaker-and-marketing turn, and each teammate can explain their role, one business tradeoff, and one prompt improvement.',
    businessQuestion:
      'Which business action should the game teach first: marketing, hiring, taxes, accounting, product design, or international relationships?',
    aiLiteracyQuestion:
      'Which part of the prompt did you rewrite because it was unclear before asking Codex to implement it?',
    risks: [
      'The game may become too large before the first business lesson is playable',
      'Friends may change roadmap decisions outside their role',
      'Learners may accept AI business advice without checking whether it makes sense'
    ]
  };

  state.plan = plan;
  state.milestones = buildMilestones(state.project, plan, language);
  state.milestones[0].status = 'done';
  state.milestones[1].status = 'in-progress';
  state.buildSession = {
    milestoneId: 'core-flow',
    writingDraft:
      'Make my sneaker company game better and add business stuff.',
    writingFeedback:
      'This request is too broad. Name the player action, the business concept, the teammate role, and the evidence for success before asking Codex to build.',
    learnerDecision:
      'The project owner controls roadmap changes. The first milestone teaches marketing choice before adding hiring, taxes, accounting, or international expansion.',
    businessDecision:
      'We will compare two marketing choices inside the game and ask what would make a customer care about the sneaker brand.',
    teamRoles:
      'Owner: roadmap and scope. Designer: sneaker visuals only. Tester: records bugs and unclear instructions. Business lead: proposes marketing, hiring, tax, and partnership ideas but cannot change scope alone.',
    implementationNotes:
      'Create one playable turn with design choice, marketing choice, and outcome. Do not add multiplayer, executive hiring, taxes, accounting, or international expansion yet.',
    verificationEvidence: ''
  };
  state.coach = {
    source: 'sample',
    generatedAt: new Date().toISOString()
  };
  state.currentStep = 'scope';
  return state;
}
