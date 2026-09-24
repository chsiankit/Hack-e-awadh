import type {
  ActionCategory,
  HouseholdInput,
  RiskAssessment,
  RiskFactor,
  RiskLevel,
} from './types';

function housingRisk(type: string): number {
  switch (type) {
    case 'tin_roof':
      return 28;
    case 'mud_house':
      return 18;
    case 'concrete':
      return 8;
    default:
      return 10;
  }
}

function coolingRisk(assets: string[]): number {
  if (assets.includes('ac')) return 2;
  if (assets.includes('cooler')) return 8;
  if (assets.includes('fan')) return 15;
  return 30;
}

function waterRisk(source: string): number {
  switch (source) {
    case 'piped':
      return 3;
    case 'borewell':
      return 8;
    case 'tanker':
      return 15;
    case 'none':
      return 25;
    default:
      return 10;
  }
}

function occupantRisk(seniors: number, children: number, outdoor: number): number {
  return Math.min(40, seniors * 12 + children * 8 + outdoor * 7);
}

export function assessRisk(input: HouseholdInput): RiskAssessment {
  const factors: RiskFactor[] = [];

  const hRisk = housingRisk(input.housing_type);
  if (hRisk >= 18) {
    factors.push({
      label: `${input.housing_type === 'tin_roof' ? 'Tin roof' : 'Mud house'} traps heat, raising indoor temperature`,
      labelHi:
        input.housing_type === 'tin_roof'
          ? 'टिन की छत गर्मी फँसाती है, घर का तापमान बढ़ाती है'
          : 'कच्चा घर गर्मी फँसाता है, तापमान बढ़ाता है',
      severity: hRisk >= 25 ? 'high' : 'medium',
    });
  }

  const cRisk = coolingRisk(input.cooling_assets);
  if (cRisk >= 15) {
    factors.push({
      label: 'No effective cooling — AC or cooler strongly recommended',
      labelHi: 'कूलिंग का अभाव — एसी या कूलर अत्यंत आवश्यक',
      severity: cRisk >= 25 ? 'high' : 'medium',
    });
  }

  const wRisk = waterRisk(input.water_source);
  if (wRisk >= 15) {
    factors.push({
      label: 'Limited water access increases dehydration risk',
      labelHi: 'पानी की कम पहुंच से निर्जलीकरण का खतरा बढ़ता है',
      severity: wRisk >= 20 ? 'high' : 'medium',
    });
  }

  if (input.seniors > 0) {
    factors.push({
      label: `${input.seniors} senior${input.seniors > 1 ? 's' : ''} (60+) — high vulnerability to heat stress`,
      labelHi: `${input.seniors} बुजुर्ग (60+) — लू से अति संवेदनशील`,
      severity: 'high',
    });
  }

  if (input.children > 0) {
    factors.push({
      label: `${input.children} child${input.children > 1 ? 'ren' : ''} under 5 — susceptible to dehydration`,
      labelHi: `${input.children} बच्चे 5 वर्ष से कम — निर्जलीकरण का खतरा`,
      severity: 'medium',
    });
  }

  if (input.outdoor_workers > 0) {
    factors.push({
      label: `${input.outdoor_workers} outdoor worker${input.outdoor_workers > 1 ? 's' : ''} — direct sun exposure risk`,
      labelHi: `${input.outdoor_workers} बाहरी कार्यकर्ता — सीधे धूप का खतरा`,
      severity: 'high',
    });
  }

  const oRisk = occupantRisk(input.seniors, input.children, input.outdoor_workers);
  const raw = hRisk + cRisk + wRisk + oRisk;
  const score = Math.min(100, Math.round(raw));

  let level: RiskLevel = 'low';
  if (score >= 65) level = 'high';
  else if (score >= 35) level = 'medium';

  factors.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  const actionPlan = buildActionPlan(input, level);

  return { score, level, factors, actionPlan };
}

