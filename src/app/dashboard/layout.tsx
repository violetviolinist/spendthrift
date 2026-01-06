import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";
import { Navbar } from "@/components/layout/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1 container py-6">{children}</main>
    </div>
  );
}
