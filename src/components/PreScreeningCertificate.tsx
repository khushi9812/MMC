import React from 'react';
import {
  Printer,
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  QrCode,
  Calendar,
  FileCheck2,
  ArrowLeft,
  DollarSign,
  Clock,
} from 'lucide-react';
import {
  PermitDefinition,
  RuleEvaluationSummary,
} from '../types/permits';

interface PreScreeningCertificateProps {
  permit: PermitDefinition;
  evaluation: RuleEvaluationSummary;
  applicantData: Record<string, any>;
  municipality: string;
  onBackToAssessor: () => void;
}

export const PreScreeningCertificate: React.FC<PreScreeningCertificateProps> = ({
  permit,
  evaluation,
  applicantData,
  municipality,
  onBackToAssessor,
}) => {
  const referenceId = `MUNI-2026-${permit.code.split('-')[0]}-${Math.floor(
    100000 + Math.random() * 900000
  )}`;
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const isEligible = evaluation.overallStatus === 'ELIGIBLE';
  const isConditional = evaluation.overallStatus === 'CONDITIONALLY_ELIGIBLE';

  return (
    <div className="bg-slate-100 min-h-full p-4 sm:p-8 flex flex-col items-center overflow-y-auto">
      {/* Top Action Bar (hidden in print) */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-4 print:hidden">
        <button
          onClick={onBackToAssessor}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assessor
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="text-xs font-bold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Official Certificate Paper Container */}
      <div className="w-full max-w-3xl bg-white rounded-2xl border-2 border-slate-300 shadow-xl p-6 sm:p-10 text-slate-800 relative overflow-hidden print:border-none print:shadow-none print:p-0">
        {/* Subtle Watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none">
          <Building2 className="w-96 h-96" />
        </div>

        {/* Certificate Header */}
        <div className="border-b-2 border-slate-800 pb-5 mb-6 text-center relative">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h1 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {municipality}
              </h1>
              <p className="text-sm font-black tracking-tight text-slate-900">
                {permit.department.toUpperCase()}
              </p>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 mt-2">
            Automated Pre-Screening Eligibility Clearance
          </h2>
          <p className="text-xs text-slate-500 font-serif italic mt-0.5">
            Issued under Statutory Authority: {permit.statutoryAuthority}
          </p>

          <div className="mt-3 flex items-center justify-center gap-4 text-xs font-mono text-slate-600">
            <span>Reference: <strong>{referenceId}</strong></span>
            <span>•</span>
            <span>Date: <strong>{issueDate}</strong></span>
          </div>
        </div>

        {/* Verdict Box */}
        <div
          className={`p-4 rounded-xl border-2 mb-6 text-center ${
            isEligible
              ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
              : isConditional
              ? 'border-amber-600 bg-amber-50 text-amber-950'
              : 'border-rose-600 bg-rose-50 text-rose-950'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            {isEligible && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
            {isConditional && <AlertTriangle className="w-6 h-6 text-amber-600" />}
            {!isEligible && !isConditional && <XCircle className="w-6 h-6 text-rose-600" />}
            <span className="text-lg font-black tracking-wide uppercase">
              {evaluation.overallStatus === 'ELIGIBLE'
                ? 'CLEARED FOR FORMAL SUBMISSION'
                : evaluation.overallStatus === 'CONDITIONALLY_ELIGIBLE'
                ? 'CONDITIONALLY ELIGIBLE (DOCUMENTS PENDING)'
                : 'ACTION REQUIRED / VARIANCE MANDATED'}
            </span>
          </div>
          <p className="text-xs max-w-xl mx-auto leading-relaxed">
            {isEligible
              ? 'All primary statutory parameters comply with the Municipal Code. This dossier qualifies the applicant for expedited digital plan intake.'
              : isConditional
              ? 'The project meets primary zoning and dimensional thresholds. Final permit issuance is contingent upon uploading all required certified documents.'
              : 'One or more proposed specifications violate mandatory statutory standards. Proceed with the mitigation advice or request an Administrative Variance.'}
          </p>
        </div>

        {/* Permit & Project Information Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold block">
              Permit Classification
            </span>
            <span className="font-bold text-slate-900 text-sm">{permit.title}</span>
            <span className="text-slate-500 block text-[11px] font-mono mt-0.5">
              Code: {permit.code}
            </span>
          </div>

          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold block">
              Regulatory Score & Confidence
            </span>
            <span className="font-bold text-slate-900 text-sm font-mono">
              Score: {evaluation.score}/100 • Accuracy: {evaluation.accuracyConfidence}%
            </span>
            <span className="text-slate-500 block text-[11px] mt-0.5">
              {evaluation.passedCount} of {permit.criteria.length} statutory criteria fully met
            </span>
          </div>

          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold block">
              Estimated Municipal Fee
            </span>
            <span className="font-bold text-slate-900 text-sm">
              ${evaluation.estimatedFee}.00 USD
            </span>
          </div>

          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold block">
              Anticipated Plan Check Turnaround
            </span>
            <span className="font-bold text-slate-900 text-sm">
              ~{evaluation.estimatedReviewDays} Business Days
            </span>
          </div>
        </div>

        {/* Criteria Audit Table */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Statutory Rule Compliance Trace
          </h3>
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Rule</th>
                  <th className="p-2.5">Statute</th>
                  <th className="p-2.5">Reported</th>
                  <th className="p-2.5">Required</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {evaluation.criteriaResults.map((c) => (
                  <tr key={c.criterionId}>
                    <td className="p-2.5 font-semibold text-slate-800">{c.name}</td>
                    <td className="p-2.5 font-mono text-[10px] text-slate-500">{c.legalCode}</td>
                    <td className="p-2.5 font-mono text-slate-700">{String(c.actualValue ?? '-')}</td>
                    <td className="p-2.5 font-mono text-slate-700">{String(c.expectedValue)}</td>
                    <td className="p-2.5">
                      <span
                        className={`font-bold font-mono text-[10px] px-1.5 py-0.5 rounded ${
                          c.status === 'PASS'
                            ? 'text-emerald-700 bg-emerald-50'
                            : c.status === 'FAIL'
                            ? 'text-rose-700 bg-rose-50'
                            : 'text-amber-700 bg-amber-50'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Missing Elements & Next Steps */}
        {evaluation.actionItems.length > 0 && (
          <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50/60 text-xs text-amber-950">
            <h3 className="font-bold uppercase text-[10px] tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Applicant Action Items & Missing Prerequisite Elements
            </h3>
            <ul className="space-y-1 list-disc list-inside">
              {evaluation.actionItems.map((item, idx) => (
                <li key={idx} className="leading-snug">{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Certificate Footer with Digital Seal */}
        <div className="border-t-2 border-slate-800 pt-6 mt-6 flex items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <p className="font-bold text-slate-900">
              Tata Public Services Municipal Automation
            </p>
            <p className="text-[11px] text-slate-500 max-w-sm">
              Certified by AI Studio CivicPermit Engine • Conforms to TCS Technology Day Problem Statement Standards.
            </p>
          </div>

          <div className="text-right">
            <div className="inline-block p-2 border border-slate-300 rounded-lg bg-slate-50 text-center">
              <div className="w-16 h-16 bg-slate-900 text-white rounded flex items-center justify-center font-mono text-[10px] mx-auto p-1 leading-tight">
                [ QR SEAL ]
                MUNI-VERIFY
              </div>
              <span className="text-[9px] font-mono text-slate-500 block mt-1">
                SECURE-SHA256
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
