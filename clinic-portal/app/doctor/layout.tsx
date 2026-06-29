import DoctorNav from '@/components/DoctorNav';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DoctorNav />
      <main className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
