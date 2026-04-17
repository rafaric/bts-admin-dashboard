import type {
  AdminUser,
  Post,
  AuditLog,
  DailyMetric,
  MemberStat,
  EraStat,
  OverviewStats,
} from "@/types";
import { MEMBER_COLORS } from "./constants";

/* ── Users ──────────────────────────────────────────────────────────────── */
export const MOCK_USERS: AdminUser[] = [
  { id: "u1",  username: "army_rm_world",    full_name: "Valentina Kim",   avatar_url: "https://api.dicebear.com/9.x/thumbs/svg?seed=rm",       bio: "RM bias forever 💜",    army_since: "2017-01-01", favorite_member: "RM",       is_admin: false, is_banned: false, created_at: "2026-01-12T10:00:00Z", last_sign_in_at: "2026-04-16T21:30:00Z", email: "valentina@example.com" },
  { id: "u2",  username: "jin_worldwide",    full_name: "Camila Yoon",     avatar_url: "https://api.dicebear.com/9.x/thumbs/svg?seed=jin",      bio: "Worldwide handsome stan", army_since: "2016-01-01", favorite_member: "Jin",      is_admin: false, is_banned: false, created_at: "2026-01-15T08:30:00Z", last_sign_in_at: "2026-04-17T09:00:00Z", email: "camila@example.com" },
  { id: "u3",  username: "suga_genius",      full_name: "Sofia Park",      avatar_url: "https://api.dicebear.com/9.x/thumbs/svg?seed=suga",     bio: "Genius at work 🎵",     army_since: "2015-01-01", favorite_member: "Suga",     is_admin: false, is_banned: true,  created_at: "2026-01-20T14:00:00Z", last_sign_in_at: "2026-04-10T18:00:00Z", email: "sofia@example.com" },
  { id: "u4",  username: "hobi_sunshine",    full_name: "Lucía Han",       avatar_url: "https://api.dicebear.com/9.x/thumbs/svg?seed=jhope",    bio: "Your hope, my hope 🌻",  army_since: "2018-01-01", favorite_member: "J-Hope",   is_admin: false, is_banned: false, created_at: "2026-02-01T11:00:00Z", last_sign_in_at: "2026-04-17T07:45:00Z", email: "lucia@example.com" },
  { id: "u5",  username: "chimchim_bias",    full_name: "Isabella Jeon",   avatar_url: "https://api.dicebear.com/9.x/thumbs/svg?seed=jimin",    bio: "Jimin babie 🌸",        army_since: "2019-01-01", favorite_member: "Jimin",    is_admin: false, is_banned: false, created_at: "2026-02-10T09:00:00Z", last_sign_in_at: "2026-04-16T23:00:00Z", email: "isabella@example.com" },
  { id: "u6",  username: "taehyung_art",     full_name: "Mariana Choi",    avatar_url: "https://api.dicebear.com/9.x/thumbs/svg?seed=taehyung", bio: "V is art personified 🎨", army_since: "2017-01-01", favorite_member: "V",        is_admin: false, is_banned: false, created_at: "2026-02-14T16:00:00Z", last_sign_in_at: "2026-04-15T20:00:00Z", email: "mariana@example.com" },
  { id: "u7",  username: "jk_golden",        full_name: "Renata Jung",     avatar_url: "https://api.dicebear.com/9.x/thumbs/svg?seed=jk",       bio: "Golden maknae forever", army_since: "2020-01-01", favorite_member: "Jungkook", is_admin: false, is_banned: false, created_at: "2026-02-20T12:00:00Z", last_sign_in_at: "2026-04-17T10:00:00Z", email: "renata@example.com" },
  { id: "u8",  username: "bts_7_always",     full_name: "Daniela Moon",    avatar_url: "https://api.dicebear.com/9.x/thumbs/svg?seed=7bts",     bio: "OT7 or nothing 💜",     army_since: "2016-01-01", favorite_member: "RM",       is_admin: false, is_banned: false, created_at: "2026-03-01T10:00:00Z", last_sign_in_at: "2026-04-16T14:00:00Z", email: "daniela@example.com" },
  { id: "u9",  username: "purple_heart_99",  full_name: "Andrea Kwon",     avatar_url: "https://api.dicebear.com/9.x/thumbs/svg?seed=purple",   bio: "I Purple You 💜",       army_since: "2021-01-01", favorite_member: "Jimin",    is_admin: false, is_banned: false, created_at: "2026-03-05T08:00:00Z", last_sign_in_at: "2026-04-14T11:00:00Z", email: "andrea@example.com" },
  { id: "u10", username: "namjoon_philosopher", full_name: "Catalina Kim", avatar_url: "https://api.dicebear.com/9.x/thumbs/svg?seed=nj",       bio: "Deep thinker like RM",  army_since: "2018-01-01", favorite_member: "RM",       is_admin: false, is_banned: false, created_at: "2026-03-10T14:00:00Z", last_sign_in_at: "2026-04-17T08:30:00Z", email: "catalina@example.com" },
  { id: "u11", username: "seokjin_astronaut", full_name: "Valentina Cho",  avatar_url: "https://api.dicebear.com/9.x/thumbs/svg?seed=astro",    bio: "Waiting for Jin's return", army_since: "2022-01-01", favorite_member: "Jin",    is_admin: false, is_banned: false, created_at: "2026-03-15T10:00:00Z", last_sign_in_at: "2026-04-16T19:00:00Z", email: "valcho@example.com" },
  { id: "u12", username: "yoongi_agust_d",   full_name: "Fernanda Min",    avatar_url: "https://api.dicebear.com/9.x/thumbs/svg?seed=agust",    bio: "AGUST D era forever",   army_since: "2019-01-01", favorite_member: "Suga",     is_admin: false, is_banned: true,  created_at: "2026-03-20T12:00:00Z", last_sign_in_at: "2026-04-05T15:00:00Z", email: "fernanda@example.com" },
  { id: "u13", username: "hoseok_hope_world", full_name: "Gabriela Jung",  avatar_url: "https://api.dicebear.com/9.x/thumbs/svg?seed=hw",       bio: "Hope World citizen 🌍",  army_since: "2020-01-01", favorite_member: "J-Hope",   is_admin: false, is_banned: false, created_at: "2026-03-25T09:00:00Z", last_sign_in_at: "2026-04-17T06:00:00Z", email: "gabriela@example.com" },
  { id: "u14", username: "park_jimin_95",    full_name: "Natalia Park",    avatar_url: "https://api.dicebear.com/9.x/thumbs/svg?seed=pjm",      bio: "Jimin's smile is my happiness", army_since: "2017-01-01", favorite_member: "Jimin", is_admin: false, is_banned: false, created_at: "2026-04-01T11:00:00Z", last_sign_in_at: "2026-04-16T22:00:00Z", email: "natalia@example.com" },
  { id: "u15", username: "kim_taehyung_fan", full_name: "Patricia Choi",   avatar_url: "https://api.dicebear.com/9.x/thumbs/svg?seed=kt",       bio: "V supremacy always",    army_since: "2023-01-01", favorite_member: "V",        is_admin: false, is_banned: false, created_at: "2026-04-05T14:00:00Z", last_sign_in_at: "2026-04-15T17:00:00Z", email: "patricia@example.com" },
];

