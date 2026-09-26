import React, { useState } from 'react';
import { MysuruProperty, DocumentScanResult } from '../types/mysuru';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Trash2,
  Sparkles,
  FileCheck,
  ShieldAlert,
  Edit2,
  RotateCcw,
} from 'lucide-react';

interface DocumentScannerProps {
  property: MysuruProperty;
  scannedDocs: DocumentScanResult[];
  onAddDoc: (doc: DocumentScanResult) => void;
  onRemoveDoc: (id: string) => void;
  onUpdateDoc: (id: string, updated: Partial<DocumentScanResult>) => void;
  lang?: 'en' | 'kn';
}

const SAMPLE_DOC_TEMPLATES: Array<{
  type: DocumentScanResult['documentType'];
  sampleFileName: string;
  simulatedText: (prop: MysuruProperty) => string;
}> = [
  {
    type: 'Sale Deed',
    sampleFileName: 'Sale_Deed_Sub_Registrar_Mysuru_South.pdf',
    simulatedText: (prop) =>
      `GOVERNMENT OF KARNATAKA - DEPARTMENT OF STAMPS & REGISTRATION\nBOOK-1 REGISTERED DEED NO: MY-SR-2019-8921\nEXECUTED AT: Sub-Registrar Office, Mysuru South\nVENDOR: M/s Urban Land Developers Mysuru\nPURCHASER / OWNER: ${prop.currentPropertyHolderName.split('(')[0].trim()}\nSCHEDULE OF PROPERTY:\nSite No: ${prop.siteNumber}, Layout: ${prop.layoutName}, Ward: ${prop.wardNumber}\nDimensions: ${prop.siteDimensions}, Extent: ${prop.siteAreaSqFt} sq ft\nBounded North by: Site 103, South by: Site 105, East by: 30ft Road, West by: Site 112\nSTAMP DUTY PAID: ₹1,42,000`,
  },
  {
    type: 'Khata Certificate (Form 3)',
    sampleFileName: 'MCC_E_Khata_Certificate_Form3.pdf',
    simulatedText: (prop) =>
      `MYSURU CITY CORPORATION (ಮೈಸೂರು ಮಹಾನಗರ ಪಾಲಿಕೆ)\nE-KHATA CERTIFICATE - FORM 3 (Rule 112 KMC Act)\nPROPERTY IDENTIFICATION NUMBER (PID): ${prop.pid}\nKHATA REGISTER TYPE: ${prop.khataType}\nASSESSED OWNER: ${prop.currentPropertyHolderName.split('(')[0].trim()}\nLOCALITY: ${prop.layoutName}, WARD: ${prop.wardNumber}\nTOTAL MEASUREMENT: ${prop.siteAreaSqFt} Sq.Ft (${prop.siteAreaSqM} Sq.Mtr)\nISSUING AUTHORITY: Assistant Revenue Officer, Zone-3, MCC`,
  },
  {
    type: 'Property Tax Receipt (Current FY)',
    sampleFileName: 'MCC_SAS_Tax_Receipt_2025_26.pdf',
    simulatedText: (prop) =>
      `MYSURU CITY CORPORATION - SELF ASSESSMENT SCHEME (SAS)\nTAX RECEIPT NO: MCC-SAS-2025-994182\nASSESSMENT YEAR: 2025-2026\nPID: ${prop.pid} | KHATA: ${prop.khataType}\nPROPERTY HOLDER: ${prop.currentPropertyHolderName.split('(')[0].trim()}\nPROPERTY ADDRESS: ${prop.address}\nTAX AMOUNT PAID: ₹4,820 (Paid Online - Transaction Ref: SBIN892147)`,
  },
  {
    type: 'Encumbrance Certificate (Form 15)',
    sampleFileName: 'Kaveri_EC_Form15_15Years.pdf',
    simulatedText: (prop) =>
      `GOVERNMENT OF KARNATAKA - KAVERI PORTAL ONLINE SERVICES\nFORM NO. 15 (RULE 148)\nCERTIFICATE OF ENCUMBRANCE ON PROPERTY (SEARCH PERIOD: 01-APR-2010 TO 20-MAR-2026)\nPROPERTY: Site ${prop.siteNumber}, ${prop.layoutName}, Mysuru\nSEARCH RESULT: NIL TRANSACTIONS REPORTED IN LAST 5 YEARS. TITLE IS FREE FROM COURT ATTACHMENTS OR PENDING LIENS.`,
  },
  {
    type: 'Architectural Building Plan',
    sampleFileName: 'Cad_Building_Drawing_Proposed_G2.dwg.pdf',
    simulatedText: (prop) =>
      `PROPOSED RESIDENTIAL BUILDING PLAN FOR SITE NO: ${prop.siteNumber}\nARCHITECT / STRUCTURAL ENGINEER: M. Tech Structures (CA/2014/61902)\nPLOT AREA: ${prop.siteAreaSqFt} SQ FT\nGROUND COVERAGE: 58% | NUMBER OF FLOORS: G+2 STOREYS\nSETBACKS: FRONT 2.0M, REAR 1.5M, SIDES 1.2M\nRAINWATER HARVESTING SUMP: 4,000 LITRES CAPACITY PROPOSED`,
  },
];

