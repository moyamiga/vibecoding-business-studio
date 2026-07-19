import './styles.css';

import { buildMilestones, requestScopePlan } from './coach';
import { getCopy, stepLabel } from './i18n';
import {
  buildCodexPrompt,
  buildLearningReport,
  downloadMarkdown,
  reportFilename
} from './report';
import { createSampleState } from './sample';
import {
  clearState,
  detectLanguage,
  loadState,
  saveState
} from './storage';
import {
  STEP_ORDER,
  createEmptyState,
  type MilestoneStatus,
  type StudioState,
  type StudioStep
} from './types';

const appElement = document.querySelector<HTMLElement>('#app');

if (!appElement) {
  throw new Error('Missing #app root element');
}

const app: HTMLElement = appElement;

let state = loadState(detectLanguage());
let busy = false;
let validationMessage = '';
let toastMessage = '';
let toastTimer: number | undefined;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function safe(value: string | undefined | null): string {
  return escapeHtml(value?.trim() || '—');
}

function setToast(message: string): void {
  toastMessage = message;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toastMessage = '';
    render();
  }, 1800);
  render();
}

function persist(): void {
  saveState(state);
}

function setStep(step: StudioStep): void {
  state.currentStep = step;
  persist();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function currentStepIndex(): number {
  return Math.max(0, STEP_ORDER.indexOf(state.currentStep));
}

function completionPercent(): number {
  let completed = 0;

  if (
    state.project.title.trim() &&
    state.project.idea.trim() &&
    state.project.audience.trim() &&
    state.project.problem.trim()
  ) {
    completed++;
  }
  if (state.plan) completed++;
  if (state.milestones.length > 0) completed++;
  if (
    state.buildSession.learnerDecision.trim() ||
    state.buildSession.implementationNotes.trim() ||
    state.buildSession.verificationEvidence.trim()
  ) {
    completed++;
  }
  if (
    state.reflection.built.trim() &&
    state.reflection.decision.trim() &&
    state.reflection.verification.trim()
  ) {
    completed++;
  }
  if (state.milestones.some((milestone) => milestone.status === 'done')) {
    completed++;
  }

  return Math.round((completed / STEP_ORDER.length) * 100);
}

function statusText(status: MilestoneStatus): string {
  if (status === 'done') return 'Done';
  if (status === 'in-progress') return 'In progress';
  return 'Not started';
}

function renderList(items: string[], className = ''): string {
  return `<ul class="clean-list ${className}">
    ${items.map((item) => `<li>${safe(item)}</li>`).join('')}
  </ul>`;
}

function renderHeader(): string {
  const c = getCopy(state.language);

  return `
    <header class="topbar">
      <div class="brand-block">
        <div class="brand-mark" aria-hidden="true">VB</div>
        <div>
          <p class="eyebrow">${c.appName}</p>
          <p class="tagline">${c.tagline}</p>
        </div>
      </div>

      <div class="header-actions">
        <button class="ghost-button" type="button" data-action="sample">
          ${c.loadSample}
        </button>
        <button class="ghost-button" type="button" data-action="reset">
          ${c.newProject}
        </button>
      </div>
    </header>
  `;
}

function renderSidebar(): string {
  const c = getCopy(state.language);
  const percentage = completionPercent();

  return `
    <aside class="sidebar">
      <div class="progress-card">
        <div class="progress-heading">
          <span>Project progress</span>
          <strong>${percentage}%</strong>
        </div>
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>
        <p>${c.localFirst}</p>
      </div>

      <nav class="step-nav" aria-label="Studio stages">
        ${STEP_ORDER.map((step, index) => {
          const active = step === state.currentStep;
          const behind = index < currentStepIndex();
          return `
            <button
              class="step-button ${active ? 'active' : ''} ${behind ? 'visited' : ''}"
              type="button"
              data-step="${step}"
            >
              <span class="step-number">${index + 1}</span>
              <span>${stepLabel(state.language, step)}</span>
            </button>
          `;
        }).join('')}
      </nav>

      <div class="privacy-card">
        <span aria-hidden="true">◎</span>
        <p>${c.privacyNote}</p>
      </div>
    </aside>
  `;
}

function renderIdea(): string {
  const c = getCopy(state.language);

  return `
    <section class="content-section">
      <div class="section-heading">
        <span class="section-kicker">${stepLabel(state.language, 'idea')}</span>
        <h1>${c.ideaTitle}</h1>
        <p>${c.ideaIntro}</p>
      </div>

      ${validationMessage ? `<div class="alert error">${safe(validationMessage)}</div>` : ''}

      <div class="form-card">
        <label class="field">
          <span>${c.projectTitle}</span>
          <input
            type="text"
            data-project-field="title"
            value="${escapeHtml(state.project.title)}"
            placeholder="${c.projectTitleHint}"
            autocomplete="off"
          />
        </label>

        <label class="field">
          <span>${c.ideaLabel}</span>
          <textarea
            data-project-field="idea"
            rows="4"
            placeholder="${c.ideaHint}"
          >${escapeHtml(state.project.idea)}</textarea>
        </label>

        <div class="two-column">
          <label class="field">
            <span>${c.audienceLabel}</span>
            <textarea
              data-project-field="audience"
              rows="3"
              placeholder="${c.audienceHint}"
            >${escapeHtml(state.project.audience)}</textarea>
          </label>

          <label class="field">
            <span>${c.problemLabel}</span>
            <textarea
              data-project-field="problem"
              rows="3"
              placeholder="${c.problemHint}"
            >${escapeHtml(state.project.problem)}</textarea>
          </label>
        </div>

        <label class="field">
          <span>${c.motivationLabel}</span>
          <textarea
            data-project-field="motivation"
            rows="3"
            placeholder="${c.motivationHint}"
          >${escapeHtml(state.project.motivation)}</textarea>
        </label>

        <div class="two-column">
          <label class="field">
            <span>${c.timeboxLabel}</span>
            <select data-project-field="timebox">
              ${[
                '1 day',
                '1 week',
                '2 weeks',
                '1 month',
                '1 quarter'
              ].map((option) => `
                <option value="${option}" ${state.project.timebox === option ? 'selected' : ''}>
                  ${option}
                </option>
              `).join('')}
            </select>
          </label>

          <label class="field">
            <span>${c.skillLabel}</span>
            <select data-project-field="skillLevel">
              <option value="beginner" ${state.project.skillLevel === 'beginner' ? 'selected' : ''}>${c.beginner}</option>
              <option value="intermediate" ${state.project.skillLevel === 'intermediate' ? 'selected' : ''}>${c.intermediate}</option>
              <option value="advanced" ${state.project.skillLevel === 'advanced' ? 'selected' : ''}>${c.advanced}</option>
            </select>
          </label>
        </div>
      </div>

      <div class="section-actions end">
        <button
          class="primary-button"
          type="button"
          data-action="generate-scope"
          ${busy ? 'disabled' : ''}
        >
          ${busy ? c.generating : c.generateScope}
        </button>
      </div>
    </section>
  `;
}

function renderCoachBadge(): string {
  const c = getCopy(state.language);
  if (!state.coach) return '';

  const label =
    state.coach.source === 'openai'
      ? c.coachOpenAI
      : state.coach.source === 'sample'
        ? c.coachSample
        : c.coachLocal;

  return `
    <div class="coach-badge ${state.coach.source}">
      <span aria-hidden="true">${state.coach.source === 'openai' ? '✦' : state.coach.source === 'sample' ? '◇' : '◌'}</span>
      <span>${label}${state.coach.model ? ` · ${safe(state.coach.model)}` : ''}</span>
    </div>
  `;
}

function renderScope(): string {
  const c = getCopy(state.language);
  const plan = state.plan;

  if (!plan) {
    return renderEmptyState(c.emptyPlan, 'idea');
  }

  return `
    <section class="content-section">
      <div class="section-heading">
        <span class="section-kicker">${stepLabel(state.language, 'scope')}</span>
        <h1>${c.scopeTitle}</h1>
        <p>${c.scopeIntro}</p>
        ${renderCoachBadge()}
      </div>

      ${state.coach?.source === 'local' ? `<div class="alert warning">${c.offlineWarning}</div>` : ''}

      <div class="feature-card accent">
        <span class="card-label">${c.pitch}</span>
        <h2>${safe(plan.oneSentencePitch)}</h2>
      </div>

      <div class="feature-card challenge-card">
        <span class="card-label">${c.challenge}</span>
        <p>${safe(plan.challenge)}</p>
      </div>

      <div class="feature-card">
        <span class="card-label">${c.firstMilestone}</span>
        <h3>${safe(plan.firstMilestone)}</h3>
        <div class="evidence-line">
          <strong>${c.evidence}</strong>
          <p>${safe(plan.successEvidence)}</p>
        </div>
      </div>

      <div class="two-column align-start">
        <div class="list-card included">
          <span class="card-label">${c.included}</span>
          ${renderList(plan.included)}
        </div>
        <div class="list-card postponed">
          <span class="card-label">${c.postponed}</span>
          ${renderList(plan.postponed)}
        </div>
      </div>

      <div class="two-column align-start">
        <div class="question-card">
          <span class="card-label">${c.businessQuestion}</span>
          <p>${safe(plan.businessQuestion)}</p>
        </div>
        <div class="question-card">
          <span class="card-label">${c.aiQuestion}</span>
          <p>${safe(plan.aiLiteracyQuestion)}</p>
        </div>
      </div>

      <div class="risk-card">
        <span class="card-label">${c.risks}</span>
        ${renderList(plan.risks)}
      </div>

      <div class="section-actions between">
        <button class="ghost-button" type="button" data-action="generate-scope">
          ${c.regenerate}
        </button>
        <button class="primary-button" type="button" data-action="create-milestones">
          ${c.continuePlan}
        </button>
      </div>
    </section>
  `;
}

function renderPlan(): string {
  const c = getCopy(state.language);

  if (!state.plan) {
    return renderEmptyState(c.emptyPlan, 'idea');
  }

  if (state.milestones.length === 0) {
    state.milestones = buildMilestones(
      state.project,
      state.plan,
      state.language
    );
    persist();
  }

  return `
    <section class="content-section">
      <div class="section-heading">
        <span class="section-kicker">${stepLabel(state.language, 'plan')}</span>
        <h1>${c.planTitle}</h1>
        <p>${c.planIntro}</p>
      </div>

      <div class="milestone-list">
        ${state.milestones.map((milestone, index) => `
          <article class="milestone-card ${milestone.status}">
            <div class="milestone-header">
              <div>
                <span class="milestone-index">${String(index + 1).padStart(2, '0')}</span>
                <h2>${safe(milestone.title)}</h2>
              </div>
              <span class="status-pill ${milestone.status}">${statusText(milestone.status)}</span>
            </div>

            <div class="milestone-grid">
              <div>
                <span class="card-label">${c.objective}</span>
                <p>${safe(milestone.objective)}</p>
              </div>
              <div>
                <span class="card-label">${c.doneWhen}</span>
                <p>${safe(milestone.doneWhen)}</p>
              </div>
            </div>

            <div class="milestone-grid">
              <div>
                <span class="card-label">${c.tasks}</span>
                ${renderList(milestone.tasks)}
              </div>
              <div>
                <span class="card-label">${c.learningConcept}</span>
                <p>${safe(milestone.learningConcept)}</p>
                <span class="card-label spaced">${c.productQuestion}</span>
                <p>${safe(milestone.productQuestion)}</p>
              </div>
            </div>

            <div class="milestone-actions">
              <button
                class="ghost-button"
                type="button"
                data-action="set-status"
                data-milestone="${milestone.id}"
                data-status="${milestone.status === 'in-progress' ? 'done' : 'in-progress'}"
              >
                ${milestone.status === 'in-progress' ? c.markDone : c.markInProgress}
              </button>
              <button
                class="primary-button compact"
                type="button"
                data-action="use-milestone"
                data-milestone="${milestone.id}"
              >
                ${c.useMilestone}
              </button>
            </div>
          </article>
        `).join('')}
      </div>

      <div class="section-actions between">
        <button class="ghost-button" type="button" data-step="scope">${c.back}</button>
        <button class="primary-button" type="button" data-step="build">${c.next}</button>
      </div>
    </section>
  `;
}

function renderBuild(): string {
  const c = getCopy(state.language);

  if (state.milestones.length === 0) {
    return renderEmptyState(c.emptyMilestones, 'plan');
  }

  if (!state.buildSession.milestoneId) {
    const active =
      state.milestones.find((milestone) => milestone.status === 'in-progress') ??
      state.milestones[0];
    state.buildSession.milestoneId = active.id;
    persist();
  }

  const milestone =
    state.milestones.find(
      (item) => item.id === state.buildSession.milestoneId
    ) ?? state.milestones[0];
  const prompt = buildCodexPrompt(state);

  return `
    <section class="content-section">
      <div class="section-heading">
        <span class="section-kicker">${stepLabel(state.language, 'build')}</span>
        <h1>${c.buildTitle}</h1>
        <p>${c.buildIntro}</p>
      </div>

      <div class="form-card">
        <label class="field">
          <span>${c.currentMilestone}</span>
          <select data-build-field="milestoneId" data-rerender="true">
            ${state.milestones.map((item) => `
              <option value="${item.id}" ${item.id === milestone.id ? 'selected' : ''}>
                ${safe(item.title)}
              </option>
            `).join('')}
          </select>
        </label>

        <div class="selected-milestone">
          <span class="card-label">${c.objective}</span>
          <h2>${safe(milestone.objective)}</h2>
          <p><strong>${c.doneWhen}:</strong> ${safe(milestone.doneWhen)}</p>
        </div>

        <label class="field">
          <span>${c.learnerDecision}</span>
          <textarea
            data-build-field="learnerDecision"
            rows="4"
            placeholder="${c.learnerDecisionHint}"
          >${escapeHtml(state.buildSession.learnerDecision)}</textarea>
        </label>

        <label class="field">
          <span>${c.implementationNotes}</span>
          <textarea
            data-build-field="implementationNotes"
            rows="4"
            placeholder="${c.implementationNotesHint}"
          >${escapeHtml(state.buildSession.implementationNotes)}</textarea>
        </label>

        <label class="field">
          <span>${c.verificationEvidence}</span>
          <textarea
            data-build-field="verificationEvidence"
            rows="4"
            placeholder="${c.verificationEvidenceHint}"
          >${escapeHtml(state.buildSession.verificationEvidence)}</textarea>
        </label>
      </div>

      <div class="prompt-card">
        <div class="prompt-header">
          <div>
            <span class="card-label">${c.codexBrief}</span>
            <h2>${safe(state.project.title)}</h2>
          </div>
          <button class="ghost-button" type="button" data-action="copy-prompt">
            ${c.copyPrompt}
          </button>
        </div>
        <pre>${escapeHtml(prompt)}</pre>
      </div>

      <div class="section-actions between">
        <button class="ghost-button" type="button" data-step="plan">${c.back}</button>
        <button class="primary-button" type="button" data-action="complete-current">
          ${c.completeMilestone}
        </button>
      </div>
    </section>
  `;
}

function reflectionField(
  label: string,
  field: keyof StudioState['reflection'],
  value: string,
  rows = 3
): string {
  return `
    <label class="field">
      <span>${label}</span>
      <textarea
        data-reflection-field="${field}"
        rows="${rows}"
      >${escapeHtml(value)}</textarea>
    </label>
  `;
}

function renderReflect(): string {
  const c = getCopy(state.language);

  return `
    <section class="content-section">
      <div class="section-heading">
        <span class="section-kicker">${stepLabel(state.language, 'reflect')}</span>
        <h1>${c.reflectTitle}</h1>
        <p>${c.reflectIntro}</p>
      </div>

      <div class="form-card reflection-grid">
        ${reflectionField(c.reflectionBuilt, 'built', state.reflection.built)}
        ${reflectionField(c.reflectionDecision, 'decision', state.reflection.decision)}
        ${reflectionField(c.reflectionVerification, 'verification', state.reflection.verification)}
        ${reflectionField(c.reflectionBusiness, 'businessLesson', state.reflection.businessLesson)}
        ${reflectionField(c.reflectionLearned, 'learned', state.reflection.learned)}
        ${reflectionField(c.reflectionUnclear, 'unclear', state.reflection.unclear)}
        ${reflectionField(c.reflectionNext, 'nextStep', state.reflection.nextStep)}
      </div>

      <div class="section-actions between">
        <button class="ghost-button" type="button" data-step="build">${c.back}</button>
        <button class="primary-button" type="button" data-action="save-reflection">
          ${c.saveReflection}
        </button>
      </div>
    </section>
  `;
}

function renderReport(): string {
  const c = getCopy(state.language);
  const report = buildLearningReport(state);

  return `
    <section class="content-section">
      <div class="section-heading">
        <span class="section-kicker">${stepLabel(state.language, 'report')}</span>
        <h1>${c.reportTitle}</h1>
        <p>${c.reportIntro}</p>
      </div>

      <div class="report-summary">
        <div>
          <span class="summary-number">${state.milestones.filter((item) => item.status === 'done').length}</span>
          <span>milestones done</span>
        </div>
        <div>
          <span class="summary-number">${state.plan?.postponed.length ?? 0}</span>
          <span>features postponed</span>
        </div>
        <div>
          <span class="summary-number">${state.reflection.verification.trim() ? '1' : '0'}</span>
          <span>verification explained</span>
        </div>
      </div>

      <div class="report-card">
        <pre>${escapeHtml(report)}</pre>
      </div>

      <div class="section-actions between">
        <button class="ghost-button" type="button" data-action="copy-report">
          ${c.copyReport}
        </button>
        <button class="primary-button" type="button" data-action="download-report">
          ${c.exportMarkdown}
        </button>
      </div>
    </section>
  `;
}

function renderEmptyState(message: string, destination: StudioStep): string {
  const c = getCopy(state.language);

  return `
    <section class="content-section empty-state">
      <div class="empty-symbol" aria-hidden="true">◇</div>
      <h1>${safe(message)}</h1>
      <button class="primary-button" type="button" data-step="${destination}">
        ${c.back}
      </button>
    </section>
  `;
}

function renderCurrentStep(): string {
  switch (state.currentStep) {
    case 'idea':
      return renderIdea();
    case 'scope':
      return renderScope();
    case 'plan':
      return renderPlan();
    case 'build':
      return renderBuild();
    case 'reflect':
      return renderReflect();
    case 'report':
      return renderReport();
  }
}

function render(): void {
  const c = getCopy(state.language);

  document.documentElement.lang = state.language;
  document.title = `${c.appName} · ${state.project.title || 'New project'}`;

  app.innerHTML = `
    <div class="app-shell">
      ${renderHeader()}
      <div class="workspace">
        ${renderSidebar()}
        <main class="main-panel">
          ${renderCurrentStep()}
        </main>
      </div>
      ${toastMessage ? `<div class="toast" role="status">${safe(toastMessage)}</div>` : ''}
    </div>
  `;

  attachHandlers();
}

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }
}

