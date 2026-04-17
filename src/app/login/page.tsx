"use client";

import type { Metadata } from "next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Credenciales incorrectas. Verificá tu email y contraseña.");
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-dvh flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-sm p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 gap-1">
          <span className="font-mono text-2xl text-gold tracking-widest font-bold">ARMY</span>
          <span className="text-[10px] tracking-[0.3em] text-[color:var(--text-muted)] uppercase">admin dashboard</span>
        </div>

        <h1 className="text-lg font-semibold text-[color:var(--text-primary)] mb-1">
          Iniciar sesión
        </h1>
        <p className="text-sm text-[color:var(--text-muted)] mb-6">
          Solo administradores autorizados pueden ingresar.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-[color:var(--text-secondary)] tracking-wide">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="army-input px-4 py-2.5 text-sm w-full"
              placeholder="admin@socialarmy.app"
              autoComplete="email"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-medium text-[color:var(--text-secondary)] tracking-wide">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="army-input px-4 py-2.5 text-sm w-full"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-[color:var(--color-danger)] bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-accent w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {/* Demo notice */}
        <div className="mt-6 pt-6 border-t border-[color:var(--glass-border)]">
          <p className="text-xs text-center text-[color:var(--text-muted)]">
            Sin login podés explorar el dashboard con datos de muestra.{" "}
            <a href="/dashboard" className="text-[color:var(--accent)] hover:underline">
              Ver demo →
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
