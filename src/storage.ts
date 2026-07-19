import {
  createEmptyState,
  type Language,
  type StudioState
} from './types';

const STORAGE_KEY = 'vibecoding-business-studio:v2';

function isLanguage(value: unknown): value is Language {
  return value === 'en';
}

export function detectLanguage(): Language {
  return 'en';
}

export function loadState(fallbackLanguage: Language): StudioState {
  const empty = createEmptyState(fallbackLanguage);

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;

    const parsed = JSON.parse(raw) as Partial<StudioState>;
    if (parsed.version !== 2) return empty;

    return {
      ...empty,
      ...parsed,
      language: isLanguage(parsed.language) ? parsed.language : fallbackLanguage,
      project: {
        ...empty.project,
        ...(parsed.project ?? {})
      },
      buildSession: {
        ...empty.buildSession,
        ...(parsed.buildSession ?? {})
      },
      reflection: {
        ...empty.reflection,
        ...(parsed.reflection ?? {})
      },
      milestones: Array.isArray(parsed.milestones) ? parsed.milestones : [],
      plan: parsed.plan ?? null,
      coach: parsed.coach ?? null
    };
  } catch {
    return empty;
  }
}

export function saveState(state: StudioState): void {
  const next: StudioState = {
    ...state,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
