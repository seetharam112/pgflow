export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <main className="flex flex-col items-center gap-6 text-center px-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-emerald-600 text-white text-2xl font-bold">
          PG
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          PGFlow
        </h1>
        <p className="max-w-md text-lg text-slate-600">
          Run your entire PG from one place — beds, tenants, rent, expenses, complaints and occupancy.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row mt-4">
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Get Started
          </a>
          <a
            href="http://localhost:3001/health"
            target="_blank"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Check API Health
          </a>
        </div>
        <div className="mt-8 text-sm text-slate-400">
          Frontend: localhost:3002 · API: localhost:3001
        </div>
      </main>
    </div>
  );
}
