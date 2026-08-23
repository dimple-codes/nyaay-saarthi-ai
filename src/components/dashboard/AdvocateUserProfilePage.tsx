import React from 'react';
import { 
  ArrowLeft, User, Mail, Phone, MapPin, Calendar, 
  ShieldCheck, FileText, Scale, Clock, AlertCircle, 
  Building, Briefcase, CheckCircle2, ChevronRight, Download, Eye
} from 'lucide-react';
import { Language, AppRoute } from '../../types';

export interface CaseCitizenInfo {
  id: string;
  citizenName: string;
  citizenNameHi?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  occupation: string;
  preferredLanguage: string;
  kycStatus: string;
  aadhaarMasked: string;
  // Case details
  caseId: string;
  caseTitle: string;
  caseCategory: string;
  filingDate: string;
  urgency: 'High' | 'Medium' | 'Normal';
  caseSummary: string;
  opponentParty: string;
  claimAmount: string;
  reliefSought: string;
  relevantActs: string[];
  jurisdictionForum: string;
  consultationMode: string;
  status: string;
}

const DEFAULT_CITIZEN_CASE: CaseCitizenInfo = {
  id: 'req-101',
  citizenName: 'Rajesh Kumar',
  citizenNameHi: 'राजेश कुमार',
  email: 'rajesh.kumar91@gmail.com',
  phone: '+91 98712 34567',
  alternatePhone: '+91 98101 98765',
  address: 'House No. 42-B, Pocket 2, Mayur Vihar Phase 1',
  city: 'New Delhi',
  state: 'Delhi NCR',
  pincode: '110091',
  occupation: 'Senior Logistics Operations Lead',
  preferredLanguage: 'Hindi & English',
  kycStatus: 'Verified (Aadhaar e-KYC Complete)',
  aadhaarMasked: 'XXXX-XXXX-8921',
  caseId: 'NS-CASE-2026-8910',
  caseTitle: 'Matter of Unauthorized Financial Debit & Bank Dispute',
  caseCategory: 'Cybercrime & Banking Fraud (IT Act & RBI Ombudsman)',
  filingDate: '18 August 2026',
  urgency: 'High',
  caseSummary: 'Citizen was induced into downloading a fraudulent utility payment application (APK) masquerading as an official state electricity bill clearance portal. At approximately 02:14 AM on 14 August 2026, an unauthorized IMPS debit of ₹65,000 was executed to an unknown beneficiary VPA without voluntary OTP authentication sharing. Citizen reported the dispute to the bank within 45 minutes and lodged an incident on the National Cyber Crime Reporting Portal (Ack #CFC-2026-90218). The bank arbitrarily rejected the zero-liability claim citing SMS delivery records. Citizen seeks formal legal demand notice under RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18 and escalation to the Banking Ombudsman.',
  opponentParty: 'Nationalized Commercial Bank (Connaught Place Branch) & Payment Intermediary Gateway',
  claimAmount: '₹65,000/- (Principal Sum) + Statutory Interest @ 18% p.a. and ₹25,000/- towards mental harassment',
  reliefSought: '1. Reversal and restitution of ₹65,000/- under RBI Customer Protection Charter.\n2. Issuance of 15-day formal Legal Notice to the Nodal Officer and Banking Ombudsman.\n3. Direction to bank to furnish transaction IP logs and beneficiary account lien records.',
  relevantActs: [
    'Section 43 & Section 66D, Information Technology Act, 2000',
    'RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18 (Customer Protection - Limiting Liability of Customers in Unauthorised Electronic Banking Transactions)',
    'Section 35, Consumer Protection Act, 2019 (Deficiency in Banking Service)'
  ],
  jurisdictionForum: 'District Cyber Crime Cell & District Consumer Disputes Redressal Commission, New Delhi',
  consultationMode: 'Video Consultation (30 Minutes)',
  status: 'Pending Advocate Review'
};

interface AdvocateUserProfilePageProps {
  language: Language;
  onNavigate: (route: AppRoute, params?: any) => void;
  caseData?: any;
}

