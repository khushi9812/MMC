import React, { useState } from 'react';
import { MysuruProperty, ProposedConstruction } from '../types/mysuru';
import {
  Building2,
  FileCheck2,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Maximize2,
  Layers,
  FileText,
  UserCheck,
} from 'lucide-react';

interface PropertyDetailsProps {
  property: MysuruProperty;
  proposed: ProposedConstruction;
  onUpdateProposed: (newProposed: ProposedConstruction) => void;
  onNavigateToEligibility: () => void;
  onNavigateToDocuments: () => void;
  lang?: 'en' | 'kn';
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  property,
  proposed,
  onUpdateProposed,
  onNavigateToEligibility,
  onNavigateToDocuments,
  lang = 'en',
}) => {
  return (
    <div className="space-y-6">
      {/* Property Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold font-mono text-[10px] uppercase">
                {property.authority} Jurisdiction
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                  property.khataType === 'A-Khata'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {property.khataType}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-mono">
                PID: {property.pid}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">{property.siteNumber}</h1>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              {property.address}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onNavigateToDocuments}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              Verify Documents
            </button>
            <button
              onClick={onNavigateToEligibility}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Run Eligibility Check
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section 1: Basic Information */}
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            1. Basic Cadastral & Site Information
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Site Dimensions</span>
              <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                {property.siteDimensions}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Total Site Area</span>
              <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                {property.siteAreaSqFt} sq ft <span className="text-[10px] text-slate-500">({property.siteAreaSqM} m²)</span>
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Zoning Classification</span>
              <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                {property.zone}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Layout Approval Status</span>
              <span
                className={`font-semibold text-sm mt-0.5 block ${
                  property.approvedLayoutStatus ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {property.approvedLayoutStatus ? 'Approved Layout' : 'Unapproved Pocket'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Ownership Information with clear distinction */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              2. Ownership Information (Information Categorization)
            </h2>
            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Not conclusive legal proof of ownership
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Field A: Supplied / On Record Name */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
              <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-1.5 py-0.2 rounded inline-block mb-1">
                A. Recorded Property Holder
              </span>
              <p className="font-bold text-slate-900 mt-1">{property.currentPropertyHolderName}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Registry Source: <strong>{property.authority} Property Tax & Khata Record</strong>
              </p>
            </div>

            {/* Field B: Document & Registration */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded inline-block mb-1">
                B. Khata Assessment Status
              </span>
              <p className="font-bold text-slate-900 mt-1">{property.khataType}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Encumbrance: <strong>{property.encumbranceStatus}</strong>
              </p>
            </div>

            {/* Field C: Statutory Distinction Notice */}
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50">
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded inline-block mb-1">
                C. Statutory Distinction Note
              </span>
              <p className="text-[11px] text-amber-900 leading-relaxed mt-1">
                Khata extract and property tax receipts are solely for property tax assessment and do not confer absolute legal title without a registered conveyance deed.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Proposed Construction Parameters for Eligibility Scrutiny */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              3. Proposed Construction Specifications (Interactive Inputs)
            </h2>
            <span className="text-[11px] text-slate-400">
              Tune parameters to test bye-law compliance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Construction Type */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Proposed Construction Type
              </label>
              <select
                value={proposed.constructionType}
                onChange={(e) =>
                  onUpdateProposed({
                    ...proposed,
                    constructionType: e.target.value as any,
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              >
                <option value="Residential Individual House">Residential Individual House</option>
                <option value="Residential Duplex/Villa">Residential Duplex/Villa</option>
                <option value="Ground + 2 Floor Residential">Ground + 2 Floor Residential</option>
                <option value="Commercial Ground Floor + Residential">
                  Commercial Ground Floor + Residential
                </option>
              </select>
            </div>

            {/* Proposed Floors */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Number of Proposed Storeys / Floors
              </label>
              <input
                type="number"
                min={1}
                max={4}
                value={proposed.proposedFloors}
                onChange={(e) =>
                  onUpdateProposed({
                    ...proposed,
                    proposedFloors: Number(e.target.value),
                  })
                }
                className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 text-xs"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Standard MCC limit: G+2 storeys
              </span>
            </div>

            {/* Proposed Built-up Area */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Proposed Total Built-up Area (sq ft)
              </label>
              <input
                type="number"
                value={proposed.proposedBuiltUpAreaSqFt}
                onChange={(e) =>
                  onUpdateProposed({
                    ...proposed,
                    proposedBuiltUpAreaSqFt: Number(e.target.value),
                  })
                }
                className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 text-xs"
              />
            </div>

            {/* Ground Coverage Percent */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Ground Plinth Coverage (% of plot)
              </label>
              <input
                type="number"
                min={10}
                max={100}
                value={proposed.proposedGroundCoveragePercent}
                onChange={(e) =>
                  onUpdateProposed({
                    ...proposed,
                    proposedGroundCoveragePercent: Number(e.target.value),
                  })
                }
                className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 text-xs"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Max allowable: 65% (≤2400 sq ft) or 60%
              </span>
            </div>

            {/* Front Setback */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Front Road Setback (meters)
              </label>
              <input
                type="number"
                step="0.1"
                value={proposed.frontSetbackMeters}
                onChange={(e) =>
                  onUpdateProposed({
                    ...proposed,
                    frontSetbackMeters: Number(e.target.value),
                  })
                }
                className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 text-xs"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Min required: 1.5m (30x40) or 2.0m (40x60)
              </span>
            </div>

            {/* Rear Setback */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Rear Boundary Setback (meters)
              </label>
              <input
                type="number"
                step="0.1"
                value={proposed.rearSetbackMeters}
                onChange={(e) =>
                  onUpdateProposed({
                    ...proposed,
                    rearSetbackMeters: Number(e.target.value),
                  })
                }
                className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 text-xs"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Min required: 1.0m (30x40) or 1.5m
              </span>
            </div>

            {/* Road Width */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Abutting Road Width (meters)
              </label>
              <input
                type="number"
                step="0.5"
                value={proposed.roadWidthMeters}
                onChange={(e) =>
                  onUpdateProposed({
                    ...proposed,
                    roadWidthMeters: Number(e.target.value),
                  })
                }
                className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 text-xs"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                e.g., 9.0m (30 ft) or 12.0m (40 ft) road
              </span>
            </div>

            {/* Rainwater Harvesting Toggle */}
            <div className="flex items-center gap-3 pt-3">
              <input
                type="checkbox"
                id="rwhCheck"
                checked={proposed.hasRainwaterHarvesting}
                onChange={(e) =>
                  onUpdateProposed({
                    ...proposed,
                    hasRainwaterHarvesting: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="rwhCheck" className="text-slate-700 font-medium cursor-pointer">
                Rainwater Harvesting (RWH) sump included
              </label>
            </div>

            {/* Solar Water Heater Toggle */}
            <div className="flex items-center gap-3 pt-3">
              <input
                type="checkbox"
                id="solarCheck"
                checked={proposed.hasSolarWaterHeater}
                onChange={(e) =>
                  onUpdateProposed({
                    ...proposed,
                    hasSolarWaterHeater: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="solarCheck" className="text-slate-700 font-medium cursor-pointer">
                Rooftop Solar Water Heater provision
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
