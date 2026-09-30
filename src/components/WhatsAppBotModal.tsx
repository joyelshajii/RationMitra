import React, { useState, useRef, useEffect } from 'react';
import { usePds } from '../context/PdsContext';
import {
  X,
  Send,
  MessageSquare,
  CheckCheck,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { getTranslation } from '../utils/i18n';

interface WhatsAppBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const WhatsAppBotModal: React.FC<WhatsAppBotModalProps> = ({ isOpen, onClose }) => {
  const { shops, language } = usePds();
  const isMl = language === 'ml';
  const t = (k: any) => getTranslation(language, k);

  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'bot',
      text: isMl
        ? 'നമസ്കാരം! ഭക്ഷ്യ പൊതുവിതരണ വകുപ്പ് (കേരള സർക്കാർ) വാട്സാപ്പ് ഹെൽപ്പ്‌ലൈനിലേക്ക് സ്വാഗതം. നിങ്ങളുടെ റേഷൻ കടയിലെ സ്റ്റോക്ക് അറിയാൻ ARD നമ്പർ (ഉദാ: ARD 104) അല്ലെങ്കിൽ സാധനത്തിന്റെ പേര് അയക്കൂ.'
        : 'Namaskaram! Welcome to the Govt. of Kerala Civil Supplies PDS WhatsApp helpline. Send an ARD Number (e.g. "ARD 104") or commodity name to check live availability.',
      timestamp: '10:00 AM',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getBotResponse = (query: string): string => {
    const q = query.toLowerCase().trim();

    // Check if looking for ARD number
    const ardMatch = q.match(/104|118|142|189|205/);
    if (ardMatch) {
      const shop = shops.find((s) => s.ardNumber.includes(ardMatch[0]));
      if (shop) {
        const inStockItems = shop.stock
          .filter((st) => st.status === 'IN_STOCK')
          .map((st) => `• ${st.nameEn}: ${st.quantityAvailable} ${st.unit}`)
          .join('\n');
        const outStockItems = shop.stock
          .filter((st) => st.status === 'EXHAUSTED' || st.status === 'LOW_STOCK')
          .map((st) => `• ${st.nameEn}: ${st.quantityAvailable} ${st.unit} (${st.status})`)
          .join('\n');

        return `🏬 *${shop.ardNumber} - ${shop.nameEn}*\n👤 Licensee: ${shop.licensee}\n📍 ${shop.ward}, ${shop.taluk}\n🚪 Status: ${shop.isOpen ? '✅ OPEN' : '🔴 CLOSED'}\n⚡ ePOS: ${shop.eposStatus}\n\n*📦 Available Stock:*\n${inStockItems || 'None'}\n\n*⚠️ Low / Out of Stock:*\n${outStockItems || 'None'}\n\n📞 Dealership Phone: ${shop.phone}`;
      }
    }

    if (q.includes('matta') || q.includes('മട്ട') || q.includes('അരി') || q.includes('rice')) {
      const shop104 = shops[0];
      const matta = shop104?.stock.find((s) => s.id === 'matta_rice');
      return `🌾 *Matta Rice (കുത്തരി) Availability:*\n\n• ARD 104 (Ponkunnam): *${matta?.quantityAvailable} Quintals* (✅ In Stock)\n• ARD 118: *12.4 Quintals* (⚠️ Low Stock)\n\nFCI inward delivery verified today at 09:30 AM via Supplyco Godown.`;
    }

    if (q.includes('epos') || q.includes('machine') || q.includes('server')) {
      return `📡 *Biometric ePOS Machine Health:*\n\n• Central NIC Server: 🟢 OPERATIONAL\n• Active Kottayam ARDs Online: 92%\n• Average fingerprint latency: 3.4 seconds.\n\nIf biometric thumbprint fails 3 times, OTP fallback is automatically triggered to your Aadhaar-linked mobile.`;
    }

    if (q.includes('time') || q.includes('timing') || q.includes('സമയ')) {
      return `⏰ *Kerala Ration Shop Working Hours:*\n\n• Morning Session: 08:30 AM – 12:30 PM\n• Lunch & Stock Tally: 12:30 PM – 03:30 PM\n• Evening Session: 03:30 PM – 07:00 PM\n• Weekly Holiday: Sunday (and notified state holidays).`;
    }

    return isMl
      ? `ക്ഷമിക്കുക, വ്യക്തമായില്ല. "ARD 104", "മട്ട അരി", "ഇപോസ് സെർവർ", അല്ലെങ്കിൽ "റേഷൻ സമയം" എന്ന് ടൈപ്പ് ചെയ്യുക.`
      : `I didn't quite catch that. Try typing "ARD 104", "Matta Rice", "ePOS status", or "Shop Timings". You can also call the 1967 toll-free helpline.`;
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(text);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#efeae2] w-full max-w-lg rounded-3xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col h-[600px] max-h-[92vh]">
        {/* WhatsApp Style Top Header Bar */}
        <div className="bg-[#075e54] text-white p-3 sm:p-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm border-2 border-white/20">
                PDS
              </div>
              <span className="w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#075e54] absolute bottom-0 right-0" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold tracking-tight">Kerala Civil Supplies PDS</h3>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              </div>
              <p className="text-[11px] text-emerald-100/90 font-mono">
                Official Helpline (+91 94000 19670)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-[#f0f2f5] px-3 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
          <button
            onClick={() => handleSend('ARD 104 Stock')}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded-full font-medium text-slate-700 whitespace-nowrap shadow-2xs transition-colors"
          >
            🌾 ARD 104 Stock
          </button>
          <button
            onClick={() => handleSend('മട്ട അരി ഉണ്ടോ?')}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded-full font-medium text-slate-700 whitespace-nowrap shadow-2xs transition-colors"
          >
            🍚 മട്ട അരി ഉണ്ടോ?
          </button>
          <button
            onClick={() => handleSend('ePOS Server Status')}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded-full font-medium text-slate-700 whitespace-nowrap shadow-2xs transition-colors"
          >
            ⚡ ePOS Status
          </button>
          <button
            onClick={() => handleSend('Shop Timing')}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded-full font-medium text-slate-700 whitespace-nowrap shadow-2xs transition-colors"
          >
            🕒 Timings
          </button>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          <div className="text-center my-2">
            <span className="bg-[#e1f3fb] text-[#25526c] text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-2xs">
              End-to-End Civil Supplies Corroborated
            </span>
          </div>

          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs relative ${
                    isUser
                      ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none'
                      : 'bg-white text-slate-900 rounded-tl-none border border-slate-200/60'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                    <span>{m.timestamp}</span>
                    {isUser && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-xs border border-slate-200/60 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse delay-100" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse delay-200" />
                <span className="text-[10px] text-slate-400 ml-1">typing response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="bg-[#f0f2f5] p-2.5 sm:p-3 border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isMl ? 'മെസ്സേജ് ടൈപ്പ് ചെയ്യുക...' : 'Type ARD number or commodity query...'}
            className="flex-1 bg-white px-4 py-2.5 rounded-full border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#075e54] shadow-2xs"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-[#075e54] hover:bg-[#128c7e] text-white flex items-center justify-center transition-colors disabled:opacity-50 shadow-xs shrink-0"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
