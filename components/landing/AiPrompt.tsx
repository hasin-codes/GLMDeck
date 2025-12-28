"use client";

import { useState } from "react";
import { ArrowRight, Paperclip, Layout } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import Image from "next/image";
import { VoiceInput } from "./VoiceInput";

interface AiPromptProps {
    prompt: string;
    setPrompt: (val: string) => void;
    handleGenerate: () => void;
}

export function AiPrompt({ prompt, setPrompt, handleGenerate }: AiPromptProps) {
    const [isFocused, setIsFocused] = useState(false);
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 72,
        maxHeight: 300,
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (prompt.trim()) {
                handleGenerate();
            }
        }
    };

    return (
        <div className="w-full max-w-4xl px-4 md:px-0 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            <div
                className={cn(
                    "backdrop-blur-md rounded-2xl relative transition-all duration-300",
                    isFocused ? "shadow-[0_0_50px_-10px_rgba(52,178,123,0.4)] scale-[1.002]" : "hover:shadow-[0_0_40px_-10px_rgba(52,178,123,0.3)]"
                )}
                style={{
                    background: isFocused
                        ? 'linear-gradient(160deg, rgba(52, 178, 123, 0.4) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(52, 178, 123, 0.2) 100%)'
                        : 'linear-gradient(160deg, rgba(52, 178, 123, 0.2) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(52, 178, 123, 0.1) 100%)',
                    padding: '1.5px',
                    borderRadius: '1rem',
                    boxShadow: isFocused
                        ? `0 8px 32px - 4px rgba(0, 0, 0, 0.5), 0 0 20px - 2px rgba(52, 178, 123, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                        : `0 4px 24px - 1px rgba(0, 0, 0, 0.3), 0 0 20px - 2px rgba(52, 178, 123, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
                }}
            >
                <div
                    className="rounded-2xl p-1.5 pt-4 relative h-full w-full"
                    style={{
                        background: 'linear-gradient(160deg, #1a1a1a, #0a0a0a)',
                        borderRadius: 'calc(1rem - 1.5px)',
                    }}
                >
                    <div className="flex items-center gap-3 mb-3 mx-2">
                        <div className="flex-1 flex items-center gap-2">
                            {/* Replaced fixed logo with standard generic or kept blank if no logo asset available. 
                                Using a Layout icon as a placeholder for "Preview" context if needed, or just text. 
                                User asked for "Slide Deck only".
                             */}
                            <div className="p-1.5 rounded-md bg-brand/10">
                                <Layout className="w-3 h-3 text-brand" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                                    New Project
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="relative flex flex-col">
                        <div
                            className="overflow-y-auto"
                            style={{ maxHeight: "400px" }}
                        >
                            <textarea
                                value={prompt}
                                placeholder="What can I build for you?"
                                className={cn(
                                    "w-full rounded-xl rounded-b-none px-4 py-3 backdrop-blur-md border-none text-white placeholder:text-neutral-500 resize-none focus:outline-none focus:ring-0",
                                    "min-h-[72px] text-base md:text-lg bg-transparent"
                                )}
                                ref={textareaRef}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onChange={(e) => {
                                    setPrompt(e.target.value);
                                    adjustHeight();
                                }}
                            />
                        </div>

                        <div className="h-14 backdrop-blur-md rounded-b-xl flex items-center bg-[#222]/50">
                            <div className="flex items-center justify-between w-full px-3">
                                <div className="flex items-center gap-2">
                                    <label
                                        className={cn(
                                            "rounded-full p-2 bg-white/5 cursor-pointer flex-shrink-0 transition-all duration-200",
                                            "hover:bg-white/10 hover:scale-105 active:scale-95",
                                            "text-neutral-400 hover:text-white"
                                        )}
                                        aria-label="Attach file"
                                    >
                                        <input type="file" className="hidden" />
                                        <Paperclip className="w-4 h-4" />
                                    </label>

                                    <div className={cn(
                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                                        "border border-brand/20 bg-brand/5",
                                        "transition-all duration-200"
                                    )}>
                                        <Layout className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                                        <span className="text-brand font-medium text-xs whitespace-nowrap">
                                            Slide Deck
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <VoiceInput />

                                    <button
                                        type="button"
                                        className={cn(
                                            "rounded-lg p-2 flex-shrink-0 transition-all duration-200",
                                            prompt.trim()
                                                ? "bg-brand text-black hover:bg-brand/90 hover:scale-105"
                                                : "bg-white/5 text-neutral-500 cursor-not-allowed"
                                        )}
                                        disabled={!prompt.trim()}
                                        onClick={handleGenerate}
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
