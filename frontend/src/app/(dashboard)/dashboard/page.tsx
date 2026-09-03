'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  Building2,
  Users,
  BedDouble,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

interface Stats {
  totalProperties: number;
  totalTenants: number;
  totalRooms: number;
  occupiedBeds: number;
  totalBeds: number;
  pendingPayments: number;
  openComplaints: number;
  monthlyRevenue: number;
  totalRentPending: number;
  totalRentDue: number;
  totalRentPaid: number;
  totalExpenses: number;
  occupancyRate: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [occupancy, setOccupancy] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/stats').then((res) => setStats(res.data.data)).catch(() => {
        setStats({
          totalProperties: 0,
          totalTenants: 0,
          totalRooms: 0,
          occupiedBeds: 0,
          totalBeds: 0,
          pendingPayments: 0,
          openComplaints: 0,
          monthlyRevenue: 0,
          totalRentPending: 0,
          totalRentDue: 0,
          totalRentPaid: 0,
          totalExpenses: 0,
          occupancyRate: 0,
        });
      }),
      api.get('/dashboard/occupancy').then((res) => setOccupancy(res.data.data)).catch(() => setOccupancy([])),
    ]).finally(() => setLoading(false));
  }, []);

  const occupancyRate =
    stats && stats.totalBeds > 0
      ? Math.round((stats.occupiedBeds / stats.totalBeds) * 100)
      : 0;

  const statCards = [
    {
      label: 'Properties',
      value: stats?.totalProperties ?? 0,
      icon: Building2,
      href: '/properties',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Tenants',
      value: stats?.totalTenants ?? 0,
      icon: Users,
      href: '/tenants',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Rooms',
      value: stats?.totalRooms ?? 0,
      icon: BedDouble,
      href: '/rooms',
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      label: 'Occupancy',
      value: `${occupancyRate}%`,
      icon: TrendingUp,
      href: '/rooms',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Pending Payments',
      value: stats?.pendingPayments ?? 0,
      icon: CreditCard,
      href: '/payments',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      label: 'Open Complaints',
      value: stats?.openComplaints ?? 0,
      icon: AlertTriangle,
      href: '/complaints',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Overview of your PG operations
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl bg-slate-200"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                href={card.href}
                className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
              >
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {card.value}
                  </p>
                </div>
                <div className={`rounded-lg ${card.bg} p-3`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Revenue & Expenses */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Monthly Revenue</h2>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            ₹{(stats?.monthlyRevenue ?? 0).toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-slate-500 mt-1">This month&apos;s collected rent</p>
          <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{
                width: `${Math.min(100, ((stats?.monthlyRevenue ?? 0) / Math.max(1, stats?.totalRentDue ?? 1)) * 100)}%`,
              }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-slate-500">
            <span>Collected</span>
            <span>Target: ₹{(stats?.totalRentDue ?? 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Rent Overview</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Total Due</span>
              <span className="font-semibold text-slate-900">₹{(stats?.totalRentDue ?? 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Total Paid</span>
              <span className="font-semibold text-emerald-600">₹{(stats?.totalRentPaid ?? 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Pending</span>
              <span className="font-semibold text-rose-600">₹{(stats?.totalRentPending ?? 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Total Expenses</span>
              <span className="font-semibold text-orange-600">₹{(stats?.totalExpenses ?? 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction href="/properties/new" label="Add Property" />
          <QuickAction href="/tenants/new" label="Add Tenant" />
          <QuickAction href="/payments/new" label="Record Payment" />
          <QuickAction href="/complaints/new" label="File Complaint" />
          <QuickAction href="/rent/new" label="Add Rent Record" />
          <QuickAction href="/expenses/new" label="Add Expense" />
          <QuickAction href="/rooms/new" label="Add Room" />
          <QuickAction href="/floors/new" label="Add Floor" />
        </div>
      </div>

      {/* Occupancy Breakdown */}
      {occupancy.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Occupancy by Property</h2>
          <div className="mt-4 space-y-4">
            {occupancy.map((prop) => (
              <div key={prop.propertyId}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{prop.propertyName}</span>
                  <span className="text-slate-500">
                    {prop.occupiedBeds} / {prop.totalBeds} beds · {prop.occupancyRate}%
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      prop.occupancyRate >= 80
                        ? 'bg-emerald-500'
                        : prop.occupancyRate >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${prop.occupancyRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