export const DocumentScanner: React.FC<DocumentScannerProps> = ({
  property,
  scannedDocs,
  onAddDoc,
  onRemoveDoc,
  onUpdateDoc,
  lang = 'en',
}) => {
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<DocumentScanResult | null>(
    scannedDocs[0] || null
  );
  const [isSimulatingOcr, setIsSimulatingOcr] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);

  // OCR simulation for instant citizen testing
  const handleSimulateUpload = (templateIndex: number) => {
    setIsSimulatingOcr(true);
    const tmpl = SAMPLE_DOC_TEMPLATES[templateIndex];

    setTimeout(() => {
      const simulatedRaw = tmpl.simulatedText(property);

      // Detect inconsistencies / mismatches
      const mismatches: string[] = [];
      if (tmpl.type === 'Khata Certificate (Form 3)' && property.khataType === 'B-Khata') {
        mismatches.push('Khata Certificate indicates B-Khata which is restricted under KMC Act Section 112');
      }

      const newDoc: DocumentScanResult = {
        id: 'doc_' + Date.now(),
        documentType: tmpl.type,
        fileName: tmpl.sampleFileName,
        fileSize: '1.8 MB',
        extractedHolderName: property.currentPropertyHolderName.split('(')[0].trim(),
        extractedPid: property.pid,
        extractedSiteNumber: property.siteNumber,
        extractedAreaSqFt: property.siteAreaSqFt,
        extractedIssueDate: '2025-11-14',
        registrationDetails: 'Sub-Registrar Mysuru',
        ocrConfidence: 96,
        verificationStatus: mismatches.length > 0 ? 'Mismatch Detected' : 'Consistent with Property',
        mismatchesDetected: mismatches,
        missingElements: [],
        rawTextPreview: simulatedRaw,
        sourceCategory: 'EXTRACTED_BY_AI',
      };

      onAddDoc(newDoc);
      setSelectedDocForPreview(newDoc);
      setIsSimulatingOcr(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              Ownership & Cadastral Document Scanner (AI-OCR Scrutiny)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Upload PDF or images of registered sale deed, Khata, tax receipts, and blueprints to extract text and cross-check inconsistencies.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Evidence Extractor</span>
          </div>
        </div>

        {/* Quick Upload / Demo Simulator Bar */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
            1-Click Simulate Standard Mysuru Property Document Uploads:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_DOC_TEMPLATES.map((tmpl, idx) => {
              const alreadyUploaded = scannedDocs.some((d) => d.documentType === tmpl.type);
              return (
                <button
                  key={idx}
                  disabled={alreadyUploaded || isSimulatingOcr}
                  onClick={() => handleSimulateUpload(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    alreadyUploaded
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-not-allowed'
                      : 'bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 shadow-2xs'
                  }`}
                >
                  {alreadyUploaded ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                  )}
                  <span>+ {tmpl.type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Comparison & Documents List */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Uploaded Documents Table */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold uppercase tracking-wider text-slate-400">
                Uploaded Dossier ({scannedDocs.length} Documents)
              </span>
              <span>Click to view OCR extraction</span>
            </div>

            {scannedDocs.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
                No documents uploaded yet. Use the simulator buttons above or upload your deeds to begin verification.
              </div>
            ) : (
              scannedDocs.map((doc) => {
                const isSelected = selectedDocForPreview?.id === doc.id;
                const hasMismatch = doc.mismatchesDetected.length > 0;

                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocForPreview(doc)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200/80 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-slate-900">{doc.documentType}</h4>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {doc.fileName} ({doc.fileSize})
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveDoc(doc.id);
                          if (selectedDocForPreview?.id === doc.id) {
                            setSelectedDocForPreview(null);
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition-colors"
                        title="Delete document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Status badge */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          hasMismatch
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {doc.verificationStatus}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        OCR: {doc.ocrConfidence}% confidence
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: OCR Extraction & Document Comparison Panel */}
          <div className="lg:col-span-7">
            {selectedDocForPreview ? (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4 text-xs">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded uppercase">
                      Side-by-Side OCR Extraction
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1">
                      {selectedDocForPreview.documentType}
                    </h3>
                  </div>

                  <span className="text-[11px] text-slate-500">
                    Source: <strong>{selectedDocForPreview.sourceCategory}</strong>
                  </span>
                </div>

                {/* Detected Mismatches Notice */}
                {selectedDocForPreview.mismatchesDetected.length > 0 && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-rose-800">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Cross-Document Discrepancy Flagged
                    </div>
                    {selectedDocForPreview.mismatchesDetected.map((m, idx) => (
                      <p key={idx} className="text-[11px] text-rose-700">
                        • {m}
                      </p>
                    ))}
                  </div>
                )}

                {/* Structured Extracted Parameters Table */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Extracted Holder Name</span>
                    <span className="font-bold text-slate-800">
                      {selectedDocForPreview.extractedHolderName || 'N/A'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Extracted PID</span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedDocForPreview.extractedPid || 'N/A'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Extracted Site Number</span>
                    <span className="font-bold text-slate-800">
                      {selectedDocForPreview.extractedSiteNumber || 'N/A'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Extracted Site Area</span>
                    <span className="font-bold text-slate-800">
                      {selectedDocForPreview.extractedAreaSqFt
                        ? `${selectedDocForPreview.extractedAreaSqFt} sq ft`
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Raw OCR Text Terminal */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Raw OCR Scanned Output
                  </span>
                  <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[10px] rounded-lg overflow-x-auto whitespace-pre-wrap max-h-48 leading-relaxed">
                    {selectedDocForPreview.rawTextPreview}
                  </div>
                </div>

                {/* Statutory Disclaimer */}
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-[10px] text-amber-900 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Disclaimer:</strong> Optical Character Recognition (OCR) assists with pre-screening. It does not replace physical deed scrutiny by the MCC Assistant Director of Town Planning (ADTP).
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
                Select a document from the left to view extracted OCR data and inconsistency checks.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
