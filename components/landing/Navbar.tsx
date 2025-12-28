"use client";

import Link from "next/link";
import { Sparkles, User } from "lucide-react";

export function Navbar() {
    return (
        <header className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer transition-transform active:scale-95">
                <div className="h-10 w-10 bg-brand rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(52,178,123,0.4)]">
                    <Sparkles className="text-black h-6 w-6" fill="currentColor" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    GLM Agent
                </span>
            </Link>

            <nav className="flex items-center gap-6">
                <button className="text-sm font-medium text-muted hover:text-foreground transition-colors">Documentation</button>
                <div className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center cursor-pointer hover:border-brand/50 transition-colors">
                    <User className="h-5 w-5 text-muted" />
                </div>
            </nav>
        </header>
    );
}
