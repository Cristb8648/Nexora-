import React, { useState } from 'react';
import { X, Flag, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Listing } from '../types';
import { addReport } from '../services/storage';

interface ReportModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  listing,
  isOpen,
  onClose
}) => {
  const [reason, setReason] = useState('Publicación engañosa o precio falso');
  const [details, setDetails] = useState('');

  if (!isOpen || !listing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReport(reason, details, listing.id, listing.title);
    alert("Muchas gracias. Tu reporte fue enviado al Centro de Operaciones NEXORA para revisión prioritaria.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
            <Flag className="w-5 h-5 text-amber-600" />
            <span>Reportar Publicación</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Publicación: <span className="font-bold text-slate-800">{listing.title}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Motivo Principal</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl font-medium"
            >
              <option value="Publicación engañosa o precio falso">Publicación engañosa o precio falso</option>
              <option value="Sospecha de fraude o estafa">Sospecha de fraude o estafa</option>
              <option value="Fotos oscuras o irrelevantes">Fotos oscuras o irrelevantes</option>
              <option value="Conducta irrespetuosa en el chat">Conducta irrespetuosa en el chat</option>
              <option value="Otro problema">Otro problema</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Detalles Adicionales</label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Explicá brevemente el motivo de tu denuncia..."
              className="w-full p-2.5 border border-slate-200 rounded-xl outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl cursor-pointer shadow-xs"
          >
            Enviar Reporte a Moderación
          </button>
        </form>
      </div>
    </div>
  );
};
