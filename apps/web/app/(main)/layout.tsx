import BottomNav from "@/components/BottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <div>{children}</div>
      <BottomNav />
    </div>
  );
}
