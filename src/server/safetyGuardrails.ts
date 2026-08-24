import { EmergencyHelpline } from '../types.ts';

// Standard Indian Emergency Helplines
export const INDIAN_EMERGENCY_HELPLINES: Record<string, EmergencyHelpline> = {
  national: {
    name: 'National Emergency Helpline (Pan-India)',
    nameHi: 'राष्ट्रीय आपातकालीन हेल्पलाइन',
    number: '112',
    category: 'national',
    description: 'Unified all-in-one emergency helpline for Police, Fire, Ambulance, and Disaster response across India.',
    descriptionHi: 'पुलिस, अग्निशमन और एम्बुलेंस के लिए पूरे भारत में 24x7 आपातकालीन नंबर।',
    available: '24x7 Pan-India',
    tollFree: true
  },
  women: {
    name: 'Women in Distress Helpline',
    nameHi: 'महिला हेल्पलाइन (घरेलू हिंसा एवं सुरक्षा)',
    number: '181',
    category: 'women',
    description: '24x7 National helpline for women facing domestic violence, harassment, physical danger, or abuse.',
    descriptionHi: 'घरेलू हिंसा, उत्पीड़न व संकट की स्थिति में महिलाओं के लिए 24 घंटे निशुल्क सहायता।',
    available: '24x7 Pan-India',
    tollFree: true
  },
  ncw: {
    name: 'National Commission for Women (NCW)',
    nameHi: 'राष्ट्रीय महिला आयोग हेल्पलाइन',
    number: '7827170170',
    category: 'women',
    description: 'WhatsApp & Telephonic 24x7 helpline for reporting violence and harassment against women.',
    descriptionHi: 'महिलाओं के विरुद्ध हिंसा और उत्पीड़न दर्ज करने के लिए 24x7 हेल्पलाइन।',
    available: '24x7 Whatsapp & Call',
    tollFree: false
  },
  cyber: {
    name: 'National Cyber Crime Reporting Helpline',
    nameHi: 'राष्ट्रीय साइबर अपराध हेल्पलाइन (गोल्डन ऑवर)',
    number: '1930',
    category: 'cyber',
    description: 'Citizen financial cyber fraud reporting (Call immediately within the golden hour to freeze transacted amounts). Portal: cybercrime.gov.in',
    descriptionHi: 'ऑनलाइन वित्तीय धोखाधड़ी, खाता हैक या अवैध UPI ट्रांजैक्शन की तत्काल रिपोर्ट (गोल्डन ऑवर)।',
    available: '24x7 Golden Hour',
    tollFree: true
  },
  child: {
    name: 'Childline Emergency Service',
    nameHi: 'चाइल्डलाइन आपातकालीन सेवा',
    number: '1098',
    category: 'child',
    description: '24x7 emergency phone outreach service for children in need of care, rescue, and protection.',
    descriptionHi: 'संकटग्रस्त बच्चों की सुरक्षा, बाल श्रम व देखभाल हेतु 24 घंटे हेल्पलाइन।',
    available: '24x7 Toll-Free',
    tollFree: true
  },
  legal: {
    name: 'NALSA Free Legal Aid Helpline',
    nameHi: 'राष्ट्रीय विधिक सेवा प्राधिकरण (नालसा)',
    number: '15100',
    category: 'legal',
    description: 'Free legal aid, advocate appointment, and legal advice under Section 12 of the Legal Services Authorities Act, 1987.',
    descriptionHi: 'नालसा/डालसा के तहत आर्थिक रूप से कमजोर नागरिकों के लिए निशुल्क वकील व विधिक सहायता।',
    available: 'Mon-Sat / 24x7 Online',
    tollFree: true
  },
  mentalHealth: {
    name: 'Tele-MANAS Mental Health Support',
    nameHi: 'टेली-मानस मानसिक स्वास्थ्य हेल्पलाइन',
    number: '14416',
    category: 'mental_health',
    description: '24x7 toll-free mental health helpline by the Ministry of Health (Also: 1800-891-4416 / KIRAN 1800-599-0019).',
    descriptionHi: 'मानसिक तनाव, अवसाद या निराशा से जूझ रहे नागरिकों के लिए 24 घंटे निशुल्क परामर्श।',
    available: '24x7 Toll-Free',
    tollFree: true
  },
  police: {
    name: 'Police Emergency Response',
    nameHi: 'पुलिस आपातकालीन सेवा',
    number: '100 / 112',
    category: 'police',
    description: 'Immediate police intervention for ongoing crimes, assault, trespassing, or safety threats.',
    descriptionHi: 'तात्कालिक पुलिस सहायता व सुरक्षा के लिए कॉल करें।',
    available: '24x7 Toll-Free',
    tollFree: true
  }
};

