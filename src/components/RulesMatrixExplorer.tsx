import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Code2,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Layers,
  Sparkles,
  Building2,
  Car,
  ShieldCheck,
} from 'lucide-react';
import { PermitDefinition } from '../types/permits';
import { MCC_MUDA_BYE_LAWS_CONFIG } from '../data/mccMudaByeLawsConfig';

interface RulesMatrixExplorerProps {
  permits: PermitDefinition[];
  selectedPermit: PermitDefinition;
  onSelectPermit: (p: PermitDefinition) => void;
}

export const RulesMatrixExplorer: React.FC<RulesMatrixExplorerProps> = ({
  permits,
  selectedPermit,
  onSelectPermit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'mcc_muda' | 'table' | 'json' | 'pipeline'>('mcc_muda');

  const categories = ['ALL', 'zoning', 'safety', 'dimensions', 'licensing', 'environmental'];

  const filteredCriteria = selectedPermit.criteria.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.legalCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === 'ALL' || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const exportAsJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(selectedPermit, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `municipal-rules-${selectedPermit.id}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportAsCSV = () => {
    const headers = [
      'Criterion ID',
      'Name',
      'Category',
      'Legal Code',
      'Target Field',
      'Condition Type',
      'Threshold Value',
      'Mandatory',
      'Description',
      'Mitigation Advice',
    ];

    const rows = selectedPermit.criteria.map((c) => [
      `"${c.id}"`,
      `"${c.name}"`,
      `"${c.category}"`,
      `"${c.legalCode}"`,
      `"${c.targetField}"`,
      `"${c.conditionType}"`,
      `"${String(c.thresholdValue)}"`,
      `"${c.isMandatory}"`,
      `"${c.description.replace(/"/g, '""')}"`,
      `"${c.mitigationAdvice.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute(
      'download',
      `municipal-criteria-${selectedPermit.id}.csv`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.07)] transition-shadow p-5 sm:p-6 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Municipal Rules & Statutory Criteria Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Transparent regulatory mapping from public guidelines to machine-readable rules and AI prompts.
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle and Export Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewMode('mcc_muda')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'mcc_muda'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              MCC / MUDA By-Laws
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Criteria Table
            </button>
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'pipeline'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Preprocessing Architecture
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'json'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Raw Schema (JSON)
            </button>
          </div>

          <button
            onClick={exportAsJSON}
            className="p-1.5 px-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
            title="Download JSON criteria schema"
          >
            <Code2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">JSON</span>
          </button>

          <button
            onClick={exportAsCSV}
            className="p-1.5 px-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
            title="Download CSV criteria matrix"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Permit Selector Bar */}
      <div className="my-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
          Select Permit:
        </span>
        {permits.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectPermit(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedPermit.id === p.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {p.title.split('&')[0].trim()}
          </button>
        ))}
      </div>

      {/* VIEW MODE: Official MCC & MUDA By-Laws Configuration Matrix */}
      {viewMode === 'mcc_muda' && (
        <div className="my-4 space-y-6">
          {/* Statutory Authority Header Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                  Config Version: {MCC_MUDA_BYE_LAWS_CONFIG.version}
                </span>
                <span className="text-[11px] text-slate-300">
                  Effective: {MCC_MUDA_BYE_LAWS_CONFIG.effectiveDate}
                </span>
              </div>
              <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                Statutory Code: MCC Building Bye-Laws Schedule II & MUDA Master Plan 2031
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Deterministic threshold rules evaluated by <code className="font-mono text-amber-300">evaluateApplicantEligibility</code> for building permits in Mysuru.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-md block">
                Jurisdiction: MCC & MUDA
              </span>
            </div>
          </div>

          {/* Section 1: Plot Dimensions, Boundary Setbacks & Ground Coverage Table */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                1. Setback Minimums & Ground Coverage Caps (MCC Schedule II, Tables 4 & 5)
              </h4>
              <span className="text-[11px] text-slate-500">Residential Plot Brackets</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Plot Area Bracket</th>
                    <th className="p-3">Min Front Setback</th>
                    <th className="p-3">Min Rear Setback</th>
                    <th className="p-3">Min Side Setbacks</th>
                    <th className="p-3">Max Ground Coverage</th>
                    <th className="p-3">Max Base FAR</th>
                    <th className="p-3">Statutory Rule Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {MCC_MUDA_BYE_LAWS_CONFIG.setbackAndCoverageRules.map((rule, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-semibold text-slate-900">
                        {rule.minPlotAreaSqFt === 0 ? 'Up to 1,200 sq ft' : `${rule.minPlotAreaSqFt.toLocaleString()} to ${rule.maxPlotAreaSqFt.toLocaleString()} sq ft`}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          ({rule.minPlotAreaSqM.toFixed(1)} to {rule.maxPlotAreaSqM.toFixed(1)} m²)
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-blue-700">
                        {rule.minFrontSetbackMeters} meters
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-800">
                        {rule.minRearSetbackMeters} meters
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        Left: {rule.minSideLeftSetbackMeters}m | Right: {rule.minSideRightSetbackMeters}m
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-700">
                        {rule.maxGroundCoveragePercent}%
                      </td>
                      <td className="p-3 font-mono font-bold text-purple-700">
                        {rule.maxFAR}
                      </td>
                      <td className="p-3 font-mono text-[10px] text-slate-500">
                        {rule.statutoryReference}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Floor Area Ratio (FAR) & Building Height by Road Width */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* FAR Matrix */}
            <div className="space-y-2 border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-600" />
                Floor Area Ratio (FAR) by Building Category
              </h4>
              <p className="text-[11px] text-slate-500">
                MUDA Master Plan 2031 & MCC Zoning Regulations Regulation 8
              </p>

              <div className="space-y-2 mt-3 text-xs">
                {Object.entries(MCC_MUDA_BYE_LAWS_CONFIG.farMatrix).map(([cat, val]) => (
                  <div key={cat} className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 capitalize block">
                        {cat.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {val.premiumFARAllowed ? `Premium FAR available up to ${val.maxPremiumFAR}` : 'Standard Base FAR only'}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200 text-xs">
                      Base FAR: {val.baseFAR}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Approach Road Width & Permissible Height Envelope */}
            <div className="space-y-2 border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-blue-600" />
                Building Height Envelope vs Approach Road Width
              </h4>
              <p className="text-[11px] text-slate-500">
                MCC Building Bye-Laws Regulation 6.2 (1.5 x Road Width Ratio)
              </p>

              <div className="space-y-2 mt-3 text-xs">
                {MCC_MUDA_BYE_LAWS_CONFIG.heightByRoadWidth.map((hr, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        Min {hr.minRoadWidthMeters}m Road Width ({Math.round(hr.minRoadWidthMeters * 3.28)} ft)
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Max {hr.maxStoreysPermissible} Storeys Permissible
                      </span>
                    </div>
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200 text-xs">
                      Max Height: {hr.maxPermissibleHeightMeters}m
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Parking Norms (ECS Ratios) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-emerald-600" />
              3. Parking Ratios & Equivalent Car Space (ECS) Standards (MCC Schedule VI)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {Object.entries(MCC_MUDA_BYE_LAWS_CONFIG.parkingNorms).slice(0, 3).map(([key, p]) => (
                <div key={key} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 capitalize text-xs">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                      {p.minimumDrivewayWidthMeters}m Driveway
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {p.ecsRatio}
                  </p>
                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                    Ratio: 1 car space per {p.fourWheelerPerSqM} m² built-up • {p.statutoryReference}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Environmental Mandates (Rainwater Harvesting & Solar) */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3 text-xs text-emerald-950">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                4. Statutory Environmental Infrastructure Mandates
              </span>
              <span className="text-[10px] text-emerald-700 font-mono">
                Karnataka Municipal Corporations (Amendment) Act
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {MCC_MUDA_BYE_LAWS_CONFIG.environmentalRules.map((env) => (
                <div key={env.id} className="p-3 bg-white rounded-lg border border-emerald-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900">{env.name}</h5>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Mandatory
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{env.thresholdCondition}</p>
                  <p className="text-[11px] font-mono text-emerald-800 pt-1">
                    Spec: {env.specification}
                  </p>
                  <p className="text-[10px] text-slate-400 pt-0.5">
                    Citation: {env.statutoryReference}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pipeline View Mode */}
      {viewMode === 'pipeline' && (
        <div className="my-4 space-y-6">
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
            <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              LangChain & Python Processing Pipeline Architecture
            </h3>
            <p className="text-xs text-blue-800/90 mt-1 leading-relaxed">
              How public municipal guidelines and statutory codes are ingested, normalized into structured logic rules via Python/LangChain prompt orchestration patterns, and fed synchronously to Jev AI (Conversational Assessment Officer) and deterministic validators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {/* Step 1 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[10px]">
                  STEP 01
                </span>
                <h4 className="font-bold text-slate-900 mt-2 text-sm">
                  Public Guidelines Ingestion
                </h4>
                <p className="text-slate-500 mt-1 text-[11px] leading-relaxed">
                  Municipal codes, zoning ordinances, fire safety guidelines, and health regulations are parsed into raw regulatory provisions.
                </p>
              </div>
              <div className="mt-3 p-2 bg-slate-50 rounded font-mono text-[10px] text-slate-600">
                PDFs • Municipal Code § 15-18 • Public Health Act
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-bold text-[10px]">
                  STEP 02
                </span>
                <h4 className="font-bold text-slate-900 mt-2 text-sm">
                  Rule Normalization & Schema
                </h4>
                <p className="text-slate-500 mt-1 text-[11px] leading-relaxed">
                  Criteria mapped into structured JSON objects with condition types (`numeric_min`, `in_list`, `boolean`, `custom`) and mandatory flags.
                </p>
              </div>
              <div className="mt-3 p-2 bg-slate-50 rounded font-mono text-[10px] text-slate-600">
                {`{ id: "crit_rear_setback", min: 5.0, unit: "ft" }`}
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono font-bold text-[10px]">
                  STEP 03
                </span>
                <h4 className="font-bold text-slate-900 mt-2 text-sm">
                  Jev AI Chain Execution
                </h4>
                <p className="text-slate-500 mt-1 text-[11px] leading-relaxed">
                  1) LangChain-style structured prompt formatting conditions rules & past turns.
                  2) Jev AI chatbot extracts parameters while mathematical rules verify 80%+ accuracy.
                </p>
              </div>
              <div className="mt-3 p-2 bg-slate-50 rounded font-mono text-[10px] text-purple-700">
                80%+ Assessment Accuracy Target
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                  STEP 04
                </span>
                <h4 className="font-bold text-slate-900 mt-2 text-sm">
                  Actionable Feedback & Clearance
                </h4>
                <p className="text-slate-500 mt-1 text-[11px] leading-relaxed">
                  Generates instant eligibility scorecard, remediation checklist, missing document notices, and official Pre-Screening Certificate.
                </p>
              </div>
              <div className="mt-3 p-2 bg-slate-50 rounded font-mono text-[10px] text-emerald-700">
                Verified Citizen Dossier + QR Tracking
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JSON Schema View Mode */}
      {viewMode === 'json' && (
        <div className="my-4">
          <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto max-h-[500px]">
            {JSON.stringify(selectedPermit, null, 2)}
          </pre>
        </div>
      )}

      {/* Table View Mode */}
      {viewMode === 'table' && (
        <div className="my-2 space-y-4">
          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search rule name, legal code, or statutory description..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
              <span className="text-slate-400 font-semibold uppercase text-[10px] shrink-0 mr-1">
                Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-md capitalize font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Rule / Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Statutory Legal Code</th>
                    <th className="p-3">Threshold / Condition</th>
                    <th className="p-3">Enforcement</th>
                    <th className="p-3">Actionable Mitigation Pathway</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredCriteria.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-semibold text-slate-900 min-w-[160px]">
                        <div>{c.name}</div>
                        <div className="text-[11px] font-normal text-slate-500 mt-0.5">
                          {c.description}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          {c.category}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-xs text-blue-700 font-medium whitespace-nowrap">
                        {c.legalCode}
                      </td>
                      <td className="p-3 font-mono text-xs font-semibold text-slate-800 whitespace-nowrap">
                        <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">
                          {c.conditionType}: {String(c.thresholdValue)} {c.unit || ''}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {c.isMandatory ? (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px] uppercase">
                            Mandatory
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[10px]">
                            Discretionary
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-[11px] text-slate-600 min-w-[220px]">
                        {c.mitigationAdvice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
