/**
 * Multi-language support for Arsenic Summit
 * Supported languages: English, Hindi, Tamil, Gujarati
 */

export type Language = 'en' | 'hi' | 'ta' | 'gu';

interface Translations {
  [key: string]: {
    [language in Language]: string;
  };
}

// Core translations
export const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    hi: 'होम',
    ta: 'வீடு',
    gu: 'હોમ',
  },
  'nav.events': {
    en: 'Events',
    hi: 'कार्यक्रम',
    ta: 'நிகழ்வுகள்',
    gu: 'ઇવેન્ટ્સ',
  },
  'nav.register': {
    en: 'Register',
    hi: 'पंजीकरण करें',
    ta: 'பதிவுசெய்',
    gu: 'નોંધણી કરો',
  },
  'nav.dashboard': {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    ta: 'ড్ಯாשବોర్డ్',
    gu: 'ડેશબોર્ડ',
  },
  'nav.checkin': {
    en: 'Check-in',
    hi: 'चेक-इन',
    ta: 'சரிபார்ப்பு',
    gu: 'ચેક-ઇન',
  },

  // Registration
  'register.title': {
    en: 'Register for Arsenic Summit',
    hi: 'आर्सेनिक शिखर सम्मेलन के लिए पंजीकरण करें',
    ta: 'Arsenic உச்চிமாநாட்டுக்கு பதிவுசெய்க',
    gu: 'આર્સેનિક સમિટ માટે નોંધણી કરો',
  },
  'register.email': {
    en: 'Email Address',
    hi: 'ईमेल पता',
    ta: 'மின்னஞ்சல் முகவரி',
    gu: 'ઈમેલ સરનામું',
  },
  'register.fullName': {
    en: 'Full Name',
    hi: 'पूरा नाम',
    ta: 'முழு பெயர்',
    gu: 'સંપૂર્ણ નામ',
  },
  'register.institution': {
    en: 'Institution/School',
    hi: 'संस्था/स्कूल',
    ta: 'প្রতিষ্ठান/স্कুল',
    gu: 'સંસ્થા/શાળા',
  },
  'register.city': {
    en: 'City',
    hi: 'शहर',
    ta: 'நகரம்',
    gu: 'શહેર',
  },
  'register.phone': {
    en: 'Phone Number',
    hi: 'फोन नंबर',
    ta: 'தொலைபேசி எண்',
    gu: 'ફોન નંબર',
  },
  'register.committee_preferences': {
    en: 'Committee Preferences',
    hi: 'समिति की प्राथमिकताएं',
    ta: 'குழு விருப்பங்கள்',
    gu: 'સમિતી પસંદીદીતાઓ',
  },
  'register.submit': {
    en: 'Submit Registration',
    hi: 'पंजीकरण जमा करें',
    ta: 'பதிவை சமर্పிக்கவும்',
    gu: 'નોંધણી સમર્પિત કરો',
  },

  // Dashboard
  'dashboard.welcome': {
    en: 'Welcome to your Dashboard',
    hi: 'आपके डैशबोर्ड में आपका स्वागत है',
    ta: 'உங்கள் ড్యాশબોర్డுக்கு வரவேற்கிறோம்',
    gu: 'તમારા ડેશબોર્ડમાં સ્વાગતું',
  },
  'dashboard.myAllocation': {
    en: 'My Committee Allocation',
    hi: 'मेरी समिति आवंटन',
    ta: 'என் குழு ஒதுக்கீடு',
    gu: 'મારી સમિતી ફાળવણી',
  },
  'dashboard.portfolio': {
    en: 'Portfolio',
    hi: 'पोर्टफोलियो',
    ta: 'போர்ட்ஃபோலியோ',
    gu: 'પોર્ટફોલિયો',
  },
  'dashboard.paymentStatus': {
    en: 'Payment Status',
    hi: 'भुगतान स्थिति',
    ta: 'பணம் செலுத்தும் நிலை',
    gu: 'ચુકવણી સ્થિતિ',
  },
  'dashboard.downloadResources': {
    en: 'Download Resources',
    hi: 'संसाधन डाउनलोड करें',
    ta: 'संसाधनहरू डाउनलोड गर्नुहोस्',
    gu: 'સંસાધનો ડાઉનલોડ કરો',
  },

  // Payment
  'payment.title': {
    en: 'Complete Payment',
    hi: 'भुगतान पूरा करें',
    ta: 'பணம் செலுத்த பூரணం',
    gu: 'ચુકવણી સંપૂર્ણ કરો',
  },
  'payment.amount': {
    en: 'Amount to Pay',
    hi: 'भुगतान की राशि',
    ta: 'செலுத்தும் தொகை',
    gu: 'ચુકવવા માટે રકમ',
  },
  'payment.razorpay': {
    en: 'Pay with Razorpay',
    hi: 'Razorpay से भुगतान करें',
    ta: 'Razorpay உடன் பணம் செலுத்துங்கள்',
    gu: 'Razorpay સાથે ચુકવો',
  },
  'payment.easebuzz': {
    en: 'Pay with Easebuzz',
    hi: 'Easebuzz से भुगतान करें',
    ta: 'Easebuzz உடன் பணம் செலுத்துங்கள்',
    gu: 'Easebuzz સાથે ચુકવો',
  },
  'payment.success': {
    en: 'Payment Successful!',
    hi: 'भुगतान सफल रहा!',
    ta: 'பணம் செலுத்த வெற்றி!',
    gu: 'ચુકવણી સફળ!',
  },

  // Committees
  'committee.security_council': {
    en: 'UN Security Council',
    hi: 'संयुक्त राष्ट्र सुरक्षा परिषद',
    ta: 'ஐக்கிய நாடுகள் பாதுகாப்பு கவுன்சिल்',
    gu: 'યુએન સિક્યુરિટી કાઉન્સિલ',
  },
  'committee.general_assembly': {
    en: 'General Assembly',
    hi: 'महासभा',
    ta: 'பொது சபை',
    gu: 'જનરલ એસેમ્બલી',
  },
  'committee.lok_sabha': {
    en: 'Lok Sabha',
    hi: 'लोक सभा',
    ta: 'லோક் சபா',
    gu: 'લોક સભા',
  },

  // Events
  'event.mun': {
    en: 'Model United Nations',
    hi: 'मॉडल संयुक्त राष्ट्र',
    ta: 'மாதிரி ஐக்கிய நாடுகள்',
    gu: 'મોડેલ યુનાઇટેડ નેશન્સ',
  },
  'event.debate': {
    en: 'Debate Competition',
    hi: 'बहस प्रतियोगिता',
    ta: 'விவாத போட்டி',
    gu: 'ડિબેટ પ્રતિયોગિતા',
  },

  // Common
  'common.loading': {
    en: 'Loading...',
    hi: 'लोड हो रहा है...',
    ta: 'ஏற்றுதல்...',
    gu: 'લોડ થઈ રહ્યું છે...',
  },
  'common.error': {
    en: 'An error occurred',
    hi: 'एक त्रुटि हुई',
    ta: 'ஒரு பிழை ஏற்பட்டது',
    gu: 'એક ભૂલ આવી',
  },
  'common.success': {
    en: 'Success!',
    hi: 'सफल!',
    ta: 'வெற்றி!',
    gu: 'સફળતા!',
  },
  'common.logout': {
    en: 'Logout',
    hi: 'लॉगआउट',
    ta: 'வெளியே',
    gu: 'લૉગઆઉટ',
  },
};