export function AdvocateUserProfilePage({
  language,
  onNavigate,
  caseData,
}: AdvocateUserProfilePageProps) {
  // Merge caseData if provided
  const citizen: CaseCitizenInfo = {
    ...DEFAULT_CITIZEN_CASE,
    citizenName: caseData?.citizenName || DEFAULT_CITIZEN_CASE.citizenName,
    citizenNameHi: caseData?.citizenNameHi || DEFAULT_CITIZEN_CASE.citizenNameHi,
    caseCategory: caseData?.category || DEFAULT_CITIZEN_CASE.caseCategory,
    caseSummary: caseData?.summary || DEFAULT_CITIZEN_CASE.caseSummary,
    city: caseData?.city?.split(',')[0] || DEFAULT_CITIZEN_CASE.city,
    urgency: caseData?.urgency || DEFAULT_CITIZEN_CASE.urgency,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              id="btn-back-to-dashboard"
              onClick={() => onNavigate('advocate-dashboard')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-sky-700 text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 hidden sm:block">
              {language === 'en' ? 'User Profile & Case Particulars' : 'उपयोगकर्ता प्रोफ़ाइल एवं वाद विवरण'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-view-evidence-from-profile"
              onClick={() => onNavigate('advocate/documents', { request: caseData || citizen })}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Documents / Evidence</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* User Identity & Contact Overview Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-700 text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-sm shrink-0 border border-sky-300">
                {citizen.citizenName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'RK'}
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {language === 'en' ? citizen.citizenName : (citizen.citizenNameHi || citizen.citizenName)}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Identity Verified</span>
                  </span>
                  <span className="text-[11px] font-mono text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 font-semibold">
                    {citizen.aadhaarMasked}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  {citizen.occupation} • Resident of {citizen.city}, {citizen.state}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Case Docket ID</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-sky-800">{citizen.caseId}</span>
              </div>
              <div className="bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200 text-right">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">Filing Urgency</span>
                <span className="text-xs sm:text-sm font-bold text-amber-900">{citizen.urgency} Priority</span>
              </div>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-150 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-sky-600" />
                <span>Email Address</span>
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 select-all truncate">{citizen.email}</p>
              <p className="text-[10px] text-emerald-700 font-semibold">Email Verified & Active</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-150 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Primary Phone Number</span>
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 select-all">{citizen.phone}</p>
              <p className="text-[10px] text-slate-500 font-medium">Alt: {citizen.alternatePhone}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-150 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>Residential Address</span>
              </span>
              <p className="text-xs font-semibold text-slate-800 leading-snug">{citizen.address}</p>
              <p className="text-[10px] text-slate-500">{citizen.city}, {citizen.state} - {citizen.pincode}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-150 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                <span>Preferred Language</span>
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900">{citizen.preferredLanguage}</p>
              <p className="text-[10px] text-sky-700 font-semibold">{citizen.consultationMode}</p>
            </div>
          </div>
        </div>

        {/* Comprehensive Case Information Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-sky-600" />
                <h3 className="text-lg font-extrabold text-slate-900">
                  {language === 'en' ? 'Case Information & Legal Synopsis' : 'वाद विवरण एवं कानूनी सारांश'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Structured factual background, disputed claim assessment, and proposed statutory recourse
              </p>
            </div>

            <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Filing Date: {citizen.filingDate}
            </span>
          </div>

          {/* Key Facts Summary Banner */}
          <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-150 space-y-2">
            <h4 className="text-sm font-bold text-sky-950 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-sky-600" />
              <span>Case Subject: {citizen.caseTitle}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {citizen.caseSummary}
            </p>
          </div>

          {/* Two-Column Structured Legal Particulars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Opponent & Claims */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Opponent / Counter-Party Details
                </span>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  {citizen.opponentParty}
                </p>
                <p className="text-[11px] text-slate-600">
                  Notice recipient: Principal Nodal Officer & Zonal Legal Cell
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Total Financial Claim / Disputed Amount
                </span>
                <p className="text-sm font-bold text-emerald-800">
                  {citizen.claimAmount}
                </p>
                <p className="text-[11px] text-slate-600">
                  Includes unauthorized transaction reimbursement, statutory interest, and claim costs.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Jurisdiction & Suggested Forum
                </span>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  {citizen.jurisdictionForum}
                </p>
              </div>
            </div>

            {/* Right Column: Applicable Statutory Provisions & Relief Sought */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Applicable Acts & Regulatory Provisions
                </span>
                <div className="space-y-1.5">
                  {citizen.relevantActs.map((act, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Specific Legal Remedy & Relief Sought
                </span>
                <div className="text-xs text-slate-700 space-y-1.5 whitespace-pre-line leading-relaxed">
                  {citizen.reliefSought}
                </div>
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => onNavigate('advocate-dashboard')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('advocate/documents', { request: caseData || citizen })}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>View Documents & Evidence Records</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}
