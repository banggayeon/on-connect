"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const parentTabs = [
  { label: "홈",        path: "/parent/home" },
  { label: "오늘의 질문", path: "/parent/question" },
  { label: "설정",      path: "/parent/settings" }
];

const TAB_BAR_PATHS = ["/parent/home", "/parent/question", "/parent/settings"];

export function ParentTabBar() {
  const pathname = usePathname();

  if (!TAB_BAR_PATHS.includes(pathname)) return null;

  return (
    <nav
      style={{
        position: "sticky",
        bottom: 0,
        marginTop: "24px",
        display: "flex",
        gap: "8px",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#FAF6EE",
        borderTop: "1px solid #F0E7D7",
        padding: "14px 14px 28px"
      }}
    >
      {parentTabs.map(({ label, path }) => {
        const active = pathname === path;
        return (
          <Link
            key={path}
            href={path}
            style={{
              flex: 1,
              height: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "999px",
              fontSize: "var(--parent-font-caption, 16px)",
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
