export type PermitId =
  | 'residential-building'
  | 'commercial-food'
  | 'street-event'
  | 'solar-clean-energy'
  | 'home-occupation'
  | 'sidewalk-cafe';

export type CriterionStatus = 'PASS' | 'FAIL' | 'WARNING' | 'PENDING';

export type ConditionType =
  | 'numeric_min'
  | 'numeric_max'
  | 'equals'
  | 'in_list'
  | 'boolean'
  | 'custom';

export interface RuleCriterion {
  id: string;
  name: string;
  category: 'zoning' | 'safety' | 'dimensions' | 'licensing' | 'environmental';
  description: string;
  legalCode: string; // e.g., "Muni Code § 17.22.040"
  targetField: string;
  conditionType: ConditionType;
  thresholdValue: any;
  unit?: string;
  isMandatory: boolean;
  mitigationAdvice: string;
}

export interface DocumentRequirement {
  id: string;
  name: string;
  category: 'legal' | 'technical' | 'insurance' | 'compliance' | 'licensing' | 'environmental';
  isMandatory: boolean;
  description: string;
  acceptableFormats: string[];
  sampleDescription: string;
}

export interface FieldDefinition {
  key: string;
  label: string;
  type: 'select' | 'number' | 'boolean' | 'text';
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  unit?: string;
  helperText?: string;
  defaultValue?: any;
}

export interface PermitDefinition {
  id: PermitId;
  code: string;
  title: string;
  department: string;
  summary: string;
  badge: string;
  baseFee: number;
  estimatedDays: number;
  statutoryAuthority: string;
  criteria: RuleCriterion[];
  documents: DocumentRequirement[];
  fields: FieldDefinition[];
  guidelinesSummary: string;
  municipalGuidelineUrl?: string;
}

export interface CriterionEvaluationResult {
  criterionId: string;
  name: string;
  status: CriterionStatus;
  actualValue: any;
  expectedValue: any;
  reason: string;
  legalCode: string;
  mitigationAdvice?: string;
}

export interface RuleEvaluationSummary {
  overallStatus: 'ELIGIBLE' | 'CONDITIONALLY_ELIGIBLE' | 'INELIGIBLE';
  accuracyConfidence: number; // e.g. 98%
  score: number; // 0-100
  criteriaResults: CriterionEvaluationResult[];
  passedCount: number;
  failedCount: number;
  pendingCount: number;
  warningCount: number;
  missingDocuments: DocumentRequirement[];
  verifiedDocuments: string[];
  estimatedFee: number;
  estimatedReviewDays: number;
  actionItems: string[];
  legalReferenceHighlights: string[];
}

export interface SyntheticProfile {
  id: string;
  name: string;
  applicantName: string;
  permitId: PermitId;
  tag: string;
  scenario: string;
  data: Record<string, any>;
  expectedVerdict: 'ELIGIBLE' | 'CONDITIONALLY_ELIGIBLE' | 'INELIGIBLE';
  groundTruthExplanation: string;
  expectedPassedRatio: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user' | 'system';
  text: string;
  timestamp: string;
  extractedData?: Record<string, any>;
  suggestedReplies?: string[];
  actionableTips?: string[];
  statusChangeAlert?: string;
}
