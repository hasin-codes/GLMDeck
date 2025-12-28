import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "outline";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

const PremiumButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
        const variants = {
            primary: "bg-brand text-black hover:opacity-90 shadow-[0_0_20px_rgba(52,178,123,0.3)]",
            secondary: "bg-surface text-foreground border border-border hover:bg-border/50",
            ghost: "bg-transparent hover:bg-white/5",
            outline: "bg-transparent border border-brand/50 text-brand hover:bg-brand/10",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-xs",
            md: "px-5 py-2.5 text-sm",
            lg: "px-8 py-4 text-base",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "relative inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group overflow-hidden",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                <span className={cn("relative z-10 flex items-center gap-2", isLoading && "opacity-0")}>
                    {children}
                </span>
                {isLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    </div>
                )}
                {/* Hover shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </button>
        );
    }
);

PremiumButton.displayName = "PremiumButton";

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("glass rounded-3xl p-6 shadow-2xl relative overflow-hidden group", className)}>
        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative z-10">{children}</div>
    </div>
);

export { PremiumButton, GlassCard };
