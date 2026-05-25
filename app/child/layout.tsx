import { SelectedParentProvider } from "@/contexts/SelectedParentContext";

export default function ChildLayout({ children }: { children: React.ReactNode }) {
  return <SelectedParentProvider>{children}</SelectedParentProvider>;
}
