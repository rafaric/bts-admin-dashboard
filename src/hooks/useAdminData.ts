"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import {
  MOCK_OVERVIEW,
  MOCK_USERS,
  MOCK_POSTS,
  MOCK_AUDIT,
  MOCK_DAILY_METRICS,
  MOCK_MEMBER_STATS,
  MOCK_ERA_STATS,
  MOCK_POLL_STATS,
  MOCK_COLLECTIBLES_STATS,
  MOCK_CARDS,
} from "@/lib/mock-data";
import { MEMBER_COLORS } from "@/lib/constants";
import type { BtsMember } from "@/lib/constants";
import type { AdminUser, Post, AuditLog, OverviewStats, DailyMetric, MemberStat, EraStat, PollStat, Card, CollectiblesStats } from "@/types";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

/* ── Overview ────────────────────────────────────────────────────────────── */
export function useOverview() {
  const { session } = useAuthStore();
  return useQuery<OverviewStats>({
    queryKey: ["overview", !!session],
    queryFn: session
      ? () => apiFetch<OverviewStats>("/api/admin/overview")
      : () => Promise.resolve(MOCK_OVERVIEW),
  });
}

/* ── Users ───────────────────────────────────────────────────────────────── */
export function useUsers() {
  const { session } = useAuthStore();
  return useQuery<AdminUser[]>({
    queryKey: ["users", !!session],
    queryFn: session
      ? () => apiFetch<AdminUser[]>("/api/admin/users")
      : () => Promise.resolve(MOCK_USERS),
  });
}

export function useBanUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: "ban" | "unban" }) =>
      fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      }).then((r) => { if (!r.ok) throw new Error("Failed"); }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/users/${id}`, { method: "DELETE" })
        .then((r) => { if (!r.ok) throw new Error("Failed"); }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

/* ── Posts ───────────────────────────────────────────────────────────────── */
export function usePosts() {
  const { session } = useAuthStore();
  return useQuery<Post[]>({
    queryKey: ["posts", !!session],
    queryFn: session
      ? () => apiFetch<Post[]>("/api/admin/posts")
      : () => Promise.resolve(MOCK_POSTS),
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/posts/${id}`, { method: "DELETE" })
        .then((r) => { if (!r.ok) throw new Error("Failed"); }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}

type AnalyticsData = { daily: DailyMetric[]; members: MemberStat[]; eras: EraStat[]; polls: PollStat[] };

/* ── Analytics ───────────────────────────────────────────────────────────── */
export function useAnalytics() {
  const { session } = useAuthStore();
  return useQuery<AnalyticsData>({
    queryKey: ["analytics", !!session],
    queryFn: session
      ? async () => {
          const data = await apiFetch<{
            daily:   { date: string; new_posts: number; new_users: number; interactions: number; logins: number }[];
            members: { member: string; posts: number }[];
            eras:    { era: string; posts: number }[];
            polls:   PollStat[];
          }>("/api/admin/analytics");
          return {
            daily:   data.daily,
            members: data.members.map((m) => ({
              ...m,
              color: MEMBER_COLORS[m.member as BtsMember] ?? "var(--accent)",
            })),
            eras:  data.eras,
            polls: data.polls ?? [],
          };
        }
      : () => Promise.resolve({
          daily:   MOCK_DAILY_METRICS,
          members: MOCK_MEMBER_STATS,
          eras:    MOCK_ERA_STATS,
          polls:   MOCK_POLL_STATS,
        }),
  });
}

/* ── Audit ───────────────────────────────────────────────────────────────── */
export function useAudit() {
  const { session } = useAuthStore();
  return useQuery<AuditLog[]>({
    queryKey: ["audit", !!session],
    queryFn: session
      ? () => apiFetch<AuditLog[]>("/api/admin/audit")
      : () => Promise.resolve(MOCK_AUDIT),
  });
}

/* ── Collectibles ────────────────────────────────────────────────────────── */
export function useCollectiblesStats() {
  const { session } = useAuthStore();
  return useQuery<CollectiblesStats>({
    queryKey: ["collectibles", "stats", !!session],
    queryFn: session
      ? () => apiFetch<CollectiblesStats>("/api/admin/collectibles/stats")
      : () => Promise.resolve(MOCK_COLLECTIBLES_STATS),
    refetchInterval: 30_000,
  });
}

export function useAdminCards() {
  const { session } = useAuthStore();
  return useQuery<Card[]>({
    queryKey: ["collectibles", "cards", !!session],
    queryFn: session
      ? () => apiFetch<Card[]>("/api/admin/collectibles/cards")
      : () => Promise.resolve(MOCK_CARDS),
  });
}

export function useUpdateCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Card> }) =>
      fetch(`/api/admin/collectibles/cards/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["collectibles", "cards"] }),
  });
}

export function useDeleteCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/collectibles/cards/${id}`, { method: "DELETE" })
        .then((r) => { if (!r.ok) throw new Error("Failed"); }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["collectibles", "cards"] }),
  });
}

export function useCreateCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Card, "id">) =>
      fetch("/api/admin/collectibles/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["collectibles", "cards"] }),
  });
}

export function useSearchUsers(query: string) {
  const { session } = useAuthStore();
  return useQuery<AdminUser[]>({
    queryKey: ["collectibles", "user-search", query],
    queryFn: () =>
      apiFetch<AdminUser[]>(`/api/admin/collectibles/gift?q=${encodeURIComponent(query)}`),
    enabled: !!session && query.length >= 2,
  });
}

export function useGiftPack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ recipient_id, pack_type, reason }: { recipient_id: string; pack_type: "simple" | "super"; reason?: string }) =>
      fetch("/api/admin/collectibles/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient_id, pack_type, reason }),
      }).then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["collectibles", "stats"] }),
  });
}
