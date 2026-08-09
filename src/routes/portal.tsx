import { createFileRoute, Outlet, Link, useMatchRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  CalendarCheck,
  GraduationCap,
  CreditCard,
  LogOut,
  User,
  Menu,
  X,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/portal")({
  component: PortalLayout,
});

const navItems = [
  { to: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { to: "/portal/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/portal/results", label: "Results", icon: GraduationCap },
  { to: "/portal/notes", label: "Notes", icon: BookOpen },
  { to: "/portal/fees", label: "Fees", icon: CreditCard },
];

function PortalLayout() {
  const { user, logout } = useAuth();
  const matchRoute = useMatchRoute();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="flex min-h-screen flex-col bg-gray-50">
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-black text-white">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            {/* Logo / Brand */}
            <Link to="/portal" className="flex items-center gap-2">
              <span className="font-display text-lg font-bold">Al-Mustafa</span>
              <span className="hidden text-xs text-gray-400 sm:inline">Student Portal</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 sm:flex">
              {navItems.map((item) => {
                const isActive =
                  item.to === "/portal"
                    ? matchRoute({ to: "/portal", fuzzy: false })
                    : matchRoute({ to: item.to, fuzzy: true });
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-white text-black"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side: user + logout */}
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 text-sm text-gray-400 sm:flex">
                <User className="h-4 w-4" />
                <span>{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="hidden text-gray-400 hover:text-white sm:flex"
              >
                <LogOut className="h-4 w-4" />
              </Button>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded p-1 text-gray-400 hover:text-white sm:hidden"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Nav Dropdown */}
          {mobileMenuOpen && (
            <nav className="border-t border-gray-800 px-4 pb-3 pt-2 sm:hidden">
              {navItems.map((item) => {
                const isActive =
                  item.to === "/portal"
                    ? matchRoute({ to: "/portal", fuzzy: false })
                    : matchRoute({ to: item.to, fuzzy: true });
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-white text-black"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-2 border-t border-gray-800 pt-2">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400">
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </nav>
          )}
        </header>

        {/* Main Content */}
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
          <Outlet />
        </main>

        {/* Simple Footer */}
        <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-500">
          Al-Mustafa Academy &copy; {new Date().getFullYear()} &mdash; Student Portal
        </footer>
      </div>
    </ProtectedRoute>
  );
}
