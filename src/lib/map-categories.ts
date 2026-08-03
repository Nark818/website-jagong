import { Church, GraduationCap, HeartPulse, Home, Landmark, UserRound, type LucideIcon } from "lucide-react";

export type MapCategory =
  | "pemerintahan"
  | "pendidikan"
  | "kesehatan"
  | "ibadah"
  | "rumah_rt_rw"
  | "rumah_ketua_rw";

export const MAP_CATEGORIES: {
  value: MapCategory;
  label: string;
  color: string;
  icon: LucideIcon;
}[] = [
  { value: "pemerintahan", label: "Sarana Pemerintahan", color: "#077390", icon: Landmark },
  { value: "pendidikan", label: "Sarana Pendidikan", color: "#166534", icon: GraduationCap },
  { value: "kesehatan", label: "Sarana Kesehatan", color: "#DC2626", icon: HeartPulse },
  { value: "ibadah", label: "Sarana Ibadah", color: "#B45309", icon: Church },
  { value: "rumah_rt_rw", label: "Rumah RT/RW", color: "#6C5A42", icon: Home },
  { value: "rumah_ketua_rw", label: "Rumah Ketua RW", color: "#A8926F", icon: UserRound },
];

export function getMapCategory(value: string) {
  return MAP_CATEGORIES.find((c) => c.value === value) ?? MAP_CATEGORIES[0];
}
