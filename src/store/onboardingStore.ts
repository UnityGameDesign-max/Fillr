import { proxy } from "valtio";

export const onboardingStore = proxy({
  currentStep: 0,
  totalSteps: 5,
  slideIndex: 0,
  province: null as string | null,
  vehicle: null as {
    make: string;
    model: string;
    year: number;
    engine: string;
    fuelType: string;
    odometer: number;
  } | null,
  role: null as string | null,
  weeklyEarnings: null as number | null,
  earningsIncludesCashAndCard: false,
  targetProfit: null as {
    period: "daily" | "weekly" | "monthly";
    amount: number;
  } | null,
});

export default function StoreRoute() {
  return null;
}