async function generateScope(): Promise<void> {
  const c = getCopy(state.language);
  const required = [
    state.project.title,
    state.project.idea,
    state.project.audience,
    state.project.problem
  ].every((value) => value.trim().length > 0);

  if (!required) {
    validationMessage = c.required;
    state.currentStep = 'idea';
    render();
    return;
  }

  validationMessage = '';
  busy = true;
  render();

  const result = await requestScopePlan(state.project, state.language);

  state.plan = result.plan;
  state.milestones = buildMilestones(
    state.project,
    result.plan,
    state.language
  );
  state.buildSession.milestoneId = state.milestones[0]?.id ?? '';
  state.coach = {
    source: result.source,
    model: result.model,
    warning: result.warning,
    generatedAt: new Date().toISOString()
  };
  state.currentStep = 'scope';
  busy = false;
  persist();
  render();
}

function loadSample(): void {
  state = createSampleState(state.language);
  validationMessage = '';
  persist();
  render();
}

function resetProject(): void {
  const c = getCopy(state.language);
  if (!window.confirm(c.resetConfirm)) return;

  clearState();
  state = createEmptyState(state.language);
  validationMessage = '';
  render();
}

function updateMilestoneStatus(
  milestoneId: string,
  status: MilestoneStatus
): void {
  state.milestones = state.milestones.map((milestone) => ({
    ...milestone,
    status:
      milestone.id === milestoneId
        ? status
        : status === 'in-progress' && milestone.status === 'in-progress'
          ? 'not-started'
          : milestone.status
  }));
  persist();
  render();
}

