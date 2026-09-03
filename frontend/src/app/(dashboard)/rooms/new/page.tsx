'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { Loader2, ArrowLeft } from 'lucide-react';

interface Floor {
  id: string;
  name: string;
  property: { name: string };
}

export default function NewRoomPage() {
  const router = useRouter();
  const [floors, setFloors] = useState<Floor[]>([]);
  const [floorId, setFloorId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/floors').then((res) => {
      setFloors(res.data.data);
      if (res.data.data.length > 0) setFloorId(res.data.data[0].id);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/rooms', {
        floorId,
        roomNumber,
        capacity: Number(capacity),
      });
      toast.success('Room created');
      router.push('/rooms');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <Link href="/rooms" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" />
        Back to rooms & beds
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">Add Room</h1>
      <p className="text-sm text-slate-500 mt-1">Create a room on a floor</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="floor" className="block text-sm font-medium text-slate-700">Floor</label>
          <select
            id="floor"
            required
            value={floorId}
            onChange={(e) => setFloorId(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Select floor</option>
            {floors.map((f) => (
              <option key={f.id} value={f.id}>{f.property?.name} - {f.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="roomNumber" className="block text-sm font-medium text-slate-700">Room Number</label>
          <input
            id="roomNumber"
            type="text"
            required
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            placeholder="101"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-slate-700">Capacity (beds)</label>
          <input
            id="capacity"
            type="number"
            required
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="2"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Room'}
          </button>
          <Link href="/rooms" className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
