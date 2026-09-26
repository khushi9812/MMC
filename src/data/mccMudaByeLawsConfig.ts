/**
 * Mysuru City Corporation (MCC) & Mysuru Urban Development Authority (MUDA)
 * Statutory Building By-Law Rules Configuration
 *
 * Grounded in:
 * 1. Karnataka Municipal Corporations (KMC) Act 1976 § 112, § 299, § 300
 * 2. Karnataka Town & Country Planning (KTCP) Act 1961 § 14, § 17
 * 3. Mysuru City Corporation Building Bye-Laws Schedule II (Tables 4, 5 & 6)
 * 4. MUDA Revised Master Plan (Comprehensive Development Plan - CDP 2031)
 * 5. National Building Code of India (NBC 2016) Part 3 & Part 4 (Fire & Life Safety)
 */

export type MysuruBuildingCategory =
  | 'residential_individual'
  | 'residential_duplex_villa'
  | 'residential_multi_dwelling_g2'
  | 'commercial_mixed'
  | 'commercial_complex';

export interface PlotDimensionRule {
  minPlotAreaSqM: number;
  maxPlotAreaSqM: number;
  minPlotAreaSqFt: number;
  maxPlotAreaSqFt: number;
  minFrontSetbackMeters: number;
  minRearSetbackMeters: number;
  minSideLeftSetbackMeters: number;
  minSideRightSetbackMeters: number;
  maxGroundCoveragePercent: number;
  maxFAR: number; // Floor Area Ratio
  statutoryReference: string;
}

export interface ParkingNormRule {
  buildingCategory: MysuruBuildingCategory;
  ecsRatio: string; // Equivalent Car Space norm
  fourWheelerPerSqM: number; // 1 space per X sq.m of floor area
  twoWheelerRatioPercentOfFourWheeler: number;
  visitorParkingPercent: number;
  minimumDrivewayWidthMeters: number;
  statutoryReference: string;
}

export interface HeightRoadWidthRule {
  minRoadWidthMeters: number;
  maxPermissibleHeightMeters: number;
  maxStoreysPermissible: number;
  allowedBuildingCategories: MysuruBuildingCategory[];
  statutoryReference: string;
}

export interface EnvironmentalInfrastructureRule {
  id: string;
  name: string;
  thresholdCondition: string;
  isMandatory: boolean;
  specification: string;
  statutoryReference: string;
  mitigationRemedy: string;
}

export interface MCCMUDAByeLawConfiguration {
  version: string;
  effectiveDate: string;
  jurisdictions: ('MCC' | 'MUDA')[];
  setbackAndCoverageRules: PlotDimensionRule[];
  farMatrix: Record<MysuruBuildingCategory, { baseFAR: number; premiumFARAllowed: boolean; maxPremiumFAR: number }>;
  parkingNorms: Record<MysuruBuildingCategory, ParkingNormRule>;
  heightByRoadWidth: HeightRoadWidthRule[];
  environmentalRules: EnvironmentalInfrastructureRule[];
  mandatoryDocumentChecklist: {
    id: string;
    code: string;
    title: string;
    issuingAuthority: string;
    isMandatory: boolean;
    statutorySection: string;
    description: string;
  }[];
}

