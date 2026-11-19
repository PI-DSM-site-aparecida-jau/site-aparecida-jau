import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5220/api";

const number = (value) => new Intl.NumberFormat("pt-BR").format(value || 0);

function StatCard({ label, value, detail }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-[#034389]">{number(value)}</p>
      {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
    </article>
  );
}

function BarChart({ items, valueKey, labelKey, emptyText }) {
  const max = Math.max(1, ...items.map((item) => item[valueKey] || 0));
  if (!items.length || items.every((item) => !item[valueKey])) {
    return <p className="py-8 text-center text-sm text-slate-500">{emptyText}</p>;
  }

  return (
    <div className="flex h-56 items-end gap-2 border-b border-slate-200 px-1 pt-4">
      {items.map((item, index) => {
        const value = item[valueKey] || 0;
        const height = value ? Math.max(5, (value / max) * 100) : 0;
        return (
          <div key={`${item[labelKey]}-${index}`} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
            <span className="text-[11px] font-semibold text-slate-600">{value}</span>
            <div
              title={`${item[labelKey]}: ${value}`}
              className="w-full max-w-12 rounded-t-md bg-[#1769aa] transition-all"
              style={{ height: `${height}%`, minHeight: value ? "4px" : "0" }}
            />
            <span className="w-full truncate text-center text-[10px] text-slate-500">{item[labelKey]}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Admin() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/Estatisticas/dashboard`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Não foi possível carregar as estatísticas.");
        return response.json();
      })
      .then((data) => { if (active) setDashboard(data); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const publicacoes = useMemo(() => dashboard?.publicacoesPorMes || [], [dashboard]);
  const acessos = useMemo(() => dashboard?.acessosPorDia || [], [dashboard]);

  if (loading) return <main className="mx-auto max-w-7xl px-5 py-12 text-slate-600">Carregando painel...</main>;
  if (error) return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <h1 className="text-2xl font-bold text-[#034389]">Painel administrativo</h1>
      <p className="mt-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>
      <p className="mt-2 text-sm text-slate-500">Verifique se a API está em execução e tente atualizar a página.</p>
    </main>
  );

  const pages = dashboard?.paginasMaisAcessadas || [];

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10">
      <header>
        <h1 className="mt-1 text-3xl font-bold text-[#034389]">Visão geral e estatísticas</h1>
        <p className="mt-2 text-slate-600">Acompanhe as publicações e as visualizações das páginas públicas.</p>
      </header>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">1. Visão geral das publicações</h2>
          <p className="text-sm text-slate-500">Dados cadastrados no banco de dados.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Notícias publicadas" value={dashboard?.totalNoticias} />
          <StatCard label="Boletins informativos" value={dashboard?.totalBoletins} />
        </div>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800">Publicações por mês</h3>
          <p className="mt-1 text-xs text-slate-500">Últimos 6 meses, somando notícias e boletins.</p>
          <BarChart items={publicacoes} valueKey="total" labelKey="mes" emptyText="Ainda não há publicações para exibir nesse período." />
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
            <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#1769aa]" /> Total de publicações</span>
          </div>
        </article>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">2. Estatísticas de acesso ao site</h2>
          <p className="text-sm text-slate-500">Contagem de visualizações registradas a partir da implantação deste recurso.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Visualizações nos últimos 30 dias" value={dashboard?.totalAcessos30Dias} detail="Soma de páginas abertas no período" />
          <StatCard label="Visualizações hoje" value={dashboard?.acessosHoje} detail="Páginas abertas desde 00h" />
        </div>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800">Evolução diária de visualizações</h3>
          <p className="mt-1 text-xs text-slate-500">Últimos 14 dias.</p>
          <BarChart items={acessos} valueKey="total" labelKey="dia" emptyText="Nenhuma visualização registrada ainda." />
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800">Páginas mais acessadas</h3>
          <p className="mt-1 text-xs text-slate-500">Últimos 30 dias.</p>
          {pages.length === 0 ? (
            <p className="py-6 text-sm text-slate-500">Ainda não há acessos registrados.</p>
          ) : (
            <ol className="mt-4 divide-y divide-slate-100">
              {pages.map((page, index) => (
                <li key={page.pagina} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="min-w-0 truncate text-slate-700"><span className="mr-3 text-slate-400">{index + 1}.</span>{page.pagina}</span>
                  <strong className="shrink-0 text-[#034389]">{number(page.total)} visualizações</strong>
                </li>
              ))}
            </ol>
          )}
        </article>
      </section>
    </main>
  );
}
