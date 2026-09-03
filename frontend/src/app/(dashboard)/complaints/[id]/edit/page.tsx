'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { Loader2, ArrowLeft } from 'lucide-react';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string | null;
}

const statuses = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function EditComplaintPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [status, setStatus] = useState('OPEN');
  const [priority, setPriority] = useState('MEDIUM');
  const [assignedTo, setAssignedTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api
      .get(`/complaints/${id}`)
      .then((res) => {
        const c: Complaint = res.data.data;
        setStatus(c.status);
        setPriority(c.priority);
        setAssignedTo(c.assignedTo || '');
      })
      .catch(() => {
        toast.error('Failed to load complaint');
        router.push('/complaints');
      })
      .finally(() => setFetching(false));
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body: any = { status, priority };
      if (assignedTo) body.assignedTo = assignedTo;
      await api.put(`/complaints/${id}`, body);
      toast.success('Complaint updated');
      router.push('/complaints');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update complaint');
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
      <Link href="/complaints" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" />
        Back to complaints
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">Update Complaint</h1>
      <p className="text-sm text-slate-500 mt-1">Change status, priority or assignment</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ').toLowerCase()}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-slate-700">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            {priorities.map((p) => (
              <option key={p} value={p}>{p.toLowerCase()}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="assignedTo" className="block text-sm font-medium text-slate-700">Assigned To <span className="text-slate-400">(optional)</span></label>
          <input
            id="assignedTo"
            type="text"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="Staff name or ID"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Complaint'}
          </button>
          <Link href="/complaints" className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
