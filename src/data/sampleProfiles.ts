import { SyntheticProfile } from '../types/permits';

export const SAMPLE_PROFILES: SyntheticProfile[] = [
  {
    id: 'profile-david-adu',
    name: 'David Chen - Residential Building License & ADU Construction',
    applicantName: 'David Chen',
    permitId: 'residential-building',
    tag: 'Building License & ADU',
    scenario:
      'Property owner applying for a full Building License to construct a 650 sq ft detached accessory dwelling unit (ADU) on an R-1 single-family lot with a tight rear yard boundary.',
    expectedVerdict: 'INELIGIBLE',
    expectedPassedRatio: '5 / 7 Criteria Passed (Minor Variance Required)',
    groundTruthExplanation:
      'Zoning is R-1, side setbacks are 4.5 ft (compliant), licensed contractor selected, not in historic zone. However, proposed rear setback is 3.5 ft (violates both standard 5ft and state ADU 4ft minimum), and proposed lot coverage reaches 48% (exceeds 45% maximum). Requires structural redesign or Administrative Variance Form B-12 before Building License issuance.',
    data: {
      zoning: 'R-1',
      isADU: true,
      rearSetbackFeet: 3.5, // Non-compliant (< 4ft for ADU)
      sideSetbackFeet: 4.5,
      buildingHeightFeet: 15,
      lotCoveragePercent: 48, // Non-compliant (> 45%)
      inHistoricDistrict: false,
      hasLicensedContractor: true,
      uploadedDocumentIds: [
        'doc_res_site_plan',
        'doc_res_structural_calcs',
        'doc_res_title_deed',
      ],
    },
  },
  {
    id: 'profile-maya-solar',
    name: 'Maya Lin - Rooftop Solar PV & Energy Storage',
    applicantName: 'Maya Lin',
    permitId: 'solar-clean-energy',
    tag: 'Clean Energy Fast-Track',
    scenario:
      'Homeowner seeking to install a 7.6 kW rooftop solar array and 10 kWh battery backup on a single-family residence built in 2016.',
    expectedVerdict: 'ELIGIBLE',
    expectedPassedRatio: '5 / 5 Criteria Passed (100%)',
    groundTruthExplanation:
      'Roof is only 8 years old (well under 15-year threshold), 200A main service panel handles 120% busbar rule without derating, 36-inch fire pathways maintained, NEC 2023 rapid shutdown microinverters specified, and utility interconnection NEM pre-application approved.',
    data: {
      roofAgeYears: 8,
      mainPanelRatingAmps: 200,
      systemCapacityKW: 7.6,
      hasFirePathwayClearance: true,
      hasRapidShutdown: true,
      hasUtilityInterconnection: true,
      hasBatteryStorage: true,
      uploadedDocumentIds: [
        'doc_solar_sld',
        'doc_solar_structural_calcs',
        'doc_solar_spec_sheets',
        'doc_solar_utility_letter',
      ],
    },
  },
  {
    id: 'profile-carlos-bakery',
    name: 'Carlos Gomez - Downtown Bakery & Espresso Cafe',
    applicantName: 'Carlos Gomez',
    permitId: 'commercial-food',
    tag: 'Commercial Food & Hospitality',
    scenario:
      'Small business owner taking over a former retail space in Central Commercial (C-2) zone to open an artisan pastry bakery and espresso bar with 28 seats.',
    expectedVerdict: 'CONDITIONALLY_ELIGIBLE',
    expectedPassedRatio: '5 / 6 Criteria Passed (Action Needed)',
    groundTruthExplanation:
      'Zoning is compliant (C-2), grease interceptor is sized and specified, commercial refuse contract secured, and seating is under 30 (permitting 1 unisex ADA restroom). However, the applicant has not yet completed the ANSI Food Protection Manager certification (currently enrolled in course).',
    data: {
      zoning: 'C-2',
      seatingCapacity: 28,
      hasGreaseInterceptor: true,
      hasFoodProtectionManager: false, // Pending certification
      hasFireSuppressionHood: true,
      restroomCount: 1, // Permissible because seating < 30
      hasCommercialRefuseContract: true,
      uploadedDocumentIds: [
        'doc_food_equipment_layout',
        'doc_food_grease_spec',
      ],
    },
  },
  {
    id: 'profile-elena-festival',
    name: 'Elena Rostova - Annual Maple Street Block Party',
    applicantName: 'Elena Rostova',
    permitId: 'street-event',
    tag: 'Community Special Event',
    scenario:
      'Neighborhood association president organizing an annual summer block gathering with acoustic live music, food potluck, and children games.',
    expectedVerdict: 'INELIGIBLE',
    expectedPassedRatio: '3 / 6 Criteria Passed (Urgent Remediation Required)',
    groundTruthExplanation:
      'Event planned with 350 attendees and sound finishing at 21:00 (compliant). However, filing is only 14 days in advance (statute requires 21 days), neighbor petition is at only 58% (70% required), and $1M Certificate of Insurance has not yet been bound.',
    data: {
      expectedAttendance: 350,
      daysAdvanceNotice: 14, // Non-compliant (< 21 days)
      closureDurationHours: 7,
      hasAmplifiedSound: true,
      soundEndHour: 21,
      hasLiabilityInsurance: false, // Non-compliant
      hasTrafficControlPlan: true,
      portableToiletCount: 3,
      neighborApprovalPercent: 58, // Non-compliant (< 70%)
      uploadedDocumentIds: ['doc_event_traffic_plan'],
    },
  },
  {
    id: 'profile-amina-studio',
    name: 'Amina Patel - Home Architectural Design Consulting',
    applicantName: 'Amina Patel',
    permitId: 'home-occupation',
    tag: 'Home Small Business',
    scenario:
      'Licensed architect operating an independent boutique sustainable home design practice out of a designated 180 sq ft study in her personal home.',
    expectedVerdict: 'ELIGIBLE',
    expectedPassedRatio: '6 / 6 Criteria Passed (100%)',
    groundTruthExplanation:
      'Primary residence verified, business space occupies 14% of the 1,300 sq ft house (well under 25% cap), zero outside employees on-site, max 2 client visits per day, zero hazardous materials, and plaque sign is 1.2 sq ft unlighted.',
    data: {
      isPrimaryResidence: true,
      floorSpacePercent: 14,
      outsideEmployeesOnSite: 0,
      dailyClientVisits: 2,
      hasHazardousMaterials: false,
      signageSquareFeet: 1.2,
      uploadedDocumentIds: [
        'doc_home_residency_proof',
        'doc_home_floor_plan',
        'doc_home_business_tax',
      ],
    },
  },
];
