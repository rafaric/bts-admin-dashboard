"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  useCollectiblesStats,
  useAdminCards,
  useUpdateCard,
  useDeleteCard,
  useCreateCard,
  useSearchUsers,
  useGiftPack,
} from "@/hooks/useAdminData";
import { useAuthStore } from "@/store/useAuthStore";
import type { Card } from "@/types";

/* ─── Config ─────────────────────────────────────────────────────────────── */

const RARITY_CONFIG = {
  common:    { label: "Común",      color: "#9ca3af" },
  rare:      { label: "Rara",       color: "#60a5fa" },
  epic:      { label: "Épica",      color: "#a855f7" },
  legendary: { label: "Legendaria", color: "#f59e0b" },
} as const;
const RARITIES = ["common", "rare", "epic", "legendary"] as const;
const MEMBERS  = ["RM", "Jin", "Suga", "J-Hope", "Jimin", "V", "Jungkook"];
const ERAS     = ["2cool4skool", "hyyh", "wings", "love_yourself", "mots", "be", "butter", "proof", "arirang"];

type Tab = "stats" | "cards" | "gift";

/* ─── Stat Card ──────────────────────────────────────────────────────────── */

function StatCard({ label, value, sub, color = "var(--accent)" }: {
  label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="glass-card p-5 flex flex-col gap-1">
      <span className="text-xs font-medium tracking-wide text-[color:var(--text-muted)] uppercase">{label}</span>
      <span className="text-3xl font-bold" style={{ color }}>{value}</span>
      {sub && <span className="text-xs text-[color:var(--text-muted)]">{sub}</span>}
    </div>
  );
}

/* ─── Edit Row (cards tab) ───────────────────────────────────────────────── */

