import { FuelLog, FuelStation } from "@/types/fuel";

export const FUEL_LOGS: FuelLog[] = [
  {
    id: '1',
    cost: 'R 850.50',
    date: '26 Oct 2023, 09:30 AM',
    vehicle: 'Ford Ranger',
    station: 'Shell, Cape Town',
    volume: '40.5 L',
    pricePerLiter: 'R21.00/L',
    brandColor: '#F59E0B', // Shell Yellow/Orange
    logoType: 'shell',
  },
  {
    id: '2',
    cost: 'R 950.00',
    date: '25 Oct 2023, 08:15 AM',
    vehicle: 'Ford Ranger',
    station: 'Engen Highveld',
    volume: '45.2 L',
    pricePerLiter: 'R21.00/L',
    brandColor: '#1E3A8A', // Engen Blue
    logoType: 'engen',
  },
  {
    id: '3',
    cost: 'R 890.20',
    date: '24 Oct 2023, 05:45 PM',
    vehicle: 'Ford Ranger',
    station: 'BP, Sandton',
    volume: '42.0 L',
    pricePerLiter: 'R21.20/L',
    brandColor: '#15803D', // BP Green
    logoType: 'bp',
  },
];

export const FUEL_STATIONS: FuelStation[] = [
  { id: 'sasol', name: 'Sasol', color: '#009FDA', icon: 'gas-station' },
  { id: 'bp', name: 'BP', color: '#15803D', icon: 'flower' },
  { id: 'shell', name: 'Shell', color: '#F59E0B', icon: 'shell' },
  { id: 'engen', name: 'Engen', color: '#1E3A8A', icon: 'gas-station' },
  { id: 'caltex', name: 'Caltex', color: '#EF4444', icon: 'star' },
  { id: 'total', name: 'Total', color: '#F97316', icon: 'fire' },
];
