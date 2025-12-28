"use client";

import { Layout, Image as ImageIcon, ArrowRight } from "lucide-react";
import { GlassCard, PremiumButton } from "@/components/ui-premium";
import { cn } from "@/lib/utils";

interface CreationCardProps {
    prompt: string;
    setPrompt: (val: string) => void;
    mode: "slides" | "poster";
    setMode: (val: "slides" | "poster") => void;
    handleGenerate: () => void;
}

export function CreationCard({ prompt, setPrompt, mode, setMode, handleGenerate }: CreationCardProps) {
    return (
        <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            <GlassCard className="p-1 border border-white/5 bg-white/[0.02]">
                <div className="p-4 space-y-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe the presentation you'd like to create..."
                        className="w-full bg-transparent border-none focus:ring-0 text-xl font-light placeholder:text-muted/40 resize-none min-h-[140px] px-4 pt-4"
                        autoFocus
                    />

                    <div className="flex items-center justify-between gap-4 pt-4 px-4 pb-2 border-t border-white/[0.05]">
                        <div className="flex gap-2 p-1 bg-surface/50 rounded-full border border-border">
                            <button
                                onClick={() => setMode("slides")}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                                    mode === "slides" ? "bg-brand text-black shadow-lg" : "text-muted hover:text-foreground"
                                )}
                            >
                                <Layout className="h-4 w-4" />
                                Slide Deck
                            </button>
                            <button
                                onClick={() => setMode("poster")}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                                    mode === "poster" ? "bg-brand text-black shadow-lg" : "text-muted hover:text-foreground"
                                )}
                            >
                                <ImageIcon className="h-4 w-4" />
                                Single Poster
                            </button>
                        </div>

                        <PremiumButton
                            disabled={!prompt.trim()}
                            onClick={handleGenerate}
                            className="px-10 py-3.5 group"
                        >
                            Generate
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </PremiumButton>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
