import React from 'react';
import { MysuruProperty, ProposedConstruction, DocumentScanResult } from '../types/mysuru';
import {
  Search,
  MapPin,
  FileCheck2,
  FileText,
  Building2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import {
  evaluateMysuruPermitEligibility,
  EligibilityResult,
} from '../utils/mysuruRuleEngine';

interface CitizenDashboardProps {
  properties: MysuruProperty[];
  selectedProperty: MysuruProperty;
  onSelectProperty: (property: MysuruProperty) => void;
  proposed: ProposedConstruction;
  scannedDocs: DocumentScanResult[];
  onNavigateTab: (tab: any) => void;
  onOpenManualEntry: () => void;
  lang?: 'en' | 'kn';
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  proposed,
  scannedDocs,
  onNavigateTab,
  onOpenManualEntry,
  lang = 'en',
}) => {
  const evaluation: EligibilityResult = evaluateMysuruPermitEligibility(
    selectedProperty,
    proposed,
    scannedDocs.map((d) => d.documentType)
  );

  return (
    <div className="space-y-6">
      {/* 1. Welcome & Primary Pre-Screening Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold tracking-wider text-amber-300 uppercase">
              🏛️ Mysuru City Corporation (MCC) & MUDA Scrutiny
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
              KMC Act 1976 & Building Bye-Laws
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Check Your Mysuru Property Building Permit Eligibility
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Verify site setbacks, ground coverage, mandatory A-Khata/E-Khata status, rainwater harvesting compliance, and required registered deeds before applying to MCC OBPAS.
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
            <button
              onClick={() => onNavigateTab('ai_chat')}
              className="px-4 py-2.5 rounded-xl font-bold bg-indigo-500 hover:bg-indigo-400 text-white shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Chat with Jev AI Officer
            </button>
            <button
              onClick={() => onNavigateTab('search')}
              className="px-4 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              Search Property by PID
            </button>
            <button
              onClick={() => onNavigateTab('map')}
              className="px-4 py-2.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              Explore Mysuru GIS Map
            </button>
            <button
              onClick={onOpenManualEntry}
              className="px-4 py-2.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              + Enter Details Manually
            </button>
          </div>
        </div>
      </div>

      {/* 2. Primary 3-Card Snapshot Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Card 1: Currently Selected Property Summary */}
        <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-2">
              <span>Active Selected Site</span>
              <span className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {selectedProperty.authority}
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 leading-snug">
              {selectedProperty.siteNumber}
            </h3>
            <p className="text-slate-500 mt-1 flex items-center gap-1 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              {selectedProperty.layoutName}, {selectedProperty.wardNumber}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">PID:</span>
                <span className="font-mono font-semibold">{selectedProperty.pid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Khata Register:</span>
                <span
                  className={`font-semibold ${
                    selectedProperty.khataType === 'A-Khata' ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {selectedProperty.khataType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Site Area:</span>
                <span className="font-semibold">
                  {selectedProperty.siteAreaSqFt} sq ft ({selectedProperty.siteDimensions})
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('search')}
            className="mt-4 pt-2 border-t border-slate-100 text-blue-600 font-semibold hover:underline flex items-center justify-between text-[11px]"
          >
            <span>Change Property</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Live Eligibility Status */}
        <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-2">
              <span>Bye-Law Scrutiny Status</span>
              <span className="font-mono text-xs font-bold text-blue-700">
                Score: {evaluation.readinessScore}/100
              </span>
            </div>

            <div className="mt-1">
              <span
                className={`px-2.5 py-1 rounded-lg font-bold text-xs inline-block ${
                  evaluation.overallVerdict === 'APPEARS_ELIGIBLE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : evaluation.overallVerdict === 'REQUIREMENTS_NOT_SATISFIED'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {evaluation.overallVerdict.replace(/_/g, ' ')}
              </span>
            </div>

            <p className="text-slate-500 mt-2 text-[11px] leading-relaxed">
              {evaluation.passedCount} of {evaluation.rulesChecked.length} bye-law checkpoints conform. Estimated municipal licence fee is approx <strong>₹{evaluation.estimatedMunicipalFeeInr.toLocaleString('en-IN')}</strong>.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('eligibility')}
            className="mt-4 pt-2 border-t border-slate-100 text-blue-600 font-semibold hover:underline flex items-center justify-between text-[11px]"
          >
            <span>Review Checkpoints & What-If</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Document Upload Readiness */}
        <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-2">
              <span>Required Title Documents</span>
              <span className="font-mono text-emerald-700 font-bold">
                {scannedDocs.length} / 5 Ready
              </span>
            </div>

            <h3 className="font-bold text-sm text-slate-900">
              {scannedDocs.length >= 4 ? 'Dossier Substantially Complete' : 'Missing Critical Documents'}
            </h3>

            <p className="text-slate-500 mt-1 text-[11px] leading-relaxed">
              {evaluation.missingMandatoryDocuments.length > 0 ? (
                <>
                  Missing: <strong className="text-amber-800">{evaluation.missingMandatoryDocuments[0]}</strong> and {evaluation.missingMandatoryDocuments.length - 1} more.
                </>
              ) : (
                'All 5 mandatory documents verified through OCR pre-check.'
              )}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('documents')}
            className="mt-4 pt-2 border-t border-slate-100 text-blue-600 font-semibold hover:underline flex items-center justify-between text-[11px]"
          >
            <span>Upload or Audit Deeds</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Statutory Notice & Disclaimer Banner */}
      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-900 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1 text-[11px] leading-relaxed">
          <p className="font-bold text-amber-950">
            Citizen Guidance & Legal Non-Ownership Disclaimer:
          </p>
          <p>
            Karnataka CivicAssist AI performs algorithmic pre-screening against published Mysuru City Corporation bye-laws. It does <strong>not</strong> confer property ownership, certify legal title deeds, or substitute for formal plan approval under Section 299 of the Karnataka Municipal Corporations Act 1976.
          </p>
        </div>
      </div>
    </div>
  );
};
