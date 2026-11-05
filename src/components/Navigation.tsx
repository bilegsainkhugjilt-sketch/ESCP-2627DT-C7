import type { PageId } from '../state/store';

export const PAGES: { id: PageId; label: string; key: string }[] = [
  { id: 'fleet', label: 'Fleet', key: 'A1' },
  { id: 'jobs', label: 'Jobs', key: 'A2' },
  { id: 'plan', label: 'Daily plan', key: 'A3' },
  { id: 'charging', label: 'Charging', key: 'A4' },
  { id: 'report', label: 'Weekly report', key: 'A5' },
];

/** Sidebar navigation (design.md §3, product.md §4.1). Screen IDs A1–A5 are kept as tooltips. */
export function Navigation({ current, onNavigate }: { current: PageId; onNavigate: (p: PageId) => void }) {
  return (
    <nav className="sidebar" aria-label="Main">
      <div className="brand">
        <div className="wordmark">Volt<span>Lane</span></div>
        {/* lane marking: solid edge line + dashed centre line, the dashes in charge lime */}
        <svg width="112" height="8" viewBox="0 0 112 8" aria-hidden="true">
          <rect x="0" y="0" width="112" height="1.5" fill="var(--color-text-muted)" />
          {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={i * 20} y="5" width="12" height="3" fill="var(--color-charge)" />)}
        </svg>
      </div>
      <ul className="nav">
        {PAGES.map((p) => (
          <li key={p.id}>
            <button aria-current={current === p.id ? 'page' : undefined} title={`Screen ${p.key}`} onClick={() => onNavigate(p.id)}>
              {p.label}
            </button>
          </li>
        ))}
      </ul>
      <p className="sidebar-foot">Prototype with fictional data. No live connections.</p>
    </nav>
  );
}
