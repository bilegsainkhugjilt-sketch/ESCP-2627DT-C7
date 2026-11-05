import type { PageId } from '../state/store';

export const PAGES: { id: PageId; label: string; key: string }[] = [
  { id: 'fleet', label: 'Fleet', key: 'A1' },
  { id: 'jobs', label: 'Jobs', key: 'A2' },
  { id: 'plan', label: 'Daily plan', key: 'A3' },
  { id: 'charging', label: 'Charging', key: 'A4' },
  { id: 'report', label: 'Weekly report', key: 'A5' },
];

/** Sidebar navigation (design.md §3, product.md §4.1). */
export function Navigation({ current, onNavigate }: { current: PageId; onNavigate: (p: PageId) => void }) {
  return (
    <nav className="sidebar" aria-label="Main">
      <div className="logo">VoltLane<span>Electric-first planning · prototype</span></div>
      <ul className="nav">
        {PAGES.map((p) => (
          <li key={p.id}>
            <button aria-current={current === p.id ? 'page' : undefined} onClick={() => onNavigate(p.id)}>
              {p.label}{' '}<span className="key">{p.key}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="sidebar-foot">All data is fictional. No external APIs. ESCP Digital Transformation, Group C7.</p>
    </nav>
  );
}
