import { useRef, useEffect } from "react";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

export function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = (reset?: boolean) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        if (reset) {
            textarea.style.height = `${minHeight}px`;
            return;
        }

        // Reset height to read correct scrollHeight
        textarea.style.height = `${minHeight}px`;

        // Calculate new height
        const newHeight = Math.max(minHeight, textarea.scrollHeight);

        // Apply max height limit if specified
        if (maxHeight && newHeight > maxHeight) {
            textarea.style.height = `${maxHeight}px`;
            textarea.style.overflowY = "auto";
        } else {
            textarea.style.height = `${newHeight}px`;
            textarea.style.overflowY = "hidden";
        }
    };

    useEffect(() => {
        // Initial adjustment
        adjustHeight();

        // Add resize listener
        window.addEventListener("resize", () => adjustHeight());
        return () => window.removeEventListener("resize", () => adjustHeight());
    }, []);

    return { textareaRef, adjustHeight };
}
