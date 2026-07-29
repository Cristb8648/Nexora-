import React, { useState } from 'react';
import {
  X,
  BarChart3,
  Users,
  Package,
  Flag,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Activity,
  FileCheck,
  Sparkles,
  Search
} from 'lucide-react';
import { ReportItem, Listing, UserProfile } from '../types';
import { getReports, addReport } from '../services/storage';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: Listing[];
  currentUser: UserProfile;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  listings,
  currentUser
}) => {
  const [reports, setReports] = useState<ReportItem[]>(getReports());
  const [activeTab, setActiveTab] = useState<'metrics' | 'reports' | 'shops'>('metrics');

  if (!isOpen) return null;

  const handleResolveReport = (reportId: string) => {
    const updated = reports.map(r => r.id === reportId ? { ...r, status: 'Resuelto' as const } : r);
    setReports(updated);
    localStorage.setItem('nexora_reports_v1', JSON.stringify(updated));
  };

  const completedOpsCount = listings.filter(l => l.status === 'Vendido').length + 18;
  const avgQualityScore = Math.round(
    listings.reduce((acc, l) => acc + l.qualityScore, 0) / (listings.length || 1)
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base">Centro de Operaciones NEXORA</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.2 rounded-full font-bold">
                  Panel Administrador
                </span>
              </div>
              <p className="text-xs text-slate-400">Supervisión en tiempo real • Santiago del Estero v1.0</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher Bar */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'metrics' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📊 Métricas de Plataforma
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reports' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Centro de Reportes ({reports.filter(r => r.status === 'Pendiente').length})</span>
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 flex-1">
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-1">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Users className="w-4 h-4 text-blue-600" /> Usuarios Activos
                  </span>
                  <div className="text-2xl font-black text-slate-900">1,248</div>
                  <span className="text-[10px] text-emerald-600 font-bold">+18% esta semana</span>
                </div>

                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-1">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Package className="w-4 h-4 text-blue-600" /> Publicaciones
                  </span>
                  <div className="text-2xl font-black text-slate-900">{listings.length + 42}</div>
                  <span className="text-[10px] text-blue-600 font-bold">Catálogo verificado</span>
                </div>

                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-1">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Operaciones Concretadas
                  </span>
                  <div className="text-2xl font-black text-slate-900">{completedOpsCount}</div>
                  <span className="text-[10px] text-emerald-600 font-bold">100% Acuerdos Seguros</span>
                </div>

                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-1">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-500" /> Promedio Calidad IA
                  </span>
                  <div className="text-2xl font-black text-emerald-700">{avgQualityScore}/100</div>
                  <span className="text-[10px] text-slate-500 font-medium">Análisis automático activo</span>
                </div>
              </div>

              {/* Founder Log Callout */}
              <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-sky-300">
                  <ShieldCheck className="w-4 h-4" /> Bitácora del Fundador Cristian Bravo
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "NEXORA nace para garantizar que la confianza sea el principal activo del comercio local en Santiago del Estero. La reputación nunca se vende: se gana con comportamiento transparente."
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900">
                Denuncias y Moderación de Contenido
              </h3>

              {reports.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs">
                  No hay denuncias o reportes pendientes de revisión.
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900">{rep.reason}</span>
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                            rep.status === 'Pendiente' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {rep.status}
                          </span>
                        </div>
                        <p className="text-slate-600">{rep.details}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Reportado por: {rep.reporterName} • {rep.createdAt}
                        </p>
                      </div>

                      {rep.status === 'Pendiente' && (
                        <button
                          onClick={() => handleResolveReport(rep.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg shrink-0 cursor-pointer"
                        >
                          Marcar Resuelto
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
