'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { Loader2, ArrowLeft, Layers } from 'lucide-react';

interface Property {
  id: string;
  name: string;
}

export default function NewFloorPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyId, setPropertyId] = useState('');
  const [name, setName] = useState('');
  const [floorNumber, setFloorNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get('/properties')
      .then((res) => {
        setProperties(res.data.data);
        if (res.data.data.length > 0) setPropertyId(res.data.data[0].id);
      })
      .catch(() => toast.error('Failed to load properties'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/floors', {
        propertyId,
        name,
        floorNumber: Number(floorNumber),
      });
      toast.success('Floor created');
      router.push('/floors');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create floor');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-xl font-bold text-slate-900">Add Floor</h1>
            <p className="text-sm text-slate-500">Create a new floor in a property</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">Property</label>
            <select
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select property</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Floor Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ground Floor"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Floor Number</label>
            <input
              type="number"
              value={floorNumber}
              onChange={(e) => setFloorNumber(e.target.value)}
              required
              placeholder="0"
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
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Floor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
