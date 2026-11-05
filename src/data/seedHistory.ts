// One fictional past week (Mon–Wed of week 45) so the weekly report is not empty (product.md §2.2).
import type { HistoryDay } from '../types/domain';

export const history: HistoryDay[] = [
  {
    date: 'Mon 2 Nov',
    trucks: [
      { truckId: 'E-01', km: 236, tollKm: 170, possibleKm: 270 },
      { truckId: 'E-02', km: 48, tollKm: 12, possibleKm: 150 },
      { truckId: 'E-03', km: 180, tollKm: 130, possibleKm: 240 },
      { truckId: 'E-04', km: 120, tollKm: 60, possibleKm: 160 },
      { truckId: 'E-05', km: 150, tollKm: 110, possibleKm: 230 },
      { truckId: 'D-01', km: 320, tollKm: 290 },
      { truckId: 'D-02', km: 260, tollKm: 220 },
      { truckId: 'D-03', km: 140, tollKm: 70 },
    ],
  },
  {
    date: 'Tue 3 Nov',
    trucks: [
      { truckId: 'E-01', km: 210, tollKm: 160, possibleKm: 265 },
      { truckId: 'E-02', km: 60, tollKm: 15, possibleKm: 155 },
      { truckId: 'E-03', km: 205, tollKm: 150, possibleKm: 240 },
      { truckId: 'E-04', km: 95, tollKm: 40, possibleKm: 160 },
      { truckId: 'E-05', km: 120, tollKm: 80, possibleKm: 225 },
      { truckId: 'D-01', km: 340, tollKm: 300 },
      { truckId: 'D-02', km: 290, tollKm: 250 },
      { truckId: 'D-03', km: 0, tollKm: 0 },
    ],
  },
  {
    date: 'Wed 4 Nov',
    trucks: [
      { truckId: 'E-01', km: 250, tollKm: 190, possibleKm: 270 },
      { truckId: 'E-02', km: 52, tollKm: 10, possibleKm: 150 },
      { truckId: 'E-03', km: 190, tollKm: 140, possibleKm: 235 },
      { truckId: 'E-04', km: 130, tollKm: 70, possibleKm: 160 },
      { truckId: 'E-05', km: 160, tollKm: 120, possibleKm: 230 },
      { truckId: 'D-01', km: 300, tollKm: 270 },
      { truckId: 'D-02', km: 310, tollKm: 280 },
      { truckId: 'D-03', km: 0, tollKm: 0 },
    ],
  },
];
