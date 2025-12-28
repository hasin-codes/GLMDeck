"use client";

import * as React from "react";
import { Sparkles, Send } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
    role: string;
    content: string;
}

interface ChatPanelProps {
    messages: Message[];
    input: string;
    setInput: (val: string) => void;
    onSendMessage: () => void;
}

export function ChatPanel({ messages, input, setInput, onSendMessage }: ChatPanelProps) {
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="w-[420px] border-r border-border bg-surface/20 flex flex-col relative">
            {/* Workspace Header */}
            <div className="p-6 border-b border-white/[0.03] flex items-center gap-3 text-gradient">
                <div className="h-8 w-8 rounded-lg bg-brand/20 border border-brand/30 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-brand" />
                </div>
                <div>
                    <h2 className="text-sm font-semibold">GLM Agent</h2>
                    <p className="text-[10px] text-muted uppercase tracking-wider">Slide Design Mode</p>
                </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i}
                        className={cn("flex flex-col gap-2", msg.role === "user" ? "items-end" : "items-start")}
                    >
                        <div className={cn(
                            "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                            msg.role === "user" ? "bg-brand text-black font-medium" : "bg-surface border border-border text-foreground/90"
                        )}>
                            {msg.content}
                        </div>
                        <span className="text-[9px] text-muted uppercase tracking-widest px-2">
                            {msg.role === "user" ? "You" : "GLM Agent"} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-6 border-t border-white/[0.03]">
                <div className="relative group">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onSendMessage();
                            }
                        }}
                        placeholder="Ask for revisions..."
                        className="w-full bg-surface border border-border rounded-2xl p-4 pr-12 text-sm focus:outline-none focus:border-brand/50 transition-colors min-h-[100px] max-h-[300px] resize-none overflow-hidden"
                    />
                    <button
                        onClick={onSendMessage}
                        disabled={!input.trim()}
                        className={cn(
                            "absolute bottom-4 right-4 p-2 rounded-xl transition-all",
                            input ? "bg-brand text-black opacity-100" : "bg-white/5 text-muted opacity-50"
                        )}
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
                <div className="mt-3 flex gap-2">
                    {["Make it shorter", "Change Style"].map(chip => (
                        <button
                            key={chip}
                            onClick={() => setInput(chip)}
                            className="text-[10px] bg-white/5 border border-white/5 px-3 py-1.5 rounded-full text-muted hover:text-foreground hover:bg-white/10 transition-colors uppercase tracking-wider font-semibold"
                        >
                            {chip}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
