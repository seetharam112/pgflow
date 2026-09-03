'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { Loader2, ArrowLeft } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api
      .get(`/properties/${id}`)
      .then((res) => {
        const p: Property = res.data.data;
        setName(p.name);
        setAddress(p.address);
        setCity(p.city);
        setState(p.state);
        setPincode(p.pincode);
      })
      .catch(() => {
        toast.error('Failed to load property');
        router.push('/properties');
      })
      .finally(() => setFetching(false));
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/properties/${id}`, { name, address, city, state, pincode });
      toast.success('Property updated');
      router.push('/properties');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update property');
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
      <Link
        href="/properties"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to properties
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">Edit Property</h1>
      <p className="text-sm text-slate-500 mt-1">Update property details</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Property Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-slate-700">
            Address
          </label>
          <textarea
            id="address"
            required
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-slate-700">
              City
            </label>
            <input
              id="city"
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-slate-700">
              State
            </label>
            <input
              id="state"
              type="text"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="pincode" className="block text-sm font-medium text-slate-700">
            Pincode
          </label>
          <input
            id="pincode"
            type="text"
            required
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Property'}
          </button>
          <Link
            href="/properties"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
