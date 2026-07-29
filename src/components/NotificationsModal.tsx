import React from 'react';
import { X, Bell, CheckCircle2, TrendingDown, Sparkles, Info } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onClearNotifications?: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearNotifications
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Bell className="w-4 h-4 text-blue-400" />
            <span>Notificaciones ({notifications.length})</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3 flex-1 divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No tenés notificaciones pendientes.
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="pt-3 first:pt-0 space-y-1 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  {n.type === 'price_drop' && <TrendingDown className="w-4 h-4 text-emerald-600" />}
                  {n.type === 'alert_match' && <Sparkles className="w-4 h-4 text-blue-600" />}
                  {n.type === 'system' && <Info className="w-4 h-4 text-sky-600" />}
                  <span>{n.title}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                <div className="text-[10px] text-slate-400 text-right">
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
