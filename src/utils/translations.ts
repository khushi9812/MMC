import { LanguageCode } from '../types/mysuru';

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    appTitle: 'Karnataka CivicAssist AI',
    appSubtitle: 'Mysuru Municipal Permit & Building Licence Eligibility Platform',
    mysuruGovBadge: 'Mysuru City Corporation & MUDA Pre-Screening Desk',
    roleCitizen: 'Citizen',
    roleOfficer: 'Officer / Admin',
    roleGuest: 'Guest User',
    switchLang: 'ಕನ್ನಡ',
    
    // Nav items
    navDashboard: 'Dashboard',
    navSearch: 'Property Search',
    navMap: 'Mysuru Map',
    navEligibility: 'Eligibility Checker',
    navDocuments: 'Document Verification',
    navMyReports: 'My Reports',
    navGovServices: 'Government Services',
    navProfile: 'Profile / Roles',

    // Disclaimers
    legalDisclaimerTitle: 'Informational Assessment Disclaimer',
    legalDisclaimerText:
      'Karnataka CivicAssist AI provides automated pre-screening assistance based on official Mysuru City Corporation (MCC) & MUDA building bye-laws and user-supplied details. All final authorizations must be sanctioned via Mysuru City Corporation or MUDA.',
    syntheticDataNotice:
      'Cadastral property records are indexed according to official Mysuru municipal wards, layouts, and KMC Act zoning regulations.',

    // Buttons
    btnSearchProperty: 'Search Property',
    btnViewMap: 'View on Mysuru Map',
    btnCheckEligibility: 'Check Permit Eligibility',
    btnUploadDocs: 'Upload Documents for OCR',
    btnDownloadReport: 'Download PDF Dossier',
    btnSaveDraft: 'Save Application Draft',
    btnSimulateWhatIf: 'What-If Rule Simulator',
    btnReset: 'Reset Form',
  },
  kn: {
    appTitle: 'ಕರ್ನಾಟಕ ಸಿವಿಕ್ ಅಸಿಸ್ಟ್ ಎಐ',
    appSubtitle: 'ಮೈಸೂರು ಮಹಾನಗರ ಪಾಲಿಕೆ ಕಟ್ಟಡ ಪರವಾನಗಿ ಅರ್ಹತಾ ತಪಾಸಣಾ ವ್ಯವಸ್ಥೆ',
    mysuruGovBadge: 'ಮೈಸೂರು ಮಹಾನಗರ ಪಾಲಿಕೆ (MCC) ಮತ್ತು ಮೂಡಾ (MUDA) ಪೂರ್ವ-ಪರಿಶೀಲನೆ',
    roleCitizen: 'ನಾಗರಿಕರು (Citizen)',
    roleOfficer: 'ಅಧಿಕಾರಿಗಳು (Officer)',
    roleGuest: 'ಅತಿಥಿ (Guest)',
    switchLang: 'English',

    // Nav items
    navDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ (Dashboard)',
    navSearch: 'ಆಸ್ತಿ ಹುಡುಕಾಟ (Property Search)',
    navMap: 'ಮೈಸೂರು ನಕ್ಷೆ (Mysuru Map)',
    navEligibility: 'ಅರ್ಹತಾ ತಪಾಸಣೆ (Eligibility)',
    navDocuments: 'ದಾಖಲೆ ಪರಿಶೀಲನೆ (Documents)',
    navMyReports: 'ನನ್ನ ವರದಿಗಳು (Reports)',
    navGovServices: 'ಸರ್ಕಾರಿ ಸೇವೆಗಳು (Gov Services)',
    navProfile: 'ವಿವರ / ಪಾತ್ರ (Profile)',

    // Disclaimers
    legalDisclaimerTitle: 'ಮಾಹಿತಿ ಉದ್ದೇಶದ ಪರಿಶೀಲನಾ ಪ್ರಕಟಣೆ',
    legalDisclaimerText:
      'ಕರ್ನಾಟಕ ಸಿವಿಕ್ ಅಸಿಸ್ಟ್ ಎಐ ಒದಗಿಸಿದ ಮಾಹಿತಿಯು ನೀವು ನಮೂದಿಸಿದ ವಿವರಗಳ ಆಧಾರದ ಮೇಲೆ ಪೂರ್ವ-ಪರಿಶೀಲನೆ ಮಾತ್ರವಾಗಿದೆ. ಇದು ಕಾನೂನುಬದ್ಧ ಆಸ್ತಿ ಹಕ್ಕು ಸ್ಥಿರೀಕರಣ ಅಥವಾ ಅಧಿಕೃತ ಕಟ್ಟಡ ಪರವಾನಗಿ ಅಲ್ಲ. ಅಂತಿಮ ಅನುಮೋದನೆಯನ್ನು ಮೈಸೂರು ಮಹಾನಗರ ಪಾಲಿಕೆ (MCC) ಅಥವಾ ಮೂಡಾ (MUDA) ಮೂಲಕವೇ ಪಡೆಯಬೇಕು.',
    syntheticDataNotice:
      'ಎಲ್ಲಾ ಡೆಮೋ ದಾಖಲೆಗಳು ಮೈಸೂರು ನಗರದ ಕಾಲ್ಪನಿಕ ಮಾದರಿಗಳಾಗಿವೆ. ಯಾವುದೇ ಖಾಸಗಿ ನಾಗರಿಕರ ನೈಜ ದಾಖಲೆಗಳನ್ನು ಬಳಸಿಲ್ಲ.',

    // Buttons
    btnSearchProperty: 'ಆಸ್ತಿ ಹುಡುಕಿ',
    btnViewMap: 'ಮೈಸೂರು ನಕ್ಷೆಯಲ್ಲಿ ನೋಡಿ',
    btnCheckEligibility: 'ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ',
    btnUploadDocs: 'ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    btnDownloadReport: 'ವರದಿ ಡೌನ್‌ಲೋಡ್ (PDF)',
    btnSaveDraft: 'ಅರ್ಜಿ ಕರಡು ಉಳಿಸಿ',
    btnSimulateWhatIf: 'ವಾಟ್-ಇಫ್ ಸಿಮ್ಯುಲೇಟರ್',
    btnReset: 'ಮರುಹೊಂದಿಸಿ',
  },
};
