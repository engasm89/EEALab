import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "VirtualLabs — Interactive STEM Labs",
  description: "Discover, run, and publish interactive labs for STEM education",
};

export default function VirtualLabsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Providers>{children}</Providers>;
}
