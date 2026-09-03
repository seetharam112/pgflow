'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { clearStoredAuth, getStoredAuth, isAuthenticated } from '@/lib/auth';
import {
  LayoutDashboard,
  Building2,
  BedDouble,
  Layers,
  Users,
  ClipboardList,
  MessageSquareWarning,
  CreditCard,
  Receipt,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/properties', label: 'Properties', icon: Building2 },
  { href: '/floors', label: 'Floors', icon: Layers },
  { href: '/rooms', label: 'Rooms & Beds', icon: BedDouble },
  { href: '/tenants', label: 'Tenants', icon: Users },
  { href: '/assignments', label: 'Assignments', icon: ClipboardList },
  { href: '/complaints', label: 'Complaints', icon: MessageSquareWarning },
  { href: '/payments', label: 'Payments', icon: CreditCard },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
  { href: '/rent', label: 'Rent', icon: Receipt },
  { href: '/organization', label: 'Organization', icon: Settings },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    const auth = getStoredAuth();
    setUserName(auth.user?.name || '');
  }, [router]);

  const handleLogout = () => {
    clearStoredAuth();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm">
            PG
          </div>
          <span className="text-lg font-bold text-slate-900">PGFlow</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <div className="flex items-center justify-between rounded-lg px-3 py-2">
            <div className="text-sm">
              <p className="font-medium text-slate-900">{userName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm">
              PG
            </div>
            <span className="text-lg font-bold text-slate-900">PGFlow</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                    active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
