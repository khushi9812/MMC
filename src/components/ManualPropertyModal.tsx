import React, { useState } from 'react';
import { MysuruProperty } from '../types/mysuru';
import { PlusCircle, MapPin, Building, CheckCircle2, X } from 'lucide-react';

interface ManualPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProperty: (property: MysuruProperty) => void;
  lang?: 'en' | 'kn';
}

export const ManualPropertyModal: React.FC<ManualPropertyModalProps> = ({
  isOpen,
  onClose,
  onSaveProperty,
  lang = 'en',
}) => {
  const [pid, setPid] = useState('MCC-W15-PID-' + Math.floor(10000 + Math.random() * 90000));
  const [siteNumber, setSiteNumber] = useState('');
  const [layoutName, setLayoutName] = useState('Vijayanagar 3rd Stage');
  const [wardNumber, setWardNumber] = useState('Ward 15 (Vijayanagar)');
  const [address, setAddress] = useState('');
  const [siteDimensions, setSiteDimensions] = useState('30 ft x 40 ft');
  const [siteAreaSqFt, setSiteAreaSqFt] = useState(1200);
  const [authority, setAuthority] = useState<'MCC' | 'MUDA'>('MCC');
  const [khataType, setKhataType] = useState<'A-Khata' | 'B-Khata' | 'E-Khata'>('A-Khata');
  const [holderName, setHolderName] = useState('');
  const [approvedLayout, setApprovedLayout] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProperty: MysuruProperty = {
      id: 'USER-PROP-' + Date.now(),
      pid: pid.trim(),
      siteNumber: siteNumber.trim() || 'Site Plot #UserEntry',
      layoutName: layoutName.trim(),
      wardNumber: wardNumber.trim(),
      zone: 'Residential Main (R-1)',
      address: address.trim() || `${siteNumber}, ${layoutName}, Mysuru, Karnataka`,
      siteDimensions,
      siteAreaSqFt: Number(siteAreaSqFt) || 1200,
      siteAreaSqM: Math.round((Number(siteAreaSqFt) || 1200) * 0.092903),
      coordinates: {
        lat: 12.308 + (Math.random() - 0.5) * 0.02,
        lng: 76.635 + (Math.random() - 0.5) * 0.02,
      },
      authority,
      khataType,
      currentPropertyHolderName: holderName.trim() || 'User Specified Property Holder',
      sourceType: 'USER_SUBMITTED',
      isSynthetic: false,
      lastUpdatedDate: new Date().toISOString().split('T')[0],
      existingBuildingStatus: 'Vacant Site',
      existingBuiltUpAreaSqFt: 0,
      approvedLayoutStatus: approvedLayout,
      encumbranceStatus: 'Verification Pending',
    };

    onSaveProperty(newProperty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-600" />
              Enter Property Details Manually
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify your Mysuru parcel details for instant bye-law eligibility scrutiny.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Property ID / PID
              </label>
              <input
                type="text"
                required
                value={pid}
                onChange={(e) => setPid(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Site / Plot Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Site 45, 2nd Main"
                value={siteNumber}
                onChange={(e) => setSiteNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Layout Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Kuvempunagar, Vijayanagar"
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ward Number</label>
              <input
                type="text"
                required
                placeholder="e.g. Ward 12"
                value={wardNumber}
                onChange={(e) => setWardNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Property Holder Name (from Sale Deed / Khata)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Site Area (Sq.Ft)</label>
              <input
                type="number"
                required
                value={siteAreaSqFt}
                onChange={(e) => setSiteAreaSqFt(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dimensions</label>
              <input
                type="text"
                value={siteDimensions}
                onChange={(e) => setSiteDimensions(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Authority</label>
              <select
                value={authority}
                onChange={(e) => setAuthority(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              >
                <option value="MCC">Mysuru City Corporation (MCC)</option>
                <option value="MUDA">Mysuru Urban Dev Authority (MUDA)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Khata Status</label>
              <select
                value={khataType}
                onChange={(e) => setKhataType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              >
                <option value="A-Khata">A-Khata (Standard Approved)</option>
                <option value="E-Khata">E-Khata (Digital Form 3)</option>
                <option value="B-Khata">B-Khata (Revenue Register)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="approvedCheck"
              checked={approvedLayout}
              onChange={(e) => setApprovedLayout(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="approvedCheck" className="text-slate-700 font-medium cursor-pointer">
              Site is in an approved MUDA or DC converted layout
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
            >
              Save & Inspect Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
