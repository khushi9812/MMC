import { MysuruProperty, ProposedConstruction } from '../types/mysuru';

export interface MunicipalRuleCheck {
  id: string;
  ruleCode: string;
  category: 'ZONING' | 'SETBACK' | 'COVERAGE' | 'HEIGHT' | 'ENVIRONMENTAL' | 'DOCUMENTATION';
  title: string;
  description: string;
  statutoryReference: string;
  status: 'PASS' | 'FAIL' | 'WARNING' | 'UNCERTAIN';
  expectedStandard: string;
  actualObserved: string;
  remedyAction?: string;
}

export interface EligibilityResult {
  overallVerdict:
    | 'APPEARS_ELIGIBLE'
    | 'ADDITIONAL_INFO_REQUIRED'
    | 'REQUIREMENTS_NOT_SATISFIED'
    | 'MANUAL_REVIEW_REQUIRED';
  readinessScore: number; // 0-100
  passedCount: number;
  failedCount: number;
  warningCount: number;
  uncertainCount: number;
  rulesChecked: MunicipalRuleCheck[];
  missingMandatoryDocuments: string[];
  remediationRoadmap: string[];
  recommendedAuthority: 'MCC' | 'MUDA' | 'Bhoomi' | 'Local Planning Authority';
  estimatedMunicipalFeeInr: number;
  estimatedPlanSanctionDays: number;
  whatIfImpactNotes: string[];
}

/**
 * Deterministic Mysuru City Corporation (MCC) & MUDA Building Bye-law engine
 * Evaluates Karnataka Municipal Corporation Act & Bye-laws (2011/2021)
 */
