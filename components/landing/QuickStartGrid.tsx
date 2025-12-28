"use client";

import { Sparkles, ArrowUpRight, MessageSquare, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface QuickStartGridProps {
    onSelect: (prompt: string) => void;
}

const quickStarts = [
    {
        title: "Q2 Quarterly Business Review",
        prompt: "Quarterly Business Review for Q2 2024 showing 20% growth",
        thumbnail: "/thumbnails/business_review_thumb_1766880302436.png",
        author: "Sarah Chen",
        stats: { views: "2.9K", likes: "361" },
        category: "Business"
    },
    {
        title: "Product Launch: Aura Unleashed",
        prompt: "Sleek product launch presentation for Aura smart wearable",
        thumbnail: "/thumbnails/product_launch_thumb_1766880321184.png",
        author: "Alex Rivers",
        stats: { views: "8.7K", likes: "1.3K" },
        category: "Product"
    },
    {
        title: "Global Climate Trends 2024",
        prompt: "Academic research poster on global climate trends and urban sustainability",
        thumbnail: "/thumbnails/academic_poster_thumb_1766880338714.png",
        author: "Dr. Elena Vance",
        stats: { views: "2.7K", likes: "614" },
        category: "Academic"
    },
    {
        title: "Future Forge: Startup Pitch Deck",
        prompt: "Dynamic startup pitch deck for Future Forge innovative solutions",
        thumbnail: "/thumbnails/startup_pitch_thumb_1766880357753.png",
        author: "Jordan Smith",
        stats: { views: "948", likes: "177" },
        category: "Startup"
    },
    {
        title: "E-Commerce Growth Strategy",
        prompt: "Strategic growth plan for an enterprise e-commerce platform",
        thumbnail: "/thumbnails/business_review_thumb_1766880302436.png",
        author: "Marcus Aurelius",
        stats: { views: "1.2K", likes: "245" },
        category: "Strategy"
    },
    {
        title: "AI Ethics: Research Proposal",
        prompt: "Academic proposal for ethical implementation of AI in healthcare",
        thumbnail: "/thumbnails/academic_poster_thumb_1766880338714.png",
        author: "Sophia Light",
        stats: { views: "3.5K", likes: "892" },
        category: "Research"
    },
];

export function QuickStartGrid({ onSelect }: QuickStartGridProps) {
    return (
        <div className="mt-24 w-full max-w-7xl space-y-10 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
            <div className="flex items-end justify-between px-4 pb-4 border-b border-white/[0.05]">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight">From the Community</h2>
                    <p className="text-sm text-muted/60">Explore what users are building with GLM Slide Agent.</p>
                </div>
                <button className="text-xs font-semibold text-muted hover:text-brand flex items-center gap-1.5 transition-colors group uppercase tracking-widest">
                    Browse All
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {quickStarts.map((item, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -4 }}
                        className="group flex flex-col gap-4 cursor-pointer"
                        onClick={() => onSelect(item.prompt)}
                    >
                        {/* Thumbnail Container */}
                        <div className="aspect-[16/9] w-full rounded-[1.5rem] bg-surface/50 border border-white/5 overflow-hidden relative shadow-2xl transition-all duration-500 group-hover:border-brand/20 group-hover:shadow-brand/5">
                            <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex justify-between items-center text-white">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">{item.category}</span>
                                <div className="p-2 bg-brand text-black rounded-full shadow-lg">
                                    <Sparkles className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        {/* Info Header */}
                        <div className="px-2 space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg tracking-tight group-hover:text-brand transition-colors">{item.title}</h3>
                                <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] bg-white/5 px-2 py-0.5 rounded">Free</span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted/60">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-brand/20 to-blue-500/20 border border-white/5" />
                                    <span className="font-medium hover:text-foreground transition-colors">{item.author}</span>
                                </div>

                                <div className="flex items-center gap-4 font-mono tracking-tighter">
                                    <div className="flex items-center gap-1.5">
                                        <MessageSquare className="h-3 w-3" />
                                        {item.stats.views}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Heart className="h-3 w-3" />
                                        {item.stats.likes}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
