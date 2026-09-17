import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  RationShop,
  CardType,
  CommodityId,
  CitizenReport,
  AlertSubscription,
  SystemNotification,
  Language,
  StockItem,
  StockStatus,
} from '../types';
import { INITIAL_SHOPS } from '../data/seedData';
import { calculateTrustScore } from '../utils/trustCalculator';

interface PdsContextType {
  shops: RationShop[];
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedCardType: CardType | 'ALL';
  setSelectedCardType: (card: CardType | 'ALL') => void;
  selectedTaluk: string;
  setSelectedTaluk: (taluk: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeView: 'HOME' | 'SHOP_DETAIL' | 'REPORT' | 'DEALER' | 'DECK' | 'PRIVACY' | 'TERMS';
  setActiveView: (view: 'HOME' | 'SHOP_DETAIL' | 'REPORT' | 'DEALER' | 'DECK' | 'PRIVACY' | 'TERMS') => void;
  selectedShopId: string | null;
  setSelectedShopId: (id: string | null) => void;
  auditModalItem: { shop: RationShop; item: StockItem } | null;
  setAuditModalItem: (val: { shop: RationShop; item: StockItem } | null) => void;
  subscribeModalData: { shop: RationShop; item?: StockItem } | null;
  setSubscribeModalData: (val: { shop: RationShop; item?: StockItem } | null) => void;
  reports: CitizenReport[];
  subscriptions: AlertSubscription[];
  notifications: SystemNotification[];
  unreadCount: number;
  addCitizenReport: (report: {
    shopId: string;
    commodityId: CommodityId;
    statusReported: any;
    cardType: CardType;
    receiptNumber?: string;
    notes?: string;
    phoneMasked?: string;
  }) => void;
  updateDealerStock: (
    shopId: string,
    commodityId: CommodityId,
    newQuantity: number,
    challanNo?: string,
    actionNotes?: string
  ) => void;
  toggleShopOpenStatus: (shopId: string, isOpen: boolean) => void;
  updateEposHealth: (shopId: string, status: 'ONLINE' | 'SLOW' | 'OFFLINE') => void;
  addSubscription: (sub: {
    shopId: string;
    commodityId: CommodityId;
    phone: string;
    channel: 'SMS' | 'WHATSAPP' | 'WEB_PUSH';
  }) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  resetToSeedData: () => void;
}

const PdsContext = createContext<PdsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_SHOPS = 'pds_kerala_shops_v1';
const LOCAL_STORAGE_KEY_LANG = 'pds_kerala_lang_v1';
const LOCAL_STORAGE_KEY_REPORTS = 'pds_kerala_reports_v1';
const LOCAL_STORAGE_KEY_SUBS = 'pds_kerala_subs_v1';
const LOCAL_STORAGE_KEY_NOTIFS = 'pds_kerala_notifs_v1';

export const PdsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shops, setShops] = useState<RationShop[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SHOPS);
      return saved ? JSON.parse(saved) : INITIAL_SHOPS;
    } catch {
      return INITIAL_SHOPS;
    }
  });

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_LANG);
      return (saved as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  const [selectedCardType, setSelectedCardType] = useState<CardType | 'ALL'>('ALL');
  const [selectedTaluk, setSelectedTaluk] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeView, setActiveView] = useState<'HOME' | 'SHOP_DETAIL' | 'REPORT' | 'DEALER' | 'DECK' | 'PRIVACY' | 'TERMS'>('HOME');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);

  const [auditModalItem, setAuditModalItem] = useState<{ shop: RationShop; item: StockItem } | null>(null);
  const [subscribeModalData, setSubscribeModalData] = useState<{ shop: RationShop; item?: StockItem } | null>(null);

  const [reports, setReports] = useState<CitizenReport[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_REPORTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [subscriptions, setSubscriptions] = useState<AlertSubscription[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SUBS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'notif-welcome',
        title: 'Ration Stock Watch Alert System',
        body: 'Subscribed cardholders receive instant SMS / Web notifications when incoming FCI or mill deliveries are verified by dealers.',
        timestamp: new Date().toISOString(),
        shopId: 'ARD-104',
        commodityId: 'matta_rice',
        read: false,
        priority: 'NORMAL',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SHOPS, JSON.stringify(shops));
    } catch (e) {
      console.warn('Failed to save shops to localStorage', e);
    }
  }, [shops]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.warn('Failed to save reports to localStorage', e);
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SUBS, JSON.stringify(subscriptions));
    } catch (e) {
      console.warn('Failed to save subs to localStorage', e);
    }
  }, [subscriptions]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications to localStorage', e);
    }
  }, [notifications]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LOCAL_STORAGE_KEY_LANG, lang);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const resetToSeedData = () => {
    setShops(INITIAL_SHOPS);
    setReports([]);
    setSubscriptions([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY_SHOPS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_REPORTS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_SUBS);
  };

  const addCitizenReport = (input: {
    shopId: string;
    commodityId: CommodityId;
    statusReported: any;
    cardType: CardType;
    receiptNumber?: string;
    notes?: string;
    phoneMasked?: string;
  }) => {
    const targetShop = shops.find((s) => s.id === input.shopId);
    const targetItem = targetShop?.stock.find((st) => st.id === input.commodityId);
    const shopName = targetShop ? `${targetShop.ardNumber} - ${targetShop.nameEn}` : input.shopId;
    const itemName = targetItem?.nameEn || input.commodityId;

    const newReport: CitizenReport = {
      id: `rep-${Date.now()}`,
      shopId: input.shopId,
      shopName,
      commodityId: input.commodityId,
      commodityName: itemName,
      statusReported: input.statusReported,
      cardType: input.cardType,
      receiptNumber: input.receiptNumber,
      timestamp: new Date().toISOString(),
      reporterPhoneMasked: input.phoneMasked || '+91 98•••• 1234',
      notes: input.notes,
      trustScoreAssigned: input.receiptNumber ? 20 : 10,
    };

    setReports((prev) => [newReport, ...prev]);

    // Update shop stock verification metrics
    setShops((prevShops) =>
      prevShops.map((shop) => {
        if (shop.id !== input.shopId) return shop;

        const updatedStock = shop.stock.map((item) => {
          if (item.id !== input.commodityId) return item;

          const isExhaustedReport = input.statusReported === 'EXHAUSTED';
          const newDisputeCount = isExhaustedReport && item.status === 'IN_STOCK' ? item.disputeCount + 1 : item.disputeCount;
          const newVerifiedCount = input.receiptNumber ? item.verifiedReportsCount + 1 : item.verifiedReportsCount;

          const trustEval = calculateTrustScore(
            new Date().toISOString(),
            Boolean(item.lastChallanNo),
            item.lastChallanDate,
            newVerifiedCount,
            newDisputeCount
          );

          let newStatus: StockStatus = item.status;
          if (newDisputeCount >= 2) {
            // Disputed state
          } else if (isExhaustedReport && !item.lastChallanNo) {
            newStatus = 'EXHAUSTED';
          }

          const newAuditEntry = {
            id: `audit-${Date.now()}`,
            timestamp: new Date().toISOString(),
            reporterType: 'CARDHOLDER' as const,
            reporterLabel: `Cardholder (${input.cardType.split('_')[0]})`,
            action: input.statusReported,
            details: input.notes || (input.receiptNumber ? `ePOS slip #${input.receiptNumber} verified` : 'Walk-in visit report'),
            referenceProof: input.receiptNumber,
            trustImpact: input.receiptNumber ? 10 : 5,
          };

          return {
            ...item,
            status: newStatus,
            trustScore: trustEval.score,
            trustLevel: trustEval.level,
            verifiedReportsCount: newVerifiedCount,
            disputeCount: newDisputeCount,
            verificationHistory: [newAuditEntry, ...item.verificationHistory],
          };
        });

        return {
          ...shop,
          stock: updatedStock,
        };
      })
    );
  };

  const updateDealerStock = (
    shopId: string,
    commodityId: CommodityId,
    newQuantity: number,
    challanNo?: string,
    actionNotes?: string
  ) => {
    const nowIso = new Date().toISOString();

    setShops((prevShops) =>
      prevShops.map((shop) => {
        if (shop.id !== shopId) return shop;

        const updatedStock = shop.stock.map((item) => {
          if (item.id !== commodityId) return item;

          const newStatus: StockStatus =
            newQuantity === 0 ? 'EXHAUSTED' : newQuantity <= item.thresholdLow ? 'LOW_STOCK' : 'IN_STOCK';

          const trustEval = calculateTrustScore(
            nowIso,
            Boolean(challanNo || item.lastChallanNo),
            challanNo ? nowIso : item.lastChallanDate,
            item.verifiedReportsCount,
            0 // reset disputes upon official dealer delivery log
          );

          const newAuditEntry = {
            id: `audit-dealer-${Date.now()}`,
            timestamp: nowIso,
            reporterType: 'DEALER' as const,
            reporterLabel: `Dealer ${shop.licensee} (${shop.ardNumber})`,
            action: `Inventory Updated: ${newQuantity} ${item.unit}`,
            details: actionNotes || (challanNo ? `Supplyco Delivery Challan logged` : `Counter physical stock count updated`),
            referenceProof: challanNo || item.lastChallanNo,
            trustImpact: challanNo ? 40 : 25,
          };

          return {
            ...item,
            quantityAvailable: newQuantity,
            status: newStatus,
            lastUpdated: nowIso,
            lastChallanNo: challanNo || item.lastChallanNo,
            lastChallanDate: challanNo ? nowIso : item.lastChallanDate,
            trustScore: trustEval.score,
            trustLevel: trustEval.level,
            disputeCount: 0,
            verificationHistory: [newAuditEntry, ...item.verificationHistory],
          };
        });

        return {
          ...shop,
          stock: updatedStock,
        };
      })
    );

    // Notify cardholders subscribed to this item and shop!
    const targetShop = shops.find((s) => s.id === shopId);
    const targetItem = targetShop?.stock.find((s) => s.id === commodityId);
    const itemName = targetItem?.nameEn || commodityId;
    const shopArd = targetShop?.ardNumber || shopId;

    // Check matching subscriptions
    const matchingSubs = subscriptions.filter(
      (sub) => (sub.shopId === shopId || sub.shopId === 'ANY_NEARBY') && sub.commodityId === commodityId
    );

    if (newQuantity > 0) {
      const newNotif: SystemNotification = {
        id: `notif-${Date.now()}`,
        title: `Stock Arrival: ${itemName}`,
        body: `${newQuantity} ${targetItem?.unit || 'units'} now available at ${shopArd} (${targetShop?.nameEn || ''}). Challan verified.`,
        timestamp: nowIso,
        shopId,
        commodityId,
        read: false,
        priority: 'URGENT',
      };

      setNotifications((prev) => [newNotif, ...prev]);

      // If browser notification permission granted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(newNotif.title, { body: newNotif.body, icon: '/favicon.svg' });
        } catch {
          // ignore
        }
      }
    }
  };

  const toggleShopOpenStatus = (shopId: string, isOpen: boolean) => {
    setShops((prev) =>
      prev.map((s) => (s.id === shopId ? { ...s, isOpen } : s))
    );
  };

  const updateEposHealth = (shopId: string, eposStatus: 'ONLINE' | 'SLOW' | 'OFFLINE') => {
    setShops((prev) =>
      prev.map((s) =>
        s.id === shopId ? { ...s, eposStatus, eposLastSynced: new Date().toISOString() } : s
      )
    );
  };

  const addSubscription = (sub: {
    shopId: string;
    commodityId: CommodityId;
    phone: string;
    channel: 'SMS' | 'WHATSAPP' | 'WEB_PUSH';
  }) => {
    const targetShop = shops.find((s) => s.id === sub.shopId);
    const targetItem = targetShop?.stock.find((s) => s.id === sub.commodityId);

    const newSub: AlertSubscription = {
      id: `sub-${Date.now()}`,
      shopId: sub.shopId,
      shopName: targetShop ? `${targetShop.ardNumber} - ${targetShop.nameEn}` : 'Nearby Stores',
      commodityId: sub.commodityId,
      commodityName: targetItem?.nameEn || sub.commodityId,
      cardholderPhone: sub.phone,
      channel: sub.channel,
      createdAt: new Date().toISOString(),
      active: true,
    };

    setSubscriptions((prev) => [newSub, ...prev]);

    // Request browser notification permission if WEB_PUSH
    if (sub.channel === 'WEB_PUSH' && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    }

    // Add confirmation notification
    setNotifications((prev) => [
      {
        id: `notif-sub-${Date.now()}`,
        title: 'Alert Activated',
        body: `You will be notified via ${sub.channel} immediately when ${newSub.commodityName} arrives at ${newSub.shopName}.`,
        timestamp: new Date().toISOString(),
        shopId: sub.shopId,
        commodityId: sub.commodityId,
        read: false,
        priority: 'NORMAL',
      },
      ...prev,
    ]);
  };

  return (
    <PdsContext.Provider
      value={{
        shops,
        language,
        setLanguage,
        selectedCardType,
        setSelectedCardType,
        selectedTaluk,
        setSelectedTaluk,
        searchQuery,
        setSearchQuery,
        activeView,
        setActiveView,
        selectedShopId,
        setSelectedShopId,
        auditModalItem,
        setAuditModalItem,
        subscribeModalData,
        setSubscribeModalData,
        reports,
        subscriptions,
        notifications,
        unreadCount,
        addCitizenReport,
        updateDealerStock,
        toggleShopOpenStatus,
        updateEposHealth,
        addSubscription,
        markNotificationRead,
        clearNotifications,
        resetToSeedData,
      }}
    >
      {children}
    </PdsContext.Provider>
  );
};

export const usePds = () => {
  const context = useContext(PdsContext);
  if (!context) {
    throw new Error('usePds must be used within a PdsProvider');
  }
  return context;
};
