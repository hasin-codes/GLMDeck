"use client";

import Link from "next/link";
import { Home, History, Settings, Share2, Download } from "lucide-react";
import { PremiumButton } from "@/components/ui-premium";
import { cn } from "@/lib/utils";

interface TopBarProps {
    projectId: string;
    hasSlides: boolean;
}

export function TopBar({ projectId, hasSlides }: TopBarProps) {
    return (
        <header className="h-16 flex items-center justify-between px-6 bg-surface/50 backdrop-blur-md relative z-50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] border-b-0">
            <div className="flex items-center gap-4">
                <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition-colors group">
                    <Home className="h-4 w-4 text-muted group-hover:text-foreground" />
                </Link>
                <div className="h-4 w-px bg-border" />
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-muted uppercase tracking-wider">
                        Project: {projectId?.slice(0, 8)}...
                    </span>
                    <span className="text-[10px] text-brand font-semibold uppercase tracking-[0.2em] flex items-center gap-1.5">
                        <span className={`w-1 h-1 rounded-full ${hasSlides ? 'bg-brand animate-pulse' : 'bg-yellow-500'}`} />
                        {hasSlides ? 'Ready' : 'Building...'}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted">
                    <History className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted">
                    <Settings className="h-4 w-4" />
                </button>
                <div className="h-4 w-px bg-border mx-1" />
                <PremiumButton
                    variant="outline"
                    size="sm"
                    className={cn("gap-2", !hasSlides && "opacity-50 pointer-events-none grayscale")}
                    disabled={!hasSlides}
                >
                    <Share2 className="h-3.5 w-3.5" /> Share
                </PremiumButton>
                <PremiumButton
                    variant="primary"
                    size="sm"
                    className={cn("gap-2 shadow-none", !hasSlides && "opacity-50 pointer-events-none grayscale")}
                    disabled={!hasSlides}
                >
                    <Download className="h-3.5 w-3.5" /> Export
                </PremiumButton>
            </div>
        </header>
    );
}
