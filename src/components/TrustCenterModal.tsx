import React from 'react';
import {
  X,
  ShieldCheck,
  Award,
  CheckCircle2,
  Phone,
  Mail,
  UserCheck,
  Clock,
  Share2,
  Star,
  ShoppingBag,
  TrendingUp,
  FileText
} from 'lucide-react';
import { UserProfile, TrustLevel } from '../types';

interface TrustCenterModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const TrustCenterModal: React.FC<TrustCenterModalProps> = ({
  user,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const trust = user.trustIndex;

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `Perfil de ${user.name} en NEXORA`,
        text: `Mirá mi reputación y publicaciones en NEXORA - Nivel ${trust.level} (Score ${trust.score}/100)`
      });
    } else {
      alert(`Link de perfil copiado: https://nexora.santiago.app/u/${user.username}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black">{user.name}</h2>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  @{user.username}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{user.city} • Miembro desde Julio 2026</p>
              <p className="text-xs text-slate-200 mt-1 italic">{user.bio}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          {/* ICN Score Ring Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-28 rounded-2xl bg-gradient-to-tr from-blue-700 to-sky-500 text-white flex flex-col items-center justify-center shadow-md">
                <span className="text-2xl font-black">{trust.score}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider">ICN SCORE</span>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-blue-900 font-black text-lg">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Nivel {trust.level}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Reputación calculada dinámicamente por comportamiento verificado
                </p>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 mt-1">
                  ⭐ {trust.stars} / 5.0 (basado en {trust.totalSales + trust.totalPurchases} operaciones)
                </div>
              </div>
            </div>

            <button
              onClick={handleShareProfile}
              className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-blue-600" />
              <span>Compartir Perfil</span>
            </button>
          </div>

          {/* Insignias Obtenidas */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> Insignias Obtenidas
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge) => (
                <span
                  key={badge}
                  className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Factores del Índice de Confianza */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">
              Factores de Verificación
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <Phone className="w-4 h-4 text-blue-600" /> Teléfono Verificado
                </span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {trust.verifiedPhone ? 'Sí' : 'No'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <Mail className="w-4 h-4 text-blue-600" /> Email Verificado
                </span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {trust.verifiedEmail ? 'Sí' : 'No'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <UserCheck className="w-4 h-4 text-blue-600" /> DNI / Identidad
                </span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {trust.verifiedIdentity ? 'Verificada' : 'Pendiente'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <Clock className="w-4 h-4 text-blue-600" /> Respuestas Promedio
                </span>
                <span className="font-bold text-slate-900">
                  ~{trust.avgResponseTimeMin} minutos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
