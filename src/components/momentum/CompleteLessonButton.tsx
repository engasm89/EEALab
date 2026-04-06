"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CompleteLessonButton({ lessonId }: { lessonId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function complete() {
    setLoading(true);
    try {
      await fetch("/api/momentum/lesson-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, status: "COMPLETED" }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" disabled={loading} onClick={complete}>
      Mark lesson complete
    </Button>
  );
}