export const MCC_MUDA_BYE_LAWS_CONFIG: MCCMUDAByeLawConfiguration = {
  version: '2024-2026-REV3',
  effectiveDate: '2024-04-01',
  jurisdictions: ['MCC', 'MUDA'],

  /**
   * Setback and Ground Coverage Matrix
   * Mysuru City Corporation Building Bye-Laws Schedule II, Table 4 & Table 5
   * Measured for residential developments by site area brackets
   */
  setbackAndCoverageRules: [
    {
      // 1. Up to 1200 sq.ft (e.g. 20x30, 30x40 plots)
      minPlotAreaSqM: 0,
      maxPlotAreaSqM: 111.48,
      minPlotAreaSqFt: 0,
      maxPlotAreaSqFt: 1200,
      minFrontSetbackMeters: 1.5,
      minRearSetbackMeters: 1.0,
      minSideLeftSetbackMeters: 1.0,
      minSideRightSetbackMeters: 1.0,
      maxGroundCoveragePercent: 65,
      maxFAR: 1.75,
      statutoryReference: 'MCC Building Bye-Laws Schedule II, Table 4 (Item 1) & Table 5',
    },
    {
      // 2. 1201 to 2400 sq.ft (e.g. 40x60 plots)
      minPlotAreaSqM: 111.49,
      maxPlotAreaSqM: 222.96,
      minPlotAreaSqFt: 1201,
      maxPlotAreaSqFt: 2400,
      minFrontSetbackMeters: 2.0,
      minRearSetbackMeters: 1.5,
      minSideLeftSetbackMeters: 1.2,
      minSideRightSetbackMeters: 1.2,
      maxGroundCoveragePercent: 65,
      maxFAR: 1.75,
      statutoryReference: 'MCC Building Bye-Laws Schedule II, Table 4 (Item 2) & Table 5',
    },
    {
      // 3. 2401 to 4000 sq.ft (e.g. 50x80 plots)
      minPlotAreaSqM: 222.97,
      maxPlotAreaSqM: 371.61,
      minPlotAreaSqFt: 2401,
      maxPlotAreaSqFt: 4000,
      minFrontSetbackMeters: 3.0,
      minRearSetbackMeters: 2.0,
      minSideLeftSetbackMeters: 1.5,
      minSideRightSetbackMeters: 1.5,
      maxGroundCoveragePercent: 60,
      maxFAR: 1.5,
      statutoryReference: 'MCC Building Bye-Laws Schedule II, Table 4 (Item 3) & Table 5',
    },
    {
      // 4. Over 4000 sq.ft (Large Residential & Estate Sites)
      minPlotAreaSqM: 371.62,
      maxPlotAreaSqM: 10000.0,
      minPlotAreaSqFt: 4001,
      maxPlotAreaSqFt: 107639,
      minFrontSetbackMeters: 4.0,
      minRearSetbackMeters: 3.0,
      minSideLeftSetbackMeters: 2.0,
      minSideRightSetbackMeters: 2.0,
      maxGroundCoveragePercent: 55,
      maxFAR: 1.5,
      statutoryReference: 'MCC Building Bye-Laws Schedule II, Table 4 (Item 4) & MUDA CDP 2031',
    },
  ],

  /**
   * Floor Area Ratio (FAR) Matrix by Building Classification
   * Governed by MUDA Master Plan 2031 & MCC Zoning Regulations
   */
  farMatrix: {
    residential_individual: {
      baseFAR: 1.75,
      premiumFARAllowed: false,
      maxPremiumFAR: 1.75,
    },
    residential_duplex_villa: {
      baseFAR: 1.75,
      premiumFARAllowed: false,
      maxPremiumFAR: 1.75,
    },
    residential_multi_dwelling_g2: {
      baseFAR: 2.0,
      premiumFARAllowed: true,
      maxPremiumFAR: 2.5,
    },
    commercial_mixed: {
      baseFAR: 2.0,
      premiumFARAllowed: true,
      maxPremiumFAR: 2.5,
    },
    commercial_complex: {
      baseFAR: 2.25,
      premiumFARAllowed: true,
      maxPremiumFAR: 3.0,
    },
  },

  /**
   * Parking Norms & Equivalent Car Space (ECS) Standards
   * Governed by MCC Bye-Laws Regulation 14 & Schedule VI
   */
  parkingNorms: {
    residential_individual: {
      buildingCategory: 'residential_individual',
      ecsRatio: '1 Car Parking Space per dwelling unit',
      fourWheelerPerSqM: 150, // 1 space per 150 sq.m built-up
      twoWheelerRatioPercentOfFourWheeler: 200, // 2 two-wheelers per car space
      visitorParkingPercent: 0,
      minimumDrivewayWidthMeters: 3.0,
      statutoryReference: 'MCC Building Bye-Laws Regulation 14.1 (Residential Plot Norms)',
    },
    residential_duplex_villa: {
      buildingCategory: 'residential_duplex_villa',
      ecsRatio: '2 Car Parking Spaces per villa',
      fourWheelerPerSqM: 120,
      twoWheelerRatioPercentOfFourWheeler: 200,
      visitorParkingPercent: 10,
      minimumDrivewayWidthMeters: 3.5,
      statutoryReference: 'MCC Building Bye-Laws Regulation 14.2 & NBC 2016 Part 3',
    },
    residential_multi_dwelling_g2: {
      buildingCategory: 'residential_multi_dwelling_g2',
      ecsRatio: '1 Car Space per 75 sq.m of floor area + 1 Two-Wheeler per 25 sq.m',
      fourWheelerPerSqM: 75,
      twoWheelerRatioPercentOfFourWheeler: 300,
      visitorParkingPercent: 15,
      minimumDrivewayWidthMeters: 4.5,
      statutoryReference: 'MCC Building Bye-Laws Schedule VI & KMC Building Rules',
    },
    commercial_mixed: {
      buildingCategory: 'commercial_mixed',
      ecsRatio: '1 Car Space per 50 sq.m commercial plinth + 1 Car per residential unit',
      fourWheelerPerSqM: 50,
      twoWheelerRatioPercentOfFourWheeler: 400,
      visitorParkingPercent: 20,
      minimumDrivewayWidthMeters: 6.0,
      statutoryReference: 'MCC Commercial Parking Norms Schedule VI Table 2',
    },
    commercial_complex: {
      buildingCategory: 'commercial_complex',
      ecsRatio: '1 Car Space per 40 sq.m gross leasable area',
      fourWheelerPerSqM: 40,
      twoWheelerRatioPercentOfFourWheeler: 400,
      visitorParkingPercent: 25,
      minimumDrivewayWidthMeters: 7.0,
      statutoryReference: 'MUDA Commercial Sanction Guidelines & NBC Part 3 Table 12',
    },
  },

  /**
   * Maximum Permissible Height by Approach Road Width
   * MCC Bye-Laws Regulation 6.2 (1.5 x Road Width Envelope)
   */
  heightByRoadWidth: [
    {
      minRoadWidthMeters: 6.0,
      maxPermissibleHeightMeters: 8.5,
      maxStoreysPermissible: 2, // G+1
      allowedBuildingCategories: ['residential_individual'],
      statutoryReference: 'MCC Regulation 6.2 (Lane Access Limitations)',
    },
    {
      minRoadWidthMeters: 9.0, // Standard 30-foot road in residential layouts
      maxPermissibleHeightMeters: 10.5,
      maxStoreysPermissible: 3, // G+2
      allowedBuildingCategories: ['residential_individual', 'residential_duplex_villa', 'residential_multi_dwelling_g2'],
      statutoryReference: 'MCC Building Bye-Laws Regulation 6.2 & Schedule II',
    },
    {
      minRoadWidthMeters: 12.0, // 40-foot layout road
      maxPermissibleHeightMeters: 12.0,
      maxStoreysPermissible: 4, // G+3
      allowedBuildingCategories: ['residential_individual', 'residential_duplex_villa', 'residential_multi_dwelling_g2', 'commercial_mixed'],
      statutoryReference: 'MCC Building Bye-Laws Regulation 6.2',
    },
    {
      minRoadWidthMeters: 18.0, // 60-foot or Major Arterial (Outer Ring Road)
      maxPermissibleHeightMeters: 18.0,
      maxStoreysPermissible: 5,
      allowedBuildingCategories: ['residential_multi_dwelling_g2', 'commercial_mixed', 'commercial_complex'],
      statutoryReference: 'MUDA Master Plan 2031 & NBC 2016 Fire Safety Clause 4.2',
    },
  ],

  /**
   * Environmental Mandates (Rainwater Harvesting & Solar Water Heating)
   */
  environmentalRules: [
    {
      id: 'env_rwh_mandate',
      name: 'Mandatory Rainwater Harvesting (RWH)',
      thresholdCondition: 'Plot Area >= 1200 sq.ft (111.48 sq.m)',
      isMandatory: true,
      specification: 'Minimum 2000 Litres storage sump or ground percolation pit with sand-gravel filter bed',
      statutoryReference: 'Karnataka Municipal Corporations (Amendment) Act 2009 & MCC Water Supply By-Laws',
      mitigationRemedy: 'Incorporate an underground RWH sump or percolation recharge pit into the structural foundation plan.',
    },
    {
      id: 'env_solar_mandate',
      name: 'Solar Assisted Water Heating System',
      thresholdCondition: 'Plot Area >= 2000 sq.ft (185.8 sq.m) or Built-up >= 2400 sq.ft',
      isMandatory: true,
      specification: 'Minimum 100 Litres Per Day (LPD) rooftop solar water heating plumbing provision',
      statutoryReference: 'MCC Building Bye-Laws Clause 23 & KREDL Karnataka Solar Policy',
      mitigationRemedy: 'Indicate rooftop structural load allowance and dedicated plumbing lines for solar water heater on CAD drawing.',
    },
  ],

  /**
   * Mandatory Statutory Document Submissions Checklist
   * Verified against MCC Town Planning Scrutiny & OBPAS Protocol
   */
  mandatoryDocumentChecklist: [
    {
      id: 'doc_sale_deed',
      code: 'MCC-DOC-01',
      title: 'Registered Sale Deed / Title Deed',
      issuingAuthority: 'Department of Stamps & Registration, Govt of Karnataka',
      isMandatory: true,
      statutorySection: 'Registration Act 1908 § 17 & Transfer of Property Act',
      description: 'Conveyance deed executed at Sub-Registrar Office establishing unbroken chain of ownership and site boundaries.',
    },
    {
      id: 'doc_khata_certificate',
      code: 'MCC-DOC-02',
      title: 'Certified E-Khata Certificate (Form 3)',
      issuingAuthority: 'Mysuru City Corporation (Zonal Office Revenue Inspector)',
      isMandatory: true,
      statutorySection: 'Karnataka Municipal Corporations Act 1976 § 112',
      description: 'Assessment extract showing PID and confirming A-Khata status. B-Khata sites require betterment clearance.',
    },
    {
      id: 'doc_tax_receipt',
      code: 'MCC-DOC-03',
      title: 'Current Financial Year Property Tax Receipt',
      issuingAuthority: 'MCC Self Assessment Scheme (SAS) Portal',
      isMandatory: true,
      statutorySection: 'KMC Act 1976 § 108',
      description: 'Proof of up-to-date municipal tax payments for the current fiscal assessment year.',
    },
    {
      id: 'doc_encumbrance_cert',
      code: 'MCC-DOC-04',
      title: 'Encumbrance Certificate (Form 15)',
      issuingAuthority: 'Kaveri Portal, Department of Registration',
      isMandatory: true,
      statutorySection: 'Karnataka Registration Rules Rule 148',
      description: 'Minimum 15-year search certificate demonstrating nil mortgages, court attachments, or pending litigation.',
    },
    {
      id: 'doc_cad_plan',
      code: 'MCC-DOC-05',
      title: 'Architectural Plan Drawing (AutoCAD / Pre-DCR PDF)',
      issuingAuthority: 'Council of Architecture (COA) Registered Architect',
      isMandatory: true,
      statutorySection: 'Karnataka Municipal Building Plan Approval Protocol (OBPAS)',
      description: 'Architectural drawings showing boundary setbacks, ground coverage, parking bays, section elevations, and RWH details.',
    },
  ],
};
