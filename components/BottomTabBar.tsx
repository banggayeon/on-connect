"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/child/home",     label: "홈" },
  { href: "/child/signal",   label: "안부" },
  { href: "/child/care",     label: "근황" },
  { href: "/child/settings", label: "설정" }
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "sticky",
        bottom: 0,
        marginTop: "16px",
        display: "flex",
        gap: "6px",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#FAF6EE",
        borderTop: "1px solid #F0E7D7",
        padding: "12px 16px 28px"
      }}
    >
      {tabs.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: active ? 700 : 500,
              color: active ? "#241E1A" : "#8A6B5C",
              background: active ? "#F1E5C8" : "transparent",
              textDecoration: "none",
              letterSpacing: "-0.01em"
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
