import React, { useState, useEffect } from 'react';
import { X, Smartphone, Download, Share, PlusSquare, CheckCircle2, Globe, Sparkles } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert("Para instalar NEXORA en tu pantalla de inicio, usá el menú de tu navegador (Compartir o 3 puntos) y elegí 'Agregar a la pantalla principal'.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col space-y-4 p-6 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5 font-black text-slate-900 text-sm">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3>Instalar NEXORA en tu Celular</h3>
              <p className="text-[10px] text-slate-500 font-normal">Acceso directo como App Nativa</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Install Button if supported */}
        {deferredPrompt && (
          <button
            onClick={handleInstallClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Instalar Aplicación Ahora</span>
          </button>
        )}

        {/* Steps for Android / Chrome */}
        <div className="space-y-3 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              🤖 En Android (Chrome / Edge):
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
              <li>Abrí el menú de <strong>3 puntos (⋮)</strong> en la esquina superior de Chrome.</li>
              <li>Tocá en <strong>"Agregar a la pantalla principal"</strong> o <strong>"Instalar aplicación"</strong>.</li>
              <li>¡Listo! Ya podés usar NEXORA directamente desde el ícono en tu teléfono.</li>
            </ol>
          </div>

          {/* Steps for iPhone / Safari */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              🍎 En iPhone (Safari):
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
              <li>Tocá el botón <strong>Compartir <Share className="w-3 h-3 inline text-blue-600" /></strong> abajo en Safari.</li>
              <li>Desplazate hacia abajo y seleccioná <strong>"Agregar a inicio" <PlusSquare className="w-3 h-3 inline text-slate-700" /></strong>.</li>
              <li>Confirmá tocando <strong>"Agregar"</strong> arriba a la derecha.</li>
            </ol>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl cursor-pointer"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
