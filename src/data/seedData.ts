// Fictional seed data for one working day (product.md §2.2). No real companies, people or data.
import type { Charger, Driver, Job, Scenario, Truck } from '../types/domain';

export const TODAY = 'Thursday 5 November 2026';
export const TODAY_SHORT = 'Thu 5 Nov';
export const DEPOT = 'Depot Dortmund';

export const trucks: Truck[] = [
  { id: 'E-01', name: 'E-01', brand: 'Brand A', powertrain: 'electric', weightClass: 'heavy', batteryKWh: 440, socPercent: 82, reservePercent: 15, efficiencyKWhPerKm: 1.1, capacityKg: 24000, status: 'available', driverId: 'DR-1' },
  { id: 'E-02', name: 'E-02', brand: 'Brand B', powertrain: 'electric', weightClass: 'medium', batteryKWh: 200, socPercent: 34, reservePercent: 15, efficiencyKWhPerKm: 0.6, capacityKg: 5000, status: 'available', driverId: 'DR-2' },
  { id: 'E-03', name: 'E-03', brand: 'Brand A', powertrain: 'electric', weightClass: 'heavy', batteryKWh: 421, socPercent: 71, reservePercent: 15, efficiencyKWhPerKm: 1.065, capacityKg: 24000, status: 'available', driverId: 'DR-3' },
  { id: 'E-04', name: 'E-04', brand: 'Brand B', powertrain: 'electric', weightClass: 'medium', batteryKWh: 160, socPercent: 90, reservePercent: 15, efficiencyKWhPerKm: 0.6, capacityKg: 5000, status: 'available', driverId: 'DR-4' },
  { id: 'E-05', name: 'E-05', brand: 'Brand A', powertrain: 'electric', weightClass: 'heavy', batteryKWh: 443, socPercent: 56, reservePercent: 15, efficiencyKWhPerKm: 1.1, capacityKg: 24000, status: 'available', driverId: 'DR-5' },
  { id: 'D-01', name: 'D-01', brand: 'Brand A', powertrain: 'diesel', weightClass: 'heavy', capacityKg: 25000, status: 'available', driverId: 'DR-6' },
  { id: 'D-02', name: 'D-02', brand: 'Brand B', powertrain: 'diesel', weightClass: 'heavy', capacityKg: 25000, status: 'available', driverId: 'DR-7' },
  { id: 'D-03', name: 'D-03', brand: 'Brand A', powertrain: 'diesel', weightClass: 'medium', capacityKg: 5500, status: 'maintenance', driverId: 'DR-8' },
];

export const jobs: Job[] = [
  { id: 'J-01', customer: 'Customer Alpha', route: 'Dortmund → Essen → Dortmund', distanceKm: 132, tollRoadKm: 100, payloadKg: 14000, stops: 3, windowStart: '06:30', windowEnd: '10:30' },
  { id: 'J-02', customer: 'Customer Bravo', route: 'Dortmund → Gelsenkirchen → Dortmund', distanceKm: 104, tollRoadKm: 80, payloadKg: 9000, stops: 2, windowStart: '11:30', windowEnd: '15:00' },
  { id: 'J-03', customer: 'Customer Charlie', route: 'Dortmund → Unna → Hamm → Dortmund', distanceKm: 118, tollRoadKm: 70, payloadKg: 4100, stops: 5, windowStart: '07:30', windowEnd: '12:00' },
  { id: 'J-04', customer: 'Customer Delta', route: 'Dortmund → Bochum → Dortmund', distanceKm: 148, tollRoadKm: 110, payloadKg: 12000, stops: 3, windowStart: '07:00', windowEnd: '11:00' },
  { id: 'J-05', customer: 'Customer Echo', route: 'Dortmund city round', distanceKm: 50, tollRoadKm: 10, payloadKg: 3200, stops: 8, windowStart: '12:30', windowEnd: '16:30' },
  { id: 'J-06', customer: 'Customer Foxtrot', route: 'Dortmund → Hagen → Witten → Dortmund', distanceKm: 196, tollRoadKm: 140, payloadKg: 10000, stops: 4, windowStart: '11:00', windowEnd: '17:00' },
  { id: 'J-07', customer: 'Customer Golf', route: 'Dortmund → Kassel → Dortmund', distanceKm: 330, tollRoadKm: 310, payloadKg: 20000, stops: 2, windowStart: '06:00', windowEnd: '13:30' },
  { id: 'J-08', customer: 'Customer Hotel', route: 'Dortmund → Lünen → Dortmund', distanceKm: 58, tollRoadKm: 30, payloadKg: 7600, stops: 2, windowStart: '15:30', windowEnd: '17:00' },
];

export const drivers: Driver[] = [
  { id: 'DR-1', name: 'Driver 1', shiftStart: '06:00', shiftEnd: '17:30' },
  { id: 'DR-2', name: 'Driver 2', shiftStart: '06:00', shiftEnd: '17:30' },
  { id: 'DR-3', name: 'Driver 3', shiftStart: '06:00', shiftEnd: '17:30' },
  { id: 'DR-4', name: 'Driver 4', shiftStart: '06:00', shiftEnd: '17:30' },
  { id: 'DR-5', name: 'Driver 5', shiftStart: '05:30', shiftEnd: '17:00' },
  { id: 'DR-6', name: 'Driver 6', shiftStart: '05:30', shiftEnd: '17:00' },
  { id: 'DR-7', name: 'Driver 7', shiftStart: '05:30', shiftEnd: '17:00' },
  { id: 'DR-8', name: 'Driver 8', shiftStart: '06:00', shiftEnd: '17:30' },
];

export const chargers: Charger[] = [
  { id: 'CH-D', name: 'Depot Dortmund (4 × 150 kW)', kind: 'depot', powerKw: 150, pricePerKWh: 0.24, available: true },
  { id: 'CH-P', name: 'Public truck hub A1 (fictional)', kind: 'public', powerKw: 120, pricePerKWh: 0.49, available: true },
];

export const defaultScenario: Scenario = { temperatureC: 4, delayedJobId: null, chargerOutage: false };
