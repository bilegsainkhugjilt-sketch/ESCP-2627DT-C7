import { Navigation } from './components/Navigation';
import { TopBar } from './components/TopBar';
import { Charging } from './pages/Charging';
import { DailyPlan } from './pages/DailyPlan';
import { FleetOverview } from './pages/FleetOverview';
import { Jobs } from './pages/Jobs';
import { WeeklyReport } from './pages/WeeklyReport';
import { useAppState } from './state/store';

export default function App() {
  const { state, dispatch, ctx } = useAppState();
  return (
    <div className="app">
      <Navigation current={state.page} onNavigate={(page) => dispatch({ type: 'navigate', page })} />
      <div className="main">
        <TopBar scenario={state.scenario} onReset={() => dispatch({ type: 'reset' })} />
        <main className="content" id="main">
          {state.page === 'fleet' && <FleetOverview ctx={ctx} assignments={state.assignments} />}
          {state.page === 'jobs' && <Jobs ctx={ctx} assignments={state.assignments} onGenerate={() => dispatch({ type: 'generate' })} />}
          {state.page === 'plan' && <DailyPlan state={state} ctx={ctx} dispatch={dispatch} />}
          {state.page === 'charging' && <Charging ctx={ctx} assignments={state.assignments} />}
          {state.page === 'report' && <WeeklyReport ctx={ctx} assignments={state.assignments} />}
        </main>
      </div>
    </div>
  );
}
