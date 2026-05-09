"use client";

import { useState, useEffect, useRef } from "react";
import * as motion from "framer-motion/client";
import { MessageCircle, X, Send, User, Bot } from "lucide-react";
import { getBotResponse } from "@/src/lib/chatbotLogic";
import { useQuery } from "@tanstack/react-query";
import { getBrands } from "@/src/features/catalog/services/brandService";
import { getActivePromotions } from "@/src/features/catalog/services/promotionService";
import { getEvents } from "@/src/features/catalog/services/agendaService";
import { usePathname } from "next/navigation";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function CustomerServiceChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide chatbot on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
    staleTime: 1000 * 60 * 10,
  });

  const { data: promotions = [] } = useQuery({
    queryKey: ['promotions-active'],
    queryFn: getActivePromotions,
    staleTime: 1000 * 60 * 5,
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    staleTime: 1000 * 60 * 15,
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: pathname.includes("/gastronomia") 
        ? "¡Hola! Bienvenido al sector Gastronómico de OH!. ¿Buscás alguna mesa en especial o querés ver las opciones de hoy?"
        : pathname.includes("/marcas")
        ? "¡Hola! Estoy aquí para ayudarte a encontrar tus marcas favoritas. ¿Buscás alguna en particular?"
        : "Bienvenido a OH! Buenos Aires. Soy tu asistente de Luxury Shopping. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const formatText = (text: string) => {
    // Basic markdown link parsing [text](url)
    const parts = text.split(/(\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        const isMailto = match[2].startsWith("mailto:");
        return (
          <a 
            key={i} 
            href={match[2]} 
            target={isMailto ? undefined : "_blank"} 
            rel={isMailto ? undefined : "noopener noreferrer"}
            className="text-celeste-oh underline font-bold hover:text-brand-accent transition-colors"
          >
            {match[1]}
          </a>
        );
      }
      return part;
    });
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Use smart bot response
    setTimeout(() => {
      const botResponse = getBotResponse(userMessage.text, { 
        brands, 
        promotions, 
        events, 
        pathname 
      });
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 800);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-50 h-16 w-16 bg-brand-accent text-white rounded-full shadow-2xl flex items-center justify-center border border-white/20 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : ''}`}
      >
        <MessageCircle className="h-7 w-7" />
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-onyx animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.8, filter: "blur(10px)" }}
        animate={isOpen ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : { opacity: 0, y: 100, scale: 0.8, filter: "blur(10px)" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed bottom-8 right-8 z-50 w-[95vw] sm:w-[400px] h-[580px] bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border border-onyx/5 font-sans ${!isOpen && 'pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-onyx p-6 flex justify-between items-center border-b border-celeste-oh/20">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-celeste-oh to-celeste-soft flex items-center justify-center shadow-lg">
              <Bot className="text-onyx h-6 w-6" />
            </div>
            <div>
              <h3 className="text-alabaster text-sm font-bold uppercase tracking-[0.2em]">OH! Assistant</h3>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-alabaster/40 font-medium uppercase tracking-widest">En línea</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-alabaster/30 custom-scrollbar">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                  msg.sender === "user" 
                    ? "bg-onyx text-alabaster rounded-tr-none" 
                    : "bg-white text-onyx/80 border border-onyx/5 rounded-tl-none"
                }`}
              >
                {formatText(msg.text)}
                <div className={`text-[9px] mt-2 opacity-40 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-onyx/5">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribí tu mensaje..."
              className="flex-1 bg-alabaster border-none rounded-full py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-celeste-oh/30 transition-all placeholder:text-onyx/30"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="h-12 w-12 bg-onyx text-celeste-oh rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="text-center mt-4 text-[10px] text-onyx/30 font-medium uppercase tracking-widest">
            Luxury Experience & Concierge Services
          </p>
        </div>
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}
