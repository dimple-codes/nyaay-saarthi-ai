import React, { useState } from 'react';
import { Phone, ShieldAlert, AlertTriangle, ExternalLink, Copy, Check, Info } from 'lucide-react';
import { EmergencyHelpline, Language } from '../../types';

interface EmergencyHelplineCardProps {
  helplines: EmergencyHelpline[];
  category?: string;
  alertBanner?: string;
  language: Language;
  onClose?: () => void;
}

export function EmergencyHelplineCard({
  helplines,
  category,
  alertBanner,
  language,
  onClose
}: EmergencyHelplineCardProps) {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  if (!helplines || helplines.length === 0) return null;

  return (
    <div className="bg-rose-500/10 backdrop-blur-xl border-2 border-rose-500/30 rounded-3xl p-4 sm:p-5 shadow-[0_12px_32px_rgba(244,63,94,0.15)] space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-400/30">
                {language === 'en' ? 'Immediate Assistance' : 'तत्काल सहायता'}
              </span>
              {category && (
                <span className="text-[10px] font-semibold text-rose-900">
                  • {category}
                </span>
              )}
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-rose-950 mt-0.5">
              {language === 'en' ? 'Official Indian Emergency Helplines' : 'आधिकारिक भारतीय आपातकालीन हेल्पलाइन'}
            </h4>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-rose-700 hover:text-rose-950 font-bold px-2 py-1 rounded-lg hover:bg-rose-500/10 cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Alert Banner / Message */}
      {alertBanner && (
        <p className="text-xs text-rose-900 font-semibold leading-relaxed bg-white/70 p-3 rounded-2xl border border-rose-200 shadow-2xs">
          ⚠️ {alertBanner}
        </p>
      )}

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {helplines.map((helpline, idx) => (
          <div
            key={idx}
            className="bg-white/85 backdrop-blur-md rounded-2xl p-3 border border-rose-200/80 shadow-2xs flex items-center justify-between gap-3 hover:border-rose-300 transition-all"
          >
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {language === 'hi' && helpline.nameHi ? helpline.nameHi : helpline.name}
                </span>
                <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded font-mono shrink-0">
                  {helpline.tollFree ? 'Toll Free' : '24x7'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {helpline.available} • {language === 'hi' && helpline.descriptionHi ? helpline.descriptionHi : helpline.description}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleCopy(helpline.number)}
                title="Copy number"
                className="p-1.5 text-slate-500 hover:text-rose-700 rounded-xl hover:bg-rose-50 cursor-pointer transition-colors"
              >
                {copiedNumber === helpline.number ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              <a
                href={`tel:${helpline.number.replace(/\D/g, '')}`}
                className="py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
              >
                <Phone className="w-3 h-3" />
                <span>{helpline.number}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="flex items-center gap-1.5 text-[11px] text-rose-800/90 font-medium pt-1">
        <Info className="w-3.5 h-3.5 text-rose-600 shrink-0" />
        <span>
          {language === 'en'
            ? 'All emergency lines are free of charge, available 24/7 across India, and connected directly to government responders.'
            : 'सभी आपातकालीन नंबर निःशुल्क हैं, 24x7 उपलब्ध हैं और सीधे सरकारी सहायता केंद्रों से जुड़े हैं।'}
        </span>
      </div>
    </div>
  );
}
