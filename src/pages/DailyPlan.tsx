// A3 Daily plan — core screen (US-03, US-04, US-05, US-07; FR-06–FR-13, FR-17, FR-18).
import { useState } from 'react';
import { PlanBoard } from '../components/PlanBoard';
import { RecommendationCard } from '../components/RecommendationCard';
import { ReassignDialog } from '../components/ReassignDialog';
import { Button, PageHead } from '../components/ui';
import { planSummary } from '../logic/kpis';
import type { PlanContext } from '../logic/planner';
import { effectiveDistanceKm } from '../logic/range';
import type { Action, AppState } from '../state/store';
import type { Assignment } from '../types/domain';

export function DailyPlan({ state, ctx, dispatch }: { state: AppState; ctx: PlanContext; dispatch: (a: Action) => void }) {
  const [reassigning, setReassigning] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const { assignments, scenario } = state;
  const s = planSummary(assignments, ctx);
  const start = (a: Assignment) => ctx.jobs.find((j) => j.id === a.jobId)!.windowStart;
  const byTime = (a: Assignment, b: Assignment) => start(a).localeCompare(start(b));
  const proposed = assignments.filter((a) => a.status === 'proposed').sort(byTime);
  const settled = assignments.filter((a) => a.status !== 'proposed').sort(byTime);
  const approvable = proposed.filter((a) => a.truckId).map((a) => a.jobId);

  const select = (jobId: string) => {
    setSelected(jobId);
    document.getElementById(`decision-${jobId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (!state.planGenerated) {
    return (
      <>
        <PageHead title="Daily plan" sub="No plan for today yet." />
        <div className="empty">
          <h2>Plan today's {ctx.jobs.length} jobs across the whole fleet</h2>
          <p>VoltLane gives each job, longest first, to the electric truck that can just manage it above its safety reserve. Diesels take the rest. Nothing is final until you approve it.</p>
          <Button variant="primary" onClick={() => dispatch({ type: 'generate' })}>Generate plan</Button>
        </div>
      </>
    );
  }

  const row = (a: Assignment, actions: boolean) => {
    const j = ctx.jobs.find((x) => x.id === a.jobId)!;
    return (
      <RecommendationCard
        key={a.jobId}
        assignment={a}
        job={j}
        truck={ctx.trucks.find((t) => t.id === a.truckId)}
        distanceKm={effectiveDistanceKm(j, ctx.scenario)}
        selected={selected === a.jobId}
        onApprove={actions && a.truckId ? () => dispatch({ type: 'approve', jobIds: [a.jobId] }) : undefined}
        onReassign={() => setReassigning(a.jobId)}
      />
    );
  };

  const job = reassigning ? ctx.jobs.find((j) => j.id === reassigning)! : null;

  return (
    <>
      <PageHead
        title="Daily plan"
        sub="Check each proposal, then approve it or move the job to another truck."
        actions={<Button variant="primary" disabled={approvable.length === 0} onClick={() => dispatch({ type: 'approve', jobIds: approvable })}>Approve all {approvable.length}</Button>}
      />

      <div className="summary">
        <div className="figure"><b>{Math.round(s.electricShare * 100)}%</b><span>of today's km electric</span></div>
        <div className="figure"><b>{s.electricJobs} of {s.jobs}</b><span>jobs on electric trucks</span></div>
        <div className="figure"><b>{s.proposed}</b><span>waiting for your decision</span></div>
        <div className="tests row" role="group" aria-label="Test a disruption">
          <span className="small muted">Test a disruption</span>
          <Button
            aria-pressed={scenario.delayedJobId === 'J-01'}
            onClick={() => dispatch({ type: 'scenario', patch: { delayedJobId: scenario.delayedJobId ? null : 'J-01' }, label: scenario.delayedJobId ? 'Road reopened' : 'Road closure on J-01 adds 40 km' })}
          >Road closure on J-01</Button>
          <Button
            aria-pressed={scenario.chargerOutage}
            onClick={() => dispatch({ type: 'scenario', patch: { chargerOutage: !scenario.chargerOutage }, label: scenario.chargerOutage ? 'Public charger back in service' : 'Public charger out of service' })}
          >Charger outage</Button>
          <Button
            aria-pressed={scenario.temperatureC <= -5}
            onClick={() => dispatch({ type: 'scenario', patch: { temperatureC: scenario.temperatureC <= -5 ? 4 : -5 }, label: scenario.temperatureC <= -5 ? 'Back to 4 °C' : 'Cold day at −5 °C' })}
          >Cold day, −5 °C</Button>
        </div>
      </div>

      <div aria-live="polite">
        {state.notice && (
          <div className="banner row" style={{ justifyContent: 'space-between' }}>
            <span>{state.notice}</span>
            <Button variant="ghost" onClick={() => dispatch({ type: 'dismiss' })}>Dismiss</Button>
          </div>
        )}
      </div>

      <PlanBoard assignments={assignments} ctx={ctx} selectedJobId={selected} onSelect={select} />

      <section className="decisions" aria-labelledby="h-decide">
        <h2 id="h-decide">Waiting for your decision ({proposed.length})</h2>
        {proposed.length === 0 && <p className="empty-line">Every job is approved. Test a disruption above to see how VoltLane re-plans.</p>}
        {proposed.map((a) => row(a, true))}
      </section>

      <section className="decisions" aria-labelledby="h-approved">
        <h2 id="h-approved">Approved ({settled.length})</h2>
        {settled.length === 0 && <p className="empty-line">Approved jobs move here and turn solid on the board.</p>}
        {settled.map((a) => row(a, false))}
      </section>

      <p className="footnote">
        Energy figures come from a simple rule (distance × consumption, adjusted for load and temperature), not a validated range model. See the README for every assumption.
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
