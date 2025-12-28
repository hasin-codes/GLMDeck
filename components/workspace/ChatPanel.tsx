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

function ChatMessage({ msg }: { msg: Message }) {
    const isAi = msg.role === "ai";
    const [isRevealed, setIsRevealed] = React.useState(!isAi);

    React.useEffect(() => {
        if (isAi && !isRevealed) {
            // Calculate reveal time based on length, clamped between 1s and 2s
            const duration = Math.min(2000, Math.max(1000, msg.content.length * 20));
            const timer = setTimeout(() => setIsRevealed(true), duration);
            return () => clearTimeout(timer);
        }
    }, [isAi, isRevealed, msg.content]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex flex-col gap-2", msg.role === "user" ? "items-end" : "items-start")}
        >
            <div className={cn(
                "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative overflow-hidden",
                msg.role === "user" ? "bg-brand text-black font-medium" : "bg-surface border border-border text-foreground/90"
            )}>
                <div className={cn(
                    "transition-opacity duration-500",
                    !isRevealed && isAi ? "opacity-0" : "opacity-100"
                )}>
                    {msg.content}
                </div>

                {!isRevealed && isAi && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
                        style={{ backgroundSize: '200% 100%' }}
                    />
                )}
            </div>
            <span className="text-[9px] text-muted uppercase tracking-widest px-2">
                {msg.role === "user" ? "You" : "GLM Deck"} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </motion.div>
    );
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
            {/* Workspace Header - Removed as per request */}


            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, i) => (
                    <ChatMessage key={i} msg={msg} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-6 bg-surface/30 backdrop-blur-md pt-2">
                <div className="mb-3 flex gap-2">
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
                        className="w-full bg-surface border border-border rounded-2xl p-4 pr-12 text-sm focus:outline-none focus:border-brand/50 transition-colors min-h-[100px] max-h-[300px] resize-none overflow-hidden placeholder:text-muted/40"
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
            </div>
        </div>
    );
}
