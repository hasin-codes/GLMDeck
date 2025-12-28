"use client";

import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

interface ThumbnailStripProps {
    slides: any[];
    currentSlideIndex: number;
    onSelectSlide: (index: number) => void;
}

export function ThumbnailStrip({ slides, currentSlideIndex, onSelectSlide }: ThumbnailStripProps) {
    return (
        <div className="h-28 bg-surface/30 border-t border-white/[0.03] flex items-center justify-center p-4 gap-4 overflow-x-auto overflow-y-hidden no-scrollbar">
            <AnimatePresence initial={false}>
                {slides.map((slide, i) => (
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onClick={() => onSelectSlide(i)}
                        className={cn(
                            "h-full aspect-[16/9] bg-white border rounded-lg transition-all cursor-pointer hover:-translate-y-1 relative overflow-hidden group flex-shrink-0",
                            i === currentSlideIndex ? "border-brand shadow-[0_0_15px_rgba(52,178,123,0.3)] ring-1 ring-brand" : "border-white/10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100"
                        )}
                    >
                        <div className="absolute top-2 left-2 text-[8px] font-bold opacity-30 text-black">{i + 1}</div>
                        <div className="w-full h-full p-2.5 flex flex-col justify-center">
                            <div className="w-[60%] h-1 bg-zinc-200 rounded-full mb-1" />
                            <div className="w-[40%] h-0.5 bg-zinc-100 rounded-full mb-0.5" />
                            <div className="w-[30%] h-0.5 bg-zinc-100 rounded-full" />
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            <button className="h-full aspect-[16/9] border border-dashed border-white/10 rounded-lg flex items-center justify-center group hover:border-brand/50 hover:bg-brand/5 transition-all flex-shrink-0">
                <Plus className="h-5 w-5 text-muted group-hover:text-brand transition-colors" />
            </button>
        </div>
    );
}
