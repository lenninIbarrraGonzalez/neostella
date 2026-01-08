import { CaseType } from '../types';

export interface CaseTypeConfig {
  value: CaseType;
  label: string;
  category: string;
}

export const CASE_TYPES: CaseTypeConfig[] = [
  { value: 'personal_injury', label: 'Personal Injury', category: 'Civil' },
  { value: 'auto_accident', label: 'Auto Accident', category: 'Civil' },
  { value: 'immigration_visa', label: 'Immigration - Visa', category: 'Immigration' },
  { value: 'immigration_citizenship', label: 'Immigration - Citizenship', category: 'Immigration' },
  { value: 'family_divorce', label: 'Family - Divorce', category: 'Family' },
  { value: 'family_custody', label: 'Family - Custody', category: 'Family' },
];

export const CASE_TASK_TEMPLATES: Record<CaseType, string[]> = {
  personal_injury: [
    'Initial client consultation',
    'Gather medical records',
    'File insurance claim',
    'Negotiate settlement',
    'Prepare litigation if needed',
  ],
  auto_accident: [
    'Obtain police report',
    'Document vehicle damage',
    'Gather medical records',
    'Contact insurance companies',
    'Calculate damages',
  ],
  immigration_visa: [
    'Review eligibility requirements',
    'Gather supporting documents',
    'Complete visa application forms',
    'Schedule biometrics appointment',
    'Prepare for interview',
  ],
  immigration_citizenship: [
    'Verify eligibility for naturalization',
    'Complete N-400 application',
    'Gather supporting documents',
    'Schedule biometrics',
    'Prepare for citizenship test',
  ],
  family_divorce: [
    'Initial consultation',
    'Gather financial documents',
    'File divorce petition',
    'Serve papers to spouse',
    'Negotiate settlement terms',
  ],
  family_custody: [
    'Initial consultation',
    'Document custody concerns',
    'File custody motion',
    'Prepare parenting plan',
    'Schedule mediation',
  ],
};

export function getCaseTypeConfig(type: CaseType): CaseTypeConfig | undefined {
  return CASE_TYPES.find(t => t.value === type);
}
