import { childProfile, parentProfile, relationshipTemperature } from "@/lib/mockData";

export const gradients = {
  warm: "",
  warmSoft: "",
  cream: "",
  honey: "",
  leaf: "",
  sky: ""
};

export const family = {
  childName: childProfile.name,
  parentName: parentProfile.name,
  warmth: relationshipTemperature.valueText,
  birthday: parentProfile.birthday.dateText
};
