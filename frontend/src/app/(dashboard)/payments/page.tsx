'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Plus, CreditCard, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  reference?: string;
  rent: { month: string; year: number; tenant: { name: string } | null } | null;
  paidAt: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api
      .get('/payments')
      .then((res) => setPayments(res.data.data))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this payment record?')) return;
    try {
      await api.delete(`/payments/${id}`);
      setPayments((prev) => prev.filter((p) => p.id !== id));
      toast.success('Payment deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete payment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
          <p className="text-sm text-slate-500 mt-1">Track rent payments</p>
        </div>
        <Link
          href="/payments/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Record Payment
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-slate-500">No payments recorded yet.</p>
          <Link
            href="/payments/new"
            className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Record your first payment
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-50 p-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {p.rent?.tenant?.name ?? 'Unknown'} · {p.method}
                  </p>
                  <p className="text-xs text-slate-400">
                    {p.rent ? `${p.rent.month} ${p.rent.year}` : 'N/A'} · {new Date(p.paidAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    p.status === 'COMPLETED'
                      ? 'bg-emerald-50 text-emerald-700'
                      : p.status === 'REFUNDED'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {p.status.toLowerCase()}
                </span>
                <button
                  onClick={() => router.push(`/payments/${p.id}/edit`)}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
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
