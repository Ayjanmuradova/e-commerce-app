import { getSessionUser } from "@/lib/authz";
import { redirect } from "next/navigation";
import StoreShell from "@/components/layout/store-shell";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login");
  return <StoreShell>{children}</StoreShell>;
}
