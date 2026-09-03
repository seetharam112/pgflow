'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Building2, Users, Mail } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
}

interface OrgUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function OrganizationPage() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [users, setUsers] = useState<OrgUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/organization/me').then((res) => setOrg(res.data.data)),
      api.get('/organization/users').then((res) => setUsers(res.data.data)),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Organization</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your organization details</p>
      </div>

      {loading ? (
        <div className="h-48 animate-pulse rounded-xl bg-slate-200" />
      ) : org ? (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50">
              <Building2 className="h-7 w-7 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{org.name}</h2>
              <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-500">
                {org.address && <span>{org.address}</span>}
                {org.phone && <span>{org.phone}</span>}
                {org.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {org.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Team Members</h2>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-700">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                  {u.role.toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
