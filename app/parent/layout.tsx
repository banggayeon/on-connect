import { FontSizeProvider } from "@/contexts/FontSizeContext";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return <FontSizeProvider>{children}</FontSizeProvider>;
}
