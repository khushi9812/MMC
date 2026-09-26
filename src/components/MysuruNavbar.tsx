import React from 'react';
import {
  Building2,
  Search,
  MapPin,
  FileCheck2,
  Sliders,
  FileText,
  ShieldCheck,
  Globe2,
  User,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { UserRole, LanguageCode } from '../types/mysuru';
import { TRANSLATIONS } from '../utils/translations';

export type MysuruTab =
  | 'dashboard'
  | 'search'
  | 'map'
  | 'eligibility'
  | 'documents'
  | 'report'
  | 'authorities'
  | 'ai_chat';

interface MysuruNavbarProps {
  activeTab: MysuruTab;
  setActiveTab: (tab: MysuruTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
}

export const MysuruNavbar: React.FC<MysuruNavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  lang,
  setLang,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="sticky top-0 z-40 shadow-xs">
      {/* 1. TOP STATUTORY GOV BAR: Deep Navy with Karnataka Emblem and Authority Badges */}
      <div className="bg-[#071120] text-slate-200 border-b border-[#182844] px-4 sm:px-6 h-10 flex items-center justify-between gap-4 text-xs">
        {/* Left: Karnataka Govt Branding & Mysuru Municipal Authority Notice */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-sm">🟡🔴</span>
          <span className="font-semibold text-white tracking-wider text-[11px] sm:text-xs uppercase select-none">
            GOVERNMENT OF KARNATAKA
          </span>
          <span className="hidden md:inline-block w-px h-3.5 bg-slate-700/80"></span>
          <span className="hidden md:inline-block text-slate-300 font-normal truncate">
            {t.mysuruGovBadge}
          </span>
        </div>

        {/* Right: Language Switcher & Role Selector */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#101c33] hover:bg-[#142340] border border-[#213556] text-amber-300 font-semibold text-xs cursor-pointer transition-colors"
          >
            <Globe2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
          </button>

          {/* User Role Selector */}
          <div className="flex items-center gap-1.5 bg-[#101c33] px-2 py-1 rounded-md border border-[#213556] text-xs">
            <User className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer font-medium"
            >
              <option value="citizen" className="bg-[#071120]">
                {t.roleCitizen}
              </option>
              <option value="officer" className="bg-[#071120]">
                {t.roleOfficer}
              </option>
              <option value="guest" className="bg-[#071120]">
                {t.roleGuest}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. MAIN APP BAR & UNDERLINE NAVIGATION TABS */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3">
          {/* Title & Brand Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-teal-600 flex items-center justify-center shadow-xs text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-slate-900">
                    {t.appTitle}
                  </h1>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold border border-teal-200">
                    Mysuru Building Bye-Laws
                  </span>
                </div>
                <p className="text-xs text-slate-500">{t.appSubtitle}</p>
              </div>
            </div>

            {/* Quick Status Tag */}
            <div className="flex items-center gap-2 text-xs">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Deterministic Bye-Law Engine</span>
              </span>
            </div>
          </div>

          {/* Underline Tabs */}
          <nav className="flex items-center gap-1 sm:gap-5 overflow-x-auto scrollbar-none border-t border-slate-100 -mb-px text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2.5 px-2 flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 font-medium'
              }`}
            >
              <span>🏛️ {t.navDashboard}</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`py-2.5 px-2 flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'search'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 font-medium'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{t.navSearch}</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`py-2.5 px-2 flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'map'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 font-medium'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{t.navMap}</span>
            </button>

            <button
              onClick={() => setActiveTab('eligibility')}
              className={`py-2.5 px-2 flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'eligibility'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 font-medium'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{t.navEligibility}</span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`py-2.5 px-2 flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'documents'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 font-medium'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t.navDocuments}</span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`py-2.5 px-2 flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'report'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 font-medium'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>{t.navMyReports}</span>
            </button>

            <button
              onClick={() => setActiveTab('authorities')}
              className={`py-2.5 px-2 flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'authorities'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 font-medium'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{t.navGovServices}</span>
            </button>

            <button
              onClick={() => setActiveTab('ai_chat')}
              className={`py-2.5 px-2 flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === 'ai_chat'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 font-medium'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Jev AI Assistant</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
