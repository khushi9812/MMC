export type UserRole = 'citizen' | 'officer' | 'guest';

export type LanguageCode = 'en' | 'kn';

export interface MysuruProperty {
  id: string; // e.g. "MY-PROP-001"
  pid: string; // e.g. "MCC-W12-PID-48291"
  siteNumber: string; // e.g. "45-A"
  layoutName: string; // e.g. "Vijayanagar 2nd Stage"
  wardNumber: string; // e.g. "Ward 12 (Kuvempunagar)"
  zone: string; // e.g. "Residential Main"
  address: string;
  siteDimensions: string; // e.g. "30 ft x 40 ft"
  siteAreaSqFt: number; // e.g. 1200
  siteAreaSqM: number; // e.g. 111.48
  coordinates: {
    lat: number;
    lng: number;
  };
  authority: 'MCC' | 'MUDA' | 'KHADB' | 'Gram Panchayat';
  khataType: 'A-Khata' | 'B-Khata' | 'E-Khata' | 'Under Verification';
  currentPropertyHolderName: string;
  sourceType: 'SYNTHETIC_SAMPLE' | 'USER_SUBMITTED' | 'OFFICIAL_MOCK';
  isSynthetic: boolean;
  lastUpdatedDate: string;
  existingBuildingStatus: 'Vacant Site' | 'Single Storey Old Structure' | 'Semi-Constructed' | 'Demolished Plinth';
  existingBuiltUpAreaSqFt?: number;
  approvedLayoutStatus: boolean;
  encumbranceStatus: 'Nil Encumbrance (Clean)' | 'Verification Pending' | 'Active Mortgage';
}

export interface DocumentScanResult {
  id: string;
  documentType:
    | 'Sale Deed'
    | 'Khata Certificate (Form 3)'
    | 'Property Tax Receipt (Current FY)'
    | 'Encumbrance Certificate (Form 15)'
    | 'RTC / Pahani (Form 16)'
    | 'MUDA Approved Layout Plan'
    | 'Architectural Building Plan'
    | 'Structural Stability Certificate';
  fileName: string;
  fileSize: string;
  extractedHolderName?: string;
  extractedPid?: string;
  extractedSiteNumber?: string;
  extractedAreaSqFt?: number;
  extractedIssueDate?: string;
  registrationDetails?: string;
  ocrConfidence: number; // 0-100
  verificationStatus: 'Extracted (Pending Verification)' | 'Consistent with Property' | 'Mismatch Detected' | 'Unreadable Elements';
  mismatchesDetected: string[];
  missingElements: string[];
  rawTextPreview: string;
  sourceCategory: 'USER_SUPPLIED' | 'EXTRACTED_BY_AI' | 'AUTHORIZED_RECORD';
  fileDataUrl?: string;
}

export interface ProposedConstruction {
  propertyId: string;
  constructionType: 'Residential Individual House' | 'Residential Duplex/Villa' | 'Ground + 2 Floor Residential' | 'Commercial Ground Floor + Residential' | 'Commercial Complex';
  proposedFloors: number;
  proposedBuiltUpAreaSqFt: number;
  proposedGroundCoveragePercent: number;
  proposedHeightMeters: number;
  frontSetbackMeters: number;
  rearSetbackMeters: number;
  leftSideSetbackMeters: number;
  rightSideSetbackMeters: number;
  hasRainwaterHarvesting: boolean;
  hasSolarWaterHeater: boolean;
  hasParkingProvision: boolean;
  isCornerPlot: boolean;
  roadWidthMeters: number;
  existingBuildingPresent: boolean;
}

export interface MysuruAuthorityInfo {
  id: string;
  name: string;
  acronym: string;
  jurisdiction: string;
  servicesHandled: string[];
  officialPortalUrl: string;
  officeAddress: string;
  helplinePhone: string;
  email: string;
  relevantGuidelines: string;
  lastVerifiedDate: string;
  badgeColor: string;
}
