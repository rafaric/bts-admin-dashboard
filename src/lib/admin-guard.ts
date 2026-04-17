import { createSupabaseServerClient, createSupabaseAdmin } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Validates that the request comes from an authenticated admin.
 * Returns { adminId, adminUsername } on success, or a NextResponse 401/403 on failure.
 */
export async function requireAdmin(): Promise<
  | { adminId: string; adminUsername: string }
  | NextResponse
> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createSupabaseAdmin();
  const { data: profile } = await db
    .from("profiles")
    .select("id, username, is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return { adminId: profile.id, adminUsername: profile.username };
}
