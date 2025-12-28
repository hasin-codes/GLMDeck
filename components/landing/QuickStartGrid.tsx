"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, ArrowUpRight, MessageSquare, Heart, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface QuickStartGridProps {
    onSelect: (prompt: string) => void;
}

const quickStarts = [
    {
        id: "qbr-q2-2024",
        title: "Q2 Quarterly Business Review",
        prompt: "Quarterly Business Review for Q2 2024 showing 20% growth",
        thumbnail: "/thumbnails/business_review_thumb_1766880302436.png",
        author: "Sarah Chen",
        stats: { views: "2.9K", likes: "361" },
        category: "Business",
        gradient: "from-emerald-500/20 to-cyan-500/20"
    },
    {
        id: "aura-launch",
        title: "Product Launch: Aura Unleashed",
        prompt: "Sleek product launch presentation for Aura smart wearable",
        thumbnail: "/thumbnails/product_launch_thumb_1766880321184.png",
        author: "Alex Rivers",
        stats: { views: "8.7K", likes: "1.3K" },
        category: "Product",
        gradient: "from-violet-500/20 to-fuchsia-500/20"
    },
    {
        id: "climate-2024",
        title: "Global Climate Trends 2024",
        prompt: "Academic research poster on global climate trends and urban sustainability",
        thumbnail: "/thumbnails/academic_poster_thumb_1766880338714.png",
        author: "Dr. Elena Vance",
        stats: { views: "2.7K", likes: "614" },
        category: "Academic",
        gradient: "from-blue-500/20 to-indigo-500/20"
    },
    {
        id: "future-forge",
        title: "Future Forge: Startup Pitch Deck",
        prompt: "Dynamic startup pitch deck for Future Forge innovative solutions",
        thumbnail: "/thumbnails/startup_pitch_thumb_1766880357753.png",
        author: "Jordan Smith",
        stats: { views: "948", likes: "177" },
        category: "Startup",
        gradient: "from-orange-500/20 to-amber-500/20"
    },
    {
        id: "ecom-growth",
        title: "E-Commerce Growth Strategy",
        prompt: "Strategic growth plan for an enterprise e-commerce platform",
        thumbnail: "/thumbnails/business_review_thumb_1766880302436.png",
        author: "Marcus Aurelius",
        stats: { views: "1.2K", likes: "245" },
        category: "Strategy",
        gradient: "from-rose-500/20 to-pink-500/20"
    },
    {
        id: "ai-ethics",
        title: "AI Ethics: Research Proposal",
        prompt: "Academic proposal for ethical implementation of AI in healthcare",
        thumbnail: "/thumbnails/academic_poster_thumb_1766880338714.png",
        author: "Sophia Light",
        stats: { views: "3.5K", likes: "892" },
        category: "Research",
        gradient: "from-teal-500/20 to-emerald-500/20"
    },
];

function QuickStartCard({ item, onSelect }: { item: typeof quickStarts[0]; onSelect: () => void }) {
    const [imgError, setImgError] = useState(false);

    return (
        <motion.article
            whileHover={{ y: -4 }}
            className="group flex flex-col gap-4 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-[1.5rem]"
            onClick={onSelect}
            onKeyDown={(e) => e.key === "Enter" && onSelect()}
            tabIndex={0}
            role="button"
            aria-label={`Use template: ${item.title}`}
        >
            {/* Thumbnail Container */}
            <div className="aspect-[16/9] w-full rounded-[1.5rem] bg-surface/50 border border-white/5 overflow-hidden relative shadow-2xl transition-all duration-500 group-hover:border-brand/20 group-hover:shadow-brand/5 group-focus-visible:border-brand/30">
                {imgError ? (
                    <div className={`w-full h-full bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                        <div className="text-center space-y-2 p-4">
                            <Sparkles className="h-8 w-8 mx-auto text-brand/60" />
                            <p className="text-xs text-muted/60 font-medium">{item.category}</p>
                        </div>
                    </div>
                ) : (
                    <Image
                        src={item.thumbnail}
                        alt={`Preview of ${item.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={() => setImgError(true)}
                    />
                )}
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
                <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-lg tracking-tight group-hover:text-brand transition-colors truncate">{item.title}</h3>
                    <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] bg-white/5 px-2 py-0.5 rounded shrink-0">Free</span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted/60">
                    <div className="flex items-center gap-2">
                        <div className={`h-6 w-6 rounded-full bg-gradient-to-tr ${item.gradient} border border-white/5`} />
                        <span className="font-medium group-hover:text-foreground/80 transition-colors">{item.author}</span>
                    </div>

                    <div className="flex items-center gap-3 font-mono tracking-tighter">
                        <div className="flex items-center gap-1" aria-label={`${item.stats.views} views`}>
                            <Eye className="h-3 w-3" />
                            <span>{item.stats.views}</span>
                        </div>
                        <div className="flex items-center gap-1" aria-label={`${item.stats.likes} likes`}>
                            <Heart className="h-3 w-3" />
                            <span>{item.stats.likes}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

export function QuickStartGrid({ onSelect }: QuickStartGridProps) {
    return (
        <section
            className="mt-24 w-full max-w-7xl space-y-10 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500"
            aria-labelledby="community-heading"
        >
            <header className="flex items-end justify-between px-4 pb-4 border-b border-white/[0.05]">
                <div className="space-y-1">
                    <h2 id="community-heading" className="text-xl font-semibold tracking-tight">From the Community</h2>
                    <p className="text-sm text-muted/60">Explore what users are building with GLM Slide Agent.</p>
                </div>
                <button
                    className="text-xs font-semibold text-muted hover:text-brand focus-visible:text-brand flex items-center gap-1.5 transition-colors group uppercase tracking-widest outline-none focus-visible:ring-2 focus-visible:ring-brand/50 rounded px-2 py-1"
                    aria-label="Browse all community templates"
                >
                    Browse All
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
                {quickStarts.map((item) => (
                    <QuickStartCard
                        key={item.id}
                        item={item}
                        onSelect={() => onSelect(item.prompt)}
                    />
                ))}
            </div>
        </section>
    );
}
