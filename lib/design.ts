import { childProfile, parentProfile, relationshipTemperature } from "@/lib/mockData";

export const gradients = {
  warm: "bg-gradient-to-br from-coral-400 to-coral-500",
  warmSoft: "bg-gradient-to-br from-coral-300 to-coral-400",
  cream: "bg-gradient-to-b from-[#FFEDE0] via-cream-50 to-white",
  honey: "bg-gradient-to-b from-honey-100 to-cream-50",
  leaf: "bg-gradient-to-b from-leaf-100 to-cream-50",
  sky: "bg-gradient-to-b from-sky-100 to-cream-50"
};

export const family = {
  childName: childProfile.name,
  parentName: parentProfile.name,
  warmth: relationshipTemperature.valueText,
  birthday: parentProfile.birthday.dateText
};
