"use client";

import { AgentChat, createAgentChat } from "@21st-sdk/nextjs";
import { MessageSquare, Sparkles } from "lucide-react";

export function AgentPanel() {
  const chat = createAgentChat({
    agent: "my-agent",
    tokenUrl: "/api/an-token",
  });

  const { messages, status, error } = chat;

  return (
    <div className="flex flex-col h-full border-l-4 border-brand-border bg-brand-black p-6 min-w-[400px]">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="text-brand-red" size={24} />
        <h3 className="text-xl font-black uppercase tracking-widest text-brand-white">AI Assistant</h3>
      </div>
      
      <div className="flex-1 border-2 border-brand-border bg-brand-black/50 overflow-hidden flex flex-col">
        <AgentChat 
          messages={messages}
          onSend={(m) => chat.sendMessage({ text: m.content })}
          status={status}
          onStop={() => chat.stop()}
          error={error}
          className="flex-1"
        />
      </div>
      
      <div className="mt-4 pt-4 border-t border-brand-border flex items-center gap-2 text-[10px] uppercase font-bold text-brand-white/40 tracking-widest">
        <MessageSquare size={12} />
        <span>Powered by 21st.dev AI</span>
      </div>
    </div>
  );
}