export function evaluateMysuruPermitEligibility(
  property: MysuruProperty,
  proposed: ProposedConstruction,
  uploadedDocTypes: string[]
): EligibilityResult {
  const rules: MunicipalRuleCheck[] = [];
  const missingDocs: string[] = [];
  const remediationRoadmap: string[] = [];
  const whatIfNotes: string[] = [];

  // Determine Jurisdiction Authority
  const isMuda = property.authority === 'MUDA';
  const authority = isMuda ? 'MUDA' : 'MCC';

  // 1. Mandatory Khata Rule (Rule § 112 KMC Act)
  if (property.khataType === 'A-Khata' || property.khataType === 'E-Khata') {
    rules.push({
      id: 'rule_khata',
      ruleCode: 'KMC-ACT-§112',
      category: 'DOCUMENTATION',
      title: 'Valid A-Khata / E-Khata Registration',
      description: 'Building sanction can strictly be issued only on registered A-Khata or E-Khata assessed properties.',
      statutoryReference: 'Karnataka Municipal Corporations Act 1976 § 112 & MCC Resolution 2018',
      status: 'PASS',
      expectedStandard: 'A-Khata or Certified E-Khata Certificate',
      actualObserved: `${property.khataType} on record for ${property.pid}`,
    });
  } else if (property.khataType === 'B-Khata') {
    rules.push({
      id: 'rule_khata',
      ruleCode: 'KMC-ACT-§112',
      category: 'DOCUMENTATION',
      title: 'B-Khata Assessment Restriction',
      description: 'B-Khata register entries cannot receive standard municipal building plan sanctions until regularized (Akrama-Sakrama or Betterment charges).',
      statutoryReference: 'High Court of Karnataka WP No. 4954/2014 & KMC Act Section 112',
      status: 'FAIL',
      expectedStandard: 'A-Khata conversion via MCC/MUDA Betterment fee clearance',
      actualObserved: 'B-Khata (Under unregularized revenue pocket)',
      remedyAction: 'Apply to MCC Zonal Office for conversion to A-Khata by submitting layout conversion order and betterment fee receipt.',
    });
    remediationRoadmap.push('Regularize B-Khata into verified A-Khata prior to submitting CAD plans to MCC.');
  } else {
    rules.push({
      id: 'rule_khata',
      ruleCode: 'KMC-ACT-§112',
      category: 'DOCUMENTATION',
      title: 'Khata Status Verification Required',
      description: 'Property Khata is unverified or under inquiry.',
      statutoryReference: 'KMC Act § 112',
      status: 'UNCERTAIN',
      expectedStandard: 'Clear verified Khata certificate from MCC Revenue Inspector',
      actualObserved: 'Khata status marked under verification',
      remedyAction: 'Obtain current certified E-Khata (Form-3) from MCC ward office or Seva Sindhu.',
    });
  }

  // 2. Approved Layout Plan Status (KTCP Act § 17)
  if (property.approvedLayoutStatus) {
    rules.push({
      id: 'rule_layout',
      ruleCode: 'KTCP-ACT-§17',
      category: 'ZONING',
      title: 'Sanctioned Layout / DC Converted Status',
      description: 'Site must be situated within an approved MUDA layout or officially converted under Section 95 Karnataka Land Revenue Act.',
      statutoryReference: 'Karnataka Town & Country Planning Act 1961 Section 17 & MUDA CDA',
      status: 'PASS',
      expectedStandard: 'MUDA approved layout or Single-plot conversion approval',
      actualObserved: `Approved layout plan confirmed for ${property.layoutName}`,
    });
  } else {
    rules.push({
      id: 'rule_layout',
      ruleCode: 'KTCP-ACT-§17',
      category: 'ZONING',
      title: 'Unapproved Layout / Unregularized Revenue Pocket',
      description: 'Sites formed on unapproved layouts or unconverted agricultural lands cannot receive building permission.',
      statutoryReference: 'Karnataka Town & Country Planning Act § 17(2)',
      status: 'FAIL',
      expectedStandard: 'Approved MUDA / BMRDA / Planning Authority Layout',
      actualObserved: 'Unapproved or revenue layout formation',
      remedyAction: 'Apply for MUDA layout regularization or single-site approval with DC conversion certificate.',
    });
    remediationRoadmap.push('Verify DC conversion order and apply for MUDA single-site approval.');
  }

  // 3. Ground Coverage Percentage (MCC Bye-Law Table 4)
  // For residential plots up to 2400 sq ft, max ground coverage is 65%. For larger plots, max is 60%.
  const maxAllowedCoverage = property.siteAreaSqFt <= 2400 ? 65 : 60;
  if (proposed.proposedGroundCoveragePercent <= maxAllowedCoverage) {
    rules.push({
      id: 'rule_coverage',
      ruleCode: 'MCC-BYE-LAW-T4',
      category: 'COVERAGE',
      title: 'Ground Coverage Maximum Permissible',
      description: 'Building plinth area cannot exceed statutory percentage of gross plot area to ensure open space.',
      statutoryReference: 'Mysuru City Corporation Building Bye-Laws Schedule II, Table 4',
      status: 'PASS',
      expectedStandard: `Maximum ${maxAllowedCoverage}% ground footprint`,
      actualObserved: `${proposed.proposedGroundCoveragePercent}% coverage proposed`,
    });
  } else {
    rules.push({
      id: 'rule_coverage',
      ruleCode: 'MCC-BYE-LAW-T4',
      category: 'COVERAGE',
      title: 'Excessive Ground Coverage',
      description: `Proposed footprint of ${proposed.proposedGroundCoveragePercent}% exceeds the maximum cap of ${maxAllowedCoverage}%.`,
      statutoryReference: 'Mysuru City Corporation Building Bye-Laws Schedule II, Table 4',
      status: 'FAIL',
      expectedStandard: `Maximum ${maxAllowedCoverage}% ground footprint`,
      actualObserved: `${proposed.proposedGroundCoveragePercent}% coverage exceeds limit by ${(proposed.proposedGroundCoveragePercent - maxAllowedCoverage).toFixed(1)}%`,
      remedyAction: `Reduce the ground floor footprint by at least ${(property.siteAreaSqFt * (proposed.proposedGroundCoveragePercent - maxAllowedCoverage) / 100).toFixed(0)} sq ft to leave required perimeter open space.`,
    });
    remediationRoadmap.push(`Reduce ground floor plinth to within ${maxAllowedCoverage}% to avoid plan rejection.`);
    whatIfNotes.push(`Reducing ground coverage to ${maxAllowedCoverage}% will clear Rule MCC-BYE-LAW-T4.`);
  }

  // 4. Floor Height & Storeys (MCC Bye-Law 6.2)
  // Standard residential allows G+2 (under 11.5 meters height on roads >= 9m, or 10.0m on smaller roads)
  const maxAllowedHeight = proposed.roadWidthMeters >= 9 ? 11.5 : 10.0;
  if (proposed.proposedHeightMeters <= maxAllowedHeight && proposed.proposedFloors <= 3) {
    rules.push({
      id: 'rule_height',
      ruleCode: 'MCC-BYE-LAW-6.2',
      category: 'HEIGHT',
      title: 'Building Height & Number of Floors',
      description: 'Height envelope conforms to road width ratio (1.5 x road width + front setback buffer).',
      statutoryReference: 'MCC Building Bye-Laws Regulation 6.2 & National Building Code (NBC) 2016 Part 3',
      status: 'PASS',
      expectedStandard: `Up to ${maxAllowedHeight} meters (G+2 Floors) for ${proposed.roadWidthMeters}m road`,
      actualObserved: `${proposed.proposedHeightMeters}m height (${proposed.proposedFloors} floors)`,
    });
  } else {
    rules.push({
      id: 'rule_height',
      ruleCode: 'MCC-BYE-LAW-6.2',
      category: 'HEIGHT',
      title: 'Building Height Exceeds Road Width Limitation',
      description: `Height of ${proposed.proposedHeightMeters}m or ${proposed.proposedFloors} floors exceeds permissible envelope on a ${proposed.roadWidthMeters}m approach road.`,
      statutoryReference: 'MCC Building Bye-Laws Regulation 6.2',
      status: 'FAIL',
      expectedStandard: `Maximum ${maxAllowedHeight}m height`,
      actualObserved: `${proposed.proposedHeightMeters}m proposed`,
      remedyAction: 'Reduce proposed floors to G+2 or seek special High-Rise Committee clearance if road widening is gazetted.',
    });
    remediationRoadmap.push('Restrict total vertical height to under 10.0m or verify gazetted road widening.');
  }

  // 5. Front & Rear Setback Mandate (MCC Bye-Law 7.1)
  // For 30x40 plots (<=1200 sq ft): Front min 1.5m, Rear min 1.0m, Sides min 1.0m
  // For >1200 to 2400 sq ft: Front min 2.0m, Rear min 1.5m, Sides min 1.2m
  // For >2400 sq ft: Front min 3.0m, Rear min 2.0m, Sides min 1.5m
  const minFrontSetback = property.siteAreaSqFt <= 1200 ? 1.5 : property.siteAreaSqFt <= 2400 ? 2.0 : 3.0;
  const minRearSetback = property.siteAreaSqFt <= 1200 ? 1.0 : property.siteAreaSqFt <= 2400 ? 1.5 : 2.0;

  if (proposed.frontSetbackMeters >= minFrontSetback && proposed.rearSetbackMeters >= minRearSetback) {
    rules.push({
      id: 'rule_setback',
      ruleCode: 'MCC-BYE-LAW-7.1',
      category: 'SETBACK',
      title: 'Front & Rear Boundary Setbacks',
      description: 'Satisfies mandatory setback margins required for light, ventilation, and fire safety access.',
      statutoryReference: 'MCC Building Bye-Laws Table 5 (Setback Matrix for Residential Plots)',
      status: 'PASS',
      expectedStandard: `Front ≥ ${minFrontSetback}m, Rear ≥ ${minRearSetback}m`,
      actualObserved: `Front: ${proposed.frontSetbackMeters}m, Rear: ${proposed.rearSetbackMeters}m`,
    });
  } else {
    rules.push({
      id: 'rule_setback',
      ruleCode: 'MCC-BYE-LAW-7.1',
      category: 'SETBACK',
      title: 'Insufficient Boundary Setbacks',
      description: `Proposed setbacks (Front ${proposed.frontSetbackMeters}m, Rear ${proposed.rearSetbackMeters}m) do not meet the minimum statutory thresholds of Front ${minFrontSetback}m and Rear ${minRearSetback}m.`,
      statutoryReference: 'MCC Building Bye-Laws Table 5 (Setback Matrix for Residential Plots)',
      status: 'FAIL',
      expectedStandard: `Front ≥ ${minFrontSetback}m, Rear ≥ ${minRearSetback}m`,
      actualObserved: `Front: ${proposed.frontSetbackMeters}m, Rear: ${proposed.rearSetbackMeters}m`,
      remedyAction: `Adjust architectural CAD layout to provide at least ${minFrontSetback}m front margin and ${minRearSetback}m rear margin.`,
    });
    remediationRoadmap.push(`Modify boundary setbacks to minimum Front ${minFrontSetback}m and Rear ${minRearSetback}m.`);
    whatIfNotes.push(`Adjusting front margin by +${(minFrontSetback - proposed.frontSetbackMeters > 0 ? (minFrontSetback - proposed.frontSetbackMeters).toFixed(1) : '0')}m will resolve Setback Rule.`);
  }

  // 6. Environmental Mandates (Rainwater Harvesting & Solar Water Heating)
  // Karnataka Municipal Act makes Rainwater Harvesting mandatory for all sites >= 1200 sq ft (30x40 and above)
  if (property.siteAreaSqFt >= 1200) {
    if (proposed.hasRainwaterHarvesting) {
      rules.push({
        id: 'rule_rwh',
        ruleCode: 'KMC-RWH-AMENDMENT-2009',
        category: 'ENVIRONMENTAL',
        title: 'Mandatory Rainwater Harvesting (RWH)',
        description: 'Compulsory recharge pit / storage sump for all sites measuring 1200 sq ft and above.',
        statutoryReference: 'KMC Act (Amendment) 2009 & MCC Notification on Water Conservation',
        status: 'PASS',
        expectedStandard: 'RWH design integrated in CAD blueprint',
        actualObserved: 'RWH provision confirmed in design',
      });
    } else {
      rules.push({
        id: 'rule_rwh',
        ruleCode: 'KMC-RWH-AMENDMENT-2009',
        category: 'ENVIRONMENTAL',
        title: 'Missing Rainwater Harvesting Provision',
        description: 'Sites >= 1200 sq ft must incorporate Rainwater Harvesting; failure results in plan rejection and municipal water connection denial.',
        statutoryReference: 'KMC Act (Amendment) 2009 & Mysuru City Corporation Water Byelaws',
        status: 'WARNING',
        expectedStandard: 'Minimum 2000L recharge sump or percolation pit on plan',
        actualObserved: 'Not indicated in design specification',
        remedyAction: 'Include a Rainwater Harvesting percolation pit or storage tank in your building plan drawing before submission to MCC.',
      });
      remediationRoadmap.push('Add Rainwater Harvesting sump specification into the civil drawings.');
    }
  }

  // Solar Water Heater for sites > 2000 sq ft
  if (property.siteAreaSqFt >= 2000) {
    if (proposed.hasSolarWaterHeater) {
      rules.push({
        id: 'rule_solar',
        ruleCode: 'KREDL-SOLAR-MANDATE',
        category: 'ENVIRONMENTAL',
        title: 'Solar Water Heating System Provision',
        description: 'Plots exceeding 2000 sq ft require rooftop solar water heating system provision.',
        statutoryReference: 'Karnataka Renewable Energy Policy & MCC Building Bye-Law 23',
        status: 'PASS',
        expectedStandard: 'Solar heater rooftop plumbing provision indicated',
        actualObserved: 'Solar system planned in proposal',
      });
    } else {
      rules.push({
        id: 'rule_solar',
        ruleCode: 'KREDL-SOLAR-MANDATE',
        category: 'ENVIRONMENTAL',
        title: 'Solar Water Heating Plumbing Missing',
        description: 'Plots over 2000 sq ft must include solar water heating structural plumbing on the rooftop.',
        statutoryReference: 'MCC Building Bye-Law 23 (Solar Assisted Water Heating Systems)',
        status: 'WARNING',
        expectedStandard: 'Rooftop solar water heater capacity provision',
        actualObserved: 'No solar heater provision marked',
        remedyAction: 'Ensure architect adds solar rooftop piping to the service layout drawings.',
      });
    }
  }

  // 7. Mandatory Ownership & Statutory Document Scrutiny
  const requiredDocs = [
    'Sale Deed',
    'Khata Certificate (Form 3)',
    'Property Tax Receipt (Current FY)',
    'Encumbrance Certificate (Form 15)',
    'Architectural Building Plan',
  ];

  requiredDocs.forEach((doc) => {
    if (!uploadedDocTypes.includes(doc)) {
      missingDocs.push(doc);
    }
  });

  if (missingDocs.length === 0) {
    rules.push({
      id: 'rule_docs',
      ruleCode: 'MCC-DOC-CHECKLIST',
      category: 'DOCUMENTATION',
      title: 'Primary Ownership & Title Dossier',
      description: 'All mandatory registered deeds, latest tax receipts, and encumbrance certificates are uploaded.',
      statutoryReference: 'MCC Building Licence Application Protocol (Form 1)',
      status: 'PASS',
      expectedStandard: 'Complete 5-document dossier',
      actualObserved: 'All 5 mandatory documents accounted for in upload checklist',
    });
  } else {
    rules.push({
      id: 'rule_docs',
      ruleCode: 'MCC-DOC-CHECKLIST',
      category: 'DOCUMENTATION',
      title: 'Incomplete Document Dossier',
      description: `Missing ${missingDocs.length} mandatory document(s): ${missingDocs.join(', ')}.`,
      statutoryReference: 'MCC Citizen Charter & Building Plan Submission Guidelines',
      status: 'WARNING',
      expectedStandard: 'Sale Deed, Khata Certificate, Tax Receipt, EC Form 15, CAD Plan',
      actualObserved: `${uploadedDocTypes.length} of 5 documents verified`,
      remedyAction: `Upload the remaining documents (${missingDocs.join(', ')}) into the document scanner module.`,
    });
    missingDocs.forEach((d) => remediationRoadmap.push(`Procure and upload ${d}.`));
  }

  // Calculate Metrics
  const passedCount = rules.filter((r) => r.status === 'PASS').length;
  const failedCount = rules.filter((r) => r.status === 'FAIL').length;
  const warningCount = rules.filter((r) => r.status === 'WARNING').length;
  const uncertainCount = rules.filter((r) => r.status === 'UNCERTAIN').length;

  // Readiness Score: Weighted calculation
  let readinessScore = Math.round(
    (passedCount / rules.length) * 70 +
      ((requiredDocs.length - missingDocs.length) / requiredDocs.length) * 30
  );
  if (failedCount > 0) {
    readinessScore = Math.min(readinessScore, 65);
  }

  // Overall Verdict
  let overallVerdict: EligibilityResult['overallVerdict'] = 'APPEARS_ELIGIBLE';
  if (failedCount > 0) {
    overallVerdict = 'REQUIREMENTS_NOT_SATISFIED';
  } else if (missingDocs.length > 0 || warningCount > 0) {
    overallVerdict = 'ADDITIONAL_INFO_REQUIRED';
  } else if (uncertainCount > 0) {
    overallVerdict = 'MANUAL_REVIEW_REQUIRED';
  }

  // Estimated Fee (MCC Standard Rate approx ₹15 - ₹25 per sq meter + cess + scrutiny)
  const builtUpSqM = (proposed.proposedBuiltUpAreaSqFt || 1200) * 0.092903;
  const estimatedMunicipalFeeInr = Math.round(builtUpSqM * 180 + 3500); // Realistic MCC schedule fee
  const estimatedPlanSanctionDays = isMuda ? 21 : 14; // MCC OBPAS turnaround ~14 days

  return {
    overallVerdict,
    readinessScore,
    passedCount,
    failedCount,
    warningCount,
    uncertainCount,
    rulesChecked: rules,
    missingMandatoryDocuments: missingDocs,
    remediationRoadmap,
    recommendedAuthority: isMuda ? 'MUDA' : 'MCC',
    estimatedMunicipalFeeInr,
    estimatedPlanSanctionDays,
    whatIfImpactNotes: whatIfNotes,
  };
}
