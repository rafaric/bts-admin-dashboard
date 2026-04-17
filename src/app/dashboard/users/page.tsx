"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { MOCK_USERS } from "@/lib/mock-data";
import type { AdminUser } from "@/types";

function UserRow({
  user,
  onBan,
  onUnban,
  onDelete,
  isDemo,
}: {
  user: AdminUser;
  onBan: (id: string) => void;
  onUnban: (id: string) => void;
  onDelete: (id: string) => void;
  isDemo: boolean;
}) {
  const joinDate = new Date(user.created_at).toLocaleDateString("es-AR", {
    day: "2-digit", month: "short", year: "numeric",
  });
  const lastSeen = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString("es-AR", {
        day: "2-digit", month: "short",
      })
    : "—";

  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-[color:var(--bg-surface)]">
            {user.avatar_url && (
              <Image src={user.avatar_url} alt={user.username} fill className="object-cover" sizes="32px" />
            )}
          </div>
          <div>
            <p className="font-medium text-[color:var(--text-primary)] text-sm">@{user.username}</p>
            <p className="text-xs text-[color:var(--text-muted)]">{user.email ?? "—"}</p>
          </div>
        </div>
      </td>
      <td>{user.favorite_member ?? "—"}</td>
      <td>{joinDate}</td>
      <td>{lastSeen}</td>
      <td>
        <span className={`badge ${user.is_banned ? "badge-danger" : "badge-success"}`}>
          {user.is_banned ? "Baneado" : "Activo"}
        </span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          {user.is_banned ? (
            <button
              onClick={() => !isDemo && onUnban(user.id)}
              disabled={isDemo}
              className="btn-ghost text-xs py-1 px-3 disabled:opacity-40"
              title={isDemo ? "Iniciá sesión para realizar acciones" : "Desbanear"}
            >
              Desbanear
            </button>
          ) : (
            <button
              onClick={() => !isDemo && onBan(user.id)}
              disabled={isDemo}
              className="btn-danger text-xs py-1 px-3 disabled:opacity-40"
              title={isDemo ? "Iniciá sesión para realizar acciones" : "Banear"}
            >
              Banear
            </button>
          )}
          <button
            onClick={() => !isDemo && onDelete(user.id)}
            disabled={isDemo}
            className="text-xs text-[color:var(--color-danger)] hover:underline disabled:opacity-40"
            title={isDemo ? "Iniciá sesión para realizar acciones" : "Eliminar usuario"}
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function UsersPage() {
  const { session } = useAuthStore();
  const isDemo = !session;

  const [users, setUsers]   = useState<AdminUser[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "banned">("all");

  const filtered = users.filter((u) => {
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase())
      || (u.email ?? "").toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all"    ? true :
      filter === "banned" ? u.is_banned :
      !u.is_banned;
    return matchSearch && matchFilter;
  });

  function handleBan(id: string) {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_banned: true } : u));
  }

  function handleUnban(id: string) {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_banned: false } : u));
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar este usuario permanentemente?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--text-primary)]">Usuarios</h1>
          <p className="text-sm text-[color:var(--text-muted)] mt-0.5">
            {isDemo
              ? "Datos de muestra — las acciones están deshabilitadas"
              : `${users.length} usuarios registrados`}
          </p>
        </div>
        {isDemo && (
          <a href="/login" className="btn-accent text-sm py-2 px-4">
            Ingresar para moderar
          </a>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por usuario o email…"
          className="army-input px-4 py-2 text-sm flex-1 min-w-48"
          aria-label="Buscar usuario"
        />
        <div className="flex gap-1">
          {(["all", "active", "banned"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-[color:var(--accent)] text-white"
                  : "btn-ghost"
              }`}
            >
              {f === "all" ? "Todos" : f === "active" ? "Activos" : "Baneados"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-x-auto">
        <table className="army-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Bias</th>
              <th>Registro</th>
              <th>Último acceso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-[color:var(--text-muted)]">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <UserRow
                  key={u.id}
                  user={u}
                  onBan={handleBan}
                  onUnban={handleUnban}
                  onDelete={handleDelete}
                  isDemo={isDemo}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[color:var(--text-muted)] text-right">
        Mostrando {filtered.length} de {users.length} usuarios
      </p>
    </div>
  );
}
