import React from 'react';
import { 
  CheckCircle2, Clock, Calendar, Video, Phone, Users, 
  ArrowRight, X, ShieldCheck, FileText 
} from 'lucide-react';
import { Appointment, Language, AppRoute } from '../../types';
import { AdvocateResponseTimer } from './AdvocateResponseTimer';

interface AppointmentBookingConfirmationModalProps {
  isOpen: boolean;
  appointment: Appointment;
  language?: Language;
  onClose: () => void;
  onNavigate: (route: AppRoute, params?: any) => void;
}

export function AppointmentBookingConfirmationModal({
  isOpen,
  appointment,
  language = 'en',
  onClose,
  onNavigate,
}: AppointmentBookingConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-sky-150 shadow-[0_20px_60px_rgba(15,23,42,0.18)] space-y-6 animate-in zoom-in-95 duration-200 my-8">
        
        {/* Top Close Button */}
        <button
          id="btn-close-booking-modal"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Success Icon & Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100/90 text-emerald-600 mx-auto flex items-center justify-center border-4 border-emerald-50 shadow-inner">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {language === 'en' ? 'Your Appointment is Booked' : 'आपकी कानूनी नियुक्ति बुक हो गई है'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
              {language === 'en'
                ? 'Your appointment request has been sent to the advocate and is awaiting their response.'
                : 'आपका अपॉइंटमेंट अनुरोध अधिवक्ता को भेज दिया गया है और उनकी स्वीकृति की प्रतीक्षा में है।'}
            </p>
          </div>
        </div>

        {/* 24-Hour Advocate Response Timer Banner */}
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <AdvocateResponseTimer createdAt={appointment.createdAt} />
          </div>
          <p className="text-[11px] text-amber-800 font-medium leading-normal">
            The advocate will review your dispute details and accept within 24 hours. You can monitor the live status on your Citizen Dashboard.
          </p>
        </div>

        {/* Appointment Details Summary Card */}
        <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3 text-xs">
          
          {/* Advocate & Reference */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/70">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Selected Advocate</span>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>{appointment.advocateName}</span>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.2 rounded-full border border-sky-200">Verified</span>
              </h4>
              <p className="text-slate-500 text-[11px]">{appointment.advocateSpecialty}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
              <span className="inline-block text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                Pending Advocate Response
              </span>
            </div>
          </div>

          {/* Date, Time & Mode */}
          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200/70">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Consultation Date & Slot</span>
              <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                <span>{appointment.date} at {appointment.time}</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Mode</span>
              <span className="font-bold text-sky-700 flex items-center gap-1 mt-0.5">
                {appointment.consultationType === 'Video' && <Video className="w-3.5 h-3.5" />}
                {appointment.consultationType === 'Audio' && <Phone className="w-3.5 h-3.5" />}
                {appointment.consultationType === 'In-Person' && <Users className="w-3.5 h-3.5" />}
                <span>{appointment.consultationType} Consultation</span>
              </span>
            </div>
          </div>

          {/* Fee & Reference ID */}
          <div className="flex items-center justify-between text-slate-700 pt-1">
            <span className="font-mono text-[11px] text-slate-500">
              Booking Ref: <strong>{appointment.id}</strong>
            </span>
            <span className="font-bold text-slate-900 text-sm">
              Fee: ₹{appointment.fee}
            </span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            id="btn-modal-go-dashboard"
            onClick={() => {
              onClose();
              onNavigate('user/home');
            }}
            className="w-full sm:flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-sky-600/20 active:scale-98 transition-all"
          >
            <span>Go to Citizen Dashboard</span>
            <ArrowRight className="w-4 h-4 text-sky-100" />
          </button>

          <button
            id="btn-modal-view-appointments"
            onClick={() => {
              onClose();
              onNavigate('user/appointments');
            }}
            className="w-full sm:w-auto py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-colors"
          >
            <span>View Appointments</span>
          </button>
        </div>

      </div>
    </div>
  );
}
