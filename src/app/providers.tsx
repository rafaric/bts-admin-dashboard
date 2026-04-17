"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/browser";
import { useAuthStore } from "@/store/useAuthStore";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setSession } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) =>
      setSession(session),
    );
    return () => listener.subscription.unsubscribe();
  }, [setSession]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClientRef = useRef<QueryClient | null>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: { queries: { staleTime: 30_000 } },
    });
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
