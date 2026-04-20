import { requireAdmin } from "@/lib/authz";
import { auth0 } from "@/lib/auth0";
import AdminSideBar from "@/components/AdminSideBar";
import AdminTopNav from "@/components/AdminTopNav";

export default async function AdminLayout({
    children,
}: { children: React.ReactNode; }) {
    await requireAdmin();
    const session = await auth0.getSession();

    return(
        <div className="flex flex-col">
            <AdminTopNav />
            <div className="flex">
                <AdminSideBar />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}