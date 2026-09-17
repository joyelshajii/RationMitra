# RationMitra Kerala | റേഷൻമിത്ര കേരള
### Public Distribution System (PDS) Stock Visibility & Credibility Engine

**ANAVANDI 2026 Hackathon Selection Submission**  
**Track 3: Public Welfare • Problem Statement: SC-09 (Ration shop stock visibility)**  
**Institution:** Amal Jyothi College of Engineering (AJCE), Kanjirappally, Kottayam, Kerala  

---

## 1. Challenge Overview (SC-09)

> **Problem Statement:** Cardholders may travel to a ration shop without knowing whether the items they need are available.  
> **Build Requirements:** Create a tool showing current stock at nearby ration shops. Allow shops or cardholders to update the information and notify households when a needed item arrives.  
> **Mandatory Deliverables:** Stock display for several shops, an update method, and a credible way to keep the data trustworthy.

---

## 2. Core Architecture & Features

### 🛒 Multi-Shop Real-Time Stock Grid
- Live inventory visibility across 6 Authorised Ration Dealerships (ARDs) in Kottayam District:
  - **ARD 104** - Kanjirappally Town ARD
  - **ARD 118** - Ponkunnam Market Cooperative ARD
  - **ARD 082** - Erumeli South PDS Centre
  - **ARD 145** - Pala Municipal West ARD
  - **ARD 201** - Kottayam Thirunakkara Central ARD
  - **ARD 067** - Changanassery Market Ward ARD
- Detailed commodity breakdown: Boiled Rice (Matta Ari), White Raw Rice (Pachaari), Whole Wheat, Fortified Atta packets, Subsidized Sugar, and Kerosene.
- **Ration Card Quota Filtering:** Cardholders can filter by their ration card category:
  - **AAY (Yellow Card):** Antyodaya Anna Yojana (Poorest of poor)
  - **PHH (Pink Card):** Priority Households (NFSA free entitlement)
  - **NPS (Blue Card):** Non-Priority Subsidy
  - **NPNS (White Card):** Non-Priority Non-Subsidy

### 🔄 Two-Sided Update Engine
1. **Citizen Crowdsourced Observation Flow (`/report`):**
   - Cardholders can log stock availability in 30 seconds.
   - Status options: *In Stock & Distributing*, *Low Stock (<20%)*, *Exhausted*, *ePOS Terminal Down*, *Heavy Queue (>45 mins)*.
   - High-credibility corroboration: Citizens can enter their paper ePOS transaction slip number (`TXN-KL-EPOS-XXXX`) for verified proof.
2. **Dealer Management Console (`/dealer`):**
   - PIN-secured login per dealership (e.g. ARD 104 PIN: `1040`, ARD 118 PIN: `1180`).
   - Door status toggle (*Open for Distribution* / *Closed*).
   - ePOS terminal connectivity state toggle (*Online* / *Latency* / *Down*).
   - **Log Inbound Shipments:** Record Supplyco / FCI godown truck shipments with Delivery Challan (DC) number and quantity in quintals/packets.
   - **Broadcast Trigger:** Automatically dispatches instant stock arrival notifications to waiting households.

### 🛡️ Tri-Factor Mathematical Trust & Credibility Engine
How RationMitra ensures data remains credible and immune to fake reports:
$$\text{Trust Score} = \text{Challan Weight (40\%)} + \text{Receipt Corroboration (35\%)} + \text{Freshness Factor (25\%)} - \text{Dispute Penalty}$$

- **FCI / Supplyco Delivery Challan (40 pts):** Official dealer updates backed by physical godown challan numbers establish baseline authority.
- **Cardholder ePOS Receipt Verification (35 pts):** Corroborations with valid transaction numbers add consensus points.
- **Temporal Freshness Decay (25 pts):** Decays dynamically if data is unverified for >24 hours.
- **Dispute Escrow Guardrail:** If 2 or more cardholders flag an item as exhausted while the dealer listing shows in stock, the item automatically switches to **"Disputed"** status, alerting the Taluk Supply Officer (TSO).
- Transparent **Public Audit Trail** on every commodity displaying the complete timestamped ledger.

### 🔔 Household Stock Arrival Notifications
- Citizens can subscribe to SMS, WhatsApp, or Web Push notifications for any item at their home shop or nearby stores.
- Instant alert dispatch triggered the moment a dealer logs an inbound delivery challan.

### 🌐 Bilingual Civic Design
- 100% native toggle between **English** and **മലയാളം** (vital for Kerala grassroot accessibility).
- Strict adherence to anti-vibe-coding standards:
  - Zero purple gradients (authentic deep navy `#0F2942`, slate `#1E293B`, emerald green, amber ochre).
  - Zero pill-shaped buttons (crisp, accessible 4px–6px borders).
  - Zero fake metrics or counters.
  - Zero AI slop copy, zero em dashes, zero emoji icons (crisp SVGs via `lucide-react`).
  - Custom favicon (`favicon.svg`) with Kerala civic shield and wheat stalk emblem.
  - Dedicated **Privacy Policy** (`/privacy`) and **Terms of Service** (`/terms`).
  - Custom domain deployment ready (`CNAME` configured).

