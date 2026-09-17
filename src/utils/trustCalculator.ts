import { TrustLevel } from '../types';

export interface TrustEvaluation {
  score: number;
  level: TrustLevel;
  breakdown: {
    challanPoints: number;
    crowdPoints: number;
    freshnessPoints: number;
    disputePenalty: number;
  };
  explanationEn: string;
  explanationMl: string;
}

export function calculateTrustScore(
  lastUpdatedIso: string,
  hasChallan: boolean,
  challanDateIso: string | undefined,
  verifiedReportsCount: number,
  disputeCount: number
): TrustEvaluation {
  const now = new Date().getTime();
  const updateTime = new Date(lastUpdatedIso).getTime();
  const hoursSinceUpdate = Math.max(0, (now - updateTime) / (1000 * 60 * 60));

  // 1. Delivery Challan (DC) Authority (Max 40 pts)
  let challanPoints = 10;
  if (hasChallan && challanDateIso) {
    const daysSinceChallan = (now - new Date(challanDateIso).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceChallan <= 4) {
      challanPoints = 40;
    } else if (daysSinceChallan <= 10) {
      challanPoints = 30;
    } else {
      challanPoints = 20;
    }
  }

  // 2. Crowd / Citizen Receipt Corroboration (Max 35 pts)
  const crowdPoints = Math.min(35, verifiedReportsCount * 9);

  // 3. Freshness Decay (Max 25 pts)
  let freshnessPoints = 0;
  if (hoursSinceUpdate <= 4) {
    freshnessPoints = 25;
  } else if (hoursSinceUpdate <= 12) {
    freshnessPoints = 20;
  } else if (hoursSinceUpdate <= 24) {
    freshnessPoints = 12;
  } else if (hoursSinceUpdate <= 48) {
    freshnessPoints = 5;
  } else {
    freshnessPoints = 0;
  }

  // 4. Dispute Penalty (-20 pts per active counter-report)
  const disputePenalty = disputeCount * 22;

  let rawScore = challanPoints + crowdPoints + freshnessPoints - disputePenalty;
  const score = Math.max(5, Math.min(100, Math.round(rawScore)));

  let level: TrustLevel;
  if (disputeCount >= 2) {
    level = 'DISPUTED';
  } else if (score >= 75) {
    level = 'HIGH';
  } else if (score >= 45) {
    level = 'MEDIUM';
  } else {
    level = 'LOW';
  }

  let explanationEn = '';
  let explanationMl = '';

  if (level === 'DISPUTED') {
    explanationEn = `Flagged: ${disputeCount} cardholders reported item unavailable while official log shows in stock. Escrow review triggered.`;
    explanationMl = `ശ്രദ്ധിക്കുക: ഔദ്യോഗിക കണക്കിൽ സ്റ്റോക്ക് ഉണ്ടെങ്കിലും ${disputeCount} കാർഡുടമകൾ ലഭ്യമല്ലെന്ന് റിപ്പോർട്ട് ചെയ്തു. പരിശോധന പുരോഗമിക്കുന്നു.`;
  } else if (level === 'HIGH') {
    explanationEn = `Official FCI/Supplyco Delivery Challan corroborated by ${verifiedReportsCount} physical cardholder visits within 24h.`;
    explanationMl = `ഔദ്യോഗിക സപ്ലൈകോ ചെല്ലാനും ${verifiedReportsCount} കാർഡുടമകളുടെ രസീത് പരിശോധനയും വഴി സ്ഥിരീകരിച്ചു.`;
  } else if (level === 'MEDIUM') {
    explanationEn = `Logged by dealer; awaiting recent cardholder visit confirmation.`;
    explanationMl = `ഡീലർ രേഖപ്പെടുത്തിയത്; ഉപഭോക്താക്കളുടെ പുതിയ സ്ഥിരീകരണം പ്രതീക്ഷിക്കുന്നു.`;
  } else {
    explanationEn = `Data is older than 24 hours. Verification pending.`;
    explanationMl = `വിവരം 24 മണിക്കൂറിലധികം പഴക്കമുള്ളതാണ്. പുതിയ പരിശോധന ആവശ്യമാണ്.`;
  }

  return {
    score,
    level,
    breakdown: {
      challanPoints,
      crowdPoints,
      freshnessPoints,
      disputePenalty,
    },
    explanationEn,
    explanationMl,
  };
}
