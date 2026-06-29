import PortalNav from '@/components/PortalNav';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <PortalNav />
      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