/* ── Posts ──────────────────────────────────────────────────────────────── */
export const MOCK_POSTS: Post[] = [
  { id: "p1",  user_id: "u1",  content: "Acabo de escuchar Indigo por décima vez hoy 🎵 RM es un genio",                                        image_url: null, tagged_members: ["RM"],             era: "Map of the Soul", created_at: "2026-04-17T08:00:00Z", likes_count: 24, author: { id: "u1",  username: "army_rm_world",    avatar_url: MOCK_USERS[0].avatar_url } },
  { id: "p2",  user_id: "u2",  content: "La foto de Jin con su uniforme militar me rompió el corazón y lo reparó al mismo tiempo 💜",           image_url: null, tagged_members: ["Jin"],            era: "Proof",           created_at: "2026-04-17T07:30:00Z", likes_count: 41, author: { id: "u2",  username: "jin_worldwide",    avatar_url: MOCK_USERS[1].avatar_url } },
  { id: "p3",  user_id: "u4",  content: "J-Hope en Lollapalooza 2022 fue el momento más proud de toda mi vida como ARMY 🌻",                   image_url: null, tagged_members: ["J-Hope"],         era: "BE",              created_at: "2026-04-17T06:45:00Z", likes_count: 18, author: { id: "u4",  username: "hobi_sunshine",    avatar_url: MOCK_USERS[3].avatar_url } },
  { id: "p4",  user_id: "u5",  content: "Set Me Free Pt.2 es arte puro. Jimin rompió todos los límites con ese comeback solo 🌸",              image_url: null, tagged_members: ["Jimin"],          era: "Map of the Soul", created_at: "2026-04-16T22:00:00Z", likes_count: 35, author: { id: "u5",  username: "chimchim_bias",    avatar_url: MOCK_USERS[4].avatar_url } },
  { id: "p5",  user_id: "u6",  content: "Layover de V es el álbum más hermoso que escuché en años. Raataan Lambiyan 😭",                       image_url: null, tagged_members: ["V"],              era: "Proof",           created_at: "2026-04-16T20:30:00Z", likes_count: 29, author: { id: "u6",  username: "taehyung_art",     avatar_url: MOCK_USERS[5].avatar_url } },
  { id: "p6",  user_id: "u7",  content: "Seven llegó al #1 en Billboard y lloré durante 3 horas seguidas no me arrepiento 🥇",                 image_url: null, tagged_members: ["Jungkook"],       era: "Butter",          created_at: "2026-04-16T19:00:00Z", likes_count: 52, author: { id: "u7",  username: "jk_golden",        avatar_url: MOCK_USERS[6].avatar_url } },
  { id: "p7",  user_id: "u8",  content: "FESTA 2026 ya pronto y yo sin poder dormir de emoción. OT7 PARA SIEMPRE 💜",                          image_url: null, tagged_members: ["RM","Jin","Suga","J-Hope","Jimin","V","Jungkook"], era: "Arirang", created_at: "2026-04-16T18:00:00Z", likes_count: 67, author: { id: "u8",  username: "bts_7_always",     avatar_url: MOCK_USERS[7].avatar_url } },
  { id: "p8",  user_id: "u10", content: "La parte de RM en Arirang — 'I'm rooted here, I won't ever change' — me hizo llorar. Qué letra 🙏",  image_url: null, tagged_members: ["RM"],             era: "Arirang",         created_at: "2026-04-16T17:00:00Z", likes_count: 33, author: { id: "u10", username: "namjoon_philosopher", avatar_url: MOCK_USERS[9].avatar_url } },
  { id: "p9",  user_id: "u13", content: "Hope on the Street vol.1 es lo mejor que pasó este año. Hoseok es música hecha persona 🕺",          image_url: null, tagged_members: ["J-Hope"],         era: "BE",              created_at: "2026-04-16T15:00:00Z", likes_count: 22, author: { id: "u13", username: "hoseok_hope_world", avatar_url: MOCK_USERS[12].avatar_url } },
  { id: "p10", user_id: "u14", content: "FACE de Jimin es la obra de arte más honesta y vulnerable que escuché. Crecí con este álbum 🌸",     image_url: null, tagged_members: ["Jimin"],          era: "Map of the Soul", created_at: "2026-04-16T13:00:00Z", likes_count: 45, author: { id: "u14", username: "park_jimin_95",    avatar_url: MOCK_USERS[13].avatar_url } },
];

