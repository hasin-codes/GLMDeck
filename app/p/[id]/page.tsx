"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { TopBar } from "@/components/workspace/TopBar";
import { ChatPanel } from "@/components/workspace/ChatPanel";
import { SlidePreview } from "@/components/workspace/SlidePreview";
import { ThumbnailStrip } from "@/components/workspace/ThumbnailStrip";

const slidesData = [
    {
        id: 1,
        type: "metrics",
        kicker: "QBR Q2 2024",
        title: "The Growth Engine",
        category: "Business Performance",
        heroMetric: {
            label: "Revenue Growth (QoQ)",
            value: "20%",
            badge: "Target Exceeded",
            desc: "Momentum is accelerating. We've successfully compressed our sales cycle while expanding average deal size, driving our strongest quarter to date."
        },
        secondaryMetrics: [
            { label: "Annual Recurring Revenue", value: "$12.4M", trend: "up", color: "blue" },
            { label: "Net Revenue Retention", value: "118%", trend: "up", color: "purple", badge: "+4% QoQ" },
            { label: "CAC Payback Period", value: "9 Mo", trend: "down", color: "pink", target: "Target: <12mo" }
        ]
    },
    {
        id: 2,
        type: "bullets",
        title: "Strategic Expansion",
        items: [
            "Successfully entered 3 new Enterprise markets in EMEA",
            "Partnership signed with Global Tech Solutions for distribution",
            "Customer Acquisition Cost decreased by 15% overall"
        ]
    },
    {
        id: 3,
        type: "chart",
        title: "Market Share Projection",
        content: "Projected to reach 25% market share by end of fiscal year."
    },
    {
        id: 4,
        type: "bullets",
        title: "Product Roadmap",
        items: [
            "Q3: Multi-region cloud deployment",
            "Q4: AI-driven predictive modeling beta",
            "Q1 2025: Enterprise security suite v2"
        ]
    },
    {
        id: 5,
        type: "title",
        title: "Q&A & Next Steps",
        subtitle: "Looking ahead to Q3",
        content: "Strategic alignment and execution focus."
    }
];

export default function ProjectPage() {
    const params = useParams();
    const projectId = params?.id as string;

    const [visibleSlides, setVisibleSlides] = React.useState<typeof slidesData>([]);
    const [isBuilding, setIsBuilding] = React.useState(true);
    const [messages, setMessages] = React.useState([
        { role: "ai", content: "I've analyzed your request. I'm now drafting a presentation focused on your requirements. One moment while I synthesize the content..." },
    ]);
    const [input, setInput] = React.useState("");
    const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);

    // Simulate generation sequence - runs once on mount
    React.useEffect(() => {
        console.log("[Slides] Starting slide generation sequence...");

        // Wait 3 seconds for the skeleton/building animation, then reveal slides
        const skeletonTimer = setTimeout(() => {
            console.log("[Slides] Skeleton complete, revealing slides...");
            setIsBuilding(false);

            // Add all slides at once after skeleton
            setVisibleSlides(slidesData);
            console.log(`[Slides] ${slidesData.length} slides prepared and presented to user`);

            // Add completion message
            setMessages(prev => [...prev, {
                role: "ai",
                content: "I've finished drafting your presentation! You have 5 slides ready. How do they look?"
            }]);
        }, 3000);

        return () => {
            console.log("[Slides] Cleanup timer");
            clearTimeout(skeletonTimer);
        };
    }, []);

    const currentSlide = visibleSlides[currentSlideIndex];
    const totalSlides = visibleSlides.length;

    const handleNext = () => {
        if (currentSlideIndex < totalSlides - 1) setCurrentSlideIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentSlideIndex > 0) setCurrentSlideIndex(prev => prev - 1);
    };

    const handleSendMessage = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, { role: "user", content: input }]);
        setInput("");
        // Mock AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: "ai", content: "Understood. Applying those changes to the current slide deck. One moment..." }]);
        }, 1000);
    };

    return (
        <div className="h-screen bg-background flex flex-col overflow-hidden">
            <TopBar projectId={projectId} />

            <div className="flex-1 flex overflow-hidden">
                <ChatPanel
                    messages={messages}
                    input={input}
                    setInput={setInput}
                    onSendMessage={handleSendMessage}
                />

                <div className="flex-1 bg-black relative flex flex-col">
                    <SlidePreview
                        currentSlide={currentSlide}
                        currentSlideIndex={currentSlideIndex}
                        totalSlides={totalSlides}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        isLoading={isBuilding}
                    />

                    <ThumbnailStrip
                        slides={visibleSlides}
                        currentSlideIndex={currentSlideIndex}
                        onSelectSlide={setCurrentSlideIndex}
                    />
                </div>
            </div>
        </div>
    );
}

