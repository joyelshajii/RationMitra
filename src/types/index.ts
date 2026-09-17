export type CardType = 'AAY_YELLOW' | 'PHH_PINK' | 'NPS_BLUE' | 'NPNS_WHITE';

export interface CardTypeInfo {
  type: CardType;
  code: string;
  nameEn: string;
  nameMl: string;
  colorHex: string;
  borderHex: string;
  bgHex: string;
  textHex: string;
  description: string;
}

export type CommodityId =
  | 'matta_rice'
  | 'raw_rice'
  | 'wheat'
  | 'atta'
  | 'sugar'
  | 'kerosene'
  | 'subhiksha_kit';

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'EXHAUSTED' | 'AWAITING_SUPPLY';

export type TrustLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'DISPUTED';

export interface AuditEntry {
  id: string;
  timestamp: string;
  reporterType: 'DEALER' | 'CARDHOLDER' | 'INSPECTOR';
  reporterLabel: string;
  action: string;
  details: string;
  referenceProof?: string;
  trustImpact: number;
}

export interface StockItem {
  id: CommodityId;
  nameEn: string;
  nameMl: string;
  unit: string;
  quantityAvailable: number;
  thresholdLow: number;
  status: StockStatus;
  eligibleCards: CardType[];
  subsidyRatePerKg: string;
  lastUpdated: string;
  lastChallanNo?: string;
  lastChallanDate?: string;
  trustScore: number; // 0 to 100
  trustLevel: TrustLevel;
  verifiedReportsCount: number;
  disputeCount: number;
  verificationHistory: AuditEntry[];
}

export interface RationShop {
  id: string;
  ardNumber: string;
  nameEn: string;
  nameMl: string;
  licensee: string;
  taluk: string;
  district: string;
  ward: string;
  pincode: string;
  addressEn: string;
  addressMl: string;
  phone: string;
  coordinates: { lat: number; lng: number };
  distanceKm: number;
  isOpen: boolean;
  openingHours: string;
  eposStatus: 'ONLINE' | 'SLOW' | 'OFFLINE';
  eposLastSynced: string;
  queueEstimateMinutes: number;
  dealerPin: string;
  stock: StockItem[];
  lastAuditDate: string;
}

export interface CitizenReport {
  id: string;
  shopId: string;
  shopName: string;
  commodityId: CommodityId;
  commodityName: string;
  statusReported: StockStatus | 'EPOS_DOWN' | 'LONG_QUEUE';
  cardType: CardType;
  receiptNumber?: string;
  timestamp: string;
  reporterPhoneMasked: string;
  notes?: string;
  trustScoreAssigned: number;
}

export interface AlertSubscription {
  id: string;
  shopId: string;
  shopName: string;
  commodityId: CommodityId;
  commodityName: string;
  cardholderPhone: string;
  channel: 'SMS' | 'WHATSAPP' | 'WEB_PUSH';
  createdAt: string;
  active: boolean;
}

export interface SystemNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  shopId: string;
  commodityId: CommodityId;
  read: boolean;
  priority: 'NORMAL' | 'URGENT';
}

export type Language = 'en' | 'ml';
