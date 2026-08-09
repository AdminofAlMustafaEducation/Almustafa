import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Video,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/teacher", label: "Dashboard", icon: LayoutDashboard },
  { to: "/teacher/attendance", label: "Mark Attendance", icon: CalendarCheck },
  { to: "/teacher/tests", label: "Tests", icon: FileText },
  { to: "/teacher/results", label: "Results", icon: BarChart3 },
  { to: "/teacher/notes", label: "Notes", icon: BookOpen },
  { to: "/teacher/live-classes", label: "Live Classes", icon: Video },
];

export function TeacherSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const matchRoute = useMatchRoute();

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-gray-800 bg-black text-white transition-all duration-200",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
        {!collapsed && (
          <span className="font-display text-lg font-bold">Al-Mustafa</span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded p-1 hover:bg-gray-800"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="border-b border-gray-800 px-4 py-2">
        {!collapsed && (
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Teacher Portal
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = matchRoute({
            to: item.to,
            fuzzy: item.to !== "/teacher",
          });
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white text-black"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
