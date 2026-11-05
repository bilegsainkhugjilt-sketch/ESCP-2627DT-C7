// A1 Fleet overview (US-01, FR-01–FR-03).
import { PageHead, PowertrainTag, RangeBar, truckStatusBadge } from '../components/ui';
import { WEIGHT_CLASS_LABEL } from '../data/constants';
import type { PlanContext } from '../logic/planner';
import { predictedRangeKm } from '../logic/range';
import type { Assignment } from '../types/domain';

export function FleetOverview({ ctx, assignments }: { ctx: PlanContext; assignments: Assignment[] }) {
  const electric = ctx.trucks.filter((t) => t.powertrain === 'electric');
  const brands = new Set(electric.map((t) => t.brand)).size;
  return (
    <>
      <PageHead
        title="Fleet overview"
        sub={`${ctx.trucks.length} trucks: ${electric.length} electric from ${brands} brands and ${ctx.trucks.length - electric.length} diesel.`}
      />
      <div className="table-wrap">
        <table>
          <caption className="sr-only">Trucks with battery level and predicted range</caption>
          <thead>
            <tr>
              <th scope="col">Truck</th>
              <th scope="col">Brand</th>
              <th scope="col">Powertrain</th>
              <th scope="col">Weight class</th>
              <th scope="col">Capacity</th>
              <th scope="col">Battery / predicted range</th>
              <th scope="col">Status</th>
              <th scope="col">Jobs today</th>
            </tr>
          </thead>
          <tbody>
            {ctx.trucks.map((t) => {
              const range = predictedRangeKm(t, ctx.scenario);
              const jobs = assignments.filter((a) => a.truckId === t.id).map((a) => a.jobId);
              return (
                <tr key={t.id}>
                  <td className="id">{t.name}</td>
                  <td>{t.brand}</td>
                  <td><PowertrainTag powertrain={t.powertrain} /></td>
                  <td>{WEIGHT_CLASS_LABEL[t.weightClass]}</td>
                  <td>{(t.capacityKg / 1000).toFixed(1).replace(/\.0$/, '')} t</td>
                  <td>
                    {t.powertrain === 'electric'
                      ? <RangeBar socPercent={t.socPercent!} reservePercent={t.reservePercent!} rangeKm={range} low={t.socPercent! < 40} />
                      : <span className="muted">—</span>}
                  </td>
                  <td>{truckStatusBadge(t.status)}</td>
                  <td>{jobs.length ? jobs.join(', ') : <span className="muted">none</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="footnote">
        Range is an estimate for an empty truck at {ctx.scenario.temperatureC} °C, counting only the charge above the 15% safety reserve (black marker). Heavier loads and colder weather shorten it. All trucks and figures are fictional.
      </p>
    </>
  );
}
