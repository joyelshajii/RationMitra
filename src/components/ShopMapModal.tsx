import React, { useState, useMemo } from 'react';
import { usePds } from '../context/PdsContext';
import { RationShop } from '../types';
import {
  X,
  MapPin,
  Navigation,
  Compass,
  Phone,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Wifi,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { getTranslation } from '../utils/i18n';

interface ShopMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectShop: (shopId: string) => void;
}

// Haversine formula to compute distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const ShopMapModal: React.FC<ShopMapModalProps> = ({
  isOpen,
  onClose,
  onSelectShop,
}) => {
  const { shops, language } = usePds();
  const isMl = language === 'ml';
  const t = (k: any) => getTranslation(language, k);

  const [selectedShop, setSelectedShop] = useState<RationShop>(shops[0]);
  const [radiusFilter, setRadiusFilter] = useState<number>(0); // 0 = all
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Compute map bounds from shops
  const bounds = useMemo(() => {
    let minLat = 9.5;
    let maxLat = 9.62;
    let minLng = 76.72;
    let maxLng = 76.84;

    shops.forEach((s) => {
      if (s.coordinates) {
        minLat = Math.min(minLat, s.coordinates.lat);
        maxLat = Math.max(maxLat, s.coordinates.lat);
        minLng = Math.min(minLng, s.coordinates.lng);
        maxLng = Math.max(maxLng, s.coordinates.lng);
      }
    });

    const padLat = (maxLat - minLat) * 0.12 || 0.02;
    const padLng = (maxLng - minLng) * 0.12 || 0.02;

    return {
      minLat: minLat - padLat,
      maxLat: maxLat + padLat,
      minLng: minLng - padLng,
      maxLng: maxLng + padLng,
    };
  }, [shops]);

  // Request browser geolocation
  const handleLocateMe = () => {
    setLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocating(false);
      },
      () => {
        // Fallback to Ponkunnam civil depot coordinates for demonstration
        setUserLocation({
          lat: 9.562,
          lng: 76.778,
        });
        setLocationError(
          isMl
            ? 'GPS അനുമതി ലഭ്യമല്ല. ഡെമോ ലൊക്കേഷൻ (പൊൻകുന്നം) സജ്ജീകരിച്ചു.'
            : 'Using mock location (Ponkunnam Central) for demo proximity.'
        );
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  // Convert lat/lng to SVG percentage coordinates
  const getSvgCoordinates = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    // Invert y because SVG y=0 is top
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100;
    return { x: Math.max(8, Math.min(92, x)), y: Math.max(8, Math.min(92, y)) };
  };

  // Filtered shops based on radius
  const filteredShops = useMemo(() => {
    if (!radiusFilter || !userLocation) return shops;
    return shops.filter((s) => {
      const dist = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        s.coordinates.lat,
        s.coordinates.lng
      );
      return dist <= radiusFilter;
    });
  }, [shops, radiusFilter, userLocation]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {t('mapTitle')}
                </h2>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  GPS Live
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {t('mapSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLocateMe}
              disabled={locating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-all"
            >
              <Navigation className={`w-3.5 h-3.5 text-blue-600 ${locating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{t('nearMe')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close map"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Location Notice / Error if any */}
        {locationError && (
          <div className="px-5 py-2 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{locationError}</span>
          </div>
        )}

        {/* Radius Filter Pills */}
        <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Proximity Radius:
          </span>
          <button
            onClick={() => setRadiusFilter(0)}
            className={`px-3 py-1 rounded-full font-semibold transition-all shrink-0 ${
              radiusFilter === 0
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Shops ({shops.length})
          </button>
          {[2, 5, 10].map((r) => (
            <button
              key={r}
              onClick={() => {
                if (!userLocation) handleLocateMe();
                setRadiusFilter(r);
              }}
              className={`px-3 py-1 rounded-full font-semibold transition-all shrink-0 ${
                radiusFilter === r
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Within {r} km
            </button>
          ))}
          {userLocation && (
            <span className="ml-auto text-[11px] text-emerald-700 font-mono hidden md:inline">
              📍 GPS Lock: {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E
            </span>
          )}
        </div>

        {/* Main Body: Map Canvas (Left/Top) + Selected Shop Drawer (Right/Bottom) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[380px] sm:min-h-[460px]">
          {/* Interactive Spatial Map Canvas */}
          <div className="lg:col-span-8 bg-slate-900 relative overflow-hidden flex items-center justify-center p-4">
            {/* Kerala Spatial Grid Graphic */}
            <svg
              className="w-full h-full max-h-[460px] select-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
                <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#334155" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1e293b" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Background Grid */}
              <rect width="100" height="100" fill="#0f172a" />
              <rect width="100" height="100" fill="url(#gridPattern)" />

              {/* Stylized Kerala Highway / River Arteries */}
              <path
                d="M 5 20 Q 40 45, 95 85"
                fill="none"
                stroke="#334155"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="2 1"
              />
              <path
                d="M 20 90 Q 50 50, 80 10"
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="1.8"
                strokeOpacity="0.5"
                strokeLinecap="round"
              />

              {/* User Geolocation Pulse if active */}
              {userLocation && (() => {
                const userCoord = getSvgCoordinates(userLocation.lat, userLocation.lng);
                return (
                  <g key="user-loc">
                    <circle
                      cx={userCoord.x}
                      cy={userCoord.y}
                      r="4"
                      fill="#3b82f6"
                      fillOpacity="0.3"
                      className="animate-ping"
                    />
                    <circle
                      cx={userCoord.x}
                      cy={userCoord.y}
                      r="2"
                      fill="#2563eb"
                      stroke="#ffffff"
                      strokeWidth="0.8"
                    />
                  </g>
                );
              })()}

              {/* ARD Ration Shop Markers */}
              {filteredShops.map((s) => {
                const coords = getSvgCoordinates(s.coordinates.lat, s.coordinates.lng);
                const isSelected = selectedShop.id === s.id;
                const hasStock = s.stock.some((st) => st.status === 'IN_STOCK');
                const markerColor = !s.isOpen ? '#ef4444' : hasStock ? '#10b981' : '#f59e0b';

                return (
                  <g
                    key={s.id}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={() => setSelectedShop(s)}
                  >
                    {isSelected && (
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r="5.5"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="0.8"
                        strokeDasharray="1 1"
                        className="animate-spin"
                      />
                    )}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isSelected ? '3.8' : '2.8'}
                      fill={markerColor}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? '0.9' : '0.5'}
                    />
                    <text
                      x={coords.x}
                      y={coords.y - 4}
                      textAnchor="middle"
                      fill="#f8fafc"
                      fontSize="3"
                      fontWeight="bold"
                      className="pointer-events-none drop-shadow"
                    >
                      {s.ardNumber}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 text-[11px] text-slate-300 space-y-1 shadow-lg">
              <div className="font-semibold text-white text-[10px] uppercase tracking-wider mb-1">
                Live Status
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Open &amp; In Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span>Low Stock / Slow ePOS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                <span>Closed / Stockout</span>
              </div>
              {userLocation && (
                <div className="flex items-center gap-2 pt-1 border-t border-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span>Your GPS Location</span>
                </div>
              )}
            </div>

            {/* Help Chip */}
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 rounded-lg px-2.5 py-1 text-[11px] text-slate-300">
              Click any pin to inspect stock balance
            </div>
          </div>

          {/* Selected Shop Drawer */}
          <div className="lg:col-span-4 bg-white p-5 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-100">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-[#0C1E33] text-white">
                    {selectedShop.ardNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      selectedShop.isOpen
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {selectedShop.isOpen ? 'Open Now' : 'Closed'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {isMl ? selectedShop.nameMl : selectedShop.nameEn}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Licensee: <span className="font-semibold text-slate-800">{selectedShop.licensee}</span>
                </p>
                <p className="text-xs text-slate-500">
                  {selectedShop.ward}, {selectedShop.taluk}, {selectedShop.district}
                </p>
              </div>

              {/* Proximity & ePOS Badge */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                    Approx Distance
                  </span>
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {userLocation
                      ? `${calculateDistanceKm(
                          userLocation.lat,
                          userLocation.lng,
                          selectedShop.coordinates.lat,
                          selectedShop.coordinates.lng
                        )} km`
                      : `${selectedShop.distanceKm} km`}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                    Biometric ePOS
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 mt-0.5">
                    <Wifi
                      className={`w-3.5 h-3.5 ${
                        selectedShop.eposStatus === 'ONLINE'
                          ? 'text-emerald-600'
                          : selectedShop.eposStatus === 'SLOW'
                          ? 'text-amber-500'
                          : 'text-red-600'
                      }`}
                    />
                    <span>{selectedShop.eposStatus}</span>
                  </div>
                </div>
              </div>

              {/* Commodity Availability Preview */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Essential Stock
                </span>
                <div className="space-y-1.5 text-xs">
                  {selectedShop.stock.slice(0, 4).map((st) => (
                    <div
                      key={st.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
                    >
                      <span className="font-medium text-slate-800">
                        {isMl ? st.nameMl : st.nameEn}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-slate-600">
                          {st.quantityAvailable} {st.unit}
                        </span>
                        {st.status === 'IN_STOCK' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : st.status === 'LOW_STOCK' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${selectedShop.phone}`}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Call Shop</span>
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedShop.coordinates.lat},${selectedShop.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Directions</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectShop(selectedShop.id);
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>{isMl ? 'പൂർണ്ണ വിവരങ്ങളും സ്റ്റോക്കും കാണുക' : 'Inspect Full Stock & Challan History'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
