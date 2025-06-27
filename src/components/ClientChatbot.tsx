"use client";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Loader2, User, Bot } from "lucide-react";
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

  useEffect(() => {
    if (showChat) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        className="fixed z-50 bottom-6 right-6 bg-[#219EBC] hover:bg-[#197ba3] text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-all duration-200 focus:outline-none"
        style={{ boxShadow: "0 4px 24px 0 rgba(33,158,188,0.2)" }}
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Chatbot Chat Window */}
      {showChat && (
        <div className="fixed z-50 bottom-24 right-6 w-80 max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-[#219EBC] flex flex-col overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 bg-[#219EBC] text-white">
            <span className="font-bold">Chatbot hỗ trợ</span>
            <button onClick={() => setShowChat(false)} className="text-white hover:text-gray-200 text-xl font-bold">×</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3" style={{ minHeight: 250, maxHeight: 350 }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}> 
                <div className={`flex items-end gap-2 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`rounded-full p-1 ${msg.role === "user" ? "bg-[#219EBC] text-white" : "bg-gray-200 text-[#219EBC]"}`}>
                    {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`rounded-xl px-3 py-2 text-sm shadow ${msg.role === "user" ? "bg-[#219EBC] text-white" : "bg-gray-100 text-gray-800"}`}>{msg.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start items-center gap-2">
                <div className="rounded-full p-1 bg-gray-200 text-[#219EBC]">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="rounded-xl px-3 py-2 text-sm shadow bg-gray-100 text-gray-800 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Đang trả lời...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {error && <div className="text-red-500 text-xs px-4 pb-1">{error}</div>}
          <form className="flex border-t border-gray-200" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-3 py-2 outline-none text-sm"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) handleSend(e); }}
              autoFocus
            />
            <Button type="submit" className="px-4 py-2 text-[#219EBC] font-bold" disabled={loading || !input.trim()}>
              Gửi
            </Button>
          </form>
          <div className="text-xs text-gray-400 text-center py-1">(Powered by OpenAI GPT-3.5, cần API key)</div>
        </div>
      )}
    </>
  );
}