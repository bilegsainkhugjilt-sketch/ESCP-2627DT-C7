// App state: one reducer, persisted in localStorage, with Reset demo (NFR-12).
import { useEffect, useMemo, useReducer } from 'react';
import { chargers, defaultScenario, drivers, jobs, trucks } from '../data/seedData';
import { applyReassign, approve, replan, type PlanContext } from '../logic/planner';
import type { Assignment, Scenario } from '../types/domain';

export type PageId = 'fleet' | 'jobs' | 'plan' | 'charging' | 'report';

export interface AppState {
  page: PageId;
  scenario: Scenario;
  assignments: Assignment[];
  planGenerated: boolean;
  notice: string | null;
}

export type Action =
  | { type: 'navigate'; page: PageId }
  | { type: 'generate' }
  | { type: 'approve'; jobIds: string[] }
  | { type: 'reassign'; jobId: string; truckId: string }
  | { type: 'scenario'; patch: Partial<Scenario>; label: string }
  | { type: 'dismiss' }
  | { type: 'reset' };

const STORAGE_KEY = 'voltlane-demo-v1';

export const initialState: AppState = {
  page: 'fleet',
  scenario: defaultScenario,
  assignments: [],
  planGenerated: false,
  notice: null,
};

export function contextFor(scenario: Scenario): PlanContext {
  return {
    trucks,
    jobs,
    drivers,
    chargers: chargers.map((c) => (c.kind === 'public' ? { ...c, available: !scenario.chargerOutage } : c)),
    scenario,
  };
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'navigate':
      return { ...state, page: action.page };
    case 'generate': {
      const ctx = contextFor(state.scenario);
      return { ...state, assignments: replan(state.assignments, ctx), planGenerated: true, page: 'plan', notice: null };
    }
    case 'approve':
      return { ...state, assignments: approve(state.assignments, action.jobIds), notice: null };
    case 'reassign': {
      const ctx = contextFor(state.scenario);
      return { ...state, assignments: applyReassign(state.assignments, action.jobId, action.truckId, ctx), notice: null };
    }
    case 'scenario': {
      const scenario = { ...state.scenario, ...action.patch };
      if (!state.planGenerated) return { ...state, scenario, notice: `${action.label}. Generate a plan to see the effect.` };
      const next = replan(state.assignments, contextFor(scenario));
      const replaced = next.filter((a) => a.replaces).length;
      const notice = replaced > 0
        ? `${action.label}. ${replaced} approved ${replaced === 1 ? 'job no longer works' : 'jobs no longer work'}; VoltLane proposed a replacement for each. Review them below.`
        : `${action.label}. Every approved job still works; open proposals were updated.`;
      return { ...state, scenario, assignments: next, notice };
    }
    case 'dismiss':
      return { ...state, notice: null };
    case 'reset':
      return { ...initialState };
  }
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...initialState, ...JSON.parse(raw) } : initialState;
  } catch {
    return initialState;
  }
}

export function useAppState() {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable: the demo still works for this session */
    }
  }, [state]);
  const ctx = useMemo(() => contextFor(state.scenario), [state.scenario]);
  return { state, dispatch, ctx };
}
