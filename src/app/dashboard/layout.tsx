import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      {/* Sidebar — desktop */}
      <div className="hidden md:flex w-56 shrink-0 p-4 sticky top-0 h-dvh">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-4 md:p-6" id="main-content">
        {children}
      </main>

      {/* Bottom nav — mobile */}
      <nav
        className="fixed bottom-0 inset-x-0 md:hidden glass-card rounded-none border-x-0 border-b-0 px-2 py-2 z-50"
        aria-label="Navegación móvil"
      >
        <div className="flex justify-around">
          <MobileNavLink href="/dashboard"           label="Overview"   exact />
          <MobileNavLink href="/dashboard/users"     label="Usuarios"        />
          <MobileNavLink href="/dashboard/content"   label="Contenido"       />
          <MobileNavLink href="/dashboard/analytics" label="Analytics"       />
          <MobileNavLink href="/dashboard/audit"     label="Audit"           />
        </div>
      </nav>
    </div>
  );
}

function MobileNavLink({
  href, label, exact,
}: { href: string; label: string; exact?: boolean }) {
  return (
    <a
      href={href}
      className="flex flex-col items-center gap-0.5 px-3 py-1 text-[color:var(--text-muted)] text-[10px] font-medium"
    >
      {label}
    </a>
  );
}
