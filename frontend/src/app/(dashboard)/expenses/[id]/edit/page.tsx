'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { Loader2, ArrowLeft } from 'lucide-react';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

const categories = ['ELECTRICITY', 'WATER', 'INTERNET', 'FOOD', 'MAINTENANCE', 'CLEANING', 'SALARY', 'OTHER'];

export default function EditExpensePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('OTHER');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api
      .get(`/expenses/${id}`)
      .then((res) => {
        const e: Expense = res.data.data;
        setDescription(e.description || '');
        setAmount(e.amount.toString());
        setCategory(e.category);
        setDate(new Date(e.date).toISOString().split('T')[0]);
      })
      .catch(() => {
        toast.error('Failed to load expense');
        router.push('/expenses');
      })
      .finally(() => setFetching(false));
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body: any = { category, amount: Number(amount) };
      if (description) body.description = description;
      if (date) body.date = new Date(date).toISOString();
      await api.put(`/expenses/${id}`, body);
      toast.success('Expense updated');
      router.push('/expenses');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update expense');
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
      <Link href="/expenses" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" />
        Back to expenses
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">Edit Expense</h1>
      <p className="text-sm text-slate-500 mt-1">Update expense details</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
          <select
            id="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c.replace('_', ' ').toLowerCase()}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-700">Amount (₹)</label>
          <input
            id="amount"
            type="number"
            required
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date</label>
          <input
            id="date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Expense'}
          </button>
          <Link href="/expenses" className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
