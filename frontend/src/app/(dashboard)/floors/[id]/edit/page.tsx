'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, Layers } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EditFloorPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    floorNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api
      .get(`/floors/${id}`)
      .then((res) => {
        const f = res.data.data;
        setForm({
          name: f.name,
          floorNumber: String(f.floorNumber),
        });
      })
      .catch(() => toast.error('Failed to load floor'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/floors/${id}`, {
        name: form.name,
        floorNumber: form.floorNumber ? Number(form.floorNumber) : undefined,
      });
      toast.success('Floor updated');
      router.push('/floors');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update floor');
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
        href="/floors"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Floors
      </Link>

      <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-indigo-50 p-2">
            <Layers className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Edit Floor</h1>
            <p className="text-sm text-slate-500">Update floor details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">Floor Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Floor Number</label>
            <input
              name="floorNumber"
              type="number"
              value={form.floorNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/floors"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Update Floor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
