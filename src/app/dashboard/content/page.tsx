"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { usePosts, useDeletePost } from "@/hooks/useAdminData";
import { BTS_MEMBERS, BTS_ERAS, MEMBER_COLORS, type BtsMember } from "@/lib/constants";
import type { Post } from "@/types";

export default function ContentPage() {
  const { session } = useAuthStore();
  const isDemo = !session;

  const { data: posts = [], isLoading } = usePosts();
  const deleteMutation = useDeletePost();

  const [search, setSearch]       = useState("");
  const [memberFilter, setMemberFilter] = useState("all");
  const [eraFilter, setEraFilter] = useState("all");

  const filtered = (posts as Post[]).filter((p) => {
    const matchSearch = p.content.toLowerCase().includes(search.toLowerCase())
      || (p.author?.name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchMember = memberFilter === "all" || (p.tagged_members ?? []).includes(memberFilter);
    const matchEra    = eraFilter    === "all" || p.era === eraFilter;
    return matchSearch && matchMember && matchEra;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--text-primary)]">Contenido</h1>
          <p className="text-sm text-[color:var(--text-muted)] mt-0.5">
            {isDemo ? "Datos de muestra" : `${posts.length} posts publicados`}
          </p>
        </div>
        {isDemo && <a href="/login" className="btn-accent text-sm py-2 px-4">Ingresar para moderar</a>}
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar en posts o por usuario…"
          className="army-input px-4 py-2 text-sm flex-1 min-w-48"
          aria-label="Buscar post"
        />
        <select
          value={memberFilter}
          onChange={(e) => setMemberFilter(e.target.value)}
          className="army-input px-3 py-2 text-sm"
          aria-label="Filtrar por miembro"
        >
          <option value="all">Todos los miembros</option>
          {BTS_MEMBERS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select
          value={eraFilter}
          onChange={(e) => setEraFilter(e.target.value)}
          className="army-input px-3 py-2 text-sm"
          aria-label="Filtrar por era"
        >
          <option value="all">Todas las eras</option>
          {BTS_ERAS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card p-4">
              <div className="flex gap-3">
                <div className="skeleton w-9 h-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3 w-32" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-3/4" />
                </div>
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="glass-card p-8 text-center text-[color:var(--text-muted)]">
            No se encontraron posts
          </div>
        ) : (
          filtered.map((post) => (
            <article key={post.id} className="glass-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 bg-[color:var(--bg-surface)]">
                    {post.author?.avatar && (
                      <Image src={post.author.avatar} alt={post.author.name ?? ""} fill className="object-cover" sizes="36px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-[color:var(--text-primary)]">
                        {post.author?.name ?? "—"}
                      </span>
                      {post.era && <span className="badge badge-info">{post.era}</span>}
                      {(post.tagged_members ?? []).map((m) => (
                        <span
                          key={m}
                          className="badge"
                          style={{
                            background: `${MEMBER_COLORS[m as BtsMember] ?? "var(--accent)"}22`,
                            color: MEMBER_COLORS[m as BtsMember] ?? "var(--accent)",
                          }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-[color:var(--text-secondary)] mt-1 line-clamp-3">{post.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[color:var(--text-muted)]">
                      <span>
                        {new Date(post.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                      <span>💜 {post.likes_count ?? 0}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (isDemo) return;
                    if (!confirm("¿Eliminar este post permanentemente?")) return;
                    deleteMutation.mutate(post.id);
                  }}
                  disabled={isDemo}
                  className="btn-danger text-xs py-1 px-3 shrink-0 disabled:opacity-40"
                  title={isDemo ? "Iniciá sesión para moderar" : undefined}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      <p className="text-xs text-[color:var(--text-muted)] text-right">
        Mostrando {filtered.length} de {posts.length} posts
      </p>
    </div>
  );
}
