import React from 'react';
import {
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react';
import { PermitDefinition } from '../types/permits';

interface DirectWizardProps {
  permit: PermitDefinition;
  applicantData: Record<string, any>;
  onUpdateApplicantData: (data: Record<string, any>) => void;
  onRunAudit: () => void;
  isAuditing: boolean;
}

export const DirectWizard: React.FC<DirectWizardProps> = ({
  permit,
  applicantData,
  onUpdateApplicantData,
  onRunAudit,
  isAuditing,
}) => {
  const handleChange = (key: string, value: any) => {
    onUpdateApplicantData({
      ...applicantData,
      [key]: value,
    });
  };

  const handleApplyDefaults = () => {
    const defaults: Record<string, any> = {};
    permit.fields.forEach((f) => {
      if (f.defaultValue !== undefined) {
        defaults[f.key] = f.defaultValue;
      }
    });
    onUpdateApplicantData({ ...applicantData, ...defaults });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.07)] transition-shadow p-5 sm:p-6 flex flex-col h-full overflow-y-auto">
      {/* Wizard Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Direct Assessment Parameters: {permit.title}
              </h2>
              <p className="text-xs text-slate-500">
                Adjust specific project dimensions and conditions for instant regulatory evaluation.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleApplyDefaults}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            Load Standard Values
          </button>

          <button
            onClick={onRunAudit}
            disabled={isAuditing}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            {isAuditing ? 'Auditing...' : 'Run Deep AI Audit'}
          </button>
        </div>
      </div>

      {/* Guidelines Summary Card */}
      <div className="my-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900">Statutory Standard: </span>
          <span>{permit.guidelinesSummary}</span>
          <div className="mt-1 font-mono text-[10px] text-slate-500">
            Governing Authority: {permit.statutoryAuthority} • Department: {permit.department}
          </div>
        </div>
      </div>

      {/* Input Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
        {permit.fields.map((field) => {
          const currentValue =
            applicantData[field.key] !== undefined
              ? applicantData[field.key]
              : field.defaultValue;

          return (
            <div
              key={field.key}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {field.label}
                  {field.unit && (
                    <span className="ml-1 text-[11px] font-normal text-slate-400">
                      ({field.unit})
                    </span>
                  )}
                </label>

                {field.helperText && (
                  <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                    {field.helperText}
                  </p>
                )}
              </div>

              <div className="mt-2">
                {field.type === 'select' && (
                  <select
                    value={currentValue ?? ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === 'number' && (
                  <div className="relative">
                    <input
                      type="number"
                      value={currentValue ?? ''}
                      onChange={(e) =>
                        handleChange(
                          field.key,
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                      placeholder={field.placeholder}
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {field.unit && (
                      <span className="absolute right-3 top-2 text-xs font-medium text-slate-400 pointer-events-none">
                        {field.unit}
                      </span>
                    )}
                  </div>
                )}

                {field.type === 'boolean' && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange(field.key, true)}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        currentValue === true
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Yes / Compliant
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange(field.key, false)}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        currentValue === false
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      No / Exempt
                    </button>
                  </div>
                )}

                {field.type === 'text' && (
                  <input
                    type="text"
                    value={currentValue ?? ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pre-Screening Document Verification Toggles */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Required Document Self-Check (Preliminary Package)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {permit.documents.map((doc) => {
            const isUploaded = (applicantData.uploadedDocumentIds || []).includes(
              doc.id
            );

            return (
              <label
                key={doc.id}
                className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                  isUploaded
                    ? 'border-emerald-300 bg-emerald-50/50 text-emerald-950 font-semibold'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <input
                    type="checkbox"
                    checked={isUploaded}
                    onChange={(e) => {
                      const list = applicantData.uploadedDocumentIds || [];
                      const updated = e.target.checked
                        ? [...list, doc.id]
                        : list.filter((id: string) => id !== doc.id);
                      handleChange('uploadedDocumentIds', updated);
                    }}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-0"
                  />
                  <span className="truncate">{doc.name}</span>
                </div>
                {doc.isMandatory && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold uppercase shrink-0">
                    Req
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
