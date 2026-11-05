// TruckPanel states (design.md §4): electric with a plan, electric without a plan, diesel.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { defaultScenario, trucks } from '../data/seedData';
import { planDay } from '../logic/planner';
import { contextFor } from '../state/store';
import { TruckPanel } from './TruckPanel';

const ctx = contextFor(defaultScenario);
const plan = planDay(ctx);
const truck = (id: string) => trucks.find((t) => t.id === id)!;

const meta: Meta<typeof TruckPanel> = {
  title: 'Components/TruckPanel',
  component: TruckPanel,
  decorators: [(Story) => <div style={{ width: 360, background: 'var(--color-surface)' }}><Story /></div>],
  args: { ctx, sessions: [], onClose: () => {} },
};
export default meta;
type Story = StoryObj<typeof TruckPanel>;

export const ElectricWithPlan: Story = { args: { truck: truck('E-03'), assignments: plan, week: { truck: truck('E-03'), drivenKm: 575, possibleKm: 715, underUsed: false } } };
export const ElectricNoPlan: Story = { args: { truck: truck('E-02'), assignments: [] } };
export const Diesel: Story = { args: { truck: truck('D-01'), assignments: plan } };
