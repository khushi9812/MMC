import React, { useState } from 'react';
import { MysuruProperty, ProposedConstruction, MysuruAuthorityInfo } from '../types/mysuru';
import {
  evaluateMysuruPermitEligibility,
  EligibilityResult,
} from '../utils/mysuruRuleEngine';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  HelpCircle,
  CheckCircle2,
  Sliders,
  DollarSign,
  Clock,
  Printer,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface EligibilityCheckerProps {
  property: MysuruProperty;
  proposed: ProposedConstruction;
  onUpdateProposed: (newProposed: ProposedConstruction) => void;
  uploadedDocTypes: string[];
  authorities: MysuruAuthorityInfo[];
  onNavigateToReport: () => void;
  lang?: 'en' | 'kn';
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  property,
  proposed,
  onUpdateProposed,
  uploadedDocTypes,
  authorities,
  onNavigateToReport,
  lang = 'en',
}) => {
  const [showWhatIfSimulator, setShowWhatIfSimulator] = useState(false);
  const evaluation: EligibilityResult = evaluateMysuruPermitEligibility(
    property,
    proposed,
    uploadedDocTypes
  );

  const getVerdictBadge = () => {
    switch (evaluation.overallVerdict) {
      case 'APPEARS_ELIGIBLE':
        return {
          bg: 'bg-emerald-50 text-emerald-900 border-emerald-300',
          title: 'APPEARS ELIGIBLE (ಅರ್ಹತೆ ತೋರುತ್ತದೆ)',
          desc: 'Proposed residential building conforms to Mysuru City Corporation bye-laws, setbacks, coverage, and primary document criteria.',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600',
        };
      case 'ADDITIONAL_INFO_REQUIRED':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          title: 'ADDITIONAL INFORMATION / DOCUMENTS REQUIRED',
          desc: 'Primary dimensional criteria conform, but mandatory statutory documents or municipal certifications must be attached.',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
        };
      case 'REQUIREMENTS_NOT_SATISFIED':
        return {
          bg: 'bg-rose-50 text-rose-900 border-rose-300',
          title: 'ONE OR MORE REQUIREMENTS NOT SATISFIED',
          desc: 'Statutory bye-law non-compliance detected (e.g. setback breach, coverage limit exceeded, or unregularized Khata). Redesign required.',
          icon: XCircle,
          iconColor: 'text-rose-600',
        };
      case 'MANUAL_REVIEW_REQUIRED':
        return {
          bg: 'bg-blue-50 text-blue-900 border-blue-300',
          title: 'MANUAL REVIEW REQUIRED BY MCC / MUDA',
          desc: 'Special planning consideration needed due to zone classification or historic buffer proximity.',
          icon: HelpCircle,
          iconColor: 'text-blue-600',
        };
    }
  };

  const verdict = getVerdictBadge();
  const VerdictIcon = verdict.icon;

  return (
    <div className="space-y-6">
      {/* Verdict & Metrics Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Municipal Bye-Law Deterministic Scrutiny
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Building Licence Assessment for {property.siteNumber}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWhatIfSimulator(!showWhatIfSimulator)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>What-If Simulator</span>
            </button>
            <button
              onClick={onNavigateToReport}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Generate Official Report
            </button>
          </div>
        </div>

        {/* Verdict Banner */}
        <div className={`p-4 rounded-xl border ${verdict.bg} flex items-start gap-3 transition-all`}>
          <VerdictIcon className={`w-5 h-5 ${verdict.iconColor} shrink-0 mt-0.5`} />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-sm font-bold tracking-tight">{verdict.title}</h3>
              <div className="px-2.5 py-0.5 rounded bg-white font-mono text-xs font-bold shadow-2xs">
                Preparation Score: {evaluation.readinessScore}/100
              </div>
            </div>
            <p className="text-xs mt-1 text-slate-600 leading-relaxed">{verdict.desc}</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Passed Conditions</span>
            <span className="text-base font-bold text-emerald-600 mt-0.5 block">
              {evaluation.passedCount} / {evaluation.rulesChecked.length}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Requirements Deficient</span>
            <span
              className={`text-base font-bold mt-0.5 block ${
                evaluation.failedCount > 0 ? 'text-rose-600' : 'text-slate-700'
              }`}
            >
              {evaluation.failedCount} Failed {evaluation.warningCount > 0 && `• ${evaluation.warningCount} Advisories`}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-slate-400" /> Est. Municipal Fee
            </span>
            <span className="text-base font-bold text-slate-800 mt-0.5 block">
              ₹{evaluation.estimatedMunicipalFeeInr.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-[10px] flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> OBPAS Sanction Time
            </span>
            <span className="text-base font-bold text-slate-800 mt-0.5 block">
              ~{evaluation.estimatedPlanSanctionDays} Working Days
            </span>
          </div>
        </div>

        {/* Interactive What-If Simulator Panel */}
        {showWhatIfSimulator && (
          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-600" />
                What-If Eligibility Simulator (Test Bye-Law Thresholds)
              </span>
              <span className="text-[10px] text-indigo-700">Slide values to observe instant impact</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Coverage Slider */}
              <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Ground Plinth Coverage: {proposed.proposedGroundCoveragePercent}%
                </label>
                <input
                  type="range"
                  min="30"
                  max="90"
                  value={proposed.proposedGroundCoveragePercent}
                  onChange={(e) =>
                    onUpdateProposed({
                      ...proposed,
                      proposedGroundCoveragePercent: Number(e.target.value),
                    })
                  }
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Front Setback Slider */}
              <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Front Road Setback: {proposed.frontSetbackMeters}m
                </label>
                <input
                  type="range"
                  step="0.1"
                  min="0.5"
                  max="4.0"
                  value={proposed.frontSetbackMeters}
                  onChange={(e) =>
                    onUpdateProposed({
                      ...proposed,
                      frontSetbackMeters: Number(e.target.value),
                    })
                  }
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Rainwater Harvesting */}
              <div className="bg-white p-2.5 rounded-lg border border-indigo-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700">Include RWH Sump</span>
                <input
                  type="checkbox"
                  checked={proposed.hasRainwaterHarvesting}
                  onChange={(e) =>
                    onUpdateProposed({
                      ...proposed,
                      hasRainwaterHarvesting: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {evaluation.whatIfImpactNotes.length > 0 && (
              <div className="mt-2 text-[11px] text-indigo-800 font-medium">
                <strong>Simulated Impact:</strong> {evaluation.whatIfImpactNotes.join(' ')}
              </div>
            )}
          </div>
        )}

        {/* Detailed Condition Evaluation Breakdown */}
        <div className="pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            Statutory Rule Byelaw Checkpoints
          </h3>

          <div className="space-y-2.5">
            {evaluation.rulesChecked.map((rule) => {
              const isPass = rule.status === 'PASS';
              const isFail = rule.status === 'FAIL';
              const isWarn = rule.status === 'WARNING';

              return (
                <div
                  key={rule.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    isFail
                      ? 'border-rose-200 bg-rose-50/40'
                      : isWarn
                      ? 'border-amber-200 bg-amber-50/40'
                      : 'border-slate-200/80 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      {isPass && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                      {isFail && <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                      {isWarn && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900">{rule.title}</h4>
                          <span className="font-mono text-[10px] text-slate-400">
                            {rule.ruleCode}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1 leading-relaxed">{rule.description}</p>
                        <p className="text-[10px] text-blue-600 font-mono mt-1">
                          Authority Citation: {rule.statutoryReference}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        isPass
                          ? 'bg-emerald-100 text-emerald-800'
                          : isFail
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rule.status}
                    </span>
                  </div>

                  {/* Expected vs Actual */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Statutory Standard</span>
                      <span className="font-semibold text-slate-800">{rule.expectedStandard}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Observed Specification</span>
                      <span className="font-semibold text-slate-800">{rule.actualObserved}</span>
                    </div>
                  </div>

                  {/* Remediation Action */}
                  {rule.remedyAction && (
                    <div className="mt-2 p-2 rounded-lg bg-blue-50/80 border border-blue-100 text-blue-900 text-[11px]">
                      <strong>Remedy:</strong> {rule.remedyAction}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Remediation Roadmap & Recommended Next Steps */}
        {evaluation.remediationRoadmap.length > 0 && (
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2 text-xs text-amber-950">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Recommended Next Steps for Citizen Submission
            </h4>
            <ul className="space-y-1 pl-4 list-decimal leading-relaxed">
              {evaluation.remediationRoadmap.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
