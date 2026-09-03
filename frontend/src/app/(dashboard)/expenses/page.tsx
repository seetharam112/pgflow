'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Plus, Receipt, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/expenses')
      .then((res) => setExpenses(res.data.data))
      .catch(() => setExpenses([]))
      .finally(() => setLoading(false));
  }, []);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      toast.success('Expense deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete expense');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
          <p className="text-sm text-slate-500 mt-1">Track your PG expenses</p>
        </div>
        <Link
          href="/expenses/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </Link>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm text-slate-500">Total Expenses</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">₹{total.toLocaleString('en-IN')}</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-slate-500">No expenses recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-50 p-2">
                  <Receipt className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{e.description}</h3>
                  <p className="text-sm text-slate-500">
                    {e.category} · {new Date(e.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-900">₹{e.amount.toLocaleString('en-IN')}</p>
                <Link
                  href={`/expenses/${e.id}/edit`}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(e.id)}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  title="Delete"
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
