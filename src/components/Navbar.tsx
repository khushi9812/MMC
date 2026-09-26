import React from 'react';
import {
  Building2,
  Sparkles,
  ClipboardList,
  BookOpen,
  Cpu,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { PermitDefinition } from '../types/permits';

interface NavbarProps {
  permits: PermitDefinition[];
  selectedPermit: PermitDefinition;
  onSelectPermit: (permit: PermitDefinition) => void;
  activeTab: 'chat' | 'wizard' | 'rules' | 'benchmarks' | 'certificate';
  setActiveTab: (tab: 'chat' | 'wizard' | 'rules' | 'benchmarks' | 'certificate') => void;
  isStaffMode: boolean;
  setIsStaffMode: (val: boolean) => void;
  municipality: string;
  setMunicipality: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  permits,
  selectedPermit,
  onSelectPermit,
  activeTab,
  setActiveTab,
  isStaffMode,
  setIsStaffMode,
  municipality,
  setMunicipality,
}) => {
  return (
    <header className="sticky top-0 z-40 shadow-xs">
      {/* 1. TOP BAR (TCS Branding) - Solid dark navy, crisp corporate typography */}
      <div className="bg-[#071120] text-slate-200 border-b border-[#182844] px-4 sm:px-6 h-10 flex items-center justify-between gap-4 text-xs">
        {/* Left: Clean official TCS text branding (no blue pill, no underline) */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            {/* Tata distinctive clean typography mark */}
            <span className="font-semibold text-white tracking-widest text-[11px] sm:text-xs uppercase select-none">
              TATA CONSULTANCY SERVICES
            </span>
          </div>
          <span className="hidden md:inline-block w-px h-3.5 bg-slate-700/80"></span>
          <span className="hidden md:inline-block text-slate-400 font-normal truncate">
            Public Services: Automated Permit Eligibility Checker
          </span>
        </div>

        {/* Right: Jurisdiction Dropdown & Staff Auditor Toggle (perfectly vertically centered) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="hidden sm:inline text-slate-400 text-[11px]">Jurisdiction:</span>
            <select
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
              className="bg-[#101c33] hover:bg-[#142340] text-xs text-slate-200 rounded-md px-2.5 py-1 border border-[#213556] focus:outline-none focus:border-blue-400 cursor-pointer transition-colors"
            >
              <option value="City of Metropolis (Unified Municipal Code)">
                City of Metropolis
              </option>
              <option value="Greater Urban Civic Corporation (Smart City)">
                Greater Urban Civic Corp
              </option>
              <option value="Silicon District Municipal Services">
                Silicon District
              </option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-xs text-slate-300 bg-[#101c33] hover:bg-[#142340] px-2.5 py-1 rounded-md cursor-pointer border border-[#213556] select-none transition-colors">
            <input
              type="checkbox"
              checked={isStaffMode}
              onChange={(e) => setIsStaffMode(e.target.checked)}
              className="w-3.5 h-3.5 text-blue-600 rounded bg-slate-800 border-slate-600 focus:ring-0 cursor-pointer"
            />
            <span className="font-medium text-amber-300 text-[11px] sm:text-xs">Staff Auditor View</span>
          </label>
        </div>
      </div>

      {/* 2. SINGLE LIGHT HEADER & TAB SECTION - Combines CivicPermit header & modern underline tabs */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3.5">
          {/* Header Row: Title & Clean Outlined Permit Dropdown */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-xs text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-slate-900">
                    CivicPermit AI
                  </h1>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    GenAI + Deterministic Rules
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Automated Citizen Eligibility & Document Pre-Screening Platform
                </p>
              </div>
            </div>

            {/* Target Permit Dropdown: Clean, outlined selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                Target Permit:
              </span>
              <div className="relative">
                <select
                  value={selectedPermit.id}
                  onChange={(e) => {
                    const found = permits.find((p) => p.id === e.target.value);
                    if (found) onSelectPermit(found);
                  }}
                  className="appearance-none bg-white hover:bg-slate-50/80 text-slate-900 font-semibold text-xs sm:text-sm pl-3.5 pr-9 py-2 rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none cursor-pointer transition-all"
                >
                  {permits.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.badge})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Modern Underline Tab Navigation */}
          <nav className="flex items-center gap-1 sm:gap-6 overflow-x-auto scrollbar-none border-t border-slate-100 -mb-px">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-2.5 px-2 sm:px-1 text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'chat'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 font-medium'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activeTab === 'chat' ? 'text-blue-600' : 'text-slate-400'}`} />
              Jev AI Guide
            </button>

            <button
              onClick={() => setActiveTab('wizard')}
              className={`py-2.5 px-2 sm:px-1 text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'wizard'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 font-medium'
              }`}
            >
              <ClipboardList className={`w-4 h-4 ${activeTab === 'wizard' ? 'text-blue-600' : 'text-slate-400'}`} />
              Quick Assessment Wizard
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`py-2.5 px-2 sm:px-1 text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'rules'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 font-medium'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${activeTab === 'rules' ? 'text-blue-600' : 'text-slate-400'}`} />
              Municipal Rules Matrix
            </button>

            <button
              onClick={() => setActiveTab('benchmarks')}
              className={`py-2.5 px-2 sm:px-1 text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'benchmarks'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 font-medium'
              }`}
            >
              <Cpu className={`w-4 h-4 ${activeTab === 'benchmarks' ? 'text-blue-600' : 'text-slate-400'}`} />
              Synthetic Benchmarking (80%+ Target)
            </button>

            <button
              onClick={() => setActiveTab('certificate')}
              className={`py-2.5 px-2 sm:px-1 text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'certificate'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 font-medium'
              }`}
            >
              <Printer className={`w-4 h-4 ${activeTab === 'certificate' ? 'text-blue-600' : 'text-slate-400'}`} />
              Pre-Screening Certificate
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
