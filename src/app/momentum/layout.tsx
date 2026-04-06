import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { MomentumShell } from "@/components/layout/MomentumShell";

export const metadata: Metadata = {
  title: "Kaizen Momentum — Engineering Growth OS",
  description:
    "Daily rituals, project labs, and structured paths for embedded, IoT, and robotics learners. Small continuous progress.",
};

export default function MomentumLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Providers>
      <MomentumShell>{children}</MomentumShell>
    </Providers>
  );
}
