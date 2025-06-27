"use client";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Loader2, User, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ClientChatbot() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant" as const, content: "Chào bạn! Tôi có thể giúp gì cho bạn?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showChat) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        inputRef.current?.focus();
      }, 100);
    }
  }, [messages, showChat]);

  if (isAdminPage) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;
    const newMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi hệ thống");
      setMessages([...newMessages, { role: "assistant" as const, content: data.reply }]);
    } catch (err: any) {
      setError(err.message || "Lỗi hệ thống");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setShowChat((v) => !v)}
        className="fixed z-50 bottom-6 right-6 bg-[#219EBC] hover:bg-[#197ba3] text-white rounded-full shadow-xl p-4 flex items-center justify-center transition-all duration-300 focus:outline-none"
        style={{ boxShadow: "0 8px 32px 0 rgba(33,158,188,0.25)" }}
        aria-label="Mở chatbot hỗ trợ"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Chatbot Chat Window */}
      {showChat && (
        <div className="fixed z-50 bottom-24 right-4 w-[90vw] max-w-xs sm:max-w-sm md:max-w-md bg-white rounded-3xl shadow-2xl border border-[#219EBC] flex flex-col overflow-hidden animate-fade-in scale-95 opacity-0 animate-[fadeInScale_0.2s_ease-in-out_forwards]">
          <style>{`
            @keyframes fadeInScale {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
          <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#219EBC] to-[#23b6d7] text-white shadow-md">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-200" />
              <span className="font-bold text-base">Chatbot hỗ trợ</span>
            </div>
            <button onClick={() => setShowChat(false)} className="text-white hover:bg-[#197ba3] hover:text-yellow-200 text-2xl font-bold rounded-full w-8 h-8 flex items-center justify-center transition-all duration-150" aria-label="Đóng chatbot">×</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f7fbfd]" style={{ minHeight: 280, maxHeight: 400 }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}> 
                <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`rounded-full p-1 border-2 ${msg.role === "user" ? "bg-[#219EBC] text-white border-[#219EBC]" : "bg-white text-[#219EBC] border-[#23b6d7]"}`}>
                    {msg.role === "user" ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                  </div>
                  <div className={`rounded-2xl px-4 py-2 text-sm shadow-md ${msg.role === "user" ? "bg-[#219EBC] text-white" : "bg-white text-gray-800 border border-[#e0f4ff]"}`} style={{wordBreak: 'break-word'}}>
                    {msg.content}
                    <div className="text-[10px] text-right text-gray-400 mt-1 select-none">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start items-center gap-2">
                <div className="rounded-full p-1 bg-white text-[#219EBC] border-2 border-[#23b6d7]">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="rounded-2xl px-4 py-2 text-sm shadow-md bg-white text-gray-800 border border-[#e0f4ff] flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Đang trả lời...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {error && <div className="text-red-500 text-xs px-4 pb-1">{error}</div>}
          <form className="flex border-t border-gray-200 bg-white p-2 gap-2" onSubmit={handleSend}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-2 rounded-full border border-[#e0f4ff] outline-none text-sm bg-[#f7fbfd] focus:border-[#219EBC] transition-all"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) handleSend(e); }}
            />
            <Button type="submit" className="px-5 py-2 rounded-full bg-[#219EBC] hover:bg-[#197ba3] text-white font-bold shadow-md transition-all" disabled={loading || !input.trim()}>
              Gửi
            </Button>
          </form>
          <div className="text-xs text-gray-400 text-center py-1">(Powered by OpenAI GPT-3.5, cần API key)</div>
        </div>
      )}
    </>
  );
}