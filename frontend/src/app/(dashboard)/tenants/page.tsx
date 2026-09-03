'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { Plus, Phone, Mail, Pencil, Trash2 } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  room: { roomNumber: string } | null;
  bed: { bedNumber: string } | null;
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/tenants')
      .then((res) => setTenants(res.data.data))
      .catch(() => setTenants([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tenant?')) return;
    try {
      await api.delete(`/tenants/${id}`);
      setTenants((prev) => prev.filter((t) => t.id !== id));
      toast.success('Tenant deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete tenant');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tenants</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your tenants</p>
        </div>
        <Link
          href="/tenants/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Tenant
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : tenants.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-slate-500">No tenants yet.</p>
          <Link
            href="/tenants/new"
            className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Add your first tenant
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tenants.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
            >
              <div>
                <h3 className="font-semibold text-slate-900">{t.name}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {t.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {t.phone}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {t.room ? `Room ${t.room.roomNumber}` : 'No room'} ·{' '}
                  {t.bed ? `Bed ${t.bed.bedNumber}` : 'No bed'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    t.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700'
                      : t.status === 'INACTIVE'
                      ? 'bg-slate-50 text-slate-600'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {t.status.toLowerCase()}
                </span>
                <Link
                  href={`/tenants/${t.id}/edit`}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
