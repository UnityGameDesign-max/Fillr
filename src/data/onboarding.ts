import { FuelTypeOption, OnboardingPage, ProfitRanges, ProvinceOption, RoleOption } from "@/types/onboarding";

export const pages: OnboardingPage[] = [
  {
    title: "Welcome to Fillr",
    description: "Track fuel, boost profits & manage your driving smarter",
    image: require("../../assets/images/icon.png")
  },
  {
    title: "Track Every Drop",
    description: "Fillr monitors fuel consumption, cost-per-km, and helps you find savings. No more guessing, just smarter fuel management.",
    image: require("../../assets/illustrations/track-drop-illustration.png"),
  },
  {
    title: "Boost Your Earnings",
    description: "See true profits per trip, daily, weekly and monthly. Fillr calculates earnings vs fuel, maintenance, and tolls for data-driven decisions.",
    image: require("../../assets/illustrations/boost-profit-illustration.png"),
  },
  {
    title: "Drive Smarter, Spend Less",
    description: "Fillr suggests efficient routes and highlights driving habits that waste fuel — helping you cut costs and boost profits with every trip.",
    image: require("../../assets/illustrations/insights-illustration.png"),
  },
];

export const ROLES: RoleOption[] = [
  {
    id: "EHAILING",
    title: "Rideshare Driver",
    desc: "Best for drivers earning with e-hailing apps. Track income vs. fuel costs, route suggestions, and find the cheapest fuel.",
    iconName: "location",
    iconColor: "#F4B200",
    iconBg: "bg-yellow-100",
  },
  {
    id: "SOLO",
    title: "Regular Driver",
    desc: "Perfect for personal use. Monitor your daily commute, log fuel expenses, and gain driving insights to save money.",
    iconName: "car",
    iconColor: "#00AF54",
    iconBg: "bg-green-100",
  },
  {
    id: "FLEET",
    title: "Fleet Manager",
    desc: "Ideal for businesses. Oversee multiple vehicles, track fuel usage, and optimize routes for maximum efficiency.",
    iconName: "business",
    iconColor: "#007BFF",
    iconBg: "bg-blue-100",
    disabled: true,
  },
];

export const PROVINCES: ProvinceOption[] = [
  {
    id: "GAUTENG",
    name: "Gauteng",
    pricing: "Inland (Reef)",
    emoji: "🏔️",
  },
  {
    id: "WESTERN_CAPE",
    name: "Western Cape",
    pricing: "Coastal",
    emoji: "🌊",
  },
  {
    id: "KWAZULU_NATAL",
    name: "KwaZulu-Natal",
    pricing: "Coastal",
    emoji: "🌊",
  },
  {
    id: "EASTERN_CAPE",
    name: "Eastern Cape",
    pricing: "Coastal",
    emoji: "🌊",
  },
  {
    id: "LIMPOPO",
    name: "Limpopo",
    pricing: "Inland (Reef)",
    emoji: "🏔️",
  },
  {
    id: "MPUMALANGA",
    name: "Mpumalanga",
    pricing: "Inland (Reef)",
    emoji: "🏔️",
  },
  {
    id: "NORTH_WEST",
    name: "North West",
    pricing: "Inland (Reef)",
    emoji: "🏔️",
  },
  {
    id: "FREE_STATE",
    name: "Free State",
    pricing: "Inland (Reef)",
    emoji: "🏔️",
  },
  {
    id: "NORTHERN_CAPE",
    name: "Northern Cape",
    pricing: "Inland (Reef)",
    emoji: "🏔️",
  },
];

export const FUEL_TYPES: FuelTypeOption[] = [
  { id: "UNLEADED_93", name: "Unleaded 93", emoji: "⛽️" },
  { id: "UNLEADED_95", name: "Unleaded 95", emoji: "⛽️" },
  { id: "LRP_93", name: "LRP 93", emoji: "⛽️" },
  { id: "LRP_95", name: "LRP 95", emoji: "⛽️" },
  { id: "DIESEL_50PPM", name: "Diesel 50 PPM", emoji: "🛢️" },
  { id: "DIESEL_500PPM", name: "Diesel 500 PPM", emoji: "🛢️" },
];

export const PROFIT_RANGES: ProfitRanges = {
  daily: { min: 100, max: 5000, step: 50 },
  weekly: { min: 500, max: 35000, step: 250 },
  monthly: { min: 2000, max: 150000, step: 1000 },
};

export default function DataRoute() {
  return null;
}
