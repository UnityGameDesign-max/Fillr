export interface OnboardingPage {
  title: string;
  description: string;
  image: any;
}

export interface RoleOption {
  id: string;
  title: string;
  desc: string;
  iconName: any;
  iconColor: string;
  iconBg: string;
  disabled?: boolean;
}

export interface ProvinceOption {
  id: string;
  name: string;
  pricing: string;
  emoji: string;
}

export interface FuelTypeOption {
  id: string;
  name: string;
  emoji: string;
}

export type ProfitPeriod = "daily" | "weekly" | "monthly";

export interface ProfitRange {
  min: number;
  max: number;
  step: number;
}

export type ProfitRanges = Record<ProfitPeriod, ProfitRange>;
