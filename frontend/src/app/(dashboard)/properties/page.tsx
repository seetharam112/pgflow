'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { Plus, MapPin, Users, Pencil, Trash2 } from 'lucide-react';

interface Floor {
  rooms: { beds: { status: string }[] }[];
}

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  floors: Floor[];
}

function deriveStats(property: Property) {
  const rooms = property.floors.flatMap((f) => f.rooms);
  const beds = rooms.flatMap((r) => r.beds);
  const totalRooms = rooms.length;
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.status === 'OCCUPIED').length;
  return { totalRooms, totalBeds, occupiedBeds };
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/properties')
      .then((res) => setProperties(res.data.data))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this property?')) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      toast.success('Property deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete property');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Properties</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your PG properties</p>
        </div>
        <Link
          href="/properties/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-slate-500">No properties yet.</p>
          <Link
            href="/properties/new"
            className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Add your first property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {properties.map((p) => {
            const stats = deriveStats(p);
            return (
              <div
                key={p.id}
                className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{p.name}</h3>
                    <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {p.address}, {p.city}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/properties/${p.id}/edit`}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
                  <span>{stats.totalRooms} rooms</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {stats.occupiedBeds}/{stats.totalBeds} beds
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
