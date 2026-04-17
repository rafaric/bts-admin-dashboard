"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useOverview, useAnalytics } from "@/hooks/useAdminData";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

function StatCard({
  label, value, sub, color = "var(--accent)",
}: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="glass-card p-5 flex flex-col gap-1">
      <span className="text-xs font-medium tracking-wide text-[color:var(--text-muted)] uppercase">{label}</span>
      <span className="text-3xl font-bold" style={{ color }}>{value}</span>
      {sub && <span className="text-xs text-[color:var(--text-muted)]">{sub}</span>}
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="glass-card p-5 flex flex-col gap-2">
      <div className="skeleton h-3 w-24" />
      <div className="skeleton h-8 w-16" />
    </div>
  );
}

export default function OverviewPage() {
  const { session } = useAuthStore();
  const { data: stats, isLoading: statsLoading } = useOverview();
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();

  const chartData = analytics?.daily.slice(-14).map((d) => ({
    date:   d.date.slice(5),
    Logins: d.logins,
    Posts:  d.new_posts,
    Nuevos: d.new_users,
  })) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--text-primary)]">Overview</h1>
          <p className="text-sm text-[color:var(--text-muted)] mt-0.5">
            {session
              ? "Datos en tiempo real de SocialArmy"
              : "Mostrando datos de muestra — iniciá sesión para ver datos reales"}
          </p>
        </div>
        {!session && (
          <a href="/login" className="btn-accent text-sm py-2 px-4">Ingresar</a>
        )}
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statsLoading ? (
          Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Usuarios totales"  value={stats?.total_users ?? 0}        color="var(--accent)"        />
            <StatCard label="Activos hoy"       value={stats?.active_users_today ?? 0} color="var(--color-success)" sub="últimas 24h" />
            <StatCard label="Posts totales"     value={stats?.total_posts ?? 0}        color="var(--accent-gold)"   />
            <StatCard label="Posts hoy"         value={stats?.posts_today ?? 0}        color="var(--color-info)"    />
            <StatCard label="Baneados"          value={stats?.banned_users ?? 0}       color="var(--color-danger)"  />
            <StatCard label="Sesión promedio"   value={stats?.avg_session_minutes ? `${stats.avg_session_minutes}m` : "—"} color="var(--text-secondary)" sub="por usuario" />
          </>
        )}
      </div>

      {/* Activity chart */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-[color:var(--text-primary)] mb-4">
          Actividad — últimos 14 días
        </h2>
        {analyticsLoading ? (
          <div className="skeleton h-[220px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
              <CartesianGrid stroke="rgba(124,77,206,0.1)" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--glass-border)", borderRadius: "0.5rem", color: "var(--text-primary)", fontSize: 12 }} />
              <Line type="monotone" dataKey="Logins" stroke="var(--accent)"        strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Posts"  stroke="var(--accent-gold)"   strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Nuevos" stroke="var(--color-success)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
        <div className="flex gap-4 mt-2 justify-end">
          {[
            { label: "Logins", color: "var(--accent)"        },
            { label: "Posts",  color: "var(--accent-gold)"   },
            { label: "Nuevos", color: "var(--color-success)" },
          ].map(({ label, color }) => (
            <span key={label} className="flex items-center gap-1.5 text-xs text-[color:var(--text-muted)]">
              <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Member distribution */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-[color:var(--text-primary)] mb-4">
          Posts por miembro
        </h2>
        {analyticsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, i) => <div key={i} className="skeleton h-4 w-full" />)}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {(analytics?.members ?? [])
              .sort((a, b) => b.posts - a.posts)
              .map((m) => {
                const max = Math.max(...(analytics?.members ?? []).map((x) => x.posts), 1);
                return (
                  <div key={m.member} className="flex items-center gap-3">
                    <span className="w-20 text-xs text-[color:var(--text-secondary)] shrink-0">{m.member}</span>
                    <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.round((m.posts / max) * 100)}%`, background: m.color }}
                      />
                    </div>
                    <span className="text-xs font-medium text-[color:var(--text-muted)] w-8 text-right">{m.posts}</span>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
