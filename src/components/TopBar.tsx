import { useState } from 'react';
import { DEPOT, TODAY } from '../data/seedData';
import type { Scenario } from '../types/domain';
import { Button, StatusBadge } from './ui';

/** Date, scenario and Reset demo (NFR-12). Reset asks for confirmation inline. */
export function TopBar({ scenario, onReset }: { scenario: Scenario; onReset: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const events = [
    scenario.delayedJobId && `Road closure on ${scenario.delayedJobId}`,
    scenario.chargerOutage && 'Public charger outage',
  ].filter(Boolean) as string[];
  return (
    <header className="topbar">
      <div className="meta">
        <span>{TODAY}</span>
        <span aria-hidden="true">·</span>
        <span>{DEPOT}</span>
        <span aria-hidden="true">·</span>
        <span>{scenario.temperatureC} °C</span>
        {events.map((e) => <StatusBadge key={e} tone="warning">{e}</StatusBadge>)}
      </div>
      {confirming ? (
        <div className="row" role="group" aria-label="Confirm reset">
          <span className="small">Reset all plans and scenarios?</span>
          <Button variant="danger" onClick={() => { onReset(); setConfirming(false); }}>Yes, reset demo</Button>
          <Button onClick={() => setConfirming(false)}>Cancel</Button>
        </div>
      ) : (
        <Button onClick={() => setConfirming(true)}>Reset demo</Button>
      )}
    </header>
  );
}