function useMilestone(milestoneId: string): void {
  state.buildSession.milestoneId = milestoneId;
  state.milestones = state.milestones.map((milestone) => ({
    ...milestone,
    status:
      milestone.id === milestoneId
        ? milestone.status === 'done'
          ? 'done'
          : 'in-progress'
        : milestone.status === 'in-progress'
          ? 'not-started'
          : milestone.status
  }));
  state.currentStep = 'build';
  persist();
  render();
}

function completeCurrentMilestone(): void {
  const id = state.buildSession.milestoneId;
  if (id) {
    state.milestones = state.milestones.map((milestone) => ({
      ...milestone,
      status: milestone.id === id ? 'done' : milestone.status
    }));
  }
  state.currentStep = 'reflect';
  persist();
  render();
}

function attachHandlers(): void {
  const c = getCopy(state.language);

  document.querySelectorAll<HTMLElement>('[data-step]').forEach((element) => {
    element.addEventListener('click', () => {
      const step = element.dataset.step as StudioStep | undefined;
      if (step && STEP_ORDER.includes(step)) {
        setStep(step);
      }
    });
  });

  document
    .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      '[data-project-field]'
    )
    .forEach((field) => {
      const update = () => {
        const key = field.dataset.projectField as keyof StudioState['project'];
        if (!key) return;

        if (key === 'skillLevel') {
          const value = field.value;
          if (
            value === 'beginner' ||
            value === 'intermediate' ||
            value === 'advanced'
          ) {
            state.project.skillLevel = value;
          }
        } else {
          state.project[key] = field.value as never;
        }

        validationMessage = '';
        persist();
      };

      field.addEventListener('input', update);
      field.addEventListener('change', update);
    });

  document
    .querySelectorAll<HTMLTextAreaElement | HTMLSelectElement>(
      '[data-build-field]'
    )
    .forEach((field) => {
      const update = () => {
        const key = field.dataset.buildField as keyof StudioState['buildSession'];
        if (!key) return;

        state.buildSession[key] = field.value;
        persist();

        if (field.dataset.rerender === 'true') {
          render();
        }
      };

      field.addEventListener('input', update);
      field.addEventListener('change', update);
    });

  document
    .querySelectorAll<HTMLTextAreaElement>('[data-reflection-field]')
    .forEach((field) => {
      field.addEventListener('input', () => {
        const key = field.dataset
          .reflectionField as keyof StudioState['reflection'];
        if (!key) return;

        state.reflection[key] = field.value;
        persist();
      });
    });

  document
    .querySelectorAll<HTMLButtonElement>('[data-action]')
    .forEach((button) => {
      button.addEventListener('click', async () => {
        const action = button.dataset.action;

        if (action === 'sample') {
          loadSample();
          return;
        }

        if (action === 'reset') {
          resetProject();
          return;
        }

        if (action === 'generate-scope') {
          await generateScope();
          return;
        }

        if (action === 'create-milestones' && state.plan) {
          state.milestones = buildMilestones(
            state.project,
            state.plan,
            state.language
          );
          state.buildSession.milestoneId = state.milestones[0]?.id ?? '';
          state.currentStep = 'plan';
          persist();
          render();
          return;
        }

        if (action === 'set-status') {
          const milestoneId = button.dataset.milestone;
          const status = button.dataset.status as MilestoneStatus | undefined;
          if (
            milestoneId &&
            (status === 'not-started' ||
              status === 'in-progress' ||
              status === 'done')
          ) {
            updateMilestoneStatus(milestoneId, status);
          }
          return;
        }

        if (action === 'use-milestone') {
          const milestoneId = button.dataset.milestone;
          if (milestoneId) useMilestone(milestoneId);
          return;
        }

        if (action === 'copy-prompt') {
          await copyText(buildCodexPrompt(state));
          setToast(c.copied);
          return;
        }

        if (action === 'complete-current') {
          completeCurrentMilestone();
          return;
        }

        if (action === 'save-reflection') {
          state.currentStep = 'report';
          persist();
          render();
          return;
        }

        if (action === 'copy-report') {
          await copyText(buildLearningReport(state));
          setToast(c.copied);
          return;
        }

        if (action === 'download-report') {
          downloadMarkdown(
            reportFilename(state.project.title),
            buildLearningReport(state)
          );
        }
      });
    });
}

render();
