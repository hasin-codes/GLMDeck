"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Maximize2, Sparkles, Layout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SlidePreviewProps {
    currentSlide: any;
    currentSlideIndex: number;
    totalSlides: number;
    onNext: () => void;
    onPrev: () => void;
    isLoading?: boolean;
}

export function SlidePreview({ currentSlide, currentSlideIndex, totalSlides, onNext, onPrev, isLoading }: SlidePreviewProps) {
    if (isLoading || !currentSlide) {
        return (
            <div className="flex-1 bg-[#030303] relative flex flex-col items-center justify-center overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 blur-[120px] rounded-full" />

                <div className="relative z-10 flex flex-col items-center gap-12">
                    {/* Floating Component Windows */}
                    <div className="relative w-[320px] h-[220px]">
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl p-4 overflow-hidden"
                        >
                            <div className="flex gap-1.5 mb-4">
                                <div className="h-2 w-2 rounded-full bg-red-500/20" />
                                <div className="h-2 w-2 rounded-full bg-yellow-500/20" />
                                <div className="h-2 w-2 rounded-full bg-green-500/20" />
                                <div className="ml-2 text-[8px] text-muted/40 font-mono tracking-wider">slide_content.tsx</div>
                            </div>

                            <div className="space-y-3">
                                <motion.div
                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="h-2 w-3/4 bg-brand/40 rounded-full blur-[1px]"
                                />
                                <div className="h-2 w-5/6 bg-white/5 rounded-full" />
                                <div className="h-2 w-1/2 bg-white/5 rounded-full" />
                                <div className="flex gap-2 pt-4">
                                    <div className="h-6 w-16 bg-brand/20 rounded-lg border border-brand/20" />
                                    <div className="h-6 w-16 bg-white/5 rounded-lg border border-white/5" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Secondary Window Shadow/Glow */}
                        <motion.div
                            animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-4 -right-8 w-48 h-32 bg-[#0A0A0A]/80 border border-white/5 rounded-xl backdrop-blur-xl p-3 opacity-60"
                        >
                            <div className="h-1.5 w-1/2 bg-white/10 rounded-full mb-2" />
                            <div className="h-1.5 w-3/4 bg-brand/20 rounded-full" />
                        </motion.div>
                    </div>

                    {/* Status Text */}
                    <div className="flex flex-col items-center gap-2">
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-sm font-medium text-white tracking-tight"
                        >
                            Building presentation...
                        </motion.div>
                        <div className="text-[10px] text-muted uppercase tracking-[0.3em] font-semibold">
                            Synthesizing structures
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-black relative flex flex-col">
            {/* Canvas Area with Transitions */}
            <div className="flex-1 flex items-center justify-center p-12 relative">
                {/* Slide Navigation Overlay */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-8 z-30">
                    <div className="flex items-center gap-1 bg-surface/80 backdrop-blur-md border border-white/5 rounded-full p-1.5 shadow-2xl">
                        <button
                            onClick={onPrev}
                            disabled={currentSlideIndex === 0}
                            className="p-2 hover:bg-white/5 rounded-full text-muted disabled:opacity-20 transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-xs font-bold tracking-widest px-4 uppercase text-foreground/80 min-w-[120px] text-center">
                            Slide {currentSlideIndex + 1} of {totalSlides}
                        </span>
                        <button
                            onClick={onNext}
                            disabled={currentSlideIndex === totalSlides - 1}
                            className="p-2 hover:bg-white/5 rounded-full text-muted disabled:opacity-20 transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex items-center bg-surface/80 backdrop-blur-md border border-white/5 rounded-full p-1.5 shadow-2xl">
                        <button className="p-2 hover:bg-white/5 rounded-full text-muted transition-colors">
                            <Maximize2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide.id}
                        initial={{ opacity: 0, scale: 0.98, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 1.02, x: -20 }}
                        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                        className="aspect-[16/9] w-full max-w-[1000px] bg-white shadow-[0_0_100px_rgba(52,178,123,0.1)] rounded-sm overflow-hidden flex relative group"
                    >
                        {/* Slide content based on type */}
                        {currentSlide.type === "metrics" ? (
                            <div className="w-full h-full bg-slate-50 p-12 font-sans text-slate-800 flex flex-col relative overflow-hidden">
                                {/* Decorative Background */}
                                <div className="absolute top-0 right-0 w-2/5 h-full bg-blue-50 transform skew-x-12 translate-x-20" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />

                                {/* Header */}
                                <div className="flex justify-between items-end mb-10 z-10">
                                    <div>
                                        <h2 className="text-sm font-bold text-indigo-600 tracking-widest uppercase mb-2">{currentSlide.kicker}</h2>
                                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{currentSlide.title}</h1>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-500 font-medium">{currentSlide.category}</p>
                                    </div>
                                </div>

                                {/* Main Grid */}
                                <div className="grid grid-cols-12 gap-8 flex-1 z-10 overflow-hidden">
                                    {/* Hero Metric Card (Left Column) */}
                                    <div className="col-span-12 lg:col-span-5 bg-white rounded-3xl shadow-xl p-8 flex flex-col justify-between border-l-8 border-indigo-600 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-6 opacity-10">
                                            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                            </svg>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-500 mb-1">{currentSlide.heroMetric.label}</h3>
                                            <div className="flex items-baseline gap-4">
                                                <span className="text-7xl font-black text-indigo-900 tracking-tighter">{currentSlide.heroMetric.value}</span>
                                                <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full flex items-center shadow-sm">
                                                    <div className="w-2 h-2 mr-1.5 bg-green-500 rounded-full animate-pulse" />
                                                    {currentSlide.heroMetric.badge}
                                                </span>
                                            </div>
                                            <p className="mt-6 text-slate-600 leading-relaxed text-sm">
                                                {currentSlide.heroMetric.desc}
                                            </p>
                                        </div>

                                        {/* Chart Visualization Area */}
                                        <div className="mt-8 h-32 w-full bg-slate-50 rounded-xl overflow-hidden relative border border-slate-100">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent" />
                                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white/20 backdrop-blur-sm p-4 text-[10px] font-mono text-indigo-400">
                                                // growth_trend_curve_active
                                            </div>
                                        </div>
                                    </div>

                                    {/* Secondary Metrics (Right Column) */}
                                    <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-6 content-start">
                                        {/* Metric Cards */}
                                        <div className="col-span-2 bg-white rounded-2xl shadow-md p-6 flex items-center justify-between border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{currentSlide.secondaryMetrics[0].label}</p>
                                                    <p className="text-3xl font-bold text-slate-900">{currentSlide.secondaryMetrics[0].value}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {currentSlide.secondaryMetrics.slice(1).map((m: any, idx: number) => (
                                            <div key={idx} className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className={cn("p-3 rounded-lg", m.color === 'purple' ? "bg-purple-100 text-purple-600" : "bg-pink-100 text-pink-600")}>
                                                        <Layout className="w-6 h-6" />
                                                    </div>
                                                    {m.badge && <span className="text-green-600 text-[10px] font-bold bg-green-50 px-2 py-1 rounded">{m.badge}</span>}
                                                    {m.target && <span className="text-slate-400 text-[10px] font-bold">{m.target}</span>}
                                                </div>
                                                <div>
                                                    <p className="text-3xl font-bold text-slate-900 mb-1">{m.value}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-slate-400 text-[10px] font-medium uppercase tracking-widest">
                                    <span>CONFIDENTIAL - INTERNAL USE ONLY</span>
                                    <span>SLIDE {currentSlideIndex + 1} OF {totalSlides}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 p-16 flex flex-col justify-center gap-8">
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className={cn(
                                        "font-display text-black leading-tight border-b-2 border-brand pb-8 inline-block",
                                        currentSlide.type === "title" ? "text-7xl font-semibold border-none pb-0" : "text-5xl max-w-[80%]"
                                    )}
                                >
                                    {currentSlide.title}
                                </motion.h1>

                                {currentSlide.type === "bullets" && currentSlide.items && (
                                    <ul className="space-y-6">
                                        {currentSlide.items.map((item: string, i: number) => (
                                            <motion.li
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + i * 0.1 }}
                                                key={i}
                                                className="flex items-start gap-4 group/item"
                                            >
                                                <div className="mt-2.5 h-2 w-2 rounded-full bg-brand group-hover/item:scale-150 transition-transform duration-300" />
                                                <span className="text-xl text-zinc-600 font-light">{item}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                )}

                                {currentSlide.type === "title" && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-2xl text-muted font-light tracking-tight"
                                    >
                                        {currentSlide.content}
                                    </motion.p>
                                )}

                                <div className="mt-auto">
                                    <p className="text-[10px] font-bold tracking-[0.4em] text-zinc-300 uppercase">Confidential • 2024</p>
                                </div>
                            </div>
                        )}

                        <div className="w-[30%] bg-zinc-50 border-l border-zinc-100 p-12 flex flex-col items-center justify-center gap-6 text-center">
                            <div className="h-16 w-16 bg-brand/10 rounded-full flex items-center justify-center mb-4">
                                <Sparkles className="h-8 w-8 text-brand" />
                            </div>
                            <p className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase leading-relaxed max-w-[150px]">
                                AI suggestion: This layout prioritizes clarity for executive audiences.
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
