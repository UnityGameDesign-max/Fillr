export interface TripSummary {
  id: string;
  label: string;
  from: string;
  to: string;
  distanceKm: number;
  durationMin: number;
  estCost: number;
  note: string;
}

export interface TripDetail {
  id: string;
  distanceKm: number;
  durationLabel: string;
  cost: number;
  insight: string;
  fuelConsumedL: number;
  efficiencyLPer100km: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  startLabel: string;
  startAddress: string;
  startTime: string;
  endLabel: string;
  endAddress: string;
  endTime: string;
}
