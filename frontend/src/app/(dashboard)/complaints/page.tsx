'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Plus, AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  tenant: { name: string } | null;
  createdAt: string;
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/complaints')
      .then((res) => setComplaints(res.data.data))
      .catch(() => setComplaints([]))
      .finally(() => setLoading(false));
  }, []);

  const priorityColor = (p: string) => {
    switch (p) {
      case 'HIGH': return 'bg-red-50 text-red-700';
      case 'MEDIUM': return 'bg-amber-50 text-amber-700';
      case 'LOW': return 'bg-blue-50 text-blue-700';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'OPEN': return 'bg-rose-50 text-rose-700';
      case 'IN_PROGRESS': return 'bg-blue-50 text-blue-700';
      case 'RESOLVED': return 'bg-emerald-50 text-emerald-700';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this complaint?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      setComplaints((prev) => prev.filter((c) => c.id !== id));
      toast.success('Complaint deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete complaint');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Complaints</h1>
          <p className="text-sm text-slate-500 mt-1">Track tenant complaints</p>
        </div>
        <Link
          href="/complaints/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Complaint
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : complaints.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-slate-500">No complaints yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <div
              key={c.id}
              className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{c.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{c.description}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    By {c.tenant?.name ?? 'Unknown'} · {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColor(c.priority)}`}>
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      {c.priority.toLowerCase()}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(c.status)}`}>
                      {c.status.toLowerCase().replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/complaints/${c.id}/edit`}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
