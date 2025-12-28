"use client";

export function HeroSection() {
    return (
        <div className="text-center mb-12 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-6xl md:text-7xl font-display font-medium leading-[1.1] tracking-tight max-w-3xl mx-auto italic">
                Design <span className="text-white not-italic font-semibold">thoughtful</span> Pitch Deck.
            </h1>
            <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto font-light leading-relaxed">
                From product launches to complex research, transform your ideas into professional narratives through conversation.
            </p>
        </div>
    );
}
