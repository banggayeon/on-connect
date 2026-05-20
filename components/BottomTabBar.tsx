"use client";

import Link from "next/link";
import { Heart, Home, MessageCircle, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/child/home", label: "홈", icon: Home },
  { href: "/child/signal", label: "안부", icon: MessageCircle },
  { href: "/child/care", label: "근황", icon: Heart },
  { href: "/child/settings", label: "설정", icon: Settings }
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "sticky",
        bottom: 0,
        marginTop: "24px",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "4px",
        background: "rgba(255,255,255,0.96)",
        borderRadius: "20px",
        padding: "6px",
        boxShadow: "0 -2px 24px rgba(61,36,25,0.08), 0 0 0 1px rgba(240,228,216,0.8)",
        backdropFilter: "blur(12px)"
      }}
    >
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              borderRadius: "16px",
              padding: "8px 4px",
              fontSize: "11px",
              fontWeight: active ? 600 : 500,
              color: active ? "white" : "#B07A5C",
              background: active ? "linear-gradient(135deg, #FF8A65, #E07856)" : "transparent",
              textDecoration: "none",
              boxShadow: active ? "0 4px 12px rgba(224,120,86,0.28)" : "none"
            }}
          >
            <Icon size={19} strokeWidth={active ? 2.5 : 2} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
