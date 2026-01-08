export interface FuelLog {
  id: string;
  cost: string;
  date: string;
  vehicle: string;
  station: string;
  volume: string;
  pricePerLiter: string;
  brandColor: string;
  logoType: string;
}

export interface FuelStation {
  id: string;
  name: string;
  color: string;
  icon: string;
}
