// Foundations / Tokens page (design.md §2, §4): colours with contrast, type scale, spacing.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Navigation } from './Navigation';

const colours: [string, string][] = [
  ['--color-bg', 'Page background'], ['--color-surface', 'Cards, tables'], ['--color-surface-subtle', 'Table headers'],
  ['--color-surface-inverse', 'Sidebar, approved'], ['--color-text', 'Main text'], ['--color-text-muted', 'Secondary text (6.0 : 1)'],
  ['--color-accent', 'Lime accent — background only'], ['--color-success', 'Feasible (5.9 : 1)'], ['--color-warning', 'Needs attention (5.9 : 1)'],
  ['--color-danger', 'Not electric (6.5 : 1)'], ['--color-focus', 'Focus ring (5.5 : 1)'],
];

const meta: Meta = { title: 'Foundations/Tokens' };
export default meta;
type Story = StoryObj;

export const Colours: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {colours.map(([v, use]) => (
        <div key={v} className="panel" style={{ padding: 12 }}>
          <div style={{ height: 56, borderRadius: 8, background: `var(${v})`, border: '1px solid var(--color-border)' }} />
          <code className="small">{v}</code>
          <span className="small muted">{use}</span>
        </div>
      ))}
    </div>
  ),
};

export const TypeScale: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      <span style={{ fontSize: 'var(--font-size-kpi)', fontWeight: 700 }}>40 · KPI number</span>
      <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>28 · Page title</span>
      <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>20 · Section title</span>
      <span style={{ fontSize: 'var(--font-size-md)' }}>16 · Body</span>
      <span style={{ fontSize: 'var(--font-size-sm)' }}>14 · Tables and cards</span>
      <span style={{ fontSize: 'var(--font-size-xs)' }}>12 · Badges and footnotes</span>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
        <div key={n} className="row"><code className="small" style={{ width: 80 }}>--space-{n}</code>
          <div style={{ height: 12, width: `var(--space-${n})`, background: 'var(--color-surface-inverse)' }} /></div>
      ))}
    </div>
  ),
};

export const SidebarNavigation: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <div style={{ height: 480, display: 'flex' }}><Navigation current="plan" onNavigate={() => {}} /></div>,
};
