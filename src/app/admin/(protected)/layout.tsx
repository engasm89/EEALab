import { requireAdminRole } from "@/lib/auth/admin";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdminRole();
  return <AdminShell>{children}</AdminShell>;
}

