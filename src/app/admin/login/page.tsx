import { AdminLoginClient } from "@/components/admin/AdminLoginClient";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next && params.next.startsWith("/") ? params.next : "/admin";
  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <AdminLoginClient nextPath={next} />
    </div>
  );
}

