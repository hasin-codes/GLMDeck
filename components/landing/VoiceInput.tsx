"use client";

import { useState } from "react";
import { AudioLines, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function VoiceInput() {
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);

    const handleVoiceClick = () => {
        if (isTranscribing) return;

        if (isRecording) {
            // Stop recording, start transcribing
            setIsRecording(false);
            setIsTranscribing(true);
            setTimeout(() => {
                setIsTranscribing(false);
            }, 3000);
        } else {
            // Start recording
            setIsRecording(true);
        }
    };

    return (
        <button
            type="button"
            onClick={handleVoiceClick}
            className={cn(
                "h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out overflow-hidden relative",
                isRecording ? "w-16 bg-brand" : "w-8 bg-brand hover:scale-105"
            )}
            title={isRecording ? "Stop recording" : "Start recording"}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                {isTranscribing ? (
                    <Loader2 className="w-4 h-4 text-black animate-spin" />
                ) : isRecording ? (
                    <div className="flex items-center gap-[3px] h-3">
                        <div className="w-[2px] bg-black h-full animate-[wave_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }} />
                        <div className="w-[2px] bg-black h-full animate-[wave_0.8s_ease-in-out_infinite_0.1s]" style={{ animationDelay: '100ms' }} />
                        <div className="w-[2px] bg-black h-full animate-[wave_0.8s_ease-in-out_infinite_0.2s]" style={{ animationDelay: '200ms' }} />
                        <div className="w-[2px] bg-black h-full animate-[wave_0.8s_ease-in-out_infinite_0.1s]" style={{ animationDelay: '100ms' }} />
                        <div className="w-[2px] bg-black h-full animate-[wave_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }} />
                    </div>
                ) : (
                    <AudioLines className="w-4 h-4 text-black" />
                )}
            </div>
            <style jsx>{`
                @keyframes wave {
                    0%, 100% { height: 30%; opacity: 0.5; }
                    50% { height: 100%; opacity: 1; }
                }
            `}</style>
        </button>
    );
}
