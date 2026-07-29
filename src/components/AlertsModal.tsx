import React, { useState } from 'react';
import { X, Bell, Plus, CheckCircle2, Trash2, Sparkles, Filter } from 'lucide-react';
import { PriceAlert, ProductCategory } from '../types';
import { addPriceAlert } from '../services/storage';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: PriceAlert[];
  onRefreshAlerts: () => void;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onRefreshAlerts
}) => {
  const [keyword, setKeyword] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [category, setCategory] = useState<ProductCategory>('Tecnología');

  if (!isOpen) return null;

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    addPriceAlert(keyword.trim(), category, maxPrice);
    setKeyword('');
    onRefreshAlerts();
    alert("¡Alerta creada con éxito! Te notificaremos apenas ingrese una coincidencia en Santiago del Estero.");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Radar de Oportunidades & Alertas ({alerts.length})</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-6 text-slate-800 text-xs">
          {/* Create Alert Form */}
          <form onSubmit={handleCreateAlert} className="bg-blue-50 border border-blue-200 p-4 rounded-2xl space-y-3">
            <div className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" /> Crear Nueva Alerta Automática
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Palabra Clave o Producto</label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Ej: Moto 110, Notebook i5, Bicicleta R29..."
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium outline-hidden"
                >
                  {['Tecnología', 'Vehículos', 'Hogar', 'Servicios', 'Moda', 'Deportes', 'Mascotas', 'Inmuebles', 'Herramientas'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Precio Máximo (ARS)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl cursor-pointer shadow-xs transition-colors"
            >
              Guardar Alerta Inteligente
            </button>
          </form>

          {/* Existing Alerts List */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Mis Alertas Activas</h3>
            {alerts.map(a => (
              <div key={a.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{a.keyword}</div>
                  <div className="text-slate-500 text-[10px]">
                    Hasta ${a.maxPrice?.toLocaleString('es-AR')} • {a.category} • Santiago del Estero
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {a.matchesCount} Coincidencias
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
