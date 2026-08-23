import React, { useState } from 'react';
import { 
  ArrowLeft, FileText, Download, Eye, CheckCircle2, 
  ShieldCheck, AlertTriangle, Calendar, HardDrive, 
  FileCheck, Lock, ExternalLink, User, X, Printer,
  FileSpreadsheet, FileArchive, Search, Filter
} from 'lucide-react';
import { Language, AppRoute } from '../../types';

export interface CaseEvidenceDocument {
  id: string;
  title: string;
  filename: string;
  category: string;
  fileType: 'PDF' | 'IMAGE' | 'SPREADSHEET';
  fileSize: string;
  uploadDate: string;
  verificationStatus: 'Digitally Verified' | 'Forensically Certified' | 'Bank Certified' | 'Under Review';
  evidentiaryValue: string;
  description: string;
  previewContent: {
    header: string;
    referenceNo: string;
    issuedBy: string;
    date: string;
    contentLines: string[];
    keyPoints: string[];
  };
}

const DEFAULT_DOCUMENTS: CaseEvidenceDocument[] = [
  {
    id: 'doc-1',
    title: 'Certified Bank Account Ledger Statement (Disputed Debits)',
    filename: 'HDFC_Account_Statement_Aug2026_Marked.pdf',
    category: 'Financial Evidence',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    uploadDate: '18 Aug 2026, 09:30 AM',
    verificationStatus: 'Bank Certified',
    evidentiaryValue: 'Primary documentary proof establishing transaction timestamp at 02:14 AM and direct balance depletion to unauthorized beneficiary VPA.',
    description: 'Official monthly account statement duly stamped with bank digital transaction certificate. Highlights the fraudulent IMPS transfer of ₹65,000/- on 14-Aug-2026.',
    previewContent: {
      header: 'HDFC BANK LIMITED - SPECIAL INVESTIGATION STATEMENT',
      referenceNo: 'TXN-IMPS-20260814-99214081',
      issuedBy: 'Digital Banking Operations & Fraud Risk Group',
      date: '14 August 2026',
      contentLines: [
        'Account Number: 5010029381XXXX (Rajesh Kumar)',
        'Transaction Timestamp: 14-08-2026 02:14:22 IST',
        'Debit Amount: INR 65,000.00 (Sixty-Five Thousand Only)',
        'Beneficiary Identifier: quickpay.utility92@okaxis (Unverified Entity)',
        'Mode of Channel: Mobile Banking API Intermediary Gateway',
        'Device IP Footprint: 103.21.144.92 (Geographic Mismatch flagged with Account Holder Home IP)'
      ],
      keyPoints: [
        'Transaction occurred during non-standard hours (02:14 AM)',
        'IP geolocation indicates out-of-state routing',
        'Customer balance reduced from ₹1,12,450 to ₹47,450'
      ]
    }
  },
  {
    id: 'doc-2',
    title: 'National Cyber Crime Reporting Portal (NCRP) Acknowledgement',
    filename: 'NCRP_Complaint_Ack_CFC-2026-90218.pdf',
    category: 'Police / Statutory Filing',
    fileType: 'PDF',
    fileSize: '1.1 MB',
    uploadDate: '18 Aug 2026, 09:32 AM',
    verificationStatus: 'Digitally Verified',
    evidentiaryValue: 'Statutory proof of immediate reporting within the 45-minute golden hour window under 1930 Cyber Fraud Helpline.',
    description: 'Ministry of Home Affairs NCRP official filing acknowledgement slip with assigned Case Officer & Nodal Bank freeze directive.',
    previewContent: {
      header: 'MINISTRY OF HOME AFFAIRS - NATIONAL CYBER CRIME REPORTING PORTAL',
      referenceNo: 'Ack No: CFC-2026-90218 / Helpline 1930',
      issuedBy: 'Cyber Crime Police Station, Delhi Police Headquarter',
      date: '14 August 2026, 03:00 AM',
      contentLines: [
        'Complainant: Rajesh Kumar (S/o Late M.L. Kumar)',
        'Incident Classification: Financial Banking Phishing / Malicious APK',
        'Suspect VPA / Merchant: quickpay.utility92@okaxis',
        'Immediate Action Taken: Automated 1930 Bank Lien Freeze Trigger dispatched to nodal intermediary',
        'Status: Escalated to Nodal Officer for zero-liability recovery'
      ],
      keyPoints: [
        'Complaint lodged at 03:00 AM (within 46 minutes of debit)',
        'Formal acknowledgement number issued for court & ombudsman record',
        'Lien notification served on receiving payment gateway'
      ]
    }
  },
  {
    id: 'doc-3',
    title: 'Phishing SMS Warnings & Malicious APK Screen Logs',
    filename: 'SMS_Deceptive_Notice_APK_Payload.pdf',
    category: 'Forensic & Digital Proof',
    fileType: 'PDF',
    fileSize: '3.8 MB',
    uploadDate: '18 Aug 2026, 09:35 AM',
    verificationStatus: 'Forensically Certified',
    evidentiaryValue: 'Demonstrates deceptive social engineering tactics used by perpetrator without intentional credential surrender by citizen.',
    description: 'Forensic screenshot package displaying electricity disconnection threat SMS received from sender "VK-POWERR" and subsequent APK screen layout.',
    previewContent: {
      header: 'DIGITAL FORENSICS EXTRACTION LOG - EVIDENCE EXHIBIT B',
      referenceNo: 'EVID-SMS-APK-2026-0814',
      issuedBy: 'Certified Cyber Investigation Examiner',
      date: '14 August 2026',
      contentLines: [
        'Sender Header: VK-POWERR (Spoofed utility header)',
        'SMS Content: "Dear Consumer, your electricity power will be disconnected tonight at 09:30 PM due to unpaid bill update immediately at http://power-delhi-bill.apk"',
        'APK Payload Analysis: Screen-overlay Trojan capable of automated background input',
        'Conclusion: Citizen did not voluntarily disclose NetBanking password or master credentials.'
      ],
      keyPoints: [
        'Establishes predatory social engineering tactic',
        'Proves lack of willful negligence by consumer',
        'Directly satisfies RBI Circular 2017 Zero-Liability conditions'
      ]
    }
  },
  {
    id: 'doc-4',
    title: 'Bank Customer Grievance & Nodal Officer Rejection Letter',
    filename: 'Bank_Grievance_Denial_Notice.pdf',
    category: 'Bank Correspondence',
    fileType: 'PDF',
    fileSize: '890 KB',
    uploadDate: '18 Aug 2026, 09:40 AM',
    verificationStatus: 'Bank Certified',
    evidentiaryValue: 'Crucial prerequisite for approaching the Reserve Bank of India Banking Ombudsman under RBI CMS portal guidelines.',
    description: 'Formal written denial letter from Bank Grievance Redressal Cell refusing reimbursement on grounds of SMS delivery logs.',
    previewContent: {
      header: 'CUSTOMER GRIEVANCE REDRESSAL DESK - REJECTION NOTICE',
      referenceNo: 'GRV-DENIAL-2026-44120',
      issuedBy: 'Principal Nodal Officer, Retail Banking Operations',
      date: '17 August 2026',
      contentLines: [
        'To: Rajesh Kumar (Customer ID: 9283711)',
        'Subject: Inability to process chargeback against IMPS Transaction dated 14-Aug-2026',
        'Bank Position: "As our systems recorded SMS delivery of 2FA authentication, bank disclaims liability under Section 10 of General Banking Terms."',
        'Legal Deficiency: Bank failed to evaluate unauthorized remote app overlay or examine golden hour notification.'
      ],
      keyPoints: [
        'Formally exhausts bank internal dispute tier',
        'Enables direct statutory complaint before Banking Ombudsman',
        'Basis for claiming ₹25,000 compensation for deficient service'
      ]
    }
  },
  {
    id: 'doc-5',
    title: 'Citizen Identity & Jurisdictional Domicile Verification (Aadhaar Masked)',
    filename: 'Citizen_Aadhaar_KYC_Masked.pdf',
    category: 'Identity / Locus Standi',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    uploadDate: '18 Aug 2026, 09:42 AM',
    verificationStatus: 'Digitally Verified',
    evidentiaryValue: 'Validates citizen identity, residential jurisdiction, and standing to institute notice before Delhi Consumer Forum.',
    description: 'Masked Aadhaar Card copy verifying domicile in Mayur Vihar, New Delhi.',
    previewContent: {
      header: 'UNIQUE IDENTIFICATION AUTHORITY OF INDIA - MASKED E-KYC',
      referenceNo: 'UIDAI-VERIFY-2026-8921',
      issuedBy: 'UIDAI Authentication Service',
      date: '10 July 2026',
      contentLines: [
        'Name: Rajesh Kumar',
        'Masked Aadhaar Number: XXXX-XXXX-8921',
        'Address: House No. 42-B, Pocket 2, Mayur Vihar Phase 1, New Delhi - 110091',
        'Authentication Status: Biometrically and OTP Authenticated'
      ],
      keyPoints: [
        'Validates territorial jurisdiction in New Delhi',
        'Complete legal standing for Vakalatnama & Legal Notice'
      ]
    }
  }
];

