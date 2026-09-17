import React, { useState, useEffect } from 'react';
import { usePds } from '../context/PdsContext';
import {
  ChevronLeft,
  ChevronRight,
  Presentation,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code2,
  Database,
  Users,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { getTranslation } from '../utils/i18n';

export const DeckPage: React.FC = () => {
  const { language, setActiveView } = usePds();
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const isMl = language === 'ml';

  const totalSlides = 8;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlide((prev) => Math.min(totalSlides, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(1, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const slideTitles = [
    '1. Challenge Selected and Why',
    '2. Who Has This Problem & Current Reality',
    '3. What We Built - One Clear Sentence',
    '4. Live Product Architecture & Features',
    '5. How It Works - Architecture, Stack & Data',
    '6. What Works Now and What Does Not',
    '7. What We Would Improve With Two More Weeks',
    '8. Team Details & Submission Information',
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Deck Control Header */}
      <div className="bg-[#0F2942] text-white p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderRadius: '6px' }}>
        <div>
          <div className="flex items-center gap-2">
            <Presentation className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
              ANAVANDI 2026 • SELECTION ROUND DECK
            </span>
          </div>
          <h1 className="text-lg font-bold text-white mt-1">
            Challenge SC-09: Ration Shop Stock Visibility
          </h1>
        </div>

        {/* Slide Counter & Prev/Next */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            disabled={currentSlide === 1}
            onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
            className="p-1.5 bg-slate-800 text-white disabled:opacity-30 hover:bg-slate-700 border border-slate-700"
            style={{ borderRadius: '4px' }}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-mono text-xs font-bold text-slate-200 px-2">
            Slide {currentSlide} of {totalSlides}
          </span>

          <button
            type="button"
            disabled={currentSlide === totalSlides}
            onClick={() => setCurrentSlide((prev) => Math.min(totalSlides, prev + 1))}
            className="p-1.5 bg-slate-800 text-white disabled:opacity-30 hover:bg-slate-700 border border-slate-700"
            style={{ borderRadius: '4px' }}
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Navigation Thumbnails */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-xs font-mono">
        {slideTitles.map((title, idx) => {
          const slideNum = idx + 1;
          const isActive = currentSlide === slideNum;
          return (
            <button
              key={slideNum}
              type="button"
              onClick={() => setCurrentSlide(slideNum)}
              className={`py-1.5 px-1 border text-center transition-colors truncate ${
                isActive
                  ? 'bg-blue-700 text-white font-bold border-blue-800'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              style={{ borderRadius: '3px' }}
              title={title}
            >
              Slide {slideNum}
            </button>
          );
        })}
      </div>

      {/* Main Active Slide Display Card */}
      <div
        className="bg-white border border-slate-300 p-8 sm:p-12 shadow-sm min-h-[500px] flex flex-col justify-between"
        style={{ borderRadius: '6px' }}
      >
        <div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <span className="text-xs font-mono font-bold text-blue-700 tracking-wider uppercase">
              Slide 0{currentSlide} • {slideTitles[currentSlide - 1]}
            </span>
            <span className="text-xs font-mono text-slate-400">ANAVANDI 2026 Evaluation Framework</span>
          </div>

          {/* SLIDE 1: Challenge Selected and Why */}
          {currentSlide === 1 && (
            <div className="space-y-6">
              <div>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300" style={{ borderRadius: '2px' }}>
                  TRACK 3: PUBLIC WELFARE • SC-09
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  Ration Shop Stock Visibility: Restoring Dignity &amp; Certainty to PDS Access
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-4 bg-slate-50 border border-slate-200 space-y-2" style={{ borderRadius: '4px' }}>
                  <h3 className="text-sm font-bold text-slate-900">Why This Challenge?</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Public Distribution System (PDS) provides life-sustaining food grain rations to over 80 crore Indians, including 3.5+ crore cardholders in Kerala. Yet, the physical delivery chain remains a daily gamble for vulnerable households.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 space-y-2" style={{ borderRadius: '4px' }}>
                  <h3 className="text-sm font-bold text-slate-900">Critical Drivers</h3>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                    <li>
                      <strong>The Mobility Penalty:</strong> Rural cardholders spend ₹40–₹80 on auto/bus fares only to discover Atta or Kerosene hasn't arrived.
                    </li>
                    <li>
                      <strong>Information Asymmetry:</strong> Only dealers and godown drivers know when truck shipments arrive; citizens are left in the dark.
                    </li>
                    <li>
                      <strong>Dealer Burden:</strong> Dealerships spend hours fielding anxious calls ("Stock ethiyo?") instead of handling efficient distribution.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: Who has this problem and what they do today */}
          {currentSlide === 2 && (
            <div className="space-y-6">
              <div>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300" style={{ borderRadius: '2px' }}>
                  FIELD EMPATHY &amp; CURRENT REALITY
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  Who Faces This Problem and How They Cope Today
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 border border-slate-200 bg-slate-50 space-y-2" style={{ borderRadius: '4px' }}>
                  <span className="font-bold text-slate-900 block text-sm">1. Rural &amp; Elderly Cardholders</span>
                  <p className="text-slate-600 leading-relaxed">
                    AAY (Yellow) and PHH (Pink) cardholders, especially elderly citizens living 2–5 km away in villages like Kanjirappally, Ponkunnam, and Erumeli.
                  </p>
                  <div className="pt-2 border-t border-slate-200 font-semibold text-slate-800">
                    Current Action: Walk or take morning bus on blind guesswork; wait in 45-min queues; return empty-handed if shipment is delayed.
                  </div>
                </div>

                <div className="p-4 border border-slate-200 bg-slate-50 space-y-2" style={{ borderRadius: '4px' }}>
                  <span className="font-bold text-slate-900 block text-sm">2. Daily-Wage Workers</span>
                  <p className="text-slate-600 leading-relaxed">
                    NPS (Blue) cardholders who must forfeit half a day's wages (₹400–₹600) to collect monthly wheat flour and rice.
                  </p>
                  <div className="pt-2 border-t border-slate-200 font-semibold text-slate-800">
                    Current Action: Rely on rumors, informal WhatsApp neighborhood messages, or repeated calls to the shopkeeper's personal mobile.
                  </div>
                </div>

                <div className="p-4 border border-slate-200 bg-slate-50 space-y-2" style={{ borderRadius: '4px' }}>
                  <span className="font-bold text-slate-900 block text-sm">3. Ration Dealerships (ARDs)</span>
                  <p className="text-slate-600 leading-relaxed">
                    Shop licensees who receive FCI shipments without fixed schedule and face frustrated cardholder accusations when items run out.
                  </p>
                  <div className="pt-2 border-t border-slate-200 font-semibold text-slate-800">
                    Current Action: Manually write on blackboards outside the shop; deal with angry crowds whenever ePOS server goes offline.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: What you built - one clear sentence */}
          {currentSlide === 3 && (
            <div className="space-y-8 my-auto py-8">
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300" style={{ borderRadius: '2px' }}>
                CORE VALUE PROPOSITION
              </span>

              <div className="p-8 bg-slate-50 border-l-4 border-blue-700 border-t border-r border-b border-slate-300" style={{ borderRadius: '4px' }}>
                <p className="text-xl sm:text-2xl font-serif text-slate-900 font-semibold leading-relaxed">
                  "RationMitra is a bilingual civic web application that provides real-time, card-specific commodity stock visibility across nearby Kerala ration shops, verifies inventory through official FCI delivery challans and crowdsourced ePOS transaction receipts, and automatically notifies subscribed households the moment critical items arrive."
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Stock display for 6+ local dealerships</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Two-sided update flow (Citizen + Dealer)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tri-factor mathematical trust engine</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: Live product screenshots */}
          {currentSlide === 4 && (
            <div className="space-y-6">
              <div>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300" style={{ borderRadius: '2px' }}>
                  PRODUCT WALKTHROUGH &amp; FLOWS
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  Deployed Prototype Features &amp; User Journeys
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="border border-slate-300 p-4 bg-slate-50" style={{ borderRadius: '4px' }}>
                  <span className="font-bold text-slate-900 block text-sm mb-1">
                    A. Multi-Shop Grid &amp; Card Filter
                  </span>
                  <p className="text-slate-600 leading-relaxed mb-3">
                    Citizens search by ARD or Taluk and toggle their card colour (Yellow, Pink, Blue, White) to see exactly what is available for their specific entitlement.
                  </p>
                  <div className="p-2 bg-white border border-slate-200 font-mono text-[11px] text-slate-700">
                    Live Status • ePOS Machine Status • Queue Estimator • Distances
                  </div>
                </div>

                <div className="border border-slate-300 p-4 bg-slate-50" style={{ borderRadius: '4px' }}>
                  <span className="font-bold text-slate-900 block text-sm mb-1">
                    B. Two-Sided Update Engine
                  </span>
                  <p className="text-slate-600 leading-relaxed mb-3">
                    Cardholders submit ground reports in 30 seconds with ePOS slip corroboration. Dealers log truck Delivery Challans (DC) with instant arrival broadcasts.
                  </p>
                  <div className="p-2 bg-white border border-slate-200 font-mono text-[11px] text-slate-700">
                    Citizen Form (/report) • PIN-Protected Dealer Portal (/dealer)
                  </div>
                </div>

                <div className="border border-slate-300 p-4 bg-slate-50" style={{ borderRadius: '4px' }}>
                  <span className="font-bold text-slate-900 block text-sm mb-1">
                    C. Tri-Factor Trust Verification
                  </span>
                  <p className="text-slate-600 leading-relaxed mb-3">
                    Prevents fake reports: Scores weight FCI Challans (40%), Receipt Corroborations (35%), and Freshness (25%) with automatic discrepancy dispute flagging.
                  </p>
                  <div className="p-2 bg-white border border-slate-200 font-mono text-[11px] text-slate-700">
                    Full Public Audit Trail • Dispute Escrow Flagging
                  </div>
                </div>

                <div className="border border-slate-300 p-4 bg-slate-50" style={{ borderRadius: '4px' }}>
                  <span className="font-bold text-slate-900 block text-sm mb-1">
                    D. Household Arrival Notifications
                  </span>
                  <p className="text-slate-600 leading-relaxed mb-3">
                    Cardholders subscribe via WhatsApp, SMS, or Browser Push. The moment a dealer logs an inbound delivery, subscribers receive instant alerts.
                  </p>
                  <div className="p-2 bg-white border border-slate-200 font-mono text-[11px] text-slate-700">
                    In-App Notification Center • Web Push Integration
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: How it works - architecture, stack and data */}
          {currentSlide === 5 && (
            <div className="space-y-6">
              <div>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300" style={{ borderRadius: '2px' }}>
                  TECHNICAL ARCHITECTURE &amp; DATA ENGINE
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  System Architecture, Technology Stack &amp; Schema
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="border border-slate-300 p-4 bg-slate-50 space-y-2" style={{ borderRadius: '4px' }}>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Code2 className="w-4 h-4 text-blue-700" />
                    <span>Frontend &amp; UX</span>
                  </div>
                  <ul className="text-slate-700 space-y-1">
                    <li>• <strong>Framework:</strong> React 18, Vite 8, TypeScript</li>
                    <li>• <strong>Styling:</strong> Tailwind CSS v4 (Strict civic-tech tokens, zero vibe-coding)</li>
                    <li>• <strong>Localization:</strong> Native English &amp; മലയാളം i18n engine</li>
                    <li>• <strong>Accessibility:</strong> Semantic HTML5, high-contrast palette</li>
                  </ul>
                </div>

                <div className="border border-slate-300 p-4 bg-slate-50 space-y-2" style={{ borderRadius: '4px' }}>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Database className="w-4 h-4 text-emerald-700" />
                    <span>State &amp; Persistence</span>
                  </div>
                  <ul className="text-slate-700 space-y-1">
                    <li>• <strong>Offline-First:</strong> Resilient localStorage engine that maintains functionality during rural network drops</li>
                    <li>• <strong>Schema:</strong> Normalized RationShop, StockItem, AuditEntry, AlertSubscription entities</li>
                    <li>• <strong>Event Loop:</strong> Reactive notification dispatch upon dealer inventory events</li>
                  </ul>
                </div>

                <div className="border border-slate-300 p-4 bg-slate-50 space-y-2" style={{ borderRadius: '4px' }}>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Shield className="w-4 h-4 text-amber-700" />
                    <span>Trust Algorithm</span>
                  </div>
                  <div className="font-mono text-[11px] bg-white p-2 border border-slate-200 text-slate-800">
                    Trust = 40(DC) + 35(Receipts) + 25(Freshness) - 22(Disputes)
                  </div>
                  <p className="text-[11px] text-slate-600">
                    If disputes &ge; 2, auto-flags as "Disputed" to protect consumers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 6: What works now and what does not */}
          {currentSlide === 6 && (
            <div className="space-y-6">
              <div>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300" style={{ borderRadius: '2px' }}>
                  HONEST STATUS &amp; CAPABILITY AUDIT
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  What Works Now and What Does Not
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-5 border border-emerald-300 bg-emerald-50/40 space-y-3" style={{ borderRadius: '4px' }}>
                  <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <span>What Works in This Prototype</span>
                  </div>
                  <ul className="space-y-2 text-slate-800">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>Real-time multi-shop inventory search across 6 Kottayam ARDs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>Card-specific entitlement filtering (Yellow, Pink, Blue, White)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>Two-sided update workflows (Citizen report + Dealer console)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>Tri-factor mathematical trust scoring and public audit logs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>Stock arrival alert subscription &amp; simulated instant dispatch</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>Full English &amp; Malayalam bilingual localization</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 border border-amber-300 bg-amber-50/40 space-y-3" style={{ borderRadius: '4px' }}>
                  <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
                    <AlertCircle className="w-5 h-5 text-amber-700" />
                    <span>Current Constraints &amp; Limitations</span>
                  </div>
                  <ul className="space-y-2 text-slate-800">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold">!</span>
                      <span>
                        <strong>Direct NIC ePOS Server API:</strong> Production ePOS machines run on a closed state NIC intranet requiring official government MoUs.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold">!</span>
                      <span>
                        <strong>Basic Feature Phone USSD:</strong> Current prototype is mobile-web; feature phones require telecom gateway integration (*99#).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold">!</span>
                      <span>
                        <strong>Physical Weight Sensor Integration:</strong> Grain weighing scale IoT sync is simulated rather than hardware-connected.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 7: What you would improve with two more weeks */}
          {currentSlide === 7 && (
            <div className="space-y-6">
              <div>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300" style={{ borderRadius: '2px' }}>
                  FUTURE ROADMAP &amp; SCALING
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  What We Would Build With Two More Weeks
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 border border-slate-200 bg-slate-50 space-y-1.5" style={{ borderRadius: '4px' }}>
                  <span className="font-bold text-slate-900 text-sm block">
                    1. Direct NIC ePOS API Integration &amp; Webhooks
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    Build bi-directional webhooks with the National Informatics Centre (NIC) Kerala PDS server to automatically decrement stock as biometric transactions occur at the counter.
                  </p>
                </div>

                <div className="p-4 border border-slate-200 bg-slate-50 space-y-1.5" style={{ borderRadius: '4px' }}>
                  <span className="font-bold text-slate-900 text-sm block">
                    2. USSD &amp; IVR Voice Bot for Feature Phones
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    Cardholders without smartphones can dial a toll-free number or USSD code in Malayalam ("പ്രസ് 1 ഫോർ മട്ട അരി") to hear live availability at their mapped dealership.
                  </p>
                </div>

                <div className="p-4 border border-slate-200 bg-slate-50 space-y-1.5" style={{ borderRadius: '4px' }}>
                  <span className="font-bold text-slate-900 text-sm block">
                    3. WhatsApp Business API Bot
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    Allow citizens to send a 1-word message like "ARD 104" on WhatsApp to receive an instant stock sheet without installing an app.
                  </p>
                </div>

                <div className="p-4 border border-slate-200 bg-slate-50 space-y-1.5" style={{ borderRadius: '4px' }}>
                  <span className="font-bold text-slate-900 text-sm block">
                    4. Supplyco Godown Predictive Dispatch Model
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    Analyze historic consumption rates per ward to alert the Taluk Supply Officer 3 days before critical wheat or rice exhaustion occurs.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 8: Team names, institution and contact details */}
          {currentSlide === 8 && (
            <div className="space-y-6">
              <div>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-[#0F2942] text-white" style={{ borderRadius: '2px' }}>
                  SELECTION SUBMISSION DETAILS
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  Team &amp; Institutional Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="border border-slate-300 p-5 bg-slate-50 space-y-3" style={{ borderRadius: '4px' }}>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Institution
                  </span>
                  <div className="text-sm font-bold text-slate-900">
                    Amal Jyothi College of Engineering (AJCE)
                  </div>
                  <p className="text-slate-600">
                    Kanjirappally, Koovappally P.O., Kottayam, Kerala - 686518
                  </p>
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                    Autonomous Engineering College • Affiliated to APJ Abdul Kalam Technological University
                  </div>
                </div>

                <div className="border border-slate-300 p-5 bg-slate-50 space-y-3" style={{ borderRadius: '4px' }}>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Team Composition (2 Members)
                  </span>
                  <div className="space-y-2">
                    <div>
                      <div className="font-bold text-slate-900">Lead Developer &amp; Architect: Joyel</div>
                      <div className="text-slate-600">Department of Computer Science &amp; Engineering, AJCE</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Co-Developer: Team Partner</div>
                      <div className="text-slate-600">Department of Computer Science &amp; Engineering, AJCE</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 text-xs text-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderRadius: '4px' }}>
                <div>
                  <span className="font-bold block">Submission Readiness:</span>
                  <span>Form link: forms.gle/iPRFq7zTfPL84Dqq9 • Selection Round Target: 19 September 2026</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView('HOME')}
                  className="px-4 py-2 bg-blue-700 text-white font-bold hover:bg-blue-800 transition-colors self-start sm:self-auto"
                  style={{ borderRadius: '4px' }}
                >
                  Open Live Prototype
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Slide Bottom Bar Controls */}
        <div className="border-t border-slate-200 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>Use Left / Right arrow keys to navigate slides</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentSlide === 1}
              onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-30"
              style={{ borderRadius: '4px' }}
            >
              Previous Slide
            </button>
            <button
              type="button"
              disabled={currentSlide === totalSlides}
              onClick={() => setCurrentSlide((prev) => Math.min(totalSlides, prev + 1))}
              className="px-3 py-1.5 bg-[#0F2942] text-white hover:bg-slate-800 disabled:opacity-30"
              style={{ borderRadius: '4px' }}
            >
              Next Slide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
