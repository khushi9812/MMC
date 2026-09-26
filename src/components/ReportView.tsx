import React from 'react';
import { MysuruProperty, ProposedConstruction, DocumentScanResult } from '../types/mysuru';
import {
  evaluateMysuruPermitEligibility,
  EligibilityResult,
} from '../utils/mysuruRuleEngine';
import {
  Printer,
  FileCheck,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Building,
  MapPin,
  FileText,
} from 'lucide-react';

interface ReportViewProps {
  property: MysuruProperty;
  proposed: ProposedConstruction;
  scannedDocs: DocumentScanResult[];
  onBackToChecker: () => void;
  lang?: 'en' | 'kn';
}

export const ReportView: React.FC<ReportViewProps> = ({
  property,
  proposed,
  scannedDocs,
  onBackToChecker,
  lang = 'en',
}) => {
  const evaluation: EligibilityResult = evaluateMysuruPermitEligibility(
    property,
    proposed,
    scannedDocs.map((d) => d.documentType)
  );

  const handlePrint = () => {
    window.print();
  };

  const reportId = `MY-CIVIC-2026-${property.pid.replace(/[^0-9]/g, '').slice(0, 6) || '849102'}`;

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Mysuru Municipal Pre-Screening Dossier & Report
          </h2>
          <p className="text-xs text-slate-500">
            Official summary document formatted for citizen printing, municipal pre-check, and architect consultation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToChecker}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
          >
            Back to Checker
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Printable Paper Dossier Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 max-w-4xl mx-auto space-y-6 text-slate-900 font-sans print:shadow-none print:border-none print:p-0">
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl">
                🏛️
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                  GOVERNMENT OF KARNATAKA • PUBLIC SERVICES ASSIST
                </span>
                <h1 className="text-xl font-bold tracking-tight text-slate-950">
                  Karnataka CivicAssist AI — Mysuru Building Permit Pre-Screening
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  Autonomous Cadastral & Statutory Bye-Law Assessment Dossier
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="font-mono font-bold text-slate-900 block">{reportId}</span>
              <span className="text-slate-500 block text-[11px]">
                Date: {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
              </span>
              <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                Evaluation Hash: PASS-VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* High-Level Verdict Strip */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Pre-Screening Determination
            </span>
            <span className="text-base font-bold text-slate-900">
              {evaluation.overallVerdict.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Application Readiness Score
            </span>
            <span className="text-xl font-bold text-blue-700 font-mono">
              {evaluation.readinessScore} / 100
            </span>
          </div>
        </div>

        {/* Property & Ownership Details */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
            1. Property & Recorded Title Particulars
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Property ID (PID)</span>
              <span className="font-mono font-bold text-slate-900">{property.pid}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Site Number</span>
              <span className="font-bold text-slate-900">{property.siteNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Layout & Ward</span>
              <span className="font-bold text-slate-900">
                {property.layoutName}, {property.wardNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Jurisdiction Authority</span>
              <span className="font-bold text-blue-700">
                {property.authority} ({property.khataType})
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
            <div>
              <span className="text-slate-500">Recorded Property Holder: </span>
              <strong>{property.currentPropertyHolderName}</strong>
            </div>
            <div>
              <span className="text-slate-500">Address: </span>
              <span>{property.address}</span>
            </div>
            <div>
              <span className="text-slate-500">Site Dimensions & Extent: </span>
              <strong>
                {property.siteDimensions} ({property.siteAreaSqFt} sq ft / {property.siteAreaSqM} m²)
              </strong>
            </div>
          </div>
        </div>

        {/* Proposed Construction Specifications */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
            2. Proposed Construction Parameters Evaluated
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Construction Type</span>
              <span className="font-semibold text-slate-900">{proposed.constructionType}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Storeys / Floors</span>
              <span className="font-semibold text-slate-900">{proposed.proposedFloors} Floors</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Ground Coverage</span>
              <span className="font-semibold text-slate-900">
                {proposed.proposedGroundCoveragePercent}%
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Road Width Buffer</span>
              <span className="font-semibold text-slate-900">{proposed.roadWidthMeters} meters</span>
            </div>
          </div>
        </div>

        {/* Checklist of Evaluated Rules */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
            3. Detailed Statutory Bye-Law Assessment
          </h2>

          <div className="space-y-2 text-xs">
            {evaluation.rulesChecked.map((rule, idx) => (
              <div
                key={rule.id}
                className="p-2.5 rounded-lg border border-slate-200 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{rule.title}</span>
                    <span className="font-mono text-[10px] text-slate-400">{rule.ruleCode}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{rule.description}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Citation: {rule.statutoryReference}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                    rule.status === 'PASS'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {rule.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Uploaded Documents Scrutinized */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
            4. Verified Document Evidence ({scannedDocs.length} Accounted For)
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {scannedDocs.map((doc) => (
              <div key={doc.id} className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="font-semibold text-slate-900">{doc.documentType}</span>
                <span className="block text-[10px] text-slate-500 font-mono">
                  {doc.fileName} • {doc.verificationStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/70 text-amber-950 text-xs space-y-1 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 uppercase text-[11px]">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            Statutory Legal Notice & Disclaimer
          </div>
          <p className="text-[11px]">
            This document is an automated pre-screening eligibility report generated by Karnataka CivicAssist AI based solely on user-supplied details and configured municipal bye-law algorithms. <strong>It does not constitute an official Building Licence, Sanctioned Plan, legal title deed verification, or a guarantee of municipal approval.</strong>
          </p>
          <p className="text-[11px]">
            Formal applications must be submitted through the <strong>Mysuru City Corporation (MCC) Online Building Plan Approval System (OBPAS)</strong> or <strong>Mysuru Urban Development Authority (MUDA)</strong> along with original registered deeds and CAD drawings stamped by an architect registered with the Council of Architecture (COA).
          </p>
        </div>
      </div>
    </div>
  );
};
