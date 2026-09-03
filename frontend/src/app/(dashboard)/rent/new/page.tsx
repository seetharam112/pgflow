'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { Loader2, ArrowLeft } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
}

interface Assignment {
  id: string;
  tenant: Tenant;
  bed: { room: { roomNumber: string }; bedNumber: string };
}

export default function NewRentPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentId, setAssignmentId] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/assignments/active').then((res) => {
      setAssignments(res.data.data);
      if (res.data.data.length > 0) {
        setAssignmentId(res.data.data[0].id);
        setTenantId(res.data.data[0].tenant.id);
      }
    }).catch(() => {});
  }, []);

  const handleAssignmentChange = (id: string) => {
    setAssignmentId(id);
    const a = assignments.find((x) => x.id === id);
    if (a) setTenantId(a.tenant.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/rents', {
        tenantId,
        assignmentId,
        amount: Number(amount),
        dueDate: new Date(dueDate).toISOString(),
        month,
        year,
      });
      toast.success('Rent record created');
      router.push('/rent');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create rent record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <Link href="/rent" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" />
        Back to rent
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">Add Rent Record</h1>
      <p className="text-sm text-slate-500 mt-1">Create a rent invoice</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="assignment" className="block text-sm font-medium text-slate-700">Tenant Assignment</label>
          <select
            id="assignment"
            required
            value={assignmentId}
            onChange={(e) => handleAssignmentChange(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Select assignment</option>
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.tenant.name} — Room {a.bed?.room?.roomNumber} Bed {a.bed?.bedNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-700">Amount (₹)</label>
          <input
            id="amount"
            type="number"
            required
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="8000"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">Due Date</label>
          <input
            id="dueDate"
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-slate-700">Month</label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-slate-700">Year</label>
            <input
              id="year"
              type="number"
              min={2000}
              max={2100}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Rent Record'}
          </button>
          <Link href="/rent" className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