function buildActionPlan(input: HouseholdInput, level: RiskLevel): ActionCategory[] {
  const immediate: ActionCategory = {
    category: 'immediate',
    title: 'Immediate Actions',
    titleHi: 'तत्काल कार्य',
    items: [],
  };

  if (input.cooling_assets.includes('none') || (!input.cooling_assets.includes('ac') && !input.cooling_assets.includes('cooler'))) {
    immediate.items.push({
      id: 'imm-cooler',
      text: 'Arrange a cooler or fan immediately — prioritize AC if possible',
      textHi: 'तुरंत कूलर या पंखा लगाएं — संभव हो तो एसी जुटाएं',
      done: false,
    });
  }
  if (input.water_source === 'none' || input.water_source === 'tanker') {
    immediate.items.push({
      id: 'imm-water',
      text: 'Stock at least 20 litres of drinking water per person per day',
      textHi: 'प्रति व्यक्ति प्रतिदिन कम से कम 20 लीटर पीने का पानी जमा करें',
      done: false,
    });
  }
  immediate.items.push({
    id: 'imm-hydrate',
    text: 'Ensure everyone drinks water every 30 minutes, even without thirst',
    textHi: 'सबको हर 30 मिनट में पानी पिलाएं, प्यास न हो तब भी',
    done: false,
  });
  if (input.housing_type === 'tin_roof') {
    immediate.items.push({
      id: 'imm-tin',
      text: 'Cover tin roof with tarpaulin or wet jute cloth to reduce heat',
      textHi: 'टिन की छत पर टर्पौलिन या गीली बोरी डालें',
      done: false,
    });
  }
  if (input.seniors > 0 || input.children > 0) {
    immediate.items.push({
      id: 'imm-vulnerable',
      text: 'Keep seniors and children in the coolest room with windows shaded',
      textHi: 'बुजुर्गों और बच्चों को सबसे ठंडे कमरे में रखें',
      done: false,
    });
  }

  const daily: ActionCategory = {
    category: 'daily',
    title: 'Daily Maintenance',
    titleHi: 'दैनिक देखभाल',
    items: [
      {
        id: 'day-curtains',
        text: 'Close curtains/blinds on sun-facing windows between 10 AM – 4 PM',
        textHi: 'दोपहर 10 से 4 बजे धूप वाली खिड़कियों पर पर्दे बंद रखें',
        done: false,
      },
      {
        id: 'day-ors',
        text: 'Prepare ORS (oral rehydration solution) — 1 litre water + 6 tsp sugar + ½ tsp salt',
        textHi: 'ORS बनाएं — 1 लीटर पानी + 6 चम्मच चीनी + ½ चम्मच नमक',
        done: false,
      },
      {
        id: 'day-check',
        text: 'Check on elderly and children twice daily for heat exhaustion symptoms',
        textHi: 'बुजुर्गों और बच्चों को दिन में दो बार जांचें',
        done: false,
      },
      {
        id: 'day-meals',
        text: 'Eat light meals, avoid heavy/oily food, include curd and lemon water',
        textHi: 'हल्का भोजन करें, दही और नींबू पानी शामिल करें',
        done: false,
      },
    ],
  };

  const emergency: ActionCategory = {
    category: 'emergency',
    title: 'Emergency Prep',
    titleHi: 'आपातकालीन तैयारी',
    items: [
      {
        id: 'emg-numbers',
        text: 'Save emergency numbers: 108 (Ambulance), 1070 (NDMA), 112 (Disaster)',
        textHi: 'आपातकालीन नंबर सहेजें: 108 (एम्बुलेंस), 1070 (NDMA), 112 (आपदा)',
        done: false,
      },
      {
        id: 'emg-shade',
        text: 'Identate nearest AC public building or shaded community center for evacuation',
        textHi: 'नजदीकी एसी इमारत या छायादार सामुदायिक केंद्र पहचानें',
        done: false,
      },
      {
        id: 'emg-symptoms',
        text: 'Learn heatstroke signs: high body temp, confusion, no sweating, fainting',
        textHi: 'लू के लक्षण जानें: तेज बुखार, भ्रम, पसीना न आना, बेहोशी',
        done: false,
      },
      {
        id: 'emg-coolkit',
        text: 'Prepare a cooling kit: wet towels, spray bottle, ORS packets, umbrella',
        textHi: 'कूलिंग किट तैयार करें: गीले तौलिए, स्प्रे बोतल, ORS पैकेट, छाता',
        done: false,
      },
    ],
  };

  if (level === 'high') {
    emergency.items.unshift({
      id: 'emg-priority',
      text: 'HIGH RISK: This household should receive cooling kit distribution FIRST',
      textHi: 'उच्च जोखिम: इस घर को सबसे पहले कूलिंग किट दें',
      done: false,
    });
  }

  if (input.outdoor_workers > 0) {
    daily.items.push({
      id: 'day-outdoor',
      text: 'Outdoor workers: start before 10 AM, take 15-min shade breaks hourly',
      textHi: 'बाहरी कार्यकर्ता: 10 बजे से पहले शुरू करें, हर घंटे 15 मिनट छाया में रहें',
      done: false,
    });
  }

  return [immediate, daily, emergency];
}
