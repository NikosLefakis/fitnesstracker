"use client";

import { useState } from "react";
import { Bell, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { useNotificationStore } from "@/store/useNotificationStore";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markAllAsRead, unreadCount } = useNotificationStore();
  const unread = unreadCount();

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unread > 0) markAllAsRead();
  };

  const getIcon = (type: string) => {
    if (type === 'SUCCESS') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    if (type === 'WARNING') return <AlertCircle className="w-5 h-5 text-amber-500" />;
    return <Info className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="relative">
      <button 
        onClick={handleOpen}
        className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800/50 active:scale-95"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 border border-[#020617]"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-4 w-80 bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
              <span className="font-bold text-sm text-white">Ειδοποιήσεις</span>
              {notifications.length > 0 && (
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-900 px-2 py-1 rounded-full">
                  {notifications.length} Νέες
                </span>
              )}
            </div>
            
            <div className="max-h-[350px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-bold">
                  Δεν έχεις νέες ειδοποιήσεις.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notif.type)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{notif.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                        <p className="text-[9px] text-slate-600 mt-2 font-bold uppercase tracking-widest">
                          {notif.createdAt.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}