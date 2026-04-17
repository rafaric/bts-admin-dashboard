"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";
import { useAnalytics } from "@/hooks/useAdminData";
import { useAuthStore } from "@/store/useAuthStore";
import { MEMBER_COLORS, type BtsMember } from "@/lib/constants";

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "var(--bg-surface)",
    border: "1px solid var(--glass-border)",
    borderRadius: "0.5rem",
    color: "var(--text-primary)",
    fontSize: 12,
  },
};

export default function AnalyticsPage() {
  const { session } = useAuthStore();
  const { data, isLoading } = useAnalytics();

  const daily   = data?.daily   ?? [];
  const members = data?.members ?? [];
  const eras    = data?.eras    ?? [];

  const last30 = daily.map((d) => ({ ...d, date: d.date.slice(5) }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[color:var(--text-primary)]">Analytics</h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-0.5">
          {session ? "Métricas en tiempo real — últimos 30 días" : "Datos de muestra — últimos 30 días"}
        </p>
      </div>

      {/* Growth */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-[color:var(--text-primary)] mb-4">
          Crecimiento diario — logins y nuevos usuarios
        </h2>
        {isLoading ? <div className="skeleton h-[240px] w-full" /> : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={last30} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
              <CartesianGrid stroke="rgba(124,77,206,0.1)" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 10 }} interval={4} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} formatter={(v) => <span style={{ color: "var(--text-secondary)" }}>{v}</span>} />
              <Line type="monotone" dataKey="logins"    name="Logins"         stroke="var(--accent)"        strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="new_users" name="Nuevos usuarios" stroke="var(--color-success)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Interactions */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-[color:var(--text-primary)] mb-4">
          Interacciones diarias (likes)
        </h2>
        {isLoading ? <div className="skeleton h-[200px] w-full" /> : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={last30} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
              <CartesianGrid stroke="rgba(124,77,206,0.1)" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 10 }} interval={4} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="interactions" name="Interacciones" fill="var(--accent-gold)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Member + Era */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-[color:var(--text-primary)] mb-4">Posts por miembro</h2>
          {isLoading ? <div className="skeleton h-[220px] w-full" /> : members.length === 0 ? (
            <p className="text-sm text-[color:var(--text-muted)] text-center py-8">Sin datos aún</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={members} dataKey="posts" nameKey="member" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {members.map((m) => <Cell key={m.member} fill={MEMBER_COLORS[m.member as BtsMember] ?? "var(--accent)"} />)}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11 }} formatter={(v) => <span style={{ color: "var(--text-secondary)" }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-[color:var(--text-primary)] mb-4">Posts por era</h2>
          {isLoading ? <div className="skeleton h-[220px] w-full" /> : eras.length === 0 ? (
            <p className="text-sm text-[color:var(--text-muted)] text-center py-8">Sin datos aún</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[...eras].sort((a, b) => b.posts - a.posts)} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 8 }}>
                <XAxis type="number" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                <YAxis type="category" dataKey="era" tick={{ fill: "var(--text-muted)", fontSize: 10 }} width={100} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="posts" name="Posts" fill="var(--accent)" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Posts per day */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-[color:var(--text-primary)] mb-4">Posts publicados por día</h2>
        {isLoading ? <div className="skeleton h-[180px] w-full" /> : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={last30} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
              <CartesianGrid stroke="rgba(124,77,206,0.1)" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 10 }} interval={4} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="new_posts" name="Posts" fill="var(--accent)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
