"use client";

export function Footer() {
    return (
        <footer className="relative z-50 p-8 text-center bg-gradient-to-t from-black to-transparent">
            <p className="text-[10px] font-medium tracking-[0.3em] text-muted/40 uppercase flex items-center justify-center gap-4">
                Powered by Gemini 3 <span className="w-1.5 h-1.5 rounded-full bg-border" /> Instant Generation <span className="w-1.5 h-1.5 rounded-full bg-border" /> Export to PPTX
            </p>
        </footer>
    );
}
