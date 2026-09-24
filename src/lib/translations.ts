export type Lang = 'en' | 'hi';

export const t = {
  appName: { en: 'Suraksha-AI', hi: 'सुरक्षा-AI' },
  appSubtitle: {
    en: 'Heatwave Preparedness Agent',
    hi: 'लू से बचाव सहायक',
  },
  tabDashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  tabAssess: { en: 'New Assessment', hi: 'नया मूल्यांकन' },
  tabField: { en: 'Field Mode', hi: 'फील्ड मोड' },
  tabCard: { en: 'Outreach Card', hi: 'आउटरीच कार्ड' },

  weatherBanner: { en: 'Live Heat Risk', hi: 'लाइव लू जोखिम' },
  temperature: { en: 'Temperature', hi: 'तापमान' },
  humidity: { en: 'Humidity', hi: 'नमी' },
  heatIndex: { en: 'Heat Index', hi: 'हीट इंडेक्स' },
  feelsLike: { en: 'Feels like', hi: 'महसूस होता है' },
  selectLocation: { en: 'Select Location', hi: 'स्थान चुनें' },
  lastUpdated: { en: 'Updated', hi: 'अपडेटेड' },

  levelGreen: { en: 'Safe', hi: 'सुरक्षित' },
  levelYellow: { en: 'Caution', hi: 'सावधानी' },
  levelOrange: { en: 'High Risk', hi: 'उच्च जोखिम' },
  levelRed: { en: 'Extreme', hi: 'अत्यधिक' },

  greenAdvice: {
    en: 'Normal conditions. Stay hydrated and monitor updates.',
    hi: 'सामान्य स्थिति। पानी पिते रहें और अपडेट देखते रहें।',
  },
  yellowAdvice: {
    en: 'Moderate heat. Limit outdoor exposure between 11 AM – 3 PM.',
    hi: 'मध्यम गर्मी। दोपहर 11 से 3 बजे तक बाहर जाना कम करें।',
  },
  orangeAdvice: {
    en: 'High heat risk. Stay indoors, use cooling, drink water frequently.',
    hi: 'उच्च लू जोखिम। घर पर रहें, कूलिंग का उपयोग करें, बार-बार पानी पिएं।',
  },
  redAdvice: {
    en: 'EXTREME HEAT. Avoid going outside. Seek AC/shade immediately. Call 108 if symptoms appear.',
    hi: 'अत्यधिक गर्मी। बाहर न जाएं। तुरंत एसी/छाया में जाएं। लक्षण दिखे तो 108 पर कॉल करें।',
  },

  wizardTitle: { en: 'Household Profiling', hi: 'घर की जानकारी' },
  wizardSubtitle: {
    en: 'Answer a few questions to assess heatwave vulnerability',
    hi: 'लू जोखिम का मूल्यांकन करने के लिए कुछ प्रश्नों के उत्तर दें',
  },
  step: { en: 'Step', hi: 'चरण' },
  of: { en: 'of', hi: '/' },
  hhName: { en: 'Household Name / ID', hi: 'घर का नाम / आईडी' },
  hhNamePlaceholder: { en: 'e.g. Sharma Family, HH-014', hi: 'जैसे शर्मा परिवार, HH-014' },
  hhLocation: { en: 'Location', hi: 'स्थान' },
  seniors: { en: 'Seniors (60+)', hi: 'बुजुर्ग (60+)' },
  children: { en: 'Children (<5)', hi: 'बच्चे (<5)' },
  outdoorWorkers: { en: 'Outdoor Workers', hi: 'बाहर काम करने वाले' },
  housingType: { en: 'Housing Type', hi: 'घर का प्रकार' },
  concrete: { en: 'Concrete', hi: 'पक्का (कंक्रीट)' },
  tinRoof: { en: 'Tin Roof', hi: 'टिन की छत' },
  mudHouse: { en: 'Mud House', hi: 'कच्चा (मिट्टी का)' },
  coolingAssets: { en: 'Cooling Assets', hi: 'कूलिंग साधन' },
  ac: { en: 'AC', hi: 'एसी' },
  cooler: { en: 'Cooler', hi: 'कूलर' },
  fan: { en: 'Fan', hi: 'पंखा' },
  none: { en: 'None', hi: 'कुछ नहीं' },
  waterSource: { en: 'Water Source', hi: 'पानी का स्रोत' },
  piped: { en: 'Piped Water', hi: 'नल का पानी' },
  borewell: { en: 'Borewell', hi: 'बोरवेल' },
  tanker: { en: 'Tanker', hi: 'टैंकर' },
  noWater: { en: 'No Access', hi: 'पहुंच नहीं' },
  back: { en: 'Back', hi: 'पीछे' },
  next: { en: 'Next', hi: 'आगे' },
  assess: { en: 'Assess Risk', hi: 'जोखिम मूल्यांकन करें' },
  startNew: { en: 'Start New', hi: 'नया शुरू करें' },
  saveAssessment: { en: 'Save Assessment', hi: 'मूल्यांकन सहेजें' },
  saved: { en: 'Saved!', hi: 'सहेजा गया!' },
  saving: { en: 'Saving...', hi: 'सहेज रहे हैं...' },

  riskTitle: { en: 'AI Risk Assessment', hi: 'AI जोखिम मूल्यांकन' },
  vulnerabilityScore: { en: 'Vulnerability Score', hi: 'संवेदनशीलता स्कोर' },
  riskLevel: { en: 'Risk Level', hi: 'जोखिम स्तर' },
  low: { en: 'Low', hi: 'कम' },
  medium: { en: 'Medium', hi: 'मध्यम' },
  high: { en: 'High', hi: 'उच्च' },
  riskFactors: { en: 'Risk Factor Breakdown', hi: 'जोखिम कारक विवरण' },
  actionPlan: { en: 'Prioritized Action Plan', hi: 'प्राथमिकता के अनुसार कार्य योजना' },
  immediate: { en: 'Immediate Actions', hi: 'तत्काल कार्य' },
  daily: { en: 'Daily Maintenance', hi: 'दैनिक देखभाल' },
  emergency: { en: 'Emergency Prep', hi: 'आपातकालीन तैयारी' },
  listenHindi: { en: 'Listen Guidance (हिंदी)', hi: 'मार्गदर्शन सुनिए' },
  stop: { en: 'Stop', hi: 'रोकें' },
  listening: { en: 'Speaking...', hi: 'बोल रहा है...' },

  fieldMode: { en: 'ASHA Worker / NGO Field Mode', hi: 'आशा कार्यकर्ता / NGO फील्ड मोड' },
  fieldSubtitle: {
    en: 'Rapidly assess multiple households and compare vulnerability',
    hi: 'एक से अधिक घरों का मूल्यांकन करें और तुलना करें',
  },
  savedHouseholds: { en: 'Saved Households', hi: 'सहेजे गए घर' },
  compare: { en: 'Compare', hi: 'तुलना करें' },
  compareSelected: { en: 'Compare Selected', hi: 'चयनित तुलना करें' },
  noHouseholds: { en: 'No households saved yet', hi: 'अभी तक कोई घर सहेजा नहीं गया' },
  selectToCompare: { en: 'Select 2-3 households to compare', hi: 'तुलना के लिए 2-3 घर चुनें' },
  priorityRank: { en: 'Priority', hi: 'प्राथमिकता' },
  coolingKitFirst: {
    en: 'Cooling kit distribution priority',
    hi: 'कूलिंग किट वितरण प्राथमिकता',
  },
  addHousehold: { en: 'Add Household', hi: 'घर जोड़ें' },
  delete: { en: 'Delete', hi: 'हटाएं' },
  view: { en: 'View', hi: 'देखें' },
  edit: { en: 'Edit', hi: 'संपादित करें' },
  close: { en: 'Close', hi: 'बंद करें' },

  cardTitle: { en: 'Heatwave Outreach Card', hi: 'लू आउटरीच कार्ड' },
  cardSubtitle: {
    en: 'Personalised Emergency Preparedness Summary',
    hi: 'व्यक्तिगत आपातकालीन तैयारी सारांश',
  },
  print: { en: 'Print / Save PDF', hi: 'प्रिंट / PDF सहेजें' },
  generateCard: {
    en: 'Generate from Latest Assessment',
    hi: 'नवीनतम मूल्यांकन से बनाएं',
  },
  helpline: { en: 'Emergency Helplines', hi: 'आपातकालीन हेल्पलाइन' },
  ambulance: { en: 'Ambulance', hi: 'एम्बुलेंस' },
  ndma: { en: 'NDMA Heatwave Helpline', hi: 'NDMA लू हेल्पलाइन' },
  disaster: { en: 'Disaster Management', hi: 'आपदा प्रबंधन' },
  police: { en: 'Police', hi: 'पुलिस' },
  household: { en: 'Household', hi: 'घर' },
  location: { en: 'Location', hi: 'स्थान' },
  score: { en: 'Score', hi: 'स्कोर' },
  keyActions: { en: 'Key Actions', hi: 'मुख्य कार्य' },
  noAssessment: {
    en: 'No assessment available. Complete an assessment first.',
    hi: 'कोई मूल्यांकन उपलब्ध नहीं। पहले मूल्यांकन पूरा करें।',
  },
  goAssess: { en: 'Go to Assessment', hi: 'मूल्यांकन पर जाएं' },

  language: { en: 'English', hi: 'हिंदी' },
  hindiMode: { en: 'हिंदी', hi: 'English' },
} as const;

export type TranslationKey = keyof typeof t;

export function tr(key: TranslationKey, lang: Lang): string {
  return t[key][lang];
}