function EditRow({ card, onSave, onCancel }: { card: Card; onSave: (d: Partial<Card>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ name: card.name, member: card.member, era: card.era, rarity: card.rarity });
  return (
    <tr className="bg-white/5 text-sm">
      <td className="px-3 py-2">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-2 py-1 rounded text-xs bg-white/10 border border-white/20 text-[color:var(--text-primary)] outline-none"
        />
      </td>
      <td className="px-3 py-2">
        <select value={form.member} onChange={(e) => setForm({ ...form, member: e.target.value })}
          className="px-2 py-1 rounded text-xs bg-white/10 border border-white/20 text-[color:var(--text-primary)] outline-none">
          {MEMBERS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </td>
      <td className="px-3 py-2">
        <select value={form.era} onChange={(e) => setForm({ ...form, era: e.target.value })}
          className="px-2 py-1 rounded text-xs bg-white/10 border border-white/20 text-[color:var(--text-primary)] outline-none">
          {ERAS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </td>
      <td className="px-3 py-2">
        <select value={form.rarity} onChange={(e) => setForm({ ...form, rarity: e.target.value as Card["rarity"] })}
          className="px-2 py-1 rounded text-xs bg-white/10 border border-white/20 outline-none"
          style={{ color: RARITY_CONFIG[form.rarity].color }}>
          {RARITIES.map((r) => <option key={r} value={r}>{RARITY_CONFIG[r].label}</option>)}
        </select>
      </td>
      <td className="px-3 py-2">
        <div className="flex gap-2">
          <button type="button" onClick={() => onSave(form)}
            className="text-[10px] px-2 py-1 rounded font-bold text-white" style={{ background: "var(--accent)" }}>
            Guardar
          </button>
          <button type="button" onClick={onCancel}
            className="text-[10px] px-2 py-1 rounded text-[color:var(--text-muted)] hover:bg-white/10">
            Cancelar
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ─── Stats Tab ──────────────────────────────────────────────────────────── */

function StatsTab() {
  const { data: stats, isLoading } = useCollectiblesStats();
  const openRate = stats ? Math.round((stats.packs.opened / (stats.packs.total || 1)) * 100) : 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Sobres totales" value={stats?.packs.total ?? 0} sub={`${openRate}% abiertos`} />
        <StatCard label="Sin abrir"      value={stats?.packs.pending ?? 0} color="#f59e0b" />
        <StatCard label="Sobres Super"   value={stats?.packs.super ?? 0}   color="#a855f7" />
        <StatCard label="Sobres Simple"  value={stats?.packs.simple ?? 0}  color="#60a5fa" />
        {(["legendary", "epic", "rare", "common"] as const).map((r) => (
          <StatCard key={r} label={RARITY_CONFIG[r].label} value={stats?.cards[r] ?? 0} color={RARITY_CONFIG[r].color}
            sub="cartas repartidas" />
        ))}
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5">
          <p className="text-sm font-semibold text-[color:var(--text-primary)]">Actividad reciente</p>
        </div>
        <div className="divide-y divide-white/5">
          {(stats?.recent ?? []).map((r, i) => (
            <div key={i} className="px-4 py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    background: r.pack_type === "super" ? "rgba(168,85,247,0.15)" : "rgba(96,165,250,0.15)",
                    color: r.pack_type === "super" ? "#a855f7" : "#60a5fa",
                  }}>
                  {r.pack_type === "super" ? "Super" : "Simple"}
                </span>
                <span className="text-xs text-[color:var(--text-secondary)] truncate">{r.activity}</span>
                {r.user_name && <span className="text-xs text-[color:var(--text-muted)] truncate">· {r.user_name}</span>}
              </div>
              <span className="text-[10px] text-[color:var(--text-muted)] shrink-0">
                {new Date(r.created_at).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Cards Tab ──────────────────────────────────────────────────────────── */

function CardsTab() {
  const { data: cards = [], isLoading } = useAdminCards();
  const updateCard  = useUpdateCard();
  const deleteCard  = useDeleteCard();
  const createCard  = useCreateCard();
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [filterMember, setFilterMember] = useState("all");
  const [filterRarity, setFilterRarity] = useState("all");
  const [showNew, setShowNew]           = useState(false);
  const [newCard, setNewCard]           = useState<Omit<Card, "id">>({ name: "", member: "RM", era: "arirang", rarity: "common", image_url: null });

  const filtered = cards.filter((c) =>
    (filterMember === "all" || c.member === filterMember) &&
    (filterRarity === "all" || c.rarity === filterRarity)
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={filterMember} onChange={(e) => setFilterMember(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-[color:var(--text-secondary)] outline-none">
          <option value="all">Todos los miembros</option>
          {MEMBERS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={filterRarity} onChange={(e) => setFilterRarity(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-[color:var(--text-secondary)] outline-none">
          <option value="all">Todas las rarezas</option>
          {RARITIES.map((r) => <option key={r} value={r}>{RARITY_CONFIG[r].label}</option>)}
        </select>
        <span className="text-xs text-[color:var(--text-muted)] ml-auto">{filtered.length} cartas</span>
        <button type="button" onClick={() => setShowNew(!showNew)}
          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
          style={{ background: "linear-gradient(135deg, var(--accent), #a855f7)" }}>
          + Nueva
        </button>
      </div>

      {/* Formulario nueva carta */}
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} className="glass-card rounded-xl overflow-hidden">
            <div className="p-4 grid grid-cols-2 md:grid-cols-5 gap-3">
              <input placeholder="Nombre" value={newCard.name} onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                className="col-span-2 md:col-span-1 px-3 py-2 rounded-lg text-xs bg-white/5 border border-white/10 text-[color:var(--text-primary)] placeholder-[color:var(--text-muted)] outline-none" />
              <select value={newCard.member} onChange={(e) => setNewCard({ ...newCard, member: e.target.value })}
                className="px-3 py-2 rounded-lg text-xs bg-white/5 border border-white/10 text-[color:var(--text-primary)] outline-none">
                {MEMBERS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={newCard.era} onChange={(e) => setNewCard({ ...newCard, era: e.target.value })}
                className="px-3 py-2 rounded-lg text-xs bg-white/5 border border-white/10 text-[color:var(--text-primary)] outline-none">
                {ERAS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
              <select value={newCard.rarity} onChange={(e) => setNewCard({ ...newCard, rarity: e.target.value as Card["rarity"] })}
                className="px-3 py-2 rounded-lg text-xs bg-white/5 border border-white/10 outline-none"
                style={{ color: RARITY_CONFIG[newCard.rarity].color }}>
                {RARITIES.map((r) => <option key={r} value={r}>{RARITY_CONFIG[r].label}</option>)}
              </select>
              <button type="button" onClick={() => createCard.mutate(newCard)}
                disabled={!newCard.name || createCard.isPending}
                className="py-2 rounded-lg text-xs font-bold text-white disabled:opacity-40"
                style={{ background: "var(--accent)" }}>
                {createCard.isPending ? "Creando..." : "Crear"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabla */}
      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-[color:var(--text-muted)]">
                <th className="px-3 py-3 text-left">Carta</th>
                <th className="px-3 py-3 text-left">Miembro</th>
                <th className="px-3 py-3 text-left">Era</th>
                <th className="px-3 py-3 text-left">Rareza</th>
                <th className="px-3 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filtered.map((card) =>
                  editingId === card.id ? (
                    <EditRow key={card.id} card={card}
                      onSave={(data) => { updateCard.mutate({ id: card.id, data }); setEditingId(null); }}
                      onCancel={() => setEditingId(null)} />
                  ) : (
                    <motion.tr key={card.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          {card.image_url ? (
                            <Image src={card.image_url} alt={card.name} width={24} height={34} className="rounded object-cover" />
                          ) : (
                            <div className="w-6 h-8 rounded flex items-center justify-center text-sm"
                              style={{ background: `${RARITY_CONFIG[card.rarity]?.color}20` }}>💜</div>
                          )}
                          <span className="text-xs text-[color:var(--text-primary)]">{card.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-[color:var(--text-secondary)]">{card.member}</td>
                      <td className="px-3 py-2.5 text-xs text-[color:var(--text-muted)]">{card.era}</td>
                      <td className="px-3 py-2.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `${RARITY_CONFIG[card.rarity]?.color}20`, color: RARITY_CONFIG[card.rarity]?.color }}>
                          {RARITY_CONFIG[card.rarity]?.label}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setEditingId(card.id)}
                            className="text-[10px] px-2 py-1 rounded text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)] hover:bg-white/10 transition-colors">
                            Editar
                          </button>
                          <button type="button"
                            onClick={() => { if (confirm(`¿Eliminar "${card.name}"?`)) deleteCard.mutate(card.id); }}
                            className="text-[10px] px-2 py-1 rounded text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Gift Tab ───────────────────────────────────────────────────────────── */

function GiftTab() {
  const { session } = useAuthStore();
  const [search, setSearch]               = useState("");
  const [selected, setSelected]           = useState<{ id: string; name: string; avatar: string | null } | null>(null);
  const [packType, setPackType]           = useState<"simple" | "super">("simple");
  const [reason, setReason]               = useState("");
  const [done, setDone]                   = useState(false);
  const { data: results = [] }            = useSearchUsers(search);
  const giftMutation                      = useGiftPack();

  function handleGift() {
    if (!selected) return;
    giftMutation.mutate({ recipient_id: selected.id, pack_type: packType, reason }, {
      onSuccess: () => {
        setDone(true);
        setSelected(null);
        setSearch("");
        setReason("");
        setTimeout(() => setDone(false), 3000);
      },
    });
  }

  if (!session) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-[color:var(--text-muted)] text-sm">Iniciá sesión para regalar sobres.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md space-y-4">
      <p className="text-xs text-[color:var(--text-muted)]">
        Enviá un sobre directamente a un usuario por un evento especial.
      </p>

      {/* Búsqueda */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar usuario por nombre..."
          value={selected ? selected.name : search}
          onChange={(e) => { setSearch(e.target.value); setSelected(null); }}
          className="w-full px-3 py-2.5 rounded-lg text-sm bg-white/5 border border-white/10 text-[color:var(--text-primary)] placeholder-[color:var(--text-muted)] outline-none focus:border-[color:var(--accent)]"
        />
        {results.length > 0 && !selected && (
          <div className="absolute top-full mt-1 inset-x-0 glass-card rounded-lg overflow-hidden z-10 border border-white/10">
            {results.map((u) => (
              <button key={u.id} type="button"
                onClick={() => { setSelected({ id: u.id, name: u.name ?? "", avatar: u.avatar }); setSearch(""); }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors text-left">
                {u.avatar && <Image src={u.avatar} alt={u.name ?? ""} width={28} height={28} className="rounded-full object-cover" />}
                <span className="text-sm text-[color:var(--text-primary)]">{u.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)" }}>
            {selected.avatar && <Image src={selected.avatar} alt={selected.name} width={24} height={24} className="rounded-full object-cover" />}
            <span className="text-sm text-[color:var(--text-primary)] flex-1">{selected.name}</span>
            <button type="button" onClick={() => setSelected(null)} className="text-[color:var(--text-muted)] hover:text-white text-xs">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tipo de sobre */}
      <div className="flex gap-2">
        {(["simple", "super"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setPackType(t)}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: packType === t
                ? t === "super" ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "linear-gradient(135deg, #1d4ed8, #60a5fa)"
                : "rgba(255,255,255,0.05)",
              color: packType === t ? "#fff" : "var(--text-secondary)",
              border: packType === t ? "none" : "1px solid rgba(255,255,255,0.08)",
            }}>
            {t === "super" ? "✨ Super" : "💜 Simple"}
          </button>
        ))}
      </div>

      <input type="text" placeholder="Motivo (ej: Cumpleaños de Jin)"
        value={reason} onChange={(e) => setReason(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg text-sm bg-white/5 border border-white/10 text-[color:var(--text-primary)] placeholder-[color:var(--text-muted)] outline-none focus:border-[color:var(--accent)]" />

      <button type="button" onClick={handleGift}
        disabled={!selected || giftMutation.isPending}
        className="w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-40 transition-opacity"
        style={{ background: "linear-gradient(135deg, var(--accent), #a855f7)" }}>
        {giftMutation.isPending ? "Enviando..." : done ? "✅ ¡Sobre enviado!" : "Enviar sobre"}
      </button>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

const TABS: { id: Tab; label: string }[] = [
  { id: "stats", label: "Estadísticas" },
  { id: "cards", label: "Catálogo"     },
  { id: "gift",  label: "Regalar"      },
];

export default function CollectiblesPage() {
  const [tab, setTab] = useState<Tab>("stats");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[color:var(--text-primary)]">Coleccionables</h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-0.5">Sobres, cartas y rarezas</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 glass-card p-1 rounded-xl w-fit">
        {TABS.map(({ id, label }) => (
          <button key={id} type="button" onClick={() => setTab(id)}
            className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ color: tab === id ? "#fff" : "var(--text-secondary)" }}>
            {tab === id && (
              <motion.div layoutId="collectibles-tab"
                className="absolute inset-0 rounded-lg"
                style={{ background: "var(--accent)" }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }} />
            )}
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}>
          {tab === "stats" && <StatsTab />}
          {tab === "cards" && <CardsTab />}
          {tab === "gift"  && <GiftTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