export interface EmergencyCheckResult {
  isEmergency: boolean;
  category?: 'women' | 'mental_health' | 'cyber' | 'child' | 'police' | 'national';
  helplines: EmergencyHelpline[];
  alertBannerMessage: string;
  alertBannerMessageHi: string;
  triggerKeywords: string[];
}

// Emergency Keyword Patterns (English, Hinglish, and Hindi)
const EMERGENCY_PATTERNS: Array<{
  category: 'women' | 'mental_health' | 'cyber' | 'child' | 'police' | 'national';
  patterns: RegExp[];
  helplineKeys: Array<keyof typeof INDIAN_EMERGENCY_HELPLINES>;
  alertEn: string;
  alertHi: string;
}> = [
  {
    category: 'women',
    patterns: [
      /\b(domestic violence|husband beating|in-laws harassing|dowry harassment|physical abuse|beaten up by husband|sexual harassment|molestation|rape|forced abortion|acid attack|threatened by husband|maar peet|pati maar raha hai|dahej|gharelu hinsa)\b/i,
      /घरेलू हिंसा|दहेज उत्पीड़न|पति मार रहा|मारपीट|यौन उत्पीड़न|बलात्कार|ससुराल वाले प्रताड़ित/
    ],
    helplineKeys: ['women', 'ncw', 'national', 'legal'],
    alertEn: 'URGENT SAFETY SUPPORT: If you or someone you know is in immediate physical danger, call 112 (National Emergency) or 181 (Women in Distress Helpline) immediately.',
    alertHi: 'अति आवश्यक सुरक्षा सहायता: यदि आप या कोई अन्य तात्कालिक खतरे में है, तो तुरंत 112 (राष्ट्रीय आपातकाल) या 181 (महिला हेल्पलाइन) पर संपर्क करें।'
  },
  {
    category: 'mental_health',
    patterns: [
      /\b(suicide|kill myself|end my life|want to die|take my own life|commit suicide|self harm|cannot live anymore|khudkushi|aatmhatya|jaan dena chahta|mar jaana chahta)\b/i,
      /आत्महत्या|खुदकुशी|जान देना चाहता|मर जाना चाहता|आत्मघाती/
    ],
    helplineKeys: ['mentalHealth', 'national'],
    alertEn: 'CRISIS SUPPORT: You are not alone. Please reach out to Tele-MANAS (14416 or 1800-891-4416) or KIRAN (1800-599-0019) for free, confidential, 24/7 mental health support.',
    alertHi: 'संकट सहायता: आप अकेले नहीं हैं। कृपया निशुल्क एवं गोपनीय मानसिक सहायता के लिए टेली-मानस (14416 या 1800-891-4416) पर संपर्क करें।'
  },
  {
    category: 'cyber',
    patterns: [
      /\b(just lost money|unauthorized upi|unauthorized deduction|bank fraud happened right now|account hacked|scammed just now|otp shared mistakenly|money deducted from account|paise kat gaye|cyber fraud)\b/i,
      /खाते से पैसे कट गए|साइबर फ्रॉड|अवैध UPI|ऑनलाइन ठगी|ओटीपी फ्रॉड/
    ],
    helplineKeys: ['cyber', 'national'],
    alertEn: 'GOLDEN HOUR CYBER FRAUD ALERT: Call 1930 immediately to freeze fraudulent bank transactions and register your complaint at cybercrime.gov.in.',
    alertHi: 'गोल्डन ऑवर साइबर अलर्ट: ट्रांजैक्शन रोकने के लिए तुरंत 1930 डायल करें और cybercrime.gov.in पर शिकायत दर्ज कराएं।'
  },
  {
    category: 'child',
    patterns: [
      /\b(child abuse|child labour|trafficked child|missing child|orphan abandoned|pocso|child marriage|baal shoshan|bachha gayab)\b/i,
      /बाल शोषण|बाल श्रम|लापता बच्चा|बाल विवाह|पोक्सो|अनाथ बच्चा/
    ],
    helplineKeys: ['child', 'national', 'legal'],
    alertEn: 'CHILD PROTECTION ALERT: Call Childline at 1098 immediately (24/7 toll-free) for the rescue, care, and legal protection of children in distress.',
    alertHi: 'बाल सुरक्षा अलर्ट: संकटग्रस्त बच्चों की सुरक्षा व बचाव के लिए तुरंत 1098 (चाइल्डलाइन) पर कॉल करें।'
  },
  {
    category: 'police',
    patterns: [
      /\b(attacker outside|break in|weapon|knife|gun|threat to kill|kidnap|kidnapping|hostage|immediate danger|chaku|bandook|jaan ka khatra)\b/i,
      /जान का खतरा|हमलावर|हथियार|अपहरण|बंधक|चाकू|बंदूक/
    ],
    helplineKeys: ['national', 'police'],
    alertEn: 'IMMEDIATE POLICE EMERGENCY: If an active crime is taking place or you are facing an imminent threat to life, please call 112 or 100 right away.',
    alertHi: 'तात्कालिक पुलिस आपातकाल: यदि कोई सक्रिय अपराध हो रहा है या जीवन पर संकट है, तो तुरंत 112 या 100 डायल करें।'
  }
];

