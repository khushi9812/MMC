import React, { useState } from 'react';
import { MysuruProperty } from '../types/mysuru';
import {
  Search,
  MapPin,
  Building,
  FileCheck,
  ChevronRight,
  Filter,
  PlusCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface PropertySearchProps {
  properties: MysuruProperty[];
  selectedProperty: MysuruProperty | null;
  onSelectProperty: (property: MysuruProperty) => void;
  onOpenManualEntry: () => void;
  lang?: 'en' | 'kn';
}

export const PropertySearch: React.FC<PropertySearchProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  onOpenManualEntry,
  lang = 'en',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [authorityFilter, setAuthorityFilter] = useState<'ALL' | 'MCC' | 'MUDA'>('ALL');
  const [layoutFilter, setLayoutFilter] = useState<string>('ALL');

  // Unique layout names for quick filter
  const layouts = Array.from(new Set(properties.map((p) => p.layoutName)));

  // Filtered properties
  const filtered = properties.filter((p) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      p.pid.toLowerCase().includes(term) ||
      p.siteNumber.toLowerCase().includes(term) ||
      p.layoutName.toLowerCase().includes(term) ||
      p.wardNumber.toLowerCase().includes(term) ||
      p.address.toLowerCase().includes(term) ||
      p.currentPropertyHolderName.toLowerCase().includes(term);

    const matchesAuthority = authorityFilter === 'ALL' || p.authority === authorityFilter;
    const matchesLayout = layoutFilter === 'ALL' || p.layoutName === layoutFilter;

    return matchesSearch && matchesAuthority && matchesLayout;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            {lang === 'kn' ? 'ಮೈಸೂರು ಆಸ್ತಿ ಹುಡುಕಾಟ' : 'Mysuru Municipal Property Search'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'kn'
              ? 'ಆಸ್ತಿ ಐಡಿ (PID), ನಿವೇಶನ ಸಂಖ್ಯೆ (Site No), ಅಥವಾ ಬಡಾವಣೆ (Layout) ಮೂಲಕ ಹುಡುಕಿ'
              : 'Search via Property ID (PID), Site Number, Ward, or Layout Name across Mysuru'}
          </p>
        </div>

        {/* Manual Entry Button */}
        <button
          onClick={onOpenManualEntry}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/80 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-blue-600" />
          <span>{lang === 'kn' ? '+ ಹೊಸ ಆಸ್ತಿ ನಮೂದಿಸಿ' : '+ Enter Property Manually'}</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              lang === 'kn'
                ? 'ಉದಾ: Vijayanagar, Site 104, ಅಥವಾ MCC-W12-PID...'
                : 'e.g., Vijayanagar, Site 104, Dattagalli, or MCC-W12-PID-48291...'
            }
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Authority Filter */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
          <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" /> Authority:
          </span>
          {(['ALL', 'MCC', 'MUDA'] as const).map((auth) => (
            <button
              key={auth}
              onClick={() => setAuthorityFilter(auth)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                authorityFilter === auth
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {auth}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results List */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <span>
            Found <strong>{filtered.length}</strong> matching property records in Mysuru
          </span>
          <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
            MCC & MUDA Property Cadastral Register
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-3 bg-slate-50/50">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              {lang === 'kn' ? 'ಯಾವುದೇ ಆಸ್ತಿ ಕಂಡುಬಂದಿಲ್ಲ' : 'No matching property was found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Please verify the details or enter property information manually to perform a municipal building permit eligibility check.
            </p>
            <button
              onClick={onOpenManualEntry}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Enter Property Details Manually
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filtered.map((prop) => {
              const isSelected = selectedProperty?.id === prop.id;

              return (
                <div
                  key={prop.id}
                  onClick={() => onSelectProperty(prop)}
                  className={`p-4 rounded-xl border text-xs transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-sm'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    {/* Top Row: Authority Badge & Khata */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider ${
                          prop.authority === 'MUDA'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {prop.authority} • {prop.khataType}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {prop.lastUpdatedDate}
                      </span>
                    </div>

                    {/* Site and Layout */}
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {prop.siteNumber}
                    </h3>
                    <p className="text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      {prop.layoutName}, {prop.wardNumber}
                    </p>

                    {/* Property ID and Details */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                      <div>
                        <span className="block text-slate-400 text-[10px]">Property ID (PID)</span>
                        <span className="font-mono font-semibold text-slate-700">{prop.pid}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 text-[10px]">Site Area</span>
                        <span className="font-semibold text-slate-700">
                          {prop.siteAreaSqFt} sq ft ({prop.siteDimensions})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Link Footer */}
                  <div className="mt-3.5 pt-2 border-t border-slate-100 flex items-center justify-between text-blue-600 font-semibold text-[11px]">
                    <span className="text-slate-400 font-normal">
                      Holder: <strong className="text-slate-600">{prop.currentPropertyHolderName.split('(')[0]}</strong>
                    </span>
                    <span className="flex items-center gap-0.5 hover:underline">
                      View Details & Check <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
