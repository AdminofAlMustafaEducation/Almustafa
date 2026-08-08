"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Bell, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { notifications as defaultNotifications } from "@/data/notifications";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifs, setNotifs] = useState(defaultNotifications);

  const activeNotifs = notifs
    .filter((n) => n.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const unreadCount = activeNotifs.filter((n) => !n.isRead).length;

  function handleOpen() {
    setIsOpen(!isOpen);
  }

  function markAsRead(id: string) {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  function markAllAsRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  if (activeNotifs.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:w-96"
          >
            {/* Header */}
            <div className="bg-navy-deep px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Notifications</h3>
                  <p className="text-[11px] text-white/70">
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                      : "All caught up!"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="rounded-full px-2 py-1 text-[10px] font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {activeNotifs.map((notif) => (
                <button
                  key={notif.id}
                  type="button"
                  onClick={() => markAsRead(notif.id)}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-gray-100 p-4 text-left transition-colors hover:bg-gray-50",
                    !notif.isRead && "bg-blue-50/50"
                  )}
                >
                  <div className="relative mt-0.5 shrink-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-deep text-white">
                      <Bell className="h-4 w-4" />
                    </div>
                    {!notif.isRead && (
                      <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={cn("text-sm text-gray-900", !notif.isRead && "font-semibold")}>
                        {notif.title}
                      </h4>
                      <span className="shrink-0 text-[10px] text-gray-400">
                        {new Date(notif.date).toLocaleDateString("en-PK", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{notif.message}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        type="button"
        onClick={handleOpen}
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-full bg-navy-deep text-white shadow-lg transition-all hover:bg-navy hover:scale-105 sm:h-12 sm:w-12",
          "focus:outline-none focus:ring-4 focus:ring-navy/30"
        )}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="h-6 w-6 sm:h-5 sm:w-5" />

        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
}
