"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RoleRedirect({ fallback, defaultHref }: { fallback?: ReactNode; defaultHref?: string }) {
  const router = useRouter();

  useEffect(() => {
    const role = window.localStorage.getItem("role");

    if (role === "parent") {
      router.replace("/parent/home");
      return;
    }

    if (role === "child") {
      router.replace("/child/home");
      return;
    }

    if (defaultHref) {
      router.replace(defaultHref);
    }
  }, [defaultHref, router]);

  return fallback ?? null;
}
