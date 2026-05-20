import { cn } from "@/lib/utils";

export function AppCard({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl bg-white p-4 shadow-card", className)}>
      {children}
    </section>
  );
}
