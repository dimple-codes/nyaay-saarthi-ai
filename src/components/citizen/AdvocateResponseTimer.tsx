import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { calculateResponseCountdown, ResponseCountdown } from '../../data/portalData';

interface AdvocateResponseTimerProps {
  createdAt: string;
  onExpire?: () => void;
  compact?: boolean;
  className?: string;
}

export function AdvocateResponseTimer({
  createdAt,
  onExpire,
  compact = false,
  className = '',
}: AdvocateResponseTimerProps) {
  const [countdown, setCountdown] = useState<ResponseCountdown>(() => 
    calculateResponseCountdown(createdAt, 24)
  );

  useEffect(() => {
    // Initial evaluation
    const initial = calculateResponseCountdown(createdAt, 24);
    setCountdown(initial);
    if (initial.isExpired && onExpire) {
      onExpire();
    }

    // Interval ticker
    const timer = setInterval(() => {
      const current = calculateResponseCountdown(createdAt, 24);
      setCountdown(current);

      if (current.isExpired) {
        clearInterval(timer);
        if (onExpire) {
          onExpire();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [createdAt, onExpire]);

  if (countdown.isExpired) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
        <span>Response window ended</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/90 text-amber-800 text-[11px] font-bold shadow-2xs ${className}`}>
        <Clock className="w-3 h-3 text-amber-600 animate-pulse shrink-0" />
        <span>{countdown.formatted}</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50/90 border border-amber-200/90 text-amber-900 text-xs font-bold shadow-2xs ${className}`}>
      <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
      <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
      <span className="tracking-tight">
        Response Window: <span className="font-mono font-extrabold text-amber-950">{countdown.formatted}</span>
      </span>
    </div>
  );
}
