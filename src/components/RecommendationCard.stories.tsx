// RecommendationCard in every state (design.md §3.1): proposed, break charge, not electric, approved, overridden, replaces.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { jobs, trucks } from '../data/seedData';
import type { Assignment } from '../types/domain';
import { RecommendationCard } from './RecommendationCard';

const job = (id: string) => jobs.find((j) => j.id === id)!;
const truck = (id: string) => trucks.find((t) => t.id === id)!;

const proposed: Assignment = {
  jobId: 'J-04', truckId: 'E-03', driverId: 'DR-3', status: 'proposed', reason: 'fits',
  explanation: 'E-03 can do this: needs 182 kWh, has 236 kWh above the 15% reserve, so it arrives with 28% left.',
  reserveAfterPercent: 28,
};

const meta: Meta<typeof RecommendationCard> = {
  title: 'Components/RecommendationCard',
  component: RecommendationCard,
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
  args: { job: job('J-04'), truck: truck('E-03'), distanceKm: 148, assignment: proposed, onApprove: () => {}, onReassign: () => {} },
};
export default meta;
type Story = StoryObj<typeof RecommendationCard>;

export const Proposed: Story = {};

export const FeasibleWithBreakCharge: Story = {
  args: {
    job: job('J-02'), truck: truck('E-03'), distanceKm: 104,
    assignment: {
      jobId: 'J-02', truckId: 'E-03', driverId: 'DR-3', status: 'proposed', reason: 'fits-with-break-charge',
      explanation: "E-03 can do this with a 45-min charge during the driver's break (+90 kWh, 12:53–13:38); it arrives with 19% left.",
      breakCharge: { chargerId: 'CH-P', start: '12:53', end: '13:38', energyKWh: 90, endsAfterShift: false },
    },
  },
};

export const ChargeEndsAfterShift: Story = {
  args: {
    job: job('J-08'), truck: truck('E-05'), distanceKm: 58,
    assignment: {
      jobId: 'J-08', truckId: 'E-05', driverId: 'DR-5', status: 'proposed', reason: 'fits-with-break-charge',
      explanation: "E-05 can do this with a 45-min charge during the driver's break (+90 kWh, 16:30–17:15); it arrives with 22% left.",
      breakCharge: { chargerId: 'CH-P', start: '16:30', end: '17:15', energyKWh: 90, endsAfterShift: true },
    },
  },
};

export const NotElectric: Story = {
  args: {
    job: job('J-07'), truck: truck('D-01'), distanceKm: 330,
    assignment: {
      jobId: 'J-07', truckId: 'D-01', driverId: 'DR-6', status: 'proposed', reason: 'diesel',
      explanation: 'No e-truck can do this safely: it needs 445 kWh; the best available has 295 kWh above the reserve (even with a 45-min break charge). Assigned to diesel D-01.',
    },
  },
};

export const Approved: Story = {
  args: { assignment: { ...proposed, status: 'approved' }, onApprove: undefined },
};

export const ChangedByDispatcher: Story = {
  args: {
    truck: truck('D-02'),
    assignment: { ...proposed, truckId: 'D-02', status: 'overridden', reason: 'diesel', explanation: 'Changed by dispatcher. Diesel D-02.' },
    onApprove: undefined,
  },
};

export const ReplacesApprovedAfterDisruption: Story = {
  args: {
    job: job('J-02'), truck: truck('D-02'), distanceKm: 104,
    assignment: {
      jobId: 'J-02', truckId: 'D-02', driverId: 'DR-7', status: 'proposed', reason: 'diesel',
      replaces: 'Replaces approved E-03',
      explanation: 'Replaces approved E-03 (no longer feasible: now needs 125 kWh but has only 54 kWh above the reserve). Assigned to diesel D-02.',
    },
  },
};
