import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  FileText,
  GraduationCap,
  Calendar,
  ClipboardCheck,
  CreditCard,
  Image,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Bell,
  ClipboardList,
  BookOpen,
  Video,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/admissions", label: "Admissions", icon: FileText },
  { to: "/admin/faculty", label: "Faculty", icon: GraduationCap },
  { to: "/admin/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/admin/batches", label: "Batches", icon: Calendar },
  { to: "/admin/exams", label: "Exams", icon: ClipboardList },
  { to: "/admin/notes", label: "Notes", icon: BookOpen },
  { to: "/admin/live-classes", label: "Live Classes", icon: Video },
  { to: "/admin/fees", label: "Fees", icon: CreditCard },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { to: "/admin/chat-agents", label: "Chat Agents", icon: MessageCircle },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
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
        {!collapsed && <span className="font-display text-lg font-bold">Al-Mustafa</span>}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded p-1 hover:bg-gray-800"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = matchRoute({
            to: item.to,
            fuzzy: item.to !== "/admin",
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
