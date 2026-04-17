"use client";

import { MOCK_AUDIT } from "@/lib/mock-data";
import { useAuthStore } from "@/store/useAuthStore";
import type { AuditAction } from "@/types";

const ACTION_LABELS: Record<AuditAction, { label: string; badge: string }> = {
  ban_user:       { label: "Baneo de usuario",     badge: "badge-danger"  },
  unban_user:     { label: "Desbaneo de usuario",   badge: "badge-success" },
  delete_post:    { label: "Eliminación de post",   badge: "badge-warning" },
  delete_comment: { label: "Eliminación de comentario", badge: "badge-warning" },
  promote_admin:  { label: "Ascenso a admin",       badge: "badge-info"    },
  revoke_admin:   { label: "Revocación de admin",   badge: "badge-danger"  },
};

export default function AuditPage() {
  const { session } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[color:var(--text-primary)]">Audit Log</h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-0.5">
          {session ? "Registro de acciones de administradores" : "Datos de muestra"}
        </p>
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="army-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Admin</th>
              <th>Acción</th>
              <th>Objetivo</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_AUDIT.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-[color:var(--text-muted)]">
                  No hay entradas en el audit log
                </td>
              </tr>
            ) : (
              MOCK_AUDIT.map((entry) => {
                const meta = ACTION_LABELS[entry.action];
                const date = new Date(entry.created_at).toLocaleString("es-AR", {
                  day: "2-digit", month: "short", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                });
                return (
                  <tr key={entry.id}>
                    <td className="whitespace-nowrap">{date}</td>
                    <td>
                      <span className="font-medium text-[color:var(--text-primary)]">
                        @{entry.admin_username}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${meta.badge}`}>{meta.label}</span>
                    </td>
                    <td className="text-[color:var(--text-muted)]">
                      {entry.target_label}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!session && (
        <div className="glass-card p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-[color:var(--text-muted)]">
            Iniciá sesión para ver el audit log completo con acciones reales.
          </p>
          <a href="/login" className="btn-accent text-sm py-2 px-4 shrink-0">
            Ingresar
          </a>
        </div>
      )}
    </div>
  );
}
