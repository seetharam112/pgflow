'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { Loader2, ArrowLeft } from 'lucide-react';

interface Rent {
  id: string;
  tenant: { name: string };
  amount: number;
  month: number;
  year: number;
}

export default function NewPaymentPage() {
  const router = useRouter();
  const [rents, setRents] = useState<Rent[]>([]);
  const [rentId, setRentId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('CASH');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/rents').then((res) => {
      const data = res.data.data || [];
      setRents(data);
      if (data.length > 0) setRentId(data[0].id);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body: any = { rentId, amount: Number(amount), method };
      if (reference) body.reference = reference;
      await api.post('/payments', body);
      toast.success('Payment recorded');
      router.push('/payments');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <Link href="/payments" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" />
        Back to payments
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">Record Payment</h1>
      <p className="text-sm text-slate-500 mt-1">Log a rent payment</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="rent" className="block text-sm font-medium text-slate-700">Rent Record</label>
          <select
            id="rent"
            required
            value={rentId}
            onChange={(e) => setRentId(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Select rent record</option>
            {rents.map((r) => (
              <option key={r.id} value={r.id}>
                {r.tenant?.name} — ₹{r.amount} ({new Date(0, r.month - 1).toLocaleString('default', { month: 'short' })} {r.year})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-700">Amount Paid (₹)</label>
          <input
            id="amount"
            type="number"
            required
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="8000"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="method" className="block text-sm font-medium text-slate-700">Payment Method</label>
          <select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>

        <div>
          <label htmlFor="reference" className="block text-sm font-medium text-slate-700">Reference <span className="text-slate-400">(optional)</span></label>
          <input
            id="reference"
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="UPI ID / Transaction No"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Record Payment'}
          </button>
          <Link href="/payments" className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
