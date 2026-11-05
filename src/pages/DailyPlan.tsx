// A3 Daily plan — core screen (US-03, US-04, US-05, US-07; FR-06–FR-13, FR-17, FR-18).
import { useState } from 'react';
import { RecommendationCard } from '../components/RecommendationCard';
import { ReassignDialog } from '../components/ReassignDialog';
import { Button, PageHead } from '../components/ui';
import { planSummary } from '../logic/kpis';
import type { PlanContext } from '../logic/planner';
import { effectiveDistanceKm } from '../logic/range';
import type { Action, AppState } from '../state/store';

export function DailyPlan({ state, ctx, dispatch }: { state: AppState; ctx: PlanContext; dispatch: (a: Action) => void }) {
  const [reassigning, setReassigning] = useState<string | null>(null);
  const { assignments, scenario } = state;
  const s = planSummary(assignments, ctx);
  const byTime = (a: { jobId: string }, b: { jobId: string }) =>
    ctx.jobs.find((j) => j.id === a.jobId)!.windowStart.localeCompare(ctx.jobs.find((j) => j.id === b.jobId)!.windowStart);
  const proposed = assignments.filter((a) => a.status === 'proposed').sort(byTime);
  const settled = assignments.filter((a) => a.status !== 'proposed').sort(byTime);
  const approvable = proposed.filter((a) => a.truckId).map((a) => a.jobId);

  const scenarioControls = (
    <div className="row" role="group" aria-label="Simulate a disruption">
      <span className="small muted" style={{ fontWeight: 600 }}>Simulate:</span>
      <Button
        aria-pressed={scenario.delayedJobId === 'J-01'}
        onClick={() => dispatch({ type: 'scenario', patch: { delayedJobId: scenario.delayedJobId ? null : 'J-01' }, label: scenario.delayedJobId ? 'Road closure lifted' : 'Road closure on J-01 (+40 km detour)' })}
      >Road closure on J-01</Button>
      <Button
        aria-pressed={scenario.chargerOutage}
        onClick={() => dispatch({ type: 'scenario', patch: { chargerOutage: !scenario.chargerOutage }, label: scenario.chargerOutage ? 'Public charger back online' : 'Public charger outage' })}
      >Public charger outage</Button>
      <Button
        aria-pressed={scenario.temperatureC <= -5}
        onClick={() => dispatch({ type: 'scenario', patch: { temperatureC: scenario.temperatureC <= -5 ? 4 : -5 }, label: scenario.temperatureC <= -5 ? 'Back to 4 °C' : 'Cold day (−5 °C)' })}
      >Cold day −5 °C</Button>
    </div>
  );

  if (!state.planGenerated) {
    return (
      <>
        <PageHead title="Daily plan" sub="No plan yet for today." />
        <div className="empty">
          <strong>VoltLane proposes a plan for the whole mixed fleet. Nothing is final until you approve it.</strong>
          <span className="muted small">Jobs are matched longest first to the e-truck that can just manage them; diesels take the rest.</span>
          <Button variant="primary" onClick={() => dispatch({ type: 'generate' })}>Generate plan</Button>
        </div>
      </>
    );
  }

  const job = reassigning ? ctx.jobs.find((j) => j.id === reassigning)! : null;

  return (
    <>
      <PageHead
        title="Daily plan"
        sub={`${s.electricJobs} of ${s.jobs} jobs electric · ${Math.round(s.electricShare * 100)}% of km electric · ${s.approved} approved · ${s.proposed} to review`}
        actions={<Button variant="primary" disabled={approvable.length === 0} onClick={() => dispatch({ type: 'approve', jobIds: approvable })}>Approve all proposals ({approvable.length})</Button>}
      />
      {scenarioControls}
      <div aria-live="polite">
        {state.notice && (
          <div className="banner row" style={{ justifyContent: 'space-between' }}>
            <span>{state.notice}</span>
            <Button variant="ghost" onClick={() => dispatch({ type: 'dismiss' })} aria-label="Dismiss message">Dismiss</Button>
          </div>
        )}
      </div>
      <div className="columns">
        <section className="column" aria-labelledby="col-proposed">
          <h2 id="col-proposed">Proposed — needs your approval ({proposed.length})</h2>
          {proposed.length === 0 && <div className="empty small muted">Nothing to review. All jobs are approved.</div>}
          {proposed.map((a) => {
            const j = ctx.jobs.find((x) => x.id === a.jobId)!;
            return (
              <RecommendationCard
                key={a.jobId}
                assignment={a}
                job={j}
                truck={ctx.trucks.find((t) => t.id === a.truckId)}
                distanceKm={effectiveDistanceKm(j, ctx.scenario)}
                onApprove={a.truckId ? () => dispatch({ type: 'approve', jobIds: [a.jobId] }) : undefined}
                onReassign={() => setReassigning(a.jobId)}
              />
            );
          })}
        </section>
        <section className="column" aria-labelledby="col-approved">
          <h2 id="col-approved">Approved ({settled.length})</h2>
          {settled.length === 0 && <div className="empty small muted">Approved assignments appear here.</div>}
          {settled.map((a) => {
            const j = ctx.jobs.find((x) => x.id === a.jobId)!;
            return (
              <RecommendationCard
                key={a.jobId}
                assignment={a}
                job={j}
                truck={ctx.trucks.find((t) => t.id === a.truckId)}
                distanceKm={effectiveDistanceKm(j, ctx.scenario)}
                onReassign={() => setReassigning(a.jobId)}
              />
            );
          })}
        </section>
      </div>
      <p className="footnote">
        Dashed = proposed by VoltLane · Dark = approved by you · Solid outline = changed by you · Red = not electric. Energy figures are estimates from a simple rule (see README), not a validated range model.
      </p>
      {job && (
        <ReassignDialog
          job={job}
          assignments={assignments}
          ctx={ctx}
          onClose={() => setReassigning(null)}
          onAssign={(truckId) => { dispatch({ type: 'reassign', jobId: job.id, truckId }); setReassigning(null); }}
        />
      )}
    </>
  );
}
