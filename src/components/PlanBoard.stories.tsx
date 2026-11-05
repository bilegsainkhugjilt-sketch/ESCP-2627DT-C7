// Dispatch board states (design.md §4): all proposed, partly approved, after a charger outage.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { approve, planDay, replan } from '../logic/planner';
import { contextFor } from '../state/store';
import { defaultScenario } from '../data/seedData';
import { PlanBoard } from './PlanBoard';

const ctx = contextFor(defaultScenario);
const proposed = planDay(ctx);
const partly = approve(proposed, ['J-01', 'J-04', 'J-07']);
const outageCtx = contextFor({ ...defaultScenario, chargerOutage: true });

const meta: Meta<typeof PlanBoard> = {
  title: 'Components/PlanBoard',
  component: PlanBoard,
  args: { ctx, assignments: proposed, selectedJobId: null, onSelect: () => {} },
};
export default meta;
type Story = StoryObj<typeof PlanBoard>;

export const AllProposed: Story = {};
export const PartlyApproved: Story = { args: { assignments: partly, selectedJobId: 'J-04' } };
export const AfterChargerOutage: Story = { args: { ctx: outageCtx, assignments: replan(approve(proposed, proposed.map((a) => a.jobId)), outageCtx) } };
