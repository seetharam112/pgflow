'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { Loader2, ArrowLeft } from 'lucide-react';

interface Room {
  id: string;
  roomNumber: string;
  capacity: number;
  type: string;
}

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [roomNumber, setRoomNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api
      .get(`/rooms/${id}`)
      .then((res) => {
        const r: Room = res.data.data;
        setRoomNumber(r.roomNumber);
        setCapacity(r.capacity.toString());
      })
      .catch(() => {
        toast.error('Failed to load room');
        router.push('/rooms');
      })
      .finally(() => setFetching(false));
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/rooms/${id}`, { roomNumber, capacity: Number(capacity) });
      toast.success('Room updated');
      router.push('/rooms');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update room');
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

      <h1 className="mt-4 text-2xl font-bold text-slate-900">Edit Room</h1>
      <p className="text-sm text-slate-500 mt-1">Update room details</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="roomNumber" className="block text-sm font-medium text-slate-700">Room Number</label>
          <input
            id="roomNumber"
            type="text"
            required
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
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
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Room'}
          </button>
          <Link href="/rooms" className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