---

## 3. Official 8-Slide Pitch Deck (Conforming to PDF Page 6)

The prototype includes an in-app interactive slide deck view accessible via the **Evaluation Deck** tab in the navigation bar.

### Slide 1: Challenge Selected and Why
- **Selected Challenge:** Track 3: Public Welfare • SC-09 (Ration shop stock visibility).
- **The Core Problem:** Over 3.5 crore PDS cardholders in Kerala rely on monthly food grain allocations. Due to erratic godown truck dispatch cycles, cardholders frequently make futile trips.
- **The Human Cost:** Rural and daily-wage citizens lose ₹40–₹80 on auto/bus fares or forfeit a half-day's wage, only to hear: *"Atta hasn't arrived"* or *"ePOS server is down"*.

### Slide 2: Who Has This Problem & Current Reality
- **Rural Elderly Cardholders:** Walk kilometers in the sun or wait in long queues at ARD 104 / ARD 118 only to find stock finished.
- **Ration Dealerships:** Licensees are overwhelmed with repetitive calls and verbal hostility when stock runs out unexpectedly.
- **Today's Inadequate Coping Mechanisms:** Word-of-mouth rumors, handwritten blackboards outside shops, or calling the shopkeeper's personal mobile.

### Slide 3: What You Built - One Clear Sentence
> *"RationMitra is a bilingual civic web application that provides real-time, card-specific commodity stock visibility across nearby Kerala ration shops, verifies inventory through official FCI delivery challans and crowdsourced ePOS transaction receipts, and automatically notifies subscribed households the moment critical items arrive."*

### Slide 4: Live Product Screenshots & Features
- **Multi-Shop Grid & Card Filter:** Real-time commodity balances filtered by Yellow (AAY), Pink (PHH), Blue (NPS), and White (NPNS) cards.
- **Two-Sided Update Engine:** 30-second citizen report flow and PIN-secured dealer inventory console.
- **Tri-Factor Trust Verification:** Transparent audit trail modal on every item.
- **Arrival Notification Subscriptions:** Cardholder WhatsApp, SMS, and Web Push alerts.

### Slide 5: How It Works - Architecture, Stack & Data
- **Frontend:** React 18, Vite 8, TypeScript, Tailwind CSS v4, Lucide React icons.
- **State & Offline Storage:** Resilient client-side persistence engine that maintains functionality during rural network drops.
- **Data Entities:** Normalized `RationShop`, `StockItem`, `AuditEntry`, `CitizenReport`, `AlertSubscription`, `SystemNotification`.
- **Mathematical Trust Calculation:** Multi-parameter confidence weighting with anti-spam rate limiting.

### Slide 6: What Works Now and What Does Not
- **What Works:** Full multi-shop discovery, card-specific filtering, two-sided updates, tri-factor trust engine, delivery challan verification, stock arrival alerts, bilingual localization, privacy & terms pages.
- **Current Limitations:** Production hardware direct connection to the closed National Informatics Centre (NIC) state ePOS server requires formal departmental MoU; feature phone USSD gateway requires telecom shortcode setup.

### Slide 7: What You Would Improve With Two More Weeks
1. **NIC ePOS Webhooks:** Direct bi-directional API integration with Kerala Civil Supplies ePOS machines.
2. **USSD / IVR Voice Bot:** Keypad phone support (`*99#` or Malayalam voice IVR for non-smartphone users).
3. **WhatsApp Business API Bot:** 1-word querybot ("ARD 104") for instant WhatsApp stock sheets.
4. **Predictive Dispatch AI:** Machine learning model to forecast ward-level wheat and rice exhaustion 3 days in advance.

### Slide 8: Team Names, Institution & Contact Details
- **Institution:** Amal Jyothi College of Engineering (AJCE), Kanjirappally, Kottayam, Kerala
- **Team:** Joyel (Lead Developer & Architect) & Project Partner (Department of Computer Science & Engineering)
- **Submission Round Target:** 19 September 2026 • Registration Form: `forms.gle/iPRFq7zTfPL84Dqq9`

---

## 4. Local Development & Deployment

### Run Locally
```bash
# Clone the repository
cd Ration

# Install dependencies
npm install

# Run development server
npm run dev

# Run production build
npm run build

# Preview production build locally
npm run preview
```

### Deployment
The built application in `dist/` is a pure static single-page application compatible with:
- **Vercel:** `vercel --prod`
- **Netlify:** `netlify deploy --prod --dir=dist`
- **Cloudflare Pages:** Connect repository and set build command `npm run build` with output directory `dist`.
- **GitHub Pages:** Push `dist/` branch or configure GitHub Actions workflow.
