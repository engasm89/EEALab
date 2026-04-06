"use client";

import { useEffect } from "react";
import { captureFirstTouchAttribution } from "@/lib/analytics/attribution";

export function AttributionBootstrap() {
  useEffect(() => {
    captureFirstTouchAttribution();
  }, []);
  return null;
}

