// A2 Today's jobs (US-02, FR-04, FR-05).
import { useState } from 'react';
import { Button, PageHead, StatusBadge } from '../components/ui';
import type { PlanContext } from '../logic/planner';
import { effectiveDistanceKm } from '../logic/range';
import type { Assignment } from '../types/domain';

type SortKey = 'distance' | 'window';

export function Jobs({ ctx, assignments, onGenerate }: { ctx: PlanContext; assignments: Assignment[]; onGenerate: () => void }) {
  const [sort, setSort] = useState<SortKey>('distance');
  const rows = [...ctx.jobs].sort((a, b) =>
    sort === 'distance'
      ? effectiveDistanceKm(b, ctx.scenario) - effectiveDistanceKm(a, ctx.scenario)
      : a.windowStart.localeCompare(b.windowStart),
  );
  const totalKm = ctx.jobs.reduce((s, j) => s + effectiveDistanceKm(j, ctx.scenario), 0);

  return (
    <>
      <PageHead
        title="Today's jobs"
        sub={`${ctx.jobs.length} jobs · ${Math.round(totalKm).toLocaleString('en-GB')} km in total · sorted by ${sort === 'distance' ? 'distance (longest first)' : 'time window'}`}
        actions={
          <>
            <Button aria-pressed={sort === 'distance'} onClick={() => setSort('distance')}>Sort by distance</Button>
            <Button aria-pressed={sort === 'window'} onClick={() => setSort('window')}>Sort by time window</Button>
            <Button variant="primary" onClick={onGenerate}>{assignments.length ? 'Re-plan open jobs →' : 'Generate plan →'}</Button>
          </>
        }
      />
      <div className="table-wrap">
        <table>
          <caption className="sr-only">Jobs for today</caption>
          <thead>
            <tr>
              <th scope="col">Job</th>
              <th scope="col">Route (fictional)</th>
              <th scope="col">km</th>
              <th scope="col">Toll-road km</th>
              <th scope="col">Load</th>
              <th scope="col">Stops</th>
              <th scope="col">Time window</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((j) => {
              const a = assignments.find((x) => x.jobId === j.id);
              const km = effectiveDistanceKm(j, ctx.scenario);
              return (
                <tr key={j.id}>
                  <td><strong>{j.id}</strong></td>
                  <td>{j.route}</td>
                  <td>{km}{km !== j.distanceKm && <span className="small" style={{ color: 'var(--color-warning)' }}> (+detour)</span>}</td>
                  <td>{j.tollRoadKm}</td>
                  <td>{(j.payloadKg / 1000).toFixed(1)} t</td>
                  <td>{j.stops}</td>
                  <td>{j.windowStart}–{j.windowEnd}</td>
                  <td>
                    {!a && <StatusBadge>Unassigned</StatusBadge>}
                    {a?.status === 'proposed' && <StatusBadge tone="accent">Proposed{a.truckId ? ` · ${a.truckId}` : ''}</StatusBadge>}
                    {a && a.status !== 'proposed' && <StatusBadge tone="dark">Approved · {a.truckId}</StatusBadge>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="footnote">Jobs and customers are fictional seed data. Distances are round trips from the depot.</p>
    </>
  );
}
