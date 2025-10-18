import type { PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen bg-slate-50">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">PA MI SENTI</p>
          <h1 className="text-2xl font-semibold text-slate-900">Contatta la tua PA in pochi click</h1>
        </div>
        <p className="text-sm text-slate-500">
          Scegli la città, il tema e ottieni il canale migliore senza cercare ovunque.
        </p>
      </div>
    </header>
    <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 text-xs text-slate-500">
        <span>Dato di esempio — aggiorna `data/pa.yml` per estendere il catalogo.</span>
        <span>Deploy statico compatibile con GitHub Pages</span>
      </div>
    </footer>
  </div>
);

export default Layout;
