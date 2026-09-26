import React, { useState, useMemo } from 'react';
import { MysuruNavbar, MysuruTab } from './components/MysuruNavbar';
import { CitizenDashboard } from './components/CitizenDashboard';
import { PropertySearch } from './components/PropertySearch';
import { MysuruMap } from './components/MysuruMap';
import { PropertyDetails } from './components/PropertyDetails';
import { EligibilityChecker } from './components/EligibilityChecker';
import { DocumentScanner } from './components/DocumentScanner';
import { GovernmentServices } from './components/GovernmentServices';
import { ReportView } from './components/ReportView';
import { ManualPropertyModal } from './components/ManualPropertyModal';
import { MysuruChatAssistant } from './components/MysuruChatAssistant';
import { ConversationalAssessor } from './components/ConversationalAssessor';
import { EligibilityScorecard } from './components/EligibilityScorecard';
import { RulesMatrixExplorer } from './components/RulesMatrixExplorer';
import { BenchmarkSuite } from './components/BenchmarkSuite';

import { MYSURU_SAMPLE_PROPERTIES, KARNATAKA_AUTHORITIES } from './data/mysuruProperties';
import { PERMITS_CATALOG } from './data/permitsData';
import { SAMPLE_PROFILES } from './data/sampleProfiles';
import { evaluateApplicantEligibility } from './data/rulesEngine';

