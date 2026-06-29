'use client';
import { Bell, User } from 'lucide-react';

export default function Header({ title }: { title: string }) {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <h1 className="text-xl font-bold text-slate-900">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
            <User size={15} className="text-white" />
          </div>
          <span className="text-sm font-medium text-slate-700">Admin</span>
        </div>
      </div>
    </header>
  );
}
