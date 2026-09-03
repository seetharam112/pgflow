export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white text-xl font-bold">
            PG
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">PGFlow</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your PG with ease</p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
}
