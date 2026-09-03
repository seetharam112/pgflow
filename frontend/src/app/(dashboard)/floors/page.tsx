'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Plus, Layers, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Property {
  id: string;
  name: string;
  floors: {
    id: string;
    name: string;
    floorNumber: number;
    rooms: { id: string }[];
  }[];
}

export default function FloorsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api
      .get('/properties')
      .then((res) => setProperties(res.data.data))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  const allFloors = properties.flatMap((p) =>
    p.floors.map((f) => ({ ...f, propertyName: p.name, propertyId: p.id }))
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this floor?')) return;
    try {
      await api.delete(`/floors/${id}`);
      setProperties((prev) =>
        prev.map((p) => ({
          ...p,
          floors: p.floors.filter((f) => f.id !== id),
        }))
      );
      toast.success('Floor deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete floor');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Floors</h1>
          <p className="text-sm text-slate-500 mt-1">Manage property floors</p>
        </div>
        <Link
          href="/floors/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Floor
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : allFloors.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-slate-500">No floors yet.</p>
          <Link
            href="/floors/new"
            className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Add your first floor
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {allFloors.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-50 p-2">
                  <Layers className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{f.name}</h3>
                  <p className="text-sm text-slate-500">
                    {f.propertyName} · Floor {f.floorNumber}
                  </p>
                  <p className="text-xs text-slate-400">{f.rooms.length} rooms</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/floors/${f.id}/edit`)}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
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
