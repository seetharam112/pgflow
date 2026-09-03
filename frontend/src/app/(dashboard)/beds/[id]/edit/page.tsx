'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { Loader2, ArrowLeft } from 'lucide-react';

interface Bed {
  id: string;
  bedNumber: string;
  monthlyRent: number | null;
  status: string;
}

export default function EditBedPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [bedNumber, setBedNumber] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [status, setStatus] = useState('AVAILABLE');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api
      .get(`/beds/${id}`)
      .then((res) => {
        const b: Bed = res.data.data;
        setBedNumber(b.bedNumber);
        setMonthlyRent(b.monthlyRent?.toString() || '');
        setStatus(b.status);
      })
      .catch(() => {
        toast.error('Failed to load bed');
        router.push('/rooms');
      })
      .finally(() => setFetching(false));
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body: any = { bedNumber, status };
      if (monthlyRent) body.monthlyRent = Number(monthlyRent);
      await api.put(`/beds/${id}`, body);
      toast.success('Bed updated');
      router.push('/rooms');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update bed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <Link href="/rooms" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" />
        Back to rooms
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">Edit Bed</h1>
      <p className="text-sm text-slate-500 mt-1">Update bed details</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="bedNumber" className="block text-sm font-medium text-slate-700">Bed Number / Label</label>
          <input
            id="bedNumber"
            type="text"
            required
            value={bedNumber}
            onChange={(e) => setBedNumber(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="monthlyRent" className="block text-sm font-medium text-slate-700">Monthly Rent (₹)</label>
          <input
            id="monthlyRent"
            type="number"
            min={0}
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Bed'}
          </button>
          <Link href="/rooms" className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
