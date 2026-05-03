import Navbar from "@/components/layout/navbar";
export default function StoreLayout({
    children,
}:{ children: React.ReactNode;})
{
    return(
        <>
        <Navbar />
        <div className="min-h-screen bg-slate-50">
        {children}
        </div>
        </>
    );
}