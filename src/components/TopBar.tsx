import { useState } from 'react';
import { DEPOT, TODAY } from '../data/seedData';
import type { Scenario } from '../types/domain';
import { Button, StatusBadge } from './ui';

/** Where and when the dispatcher is planning, active test scenarios, and Reset demo (NFR-12). */
export function TopBar({ scenario, onReset }: { scenario: Scenario; onReset: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const events = [
    scenario.delayedJobId && `Road closure on ${scenario.delayedJobId}`,
    scenario.chargerOutage && 'Public charger out of service',
  ].filter(Boolean) as string[];
  return (
    <header className="topbar">
      <div className="where">
        <strong>{DEPOT}</strong>
        <span className="muted">{TODAY}</span>
        <span className="muted">{scenario.temperatureC} °C</span>
        {events.map((e) => <StatusBadge key={e} tone="warning">{e}</StatusBadge>)}
      </div>
      {confirming ? (
        <div className="row" role="group" aria-label="Confirm reset">
          <span className="small">Clear all plans and tests?</span>
          <Button variant="danger" onClick={() => { onReset(); setConfirming(false); }}>Reset demo</Button>
          <Button onClick={() => setConfirming(false)}>Keep</Button>
        </div>
      ) : (
        <Button onClick={() => setConfirming(true)}>Reset demo</Button>
      )}
    </header>
  );
}
