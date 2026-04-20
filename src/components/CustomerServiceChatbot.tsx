"use client";

import { useState, useEffect, useRef } from "react";
import * as motion from "framer-motion/client";
import { MessageCircle, X, Send, User, Bot } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function CustomerServiceChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Bienvenido a OH! Buenos Aires. Soy tu asistente de Luxury Shopping. ¿En qué puedo ayudarte hoy?",
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

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Gracias por tu consulta. Un asesor de nuestro equipo de Concierge se pondrá en contacto con vos a la brevedad, o podés visitar nuestra sección de Boutiques para más información.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1500);
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
        className={`fixed bottom-8 right-8 z-50 h-16 w-16 bg-gold-metallic text-onyx rounded-full shadow-2xl flex items-center justify-center border border-white/20 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : ''}`}
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
        <div className="bg-onyx p-6 flex justify-between items-center border-b border-gold-heritage/20">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-gold-heritage to-gold-shine flex items-center justify-center shadow-lg">
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
                {msg.text}
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
              className="flex-1 bg-alabaster border-none rounded-full py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-gold-heritage/30 transition-all placeholder:text-onyx/30"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="h-12 w-12 bg-onyx text-gold-metallic rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
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
