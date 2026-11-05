// Stories for the basic components in design.md §3 — one story per state.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, KpiTile, PowertrainTag, RangeBar, StatusBadge, truckStatusBadge } from './ui';

const meta: Meta = { title: 'Components/Basics' };
export default meta;
type Story = StoryObj;

export const Buttons: Story = {
  render: () => (
    <div className="row">
      <Button variant="primary">Primary</Button>
      <Button>Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="primary" disabled>Disabled</Button>
      <Button aria-pressed>Toggled on</Button>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="row">{truckStatusBadge('available')}{truckStatusBadge('charging')}{truckStatusBadge('maintenance')}</div>
      <div className="row">
        <StatusBadge>Unassigned</StatusBadge>
        <StatusBadge tone="accent">Proposed</StatusBadge>
        <StatusBadge tone="dark">Approved</StatusBadge>
        <StatusBadge tone="success">Feasible</StatusBadge>
        <StatusBadge tone="warning">Feasible with break charge</StatusBadge>
        <StatusBadge tone="danger">Not electric</StatusBadge>
        <StatusBadge tone="warning">Under-used</StatusBadge>
      </div>
    </div>
  ),
};

export const PowertrainTags: Story = {
  render: () => <div className="row"><PowertrainTag powertrain="electric" /><PowertrainTag powertrain="diesel" /></div>,
};

export const RangeBarNormal: Story = {
  name: 'RangeBar / Normal',
  render: () => <RangeBar socPercent={71} reservePercent={15} rangeKm={211} low={false} />,
};

export const RangeBarLow: Story = {
  name: 'RangeBar / Low',
  render: () => <RangeBar socPercent={34} reservePercent={15} rangeKm={60} low />,
};

export const KpiTiles: Story = {
  render: () => (
    <div className="tiles">
      <KpiTile value="2,486 km" label="driven electric" sub="of 4,446 km fleet total" />
      <KpiTile highlight value="56%" label="of fleet km electric" sub="target: +20% vs baseline" />
      <KpiTile value="€ 545" label="toll saved (est.)" sub="German rate by weight class" />
      <KpiTile value="€ 306" label="energy cost vs diesel (est.)" />
    </div>
  ),
};
