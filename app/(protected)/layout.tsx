import { getSessionUser } from "@/lib/authz";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: { children: React.ReactNode;

 }) {
    const  user = await getSessionUser();

    if (!user){
        redirect("/auth/login");
    }
    return<>{children}</>;
}