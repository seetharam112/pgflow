'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { Plus, Pencil, Trash2, BedDouble } from 'lucide-react';

interface Bed {
  id: string;
  bedNumber: string;
  status: string;
}

interface Room {
  id: string;
  roomNumber: string;
  type: string;
  capacity: number;
  beds: Bed[];
}

interface Floor {
  id: string;
  name: string;
  floorNumber: number;
  rooms: Room[];
}

interface Property {
  id: string;
  name: string;
  floors: Floor[];
}

export default function RoomsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/properties')
      .then((res) => setProperties(res.data.data))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteRoom = async (id: string) => {
    if (!confirm('Delete this room?')) return;
    try {
      await api.delete(`/rooms/${id}`);
      setProperties((prev) =>
        prev.map((p) => ({
          ...p,
          floors: p.floors.map((f) => ({
            ...f,
            rooms: f.rooms.filter((r) => r.id !== id),
          })),
        }))
      );
      toast.success('Room deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete room');
    }
  };

  const handleDeleteBed = async (id: string) => {
    if (!confirm('Delete this bed?')) return;
    try {
      await api.delete(`/beds/${id}`);
      setProperties((prev) =>
        prev.map((p) => ({
          ...p,
          floors: p.floors.map((f) => ({
            ...f,
            rooms: f.rooms.map((r) => ({
              ...r,
              beds: r.beds.filter((b) => b.id !== id),
            })),
          })),
        }))
      );
      toast.success('Bed deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete bed');
    }
  };

  const allRooms = properties.flatMap((p) =>
    p.floors.flatMap((f) =>
      f.rooms.map((r) => ({ ...r, propertyName: p.name, floorName: f.name, floorNumber: f.floorNumber }))
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rooms & Beds</h1>
          <p className="text-sm text-slate-500 mt-1">Manage rooms and bed assignments</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/floors/new"
            className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Add Floor
          </Link>
          <Link
            href="/rooms/new"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Room
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : allRooms.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-slate-500">No rooms yet.</p>
          <Link
            href="/rooms/new"
            className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Add your first room
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {allRooms.map((r) => (
            <div
              key={r.id}
              className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Room {r.roomNumber}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {r.propertyName} · {r.floorName} (Floor {r.floorNumber})
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/rooms/${r.id}/edit`}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteRoom(r.id)}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {r.beds.map((bed) => (
                  <span
                    key={bed.id}
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                      bed.status === 'OCCUPIED'
                        ? 'bg-emerald-50 text-emerald-700'
                        : bed.status === 'MAINTENANCE'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    <BedDouble className="h-3 w-3" />
                    {bed.bedNumber}
                  </span>
                ))}
                <Link
                  href="/beds/new"
                  className="inline-flex items-center rounded-md border border-dashed border-slate-300 px-2 py-0.5 text-xs font-medium text-slate-500 hover:border-emerald-400 hover:text-emerald-600"
                >
                  + Bed
                </Link>
              </div>

              <div className="mt-3 flex items-center gap-2">
                {r.beds.map((bed) => (
                  <div key={bed.id} className="flex items-center gap-1">
                    <Link
                      href={`/beds/${bed.id}/edit`}
                      className="text-xs text-slate-400 hover:text-slate-600"
                      title="Edit bed"
                    >
                      edit
                    </Link>
                    <button
                      onClick={() => handleDeleteBed(bed.id)}
                      className="text-xs text-slate-400 hover:text-red-600"
                      title="Delete bed"
                    >
                      del
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