/**
 * Translate a key
 */
export function translate(key: string, language: Language = 'en'): string {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  return translation[language] || translation.en;
}

/**
 * Translate multiple keys
 */
export function translateMultiple(
  keys: string[],
  language: Language = 'en'
): Record<string, string> {
  const result: Record<string, string> = {};
  keys.forEach((key) => {
    result[key] = translate(key, language);
  });
  return result;
}

/**
 * Get available languages
 */
export function getAvailableLanguages(): Array<{ code: Language; name: string }> {
  return [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'gu', name: 'ગુજરાતી' },
  ];
}

/**
 * Detect user language from browser
 */
export function detectLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  const browserLang = navigator.language.split('-')[0];
  const supportedLangs: Language[] = ['en', 'hi', 'ta', 'gu'];

  return (supportedLangs.includes(browserLang as Language)
    ? browserLang
    : 'en') as Language;
}

/**
 * Format date in specific language
 */
export function formatDateLocalized(date: Date, language: Language = 'en'): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const localeMap = {
    en: 'en-US',
    hi: 'hi-IN',
    ta: 'ta-IN',
    gu: 'gu-IN',
  };

  return date.toLocaleDateString(localeMap[language], options);
}

/**
 * Format currency in specific language
 */
export function formatCurrencyLocalized(
  amount: number,
  language: Language = 'en'
): string {
  const localeMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    gu: 'gu-IN',
  };

  return new Intl.NumberFormat(localeMap[language], {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}