/* ── Audit log ──────────────────────────────────────────────────────────── */
export const MOCK_AUDIT: AuditLog[] = [
  { id: "a1", admin_id: "admin1", admin_username: "admin", action: "ban_user",     target_id: "u3",  target_label: "suga_genius",      created_at: "2026-04-15T10:00:00Z" },
  { id: "a2", admin_id: "admin1", admin_username: "admin", action: "ban_user",     target_id: "u12", target_label: "yoongi_agust_d",   created_at: "2026-04-13T14:00:00Z" },
  { id: "a3", admin_id: "admin1", admin_username: "admin", action: "delete_post",  target_id: "p99", target_label: "post de u3",       created_at: "2026-04-15T10:05:00Z" },
  { id: "a4", admin_id: "admin1", admin_username: "admin", action: "delete_comment", target_id: "c55", target_label: "comentario de u12", created_at: "2026-04-13T14:10:00Z" },
  { id: "a5", admin_id: "admin1", admin_username: "admin", action: "unban_user",   target_id: "u3",  target_label: "suga_genius",      created_at: "2026-04-16T09:00:00Z" },
];

/* ── Daily metrics (last 30 days) ───────────────────────────────────────── */
function daysAgo(n: number): string {
  const d = new Date("2026-04-17");
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export const MOCK_DAILY_METRICS: DailyMetric[] = Array.from({ length: 30 }, (_, i) => ({
  date:         daysAgo(29 - i),
  new_users:    Math.floor(Math.random() * 8  + 1),
  new_posts:    Math.floor(Math.random() * 20 + 5),
  logins:       Math.floor(Math.random() * 40 + 10),
  interactions: Math.floor(Math.random() * 80 + 20),
}));

/* ── Member stats ───────────────────────────────────────────────────────── */
export const MOCK_MEMBER_STATS: MemberStat[] = [
  { member: "RM",       posts: 48, color: MEMBER_COLORS["RM"]       },
  { member: "Jin",      posts: 35, color: MEMBER_COLORS["Jin"]      },
  { member: "Suga",     posts: 41, color: MEMBER_COLORS["Suga"]     },
  { member: "J-Hope",   posts: 39, color: MEMBER_COLORS["J-Hope"]   },
  { member: "Jimin",    posts: 56, color: MEMBER_COLORS["Jimin"]    },
  { member: "V",        posts: 44, color: MEMBER_COLORS["V"]        },
  { member: "Jungkook", posts: 62, color: MEMBER_COLORS["Jungkook"] },
];

/* ── Era stats ──────────────────────────────────────────────────────────── */
export const MOCK_ERA_STATS: EraStat[] = [
  { era: "Arirang",         posts: 87  },
  { era: "Proof",           posts: 64  },
  { era: "Butter",          posts: 53  },
  { era: "BE",              posts: 48  },
  { era: "Map of the Soul", posts: 71  },
  { era: "Love Yourself",   posts: 59  },
  { era: "Wings",           posts: 34  },
  { era: "화양연화",         posts: 28  },
  { era: "2 Cool 4 Skool",  posts: 15  },
];

/* ── Overview KPIs ──────────────────────────────────────────────────────── */
export const MOCK_OVERVIEW: OverviewStats = {
  total_users:          15,
  active_users_today:   8,
  total_posts:          325,
  posts_today:          12,
  banned_users:         2,
  avg_session_minutes:  24,
};
