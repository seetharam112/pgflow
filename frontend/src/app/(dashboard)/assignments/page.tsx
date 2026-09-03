'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Plus, BedDouble, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

interface Assignment {
  id: string;
  startDate: string;
  endDate: string | null;
  status: string;
  tenant: { name: string } | null;
  bed: { bedNumber: string; room: { roomNumber: string } | null } | null;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/assignments/active')
      .then((res) => setAssignments(res.data.data))
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, []);

  const handleMoveOut = async (id: string) => {
    if (!confirm('Move out this tenant? The bed will be marked as available.')) return;
    try {
      await api.post(`/assignments/${id}/move-out`);
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: 'ENDED', endDate: new Date().toISOString() } : a
        )
      );
      toast.success('Tenant moved out');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to move out');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assignments</h1>
          <p className="text-sm text-slate-500 mt-1">Manage tenant bed assignments</p>
        </div>
        <Link
          href="/assignments/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Assignment
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-slate-500">No assignments yet.</p>
          <Link
            href="/assignments/new"
            className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Create your first assignment
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-50 p-2">
                  <BedDouble className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {a.tenant?.name ?? 'Unknown Tenant'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Bed {a.bed?.bedNumber ?? 'N/A'} · Room {a.bed?.room?.roomNumber ?? 'N/A'}
                  </p>
                  <p className="text-xs text-slate-400">
                    From {new Date(a.startDate).toLocaleDateString()}
                    {a.endDate ? ` to ${new Date(a.endDate).toLocaleDateString()}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {a.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleMoveOut(a.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    title="Move Out"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Move Out
                  </button>
                )}
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    a.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700'
                      : a.status === 'ENDED'
                      ? 'bg-slate-50 text-slate-600'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {a.status.toLowerCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
