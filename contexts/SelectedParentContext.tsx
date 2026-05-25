"use client";

import { createContext, useContext, useState } from "react";
import { demoDataset, demoMother, demoFather } from "@/lib/demoDataset";
import type { DemoParentProfile } from "@/lib/types";

type ParentId = "parent_mother" | "parent_father";

interface SelectedParentContextType {
  selectedParentId: ParentId;
  setSelectedParentId: (id: ParentId) => void;
  parentProfile: DemoParentProfile;
}

const SelectedParentContext = createContext<SelectedParentContextType | null>(null);

export function SelectedParentProvider({ children }: { children: React.ReactNode }) {
  const [selectedParentId, setSelectedParentId] = useState<ParentId>("parent_mother");

  const parentProfile: DemoParentProfile =
    selectedParentId === "parent_mother" ? demoMother : demoFather;

  return (
    <SelectedParentContext.Provider value={{ selectedParentId, setSelectedParentId, parentProfile }}>
      {children}
    </SelectedParentContext.Provider>
  );
}

export function useSelectedParent() {
  const ctx = useContext(SelectedParentContext);
  if (!ctx) throw new Error("useSelectedParent must be used within SelectedParentProvider");
  return ctx;
}
