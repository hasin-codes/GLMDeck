"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AiPrompt } from "@/components/landing/AiPrompt";
import { QuickStartGrid } from "@/components/landing/QuickStartGrid";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  const [prompt, setPrompt] = React.useState("");
  const router = useRouter();

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11);
    router.push(`/p/${id}`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <Navbar />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-7xl mx-auto w-full">
        <HeroSection />

        <AiPrompt
          prompt={prompt}
          setPrompt={setPrompt}
          handleGenerate={handleGenerate}
        />

        <QuickStartGrid onSelect={setPrompt} />
      </main>

      <Footer />
    </div>
  );
}
