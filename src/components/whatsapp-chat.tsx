"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActiveChatAgents } from "@/hooks/use-chat-agents";
import { useActiveNotifications } from "@/hooks/use-notifications";

export function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: activeAgents = [] } = useActiveChatAgents();
  const { data: notifications = [] } = useActiveNotifications();
  const [readNotifIds] = useState<Set<string>>(new Set());

  const unreadCount = notifications.filter((n) => !readNotifIds.has(n.id)).length;

  if (activeAgents.length === 0) return null;

  const defaultAgent = activeAgents[0];

  function handleAgentClick(agent: (typeof activeAgents)[0]) {
    const message = encodeURIComponent(
      "Assalam o Alaikum! I would like to inquire about admissions at Al-Mustafa Academy."
    );
    window.open(`https://wa.me/${agent.whatsapp_number.replace(/[^0-9]/g, "")}?text=${message}`, "_blank");
    setIsOpen(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          >
            <div className="bg-green-600 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Chat with us</h3>
                  <p className="text-[11px] text-green-100">Al-Mustafa Academy</p>
                </div>
                <button type="button" onClick={() => setIsOpen(false)} className="rounded-full p-1 text-white/80 hover:bg-green-700 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-3">
              <p className="mb-2 text-[11px] text-gray-500">Select an agent to chat on WhatsApp:</p>
              <div className="space-y-2">
                {activeAgents.map((agent) => (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => handleAgentClick(agent)}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-green-50"
                  >
                    <div className="relative shrink-0">
                      {agent.photo_url ? (
                        <img src={agent.photo_url} alt={agent.name} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                          {agent.name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-900">{agent.name}</div>
                      <div className="text-[11px] text-gray-500">{agent.role}</div>
                    </div>
                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-green-600" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => {
          if (activeAgents.length === 1) {
            handleAgentClick(defaultAgent);
          } else {
            setIsOpen(!isOpen);
          }
        }}
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all hover:bg-green-600 hover:scale-105 sm:h-12 sm:w-12",
          "focus:outline-none focus:ring-4 focus:ring-green-300"
        )}
        whileTap={{ scale: 0.95 }}
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-30" />
        <svg viewBox="0 0 24 24" className="h-7 w-7 sm:h-6 sm:w-6" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </motion.button>
    </div>
  );
}
