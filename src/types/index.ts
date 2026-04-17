export type { BtsMember } from "@/lib/constants";

export type AdminUser = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  army_since: string | null;
  favorite_member: string | null;
  is_admin: boolean;
  is_banned: boolean;
  created_at: string;
  /** Derived from auth.users — not in profiles table directly */
  last_sign_in_at?: string | null;
  email?: string | null;
};

export type Post = {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  tagged_members: string[];
  era: string | null;
  created_at: string;
  /** Joined */
  author?: Pick<AdminUser, "id" | "username" | "avatar_url">;
  likes_count?: number;
};

export type AuditAction =
  | "ban_user"
  | "unban_user"
  | "delete_post"
  | "delete_comment"
  | "promote_admin"
  | "revoke_admin";

export type AuditLog = {
  id: string;
  admin_id: string;
  admin_username: string;
  action: AuditAction;
  target_id: string;
  target_label: string;
  metadata?: Record<string, unknown>;
  created_at: string;
};

export type DailyMetric = {
  date: string;
  new_users: number;
  new_posts: number;
  logins: number;
  interactions: number;
};

export type MemberStat = {
  member: string;
  posts: number;
  color: string;
};

export type EraStat = {
  era: string;
  posts: number;
};

export type OverviewStats = {
  total_users: number;
  active_users_today: number;
  total_posts: number;
  posts_today: number;
  banned_users: number;
  avg_session_minutes: number;
};
