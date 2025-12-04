import { proxy } from "valtio";

export const onboardingStore = proxy({
  currentStep: 0,
  totalSteps: 3,
  slideIndex: 0,
});
