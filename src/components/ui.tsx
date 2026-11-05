// Small shared components (design.md §3): Button, StatusBadge, PowertrainTag, RangeBar, KpiTile.
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { Truck } from '../types/domain';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

export function Button({ variant = 'secondary', className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const v = variant === 'secondary' ? '' : `btn-${variant}`;
  return <button type="button" className={`btn ${v} ${className}`.trim()} {...rest} />;
}

export type BadgeTone = 'neutral' | 'accent' | 'dark' | 'success' | 'warning' | 'danger';

/** Status always as text, never colour alone (NFR-02). */
export function StatusBadge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function PowertrainTag({ powertrain }: { powertrain: Truck['powertrain'] }) {
  return powertrain === 'electric'
    ? <StatusBadge tone="accent">Electric</StatusBadge>
    : <StatusBadge tone="neutral">Diesel</StatusBadge>;
}

export function truckStatusBadge(status: Truck['status']) {
  if (status === 'available') return <StatusBadge tone="success">Available</StatusBadge>;
  if (status === 'charging') return <StatusBadge tone="warning">Charging</StatusBadge>;
  return <StatusBadge tone="neutral">Maintenance</StatusBadge>;
}

/** Battery level with reserve marker and predicted range (US-01, FR-02, FR-03). */
export function RangeBar({ socPercent, reservePercent, rangeKm, low }: { socPercent: number; reservePercent: number; rangeKm: number; low: boolean }) {
  return (
    <div className="range">
      <div className="range-track" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={socPercent} aria-label={`Battery ${socPercent}%`}>
        <div className={`range-fill ${low ? 'low' : ''}`} style={{ width: `${socPercent}%` }} />
        <div className="range-reserve" style={{ left: `${reservePercent}%` }} title={`${reservePercent}% safety reserve`} />
      </div>
      <span className={`range-text ${low ? 'low' : ''}`}>
        {socPercent}% · ~{Math.round(rangeKm)} km predicted (estimate){low ? ' · low' : ''}
      </span>
    </div>
  );
}

export function KpiTile({ value, label, sub, highlight = false }: { value: string; label: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`tile ${highlight ? 'tile-highlight' : ''}`}>
      <span className="value">{value}</span>
      <span className="label">{label}</span>
      {sub && <span className="sub">{sub}</span>}
    </div>
  );
}

export function PageHead({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {actions && <div className="row">{actions}</div>}
    </div>
  );
}
