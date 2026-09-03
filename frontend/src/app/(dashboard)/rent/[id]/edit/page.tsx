'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, Receipt } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EditRentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    amount: '',
    dueDate: '',
    month: '',
    year: '',
    status: 'PENDING' as string,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api
      .get(`/rent/${id}`)
      .then((res) => {
        const r = res.data.data;
        setForm({
          amount: String(r.amount),
          dueDate: r.dueDate ? new Date(r.dueDate).toISOString().slice(0, 10) : '',
          month: String(r.month),
          year: String(r.year),
          status: r.status,
        });
      })
      .catch(() => toast.error('Failed to load rent record'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/rent/${id}`, {
        amount: Number(form.amount),
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
        month: Number(form.month),
        year: Number(form.year),
        status: form.status,
      });
      toast.success('Rent record updated');
      router.push('/rent');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update rent record');
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
        href="/rent"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Rent Records
      </Link>

      <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-violet-50 p-2">
            <Receipt className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Edit Rent Record</h1>
            <p className="text-sm text-slate-500">Update rent details</p>
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
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Due Date</label>
              <input
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Month</label>
              <select
                name="month"
                value={form.month}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Year</label>
              <input
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                required
                min={2000}
                max={2100}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                <option value="PENDING">Pending</option>
                <option value="PARTIAL">Partial</option>
                <option value="PAID">Paid</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/rent"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Update Rent Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
