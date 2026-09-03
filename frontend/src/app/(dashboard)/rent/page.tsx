'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Plus, Receipt, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Rent {
  id: string;
  amount: number;
  month: string;
  year: number;
  dueDate: string;
  status: string;
  tenant: { name: string } | null;
}

export default function RentPage() {
  const [rents, setRents] = useState<Rent[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api
      .get('/rent')
      .then((res) => setRents(res.data.data))
      .catch(() => setRents([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this rent record?')) return;
    try {
      await api.delete(`/rent/${id}`);
      setRents((prev) => prev.filter((r) => r.id !== id));
      toast.success('Rent record deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete rent record');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rent Records</h1>
          <p className="text-sm text-slate-500 mt-1">Manage monthly rent dues</p>
        </div>
        <Link
          href="/rent/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Rent
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : rents.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-slate-500">No rent records yet.</p>
          <Link
            href="/rent/new"
            className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Add your first rent record
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {rents.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-50 p-2">
                  <Receipt className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    ₹{r.amount.toLocaleString('en-IN')}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {r.tenant?.name ?? 'Unknown'} · {r.month} {r.year}
                  </p>
                  <p className="text-xs text-slate-400">
                    Due {new Date(r.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    r.status === 'PAID'
                      ? 'bg-emerald-50 text-emerald-700'
                      : r.status === 'PENDING'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {r.status.toLowerCase()}
                </span>
                <button
                  onClick={() => router.push(`/rent/${r.id}/edit`)}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
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