import {
  MysuruProperty,
  ProposedConstruction,
  DocumentScanResult,
  UserRole,
  LanguageCode,
} from './types/mysuru';
import {
  Sparkles,
  MapPin,
  Search,
  FileCheck2,
  FileText,
  Building2,
  ShieldCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<MysuruTab>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('citizen');
  const [lang, setLang] = useState<LanguageCode>('en');

  // Properties state (initialized with authentic Mysuru sample properties)
  const [properties, setProperties] = useState<MysuruProperty[]>(MYSURU_SAMPLE_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<MysuruProperty>(
    MYSURU_SAMPLE_PROPERTIES[0]
  );

  // Manual property modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Proposed construction state for currently selected property
  const [proposed, setProposed] = useState<ProposedConstruction>({
    propertyId: MYSURU_SAMPLE_PROPERTIES[0].id,
    constructionType: 'Residential Individual House',
    proposedFloors: 2,
    proposedBuiltUpAreaSqFt: 1800,
    proposedGroundCoveragePercent: 55, // Under 65% limit
    proposedHeightMeters: 8.5,
    frontSetbackMeters: 2.0, // Meets 1.5m minimum for 30x40
    rearSetbackMeters: 1.5, // Meets 1.0m minimum
    leftSideSetbackMeters: 1.2,
    rightSideSetbackMeters: 1.2,
    hasRainwaterHarvesting: true,
    hasSolarWaterHeater: true,
    hasParkingProvision: true,
    isCornerPlot: false,
    roadWidthMeters: 9.0, // 30 ft road
    existingBuildingPresent: false,
  });

  // Scanned documents state
  const [scannedDocs, setScannedDocs] = useState<DocumentScanResult[]>([
    {
      id: 'doc_init_1',
      documentType: 'Sale Deed',
      fileName: 'Sale_Deed_Registered_Mysuru_South.pdf',
      fileSize: '2.1 MB',
      extractedHolderName: MYSURU_SAMPLE_PROPERTIES[0].currentPropertyHolderName.split('(')[0].trim(),
      extractedPid: MYSURU_SAMPLE_PROPERTIES[0].pid,
      extractedSiteNumber: MYSURU_SAMPLE_PROPERTIES[0].siteNumber,
      extractedAreaSqFt: MYSURU_SAMPLE_PROPERTIES[0].siteAreaSqFt,
      extractedIssueDate: '2024-05-12',
      registrationDetails: 'Sub-Registrar Mysuru South',
      ocrConfidence: 98,
      verificationStatus: 'Consistent with Property',
      mismatchesDetected: [],
      missingElements: [],
      rawTextPreview: `GOVERNMENT OF KARNATAKA - DEPARTMENT OF STAMPS & REGISTRATION\nBOOK-1 REGISTERED DEED NO: MY-SR-2024-4190\nSCHEDULE: Site ${MYSURU_SAMPLE_PROPERTIES[0].siteNumber}, ${MYSURU_SAMPLE_PROPERTIES[0].layoutName}\nPURCHASER: ${MYSURU_SAMPLE_PROPERTIES[0].currentPropertyHolderName.split('(')[0].trim()}\nPID: ${MYSURU_SAMPLE_PROPERTIES[0].pid}\nSTAMP DUTY PAID: ₹1,80,000`,
      sourceCategory: 'EXTRACTED_BY_AI',
    },
    {
      id: 'doc_init_2',
      documentType: 'Khata Certificate (Form 3)',
      fileName: 'MCC_Form3_E_Khata_Certificate.pdf',
      fileSize: '1.4 MB',
      extractedHolderName: MYSURU_SAMPLE_PROPERTIES[0].currentPropertyHolderName.split('(')[0].trim(),
      extractedPid: MYSURU_SAMPLE_PROPERTIES[0].pid,
      extractedSiteNumber: MYSURU_SAMPLE_PROPERTIES[0].siteNumber,
      extractedAreaSqFt: MYSURU_SAMPLE_PROPERTIES[0].siteAreaSqFt,
      extractedIssueDate: '2025-02-18',
      ocrConfidence: 95,
      verificationStatus: 'Consistent with Property',
      mismatchesDetected: [],
      missingElements: [],
      rawTextPreview: `MYSURU CITY CORPORATION - FORM 3\nCERTIFIED E-KHATA EXTRACT\nPID: ${MYSURU_SAMPLE_PROPERTIES[0].pid}\nREGISTER ENTRY: A-Khata\nASSESSEE: ${MYSURU_SAMPLE_PROPERTIES[0].currentPropertyHolderName.split('(')[0].trim()}\nWARD: ${MYSURU_SAMPLE_PROPERTIES[0].wardNumber}`,
      sourceCategory: 'EXTRACTED_BY_AI',
    },
  ]);

  // Handle selecting property: adjust proposed and clear/update doc links
  const handleSelectProperty = (prop: MysuruProperty) => {
    setSelectedProperty(prop);
    setProposed((prev) => ({
      ...prev,
      propertyId: prop.id,
      // Default realistic coverage based on site area
      proposedBuiltUpAreaSqFt: Math.round(prop.siteAreaSqFt * 1.5),
    }));
  };

  // Add document
  const handleAddDoc = (doc: DocumentScanResult) => {
    setScannedDocs((prev) => [...prev, doc]);
  };

  // Remove document
  const handleRemoveDoc = (id: string) => {
    setScannedDocs((prev) => prev.filter((d) => d.id !== id));
  };

  // Update document
  const handleUpdateDoc = (id: string, updated: Partial<DocumentScanResult>) => {
    setScannedDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updated } : d))
    );
  };

  // Save manual property
  const handleSaveManualProperty = (newProp: MysuruProperty) => {
    setProperties((prev) => [newProp, ...prev]);
    setSelectedProperty(newProp);
    setActiveTab('eligibility');
  };

  // State for Jev AI Chat Assistant (Building License & Multi-Permit Mode)
  const [selectedPermit, setSelectedPermit] = useState(PERMITS_CATALOG[0]);
  const [applicantData, setApplicantData] = useState<Record<string, any>>({
    zoning: 'R-1',
    isADU: false,
    rearSetbackFeet: 6.5,
    sideSetbackFeet: 4.5,
    buildingHeightFeet: 22,
    lotCoveragePercent: 42,
    inHistoricDistrict: false,
    hasLicensedContractor: true,
    uploadedDocumentIds: ['doc_res_site_plan', 'doc_res_structural_calcs'],
  });

  // Synchronized Applicant Data including live Mysuru property particulars, FAR, setbacks, and parking
  const combinedApplicantData = useMemo(() => {
    return {
      ...applicantData,
      siteAreaSqFt: selectedProperty.siteAreaSqFt,
      siteAreaSqM: selectedProperty.siteAreaSqM,
      frontSetbackMeters: proposed.frontSetbackMeters,
      rearSetbackMeters: proposed.rearSetbackMeters,
      proposedGroundCoveragePercent: proposed.proposedGroundCoveragePercent,
      proposedBuiltUpAreaSqFt: proposed.proposedBuiltUpAreaSqFt,
      buildingCategory: 'residential_individual',
      hasRainwaterHarvesting: proposed.hasRainwaterHarvesting,
      hasSolarWaterHeater: proposed.hasSolarWaterHeater,
      hasParkingProvision: proposed.hasParkingProvision,
      providedCarParkingBays: proposed.hasParkingProvision ? 1 : 0,
      roadWidthMeters: proposed.roadWidthMeters,
      authority: selectedProperty.authority,
      khataType: selectedProperty.khataType,
      pid: selectedProperty.pid,
    };
  }, [applicantData, selectedProperty, proposed]);

  const evaluation = useMemo(() => {
    return evaluateApplicantEligibility(selectedPermit, combinedApplicantData);
  }, [selectedPermit, combinedApplicantData]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans antialiased text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Header Navigation */}
      <MysuruNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        lang={lang}
        setLang={setLang}
      />

      {/* 2. Main Tab Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col">
        {/* Tab 1: Citizen Dashboard */}
        {activeTab === 'dashboard' && (
          <CitizenDashboard
            properties={properties}
            selectedProperty={selectedProperty}
            onSelectProperty={handleSelectProperty}
            proposed={proposed}
            scannedDocs={scannedDocs}
            onNavigateTab={setActiveTab}
            onOpenManualEntry={() => setIsManualModalOpen(true)}
            lang={lang}
          />
        )}

        {/* Tab 2: Property Search */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <PropertySearch
              properties={properties}
              selectedProperty={selectedProperty}
              onSelectProperty={(prop) => {
                handleSelectProperty(prop);
                setActiveTab('eligibility');
              }}
              onOpenManualEntry={() => setIsManualModalOpen(true)}
              lang={lang}
            />

            {/* Selected Property Quick Details Card */}
            <PropertyDetails
              property={selectedProperty}
              proposed={proposed}
              onUpdateProposed={setProposed}
              onNavigateToEligibility={() => setActiveTab('eligibility')}
              onNavigateToDocuments={() => setActiveTab('documents')}
              lang={lang}
            />
          </div>
        )}

        {/* Tab 3: Interactive Mysuru Map */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Mysuru Municipal GIS Interactive Property Map
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Pan and zoom across Mysuru wards (Kuvempunagar, Vijayanagar, Dattagalli, Gokulam, Saraswathipuram). Click pins to select properties.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-500">Selected Site:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200">
                    {selectedProperty.siteNumber}
                  </span>
                </div>
              </div>

              {/* Map Mount */}
              <div className="mt-4">
                <MysuruMap
                  properties={properties}
                  selectedProperty={selectedProperty}
                  onSelectProperty={handleSelectProperty}
                  onMapClickCoordinates={(lat, lng) => {
                    // Update property coordinates
                    setSelectedProperty((prev) => ({
                      ...prev,
                      coordinates: { lat, lng },
                    }));
                  }}
                  lang={lang}
                />
              </div>

              {/* Map Navigation Footer Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-500">
                  Ready to check building rules for{' '}
                  <strong className="text-slate-800">{selectedProperty.siteNumber}</strong>?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('eligibility')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    Proceed to Eligibility Checker →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Eligibility Checker & What-if Simulator */}
        {activeTab === 'eligibility' && (
          <div className="space-y-6">
            <EligibilityChecker
              property={selectedProperty}
              proposed={proposed}
              onUpdateProposed={setProposed}
              uploadedDocTypes={scannedDocs.map((d) => d.documentType)}
              authorities={KARNATAKA_AUTHORITIES}
              onNavigateToReport={() => setActiveTab('report')}
              lang={lang}
            />

            {/* Quick Property Switcher Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Switch Target Property:</span>
                <select
                  value={selectedProperty.id}
                  onChange={(e) => {
                    const found = properties.find((p) => p.id === e.target.value);
                    if (found) handleSelectProperty(found);
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-800 text-xs cursor-pointer"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.siteNumber} - {p.layoutName} ({p.authority} • {p.khataType})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsManualModalOpen(true)}
                className="text-blue-600 font-semibold hover:underline"
              >
                + Enter Custom Site
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Document Verification & OCR Scanner */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <DocumentScanner
              property={selectedProperty}
              scannedDocs={scannedDocs}
              onAddDoc={handleAddDoc}
              onRemoveDoc={handleRemoveDoc}
              onUpdateDoc={handleUpdateDoc}
              lang={lang}
            />
          </div>
        )}

        {/* Tab 6: Official PDF Report View */}
        {activeTab === 'report' && (
          <ReportView
            property={selectedProperty}
            proposed={proposed}
            scannedDocs={scannedDocs}
            onBackToChecker={() => setActiveTab('eligibility')}
            lang={lang}
          />
        )}

        {/* Tab 7: Karnataka Authorities & Government Services */}
        {activeTab === 'authorities' && (
          <GovernmentServices authorities={KARNATAKA_AUTHORITIES} lang={lang} />
        )}

        {/* Tab 8: Jev AI Conversational Officer & Mysuru Building Licence Assistant */}
        {activeTab === 'ai_chat' && (
          <div className="space-y-6">
            <MysuruChatAssistant
              property={selectedProperty}
              proposed={proposed}
              onUpdateProposed={setProposed}
              onSelectProperty={handleSelectProperty}
              uploadedDocTypes={scannedDocs.map((d) => d.documentType)}
              lang={lang}
              onNavigateTab={setActiveTab}
            />
          </div>
        )}
      </main>

      {/* Manual Property Entry Modal */}
      <ManualPropertyModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSaveProperty={handleSaveManualProperty}
        lang={lang}
      />
    </div>
  );
}
