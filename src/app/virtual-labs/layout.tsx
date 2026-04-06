import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { VirtualLabsShell } from "@/components/layout/VirtualLabsShell";

export const metadata: Metadata = {
  title: "VirtualLabs — Interactive STEM Labs",
  description: "Discover, run, and publish interactive labs for STEM education",
};

export default function VirtualLabsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Providers>
      <VirtualLabsShell>{children}</VirtualLabsShell>
    </Providers>
  );
}
