import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MobileTabBar from "@/components/layout/mobile-tab-bar";

export default function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}
