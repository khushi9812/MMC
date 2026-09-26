import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  ChevronRight,
  ChevronDown,
  FileText,
  Printer,
  Sparkles,
  Scale,
} from 'lucide-react';
import {
  PermitDefinition,
  RuleEvaluationSummary,
  DocumentRequirement,
} from '../types/permits';

interface EligibilityScorecardProps {
  permit: PermitDefinition;
  evaluation: RuleEvaluationSummary;
  applicantData: Record<string, any>;
  onUpdateApplicantData: (newData: Record<string, any>) => void;
  onOpenDocumentReview: (doc: DocumentRequirement) => void;
  onNavigateToCertificate: () => void;
  isStaffMode?: boolean;
}

export const EligibilityScorecard: React.FC<EligibilityScorecardProps> = ({
  permit,
  evaluation,
  applicantData,
  onUpdateApplicantData,
  onOpenDocumentReview,
  onNavigateToCertificate,
  isStaffMode = false,
}) => {
  const [expandedCriterionId, setExpandedCriterionId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'FAIL' | 'WARNING' | 'PASS'>('ALL');

  const getStatusBadge = () => {
    switch (evaluation.overallStatus) {
      case 'ELIGIBLE':
        return {
          bg: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/30',
          badgeText: 'PRE-SCREENING ELIGIBLE',
          description: 'Applicant meets all mandatory statutory criteria and prerequisite parameters.',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600',
        };
      case 'CONDITIONALLY_ELIGIBLE':
        return {
          bg: 'bg-amber-500/10 text-amber-900 border-amber-500/30',
          badgeText: 'CONDITIONALLY ELIGIBLE',
          description: 'Primary criteria pass, but requires submission of missing documents or minor compliance remedies.',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
        };
      case 'INELIGIBLE':
        return {
          bg: 'bg-rose-500/10 text-rose-900 border-rose-500/30',
          badgeText: 'ACTION / VARIANCE REQUIRED',
          description: 'One or more statutory criteria are currently in non-compliance. See actionable mitigation steps below.',
          icon: XCircle,
          iconColor: 'text-rose-600',
        };
    }
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  const toggleDocumentUpload = (docId: string) => {
    const currentList: string[] = applicantData.uploadedDocumentIds || [];
    const updated = currentList.includes(docId)
      ? currentList.filter((id) => id !== docId)
      : [...currentList, docId];
    onUpdateApplicantData({ ...applicantData, uploadedDocumentIds: updated });
  };

  const filteredCriteria = evaluation.criteriaResults.filter((c) => {
    if (filterStatus === 'ALL') return true;
    return c.status === filterStatus;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.07)] transition-shadow flex flex-col h-full overflow-hidden">
      {/* Scorecard Header with generous padding */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Evaluation Scorecard
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-semibold font-mono">
              {permit.code}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>{evaluation.accuracyConfidence}% Accuracy</span>
          </div>
        </div>

        {/* Verdict Banner */}
        <div className={`p-4 rounded-xl border ${statusBadge.bg} flex items-start gap-3 transition-all`}>
          <div className="mt-0.5">
            <StatusIcon className={`w-5 h-5 ${statusBadge.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold tracking-tight">
                {statusBadge.badgeText}
              </h2>
              <div className="flex items-center gap-1 text-xs font-bold font-mono px-2 py-0.5 rounded bg-white/90 shadow-2xs">
                Score: {evaluation.score}/100
              </div>
            </div>
            <p className="text-xs mt-1 text-slate-600 leading-relaxed">
              {statusBadge.description}
            </p>
          </div>
        </div>

        {/* Quick Metrics Bar: Clean spaced-out flex grid with subtle light-gray cards (no spreadsheet vertical dividers) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
            <span className="text-slate-500 text-[11px] font-medium">Passed Rules</span>
            <span className="text-base font-bold text-emerald-600 mt-1">
              {evaluation.passedCount} / {permit.criteria.length}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
            <span className="text-slate-500 text-[11px] font-medium">Violations</span>
            <span
              className={`text-base font-bold mt-1 ${
                evaluation.failedCount > 0 ? 'text-rose-600' : 'text-slate-700'
              }`}
            >
              {evaluation.failedCount} Failed {evaluation.warningCount > 0 && `• ${evaluation.warningCount} Adv`}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
            <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-slate-400" /> Est. Municipal Fee
            </span>
            <span className="text-base font-bold text-slate-800 mt-1">
              ${evaluation.estimatedFee}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
            <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> Est. Review Time
            </span>
            <span className="text-base font-bold text-slate-800 mt-1">
              ~{evaluation.estimatedReviewDays} days
            </span>
          </div>
        </div>
      </div>

      {/* Main Body - Scrollable with enhanced whitespace */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
        {/* Action Items & Remediation Checklist */}
        {evaluation.actionItems.length > 0 && (
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Remediation & Missing Elements ({evaluation.actionItems.length})
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-amber-950">
              {evaluation.actionItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-white/80 p-2.5 rounded-lg border border-amber-100/80">
                  <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Criteria Evaluation List */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Statutory Criteria Breakdown
              </h3>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
              {(['ALL', 'FAIL', 'PASS'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterStatus(filter)}
                  className={`px-2.5 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                    filterStatus === filter
                      ? 'bg-white text-slate-800 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredCriteria.map((c) => {
              const isExpanded = expandedCriterionId === c.criterionId;
              const isPass = c.status === 'PASS';
              const isFail = c.status === 'FAIL';
              const isWarn = c.status === 'WARNING';

              return (
                <div
                  key={c.criterionId}
                  className={`rounded-xl border transition-all text-xs ${
                    isFail
                      ? 'border-rose-200 bg-rose-50/40'
                      : isWarn
                      ? 'border-amber-200 bg-amber-50/30'
                      : isPass
                      ? 'border-slate-200/80 bg-white hover:border-slate-300'
                      : 'border-slate-200/60 bg-slate-50/50'
                  }`}
                >
                  <button
                    onClick={() =>
                      setExpandedCriterionId(isExpanded ? null : c.criterionId)
                    }
                    className="w-full text-left p-3.5 flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isPass && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {isFail && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                      {isWarn && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                      {c.status === 'PENDING' && (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-dashed shrink-0" />
                      )}

                      <div className="truncate">
                        <span className="font-semibold text-slate-900">
                          {c.name}
                        </span>
                        <span className="ml-2 font-mono text-[10px] text-slate-400">
                          {c.legalCode}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isPass
                            ? 'bg-emerald-100 text-emerald-800'
                            : isFail
                            ? 'bg-rose-100 text-rose-800'
                            : isWarn
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {c.status}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 text-slate-600 space-y-2.5">
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg text-[11px]">
                        <div>
                          <span className="text-slate-400 block font-medium">Reported Value</span>
                          <span className="font-semibold text-slate-900">
                            {c.actualValue !== undefined ? String(c.actualValue) : 'Not specified'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Required Standard</span>
                          <span className="font-semibold text-slate-900">
                            {String(c.expectedValue)}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-700 leading-relaxed font-medium">
                        {c.reason}
                      </p>

                      {c.mitigationAdvice && (
                        <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-blue-900 text-[11px] flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">
                            <strong>Mitigation Pathway:</strong> {c.mitigationAdvice}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Required Documents Pre-Screening Section */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Document Readiness Checklist ({evaluation.verifiedDocuments.length}/
                {permit.documents.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Click to toggle or review
            </span>
          </div>

          <div className="space-y-2.5">
            {permit.documents.map((doc) => {
              const isUploaded = (applicantData.uploadedDocumentIds || []).includes(doc.id);

              return (
                <div
                  key={doc.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 text-xs ${
                    isUploaded
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : doc.isMandatory
                      ? 'border-slate-200/80 bg-white hover:border-slate-300'
                      : 'border-slate-200/50 bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isUploaded}
                      onChange={() => toggleDocumentUpload(doc.id)}
                      className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-semibold ${
                            isUploaded ? 'text-emerald-900' : 'text-slate-900'
                          }`}
                        >
                          {doc.name}
                        </span>
                        {doc.isMandatory ? (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 font-bold uppercase">
                            Mandatory
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                            Optional / If Applicable
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {doc.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-mono">
                        <span>Formats: {doc.acceptableFormats.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenDocumentReview(doc)}
                    className="shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                    title="Audit document readiness with AI"
                  >
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    AI Audit
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Staff Mode: Regulatory Rule Execution Trace */}
        {isStaffMode && (
          <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40 text-xs">
            <div className="flex items-center gap-2 font-bold text-purple-900 mb-2">
              <Scale className="w-4 h-4 text-purple-600" />
              <span>Municipal Staff Plan-Checker Trace</span>
            </div>
            <p className="text-[11px] text-purple-800 mb-2">
              Audit log automatically verifying statutory code conformance:
            </p>
            <div className="bg-slate-900 text-emerald-400 font-mono text-[10px] p-3 rounded-lg overflow-x-auto leading-relaxed">
              <p># ENGINE: Deterministic Rule Matrix 2026.04</p>
              <p># JURISDICTION: Municipal Code Title 15/17/18</p>
              <p># PASS_COUNT: {evaluation.passedCount} | FAIL_COUNT: {evaluation.failedCount}</p>
              <p># MANDATORY_DOCS_VERIFIED: {evaluation.verifiedDocuments.length} / {permit.documents.filter(d => d.isMandatory).length}</p>
              <p># CITATIONS_FLAGGED: {evaluation.legalReferenceHighlights.join(', ')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Scorecard Footer - Action Button */}
      <div className="p-4 sm:p-5 border-t border-slate-100 bg-white">
        <button
          onClick={onNavigateToCertificate}
          className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Generate Pre-Screening Dossier & Certificate
        </button>
      </div>
    </div>
  );
};
