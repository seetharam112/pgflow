'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { Loader2, ArrowLeft } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
}

interface Property {
  id: string;
  name: string;
}

export default function NewComplaintPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenantId, setTenantId] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/tenants').then((res) => setTenants(res.data.data)).catch(() => {});
    api.get('/properties').then((res) => setProperties(res.data.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/complaints', {
        tenantId,
        propertyId,
        category,
        title,
        description,
        priority,
      });
      toast.success('Complaint filed');
      router.push('/complaints');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to file complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <Link
        href="/complaints"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to complaints
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-900">File Complaint</h1>
      <p className="text-sm text-slate-500 mt-1">Log a new tenant complaint</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="tenant" className="block text-sm font-medium text-slate-700">
            Tenant
          </label>
          <select
            id="tenant"
            required
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Select tenant</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="property" className="block text-sm font-medium text-slate-700">
            Property
          </label>
          <select
            id="property"
            required
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
          <label htmlFor="category" className="block text-sm font-medium text-slate-700">
            Category
          </label>
          <input
            id="category"
            type="text"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="Plumbing / WiFi / Cleanliness"
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="Water leakage in bathroom"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="Detailed description of the issue..."
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-slate-700">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'File Complaint'}
          </button>
          <Link
            href="/complaints"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
