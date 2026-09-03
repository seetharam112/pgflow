'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function NewTenantPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deposit, setDeposit] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body: any = { name, phone };
      if (email) body.email = email;
      if (deposit) body.deposit = Number(deposit);
      await api.post('/tenants', body);
      toast.success('Tenant created');
      router.push('/tenants');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create tenant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <Link
        href="/tenants"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to tenants
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">Add Tenant</h1>
      <p className="text-sm text-slate-500 mt-1">Register a new tenant</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="Rahul Sharma"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="rahul@example.com"
          />
        </div>

        <div>
          <label htmlFor="deposit" className="block text-sm font-medium text-slate-700">
            Security Deposit <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="deposit"
            type="number"
            min={0}
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="10000"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Tenant'}
          </button>
          <Link
            href="/tenants"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
