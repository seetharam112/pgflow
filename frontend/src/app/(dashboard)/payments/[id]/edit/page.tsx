'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EditPaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    amount: '',
    method: 'CASH' as string,
    reference: '',
    status: 'COMPLETED' as string,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api
      .get(`/payments/${id}`)
      .then((res) => {
        const p = res.data.data;
        setForm({
          amount: String(p.amount),
          method: p.method,
          reference: p.reference || '',
          status: p.status,
        });
      })
      .catch(() => toast.error('Failed to load payment'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/payments/${id}`, {
        amount: form.amount ? Number(form.amount) : undefined,
        method: form.method,
        reference: form.reference || undefined,
        status: form.status,
      });
      toast.success('Payment updated');
      router.push('/payments');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update payment');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-96 animate-pulse rounded-xl bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/payments"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Payments
      </Link>

      <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-emerald-50 p-2">
            <CreditCard className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Edit Payment</h1>
            <p className="text-sm text-slate-500">Update payment details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Amount (₹)</label>
              <input
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Method</label>
              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Reference (optional)</label>
              <input
                name="reference"
                type="text"
                value={form.reference}
                onChange={handleChange}
                placeholder="Transaction ID or note"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/payments"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Update Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
