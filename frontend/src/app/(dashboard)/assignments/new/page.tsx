'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { Loader2, ArrowLeft, BedDouble, Users } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  phone: string;
  assignments: { id: string }[];
}

interface Bed {
  id: string;
  bedNumber: string;
  status: string;
  room: {
    roomNumber: string;
    floor: {
      name: string;
      property: { name: string };
    };
  };
}

export default function NewAssignmentPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [availableBeds, setAvailableBeds] = useState<Bed[]>([]);
  const [tenantId, setTenantId] = useState('');
  const [bedId, setBedId] = useState('');
  const [rent, setRent] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/tenants').then((res) => res.data.data),
      api.get('/properties').then((res) => res.data.data),
    ])
      .then(([tenantList, propertyList]) => {
        const unassigned = tenantList.filter((t: Tenant) => t.assignments.length === 0);
        setTenants(unassigned);
        if (unassigned.length > 0) setTenantId(unassigned[0].id);

        const beds: Bed[] = [];
        for (const prop of propertyList) {
          for (const floor of prop.floors || []) {
            for (const room of floor.rooms || []) {
              for (const bed of room.beds || []) {
                if (bed.status === 'AVAILABLE') {
                  beds.push({
                    ...bed,
                    room: {
                      roomNumber: room.roomNumber,
                      floor: {
                        name: floor.name,
                        property: { name: prop.name },
                      },
                    },
                  });
                }
              }
            }
          }
        }
        setAvailableBeds(beds);
        if (beds.length > 0) setBedId(beds[0].id);
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setFetching(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/assignments/move-in', {
        tenantId,
        bedId,
        rent: Number(rent),
        startDate: new Date(startDate).toISOString(),
      });
      toast.success('Tenant moved in successfully');
      router.push('/assignments');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to move in tenant');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-96 animate-pulse rounded-xl bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/assignments"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assignments
      </Link>

      <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-emerald-50 p-2">
            <BedDouble className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">New Assignment</h1>
            <p className="text-sm text-slate-500">Move a tenant into a bed</p>
          </div>
        </div>

        {tenants.length === 0 ? (
          <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
            No unassigned tenants available.{' '}
            <Link href="/tenants/new" className="font-medium underline">
              Add a tenant first
            </Link>
          </div>
        ) : availableBeds.length === 0 ? (
          <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
            No available beds. Please add rooms/beds or free up existing ones.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="tenant" className="block text-sm font-medium text-slate-700">
                Tenant
              </label>
              <div className="relative mt-1">
                <Users className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <select
                  id="tenant"
                  required
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.phone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="bed" className="block text-sm font-medium text-slate-700">
                Bed
              </label>
              <div className="relative mt-1">
                <BedDouble className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <select
                  id="bed"
                  required
                  value={bedId}
                  onChange={(e) => setBedId(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  {availableBeds.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.room.floor.property.name} · {b.room.floor.name} · Room {b.room.roomNumber} · Bed {b.bedNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="rent" className="block text-sm font-medium text-slate-700">
                Monthly Rent (₹)
              </label>
              <input
                id="rent"
                type="number"
                required
                min={1}
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                placeholder="8000"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-slate-700">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/assignments"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Move In'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