// Sanitize user inputs to prevent injection and XSS
export function sanitizeUserInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags
    .replace(/javascript:/gi, '')
    .replace(/onerror\s*=/gi, '')
    .replace(/onload\s*=/gi, '')
    .slice(0, 4000); // Enforce reasonable length constraint
}

// Emergency guardrail scanner
export function checkEmergencyGuardrails(text: string): EmergencyCheckResult {
  const sanitized = sanitizeUserInput(text);
  const matchedKeywords: string[] = [];

  for (const group of EMERGENCY_PATTERNS) {
    for (const pattern of group.patterns) {
      if (pattern.test(sanitized)) {
        matchedKeywords.push(pattern.source);
        const helplines = group.helplineKeys.map(key => INDIAN_EMERGENCY_HELPLINES[key]).filter(Boolean);
        
        return {
          isEmergency: true,
          category: group.category,
          helplines,
          alertBannerMessage: group.alertEn,
          alertBannerMessageHi: group.alertHi,
          triggerKeywords: matchedKeywords
        };
      }
    }
  }

  return {
    isEmergency: false,
    helplines: [
      INDIAN_EMERGENCY_HELPLINES.national,
      INDIAN_EMERGENCY_HELPLINES.legal
    ],
    alertBannerMessage: '',
    alertBannerMessageHi: '',
    triggerKeywords: []
  };
}

// Audit logger for sensitive/flagged interactions (preserving privacy)
export function logFlaggedInteraction(data: {
  userId?: string;
  category?: string;
  timestamp: string;
  triggerType: string;
}) {
  const auditEntry = {
    event: 'EMERGENCY_GUARDRAIL_TRIGGERED',
    timestamp: data.timestamp || new Date().toISOString(),
    category: data.category || 'general_emergency',
    userIdHash: data.userId ? Buffer.from(data.userId).toString('base64').slice(0, 12) : 'anonymous_session',
    triggerType: data.triggerType
  };

  console.info('[AUDIT LOG - SAFETY GUARDRAIL]', JSON.stringify(auditEntry));
}