interface AdvocateCaseDocumentsPageProps {
  language: Language;
  onNavigate: (route: AppRoute, params?: any) => void;
  caseData?: any;
}

export function AdvocateCaseDocumentsPage({
  language,
  onNavigate,
  caseData,
}: AdvocateCaseDocumentsPageProps) {
  const [documents] = useState<CaseEvidenceDocument[]>(DEFAULT_DOCUMENTS);
  const [selectedDoc, setSelectedDoc] = useState<CaseEvidenceDocument | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDownloadToast, setShowDownloadToast] = useState<string | null>(null);

  const citizenName = caseData?.citizenName || 'Rajesh Kumar';
  const caseId = caseData?.caseId || 'NS-CASE-2026-8910';
  const caseCategory = caseData?.category || caseData?.caseCategory || 'Cybercrime & Banking Fraud';

  const filteredDocs = documents.filter(doc => {
    if (filterCategory !== 'All' && doc.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return doc.title.toLowerCase().includes(q) || 
             doc.filename.toLowerCase().includes(q) || 
             doc.evidentiaryValue.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDownload = (docTitle: string) => {
    setShowDownloadToast(`Downloading certified copy of "${docTitle}"...`);
    setTimeout(() => {
      setShowDownloadToast(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              id="btn-back-to-dashboard-from-docs"
              onClick={() => onNavigate('advocate-dashboard')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-sky-700 text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 hidden sm:block">
              {language === 'en' ? 'Case Documents & Evidentiary Records' : 'वाद दस्तावेज़ एवं साक्ष्य अभिलेख'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-view-profile-from-docs"
              onClick={() => onNavigate('advocate/user-profile', { request: caseData })}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-sky-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-sky-600" />
              <span>Show User Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Case & Evidence Overview Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                  {caseId}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>5 Evidentiary Attachments Verified</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 pt-1">
                Document Repository: {citizenName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Category: <strong className="text-slate-800">{caseCategory}</strong> • Authenticated under Section 65B of Indian Evidence Act
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Files</span>
                <span className="text-base font-extrabold text-slate-900">5 Records</span>
              </div>
              <div className="bg-sky-50 px-4 py-2.5 rounded-2xl border border-sky-200 text-center">
                <span className="text-[10px] uppercase font-bold text-sky-800 block">Security Hash</span>
                <span className="font-mono text-xs font-bold text-sky-900">SHA-256 Valid</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['All', 'Financial Evidence', 'Police / Statutory Filing', 'Forensic & Digital Proof', 'Bank Correspondence'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents or keywords..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Evidence Records List */}
        <div className="space-y-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-sky-100 shadow-2xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {doc.title}
                      </h3>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {doc.verificationStatus}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {doc.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {doc.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="font-mono">{doc.filename}</span>
                      <span>•</span>
                      <span>{doc.fileSize}</span>
                      <span>•</span>
                      <span>Uploaded on {doc.uploadDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    id={`btn-preview-doc-${doc.id}`}
                    onClick={() => setSelectedDoc(doc)}
                    className="flex-1 sm:flex-none w-full sm:w-36 py-2 px-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Record</span>
                  </button>

                  <button
                    id={`btn-download-doc-${doc.id}`}
                    onClick={() => handleDownload(doc.title)}
                    className="flex-1 sm:flex-none w-full sm:w-36 py-2 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Evidentiary Significance Callout */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700">
                  <strong className="text-slate-900 font-bold">Evidentiary Value: </strong>
                  <span>{doc.evidentiaryValue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Footer */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => onNavigate('advocate-dashboard')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('advocate/user-profile', { request: caseData })}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Review Full User Profile</span>
          </button>
        </div>

      </main>

      {/* Document Inspector / Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-sky-150 shadow-2xl space-y-6 my-8">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Document Header */}
            <div className="space-y-1.5 pr-8">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-mono">
                  {selectedDoc.previewContent.referenceNo}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {selectedDoc.verificationStatus}
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {selectedDoc.title}
              </h3>
              <p className="text-xs text-slate-500">
                Issued By: {selectedDoc.previewContent.issuedBy} • {selectedDoc.previewContent.date}
              </p>
            </div>

            {/* Simulated Official Document Container */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 font-mono text-xs text-slate-800 space-y-3 shadow-inner">
              <div className="text-center pb-2 border-b border-slate-300">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  {selectedDoc.previewContent.header}
                </span>
              </div>

              <div className="space-y-2 text-[11px] leading-relaxed">
                {selectedDoc.previewContent.contentLines.map((line, idx) => (
                  <p key={idx} className="border-b border-slate-200/50 pb-1.5 last:border-0">
                    {line}
                  </p>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-300">
                <span className="text-[10px] font-bold text-slate-600 block uppercase tracking-wider mb-1">
                  Key Evidentiary Highlights:
                </span>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700">
                  {selectedDoc.previewContent.keyPoints.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Digitally Sealed & Cryptographically Verifiable</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleDownload(selectedDoc.title)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Certified Copy</span>
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Toast */}
      {showDownloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{showDownloadToast}</span>
        </div>
      )}
    </div>
  );
}
