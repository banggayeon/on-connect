"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TemperatureRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/child/home/menu/temperature"); }, [router]);
  return null;
}
