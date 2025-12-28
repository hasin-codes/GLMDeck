"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Settings, CreditCard, FileText, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleSignOut } from "@/app/actions/auth";

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    user: {
        firstName?: string | null;
        lastName?: string | null;
        email: string;
        profilePictureUrl?: string | null;
    };
}

export default function ProfileDropdown({
    user,
    className,
    ...props
}: ProfileDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const displayName = user.firstName || user.email.split("@")[0];

    return (
        <div className={cn("relative", className)} {...props}>
            <DropdownMenu onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="flex items-center gap-3 p-2 rounded-xl bg-surface border border-border hover:border-brand/50 transition-all duration-200 focus:outline-none"
                    >
                        <div className="h-9 w-9 rounded-full bg-surface border border-border flex items-center justify-center overflow-hidden">
                            {user.profilePictureUrl ? (
                                <Image
                                    src={user.profilePictureUrl}
                                    alt={displayName}
                                    width={36}
                                    height={36}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="h-5 w-5 text-muted" />
                            )}
                        </div>
                        <span className="text-sm font-medium text-foreground pr-1">
                            {displayName}
                        </span>
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-56 p-2 bg-surface/95 backdrop-blur-md border border-border rounded-xl shadow-xl"
                >
                    {/* User info header */}
                    <div className="px-3 py-2 mb-1">
                        <p className="text-sm font-medium text-foreground">
                            {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted truncate">
                            {user.email}
                        </p>
                    </div>

                    <DropdownMenuSeparator className="bg-border" />

                    <DropdownMenuItem asChild>
                        <Link
                            href="#"
                            className="flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                            <User className="w-4 h-4 text-muted" />
                            <span className="text-sm text-foreground">Profile</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link
                            href="#"
                            className="flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                            <Settings className="w-4 h-4 text-muted" />
                            <span className="text-sm text-foreground">Settings</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link
                            href="#"
                            className="flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                            <CreditCard className="w-4 h-4 text-muted" />
                            <span className="text-sm text-foreground">Billing</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-border" />

                    <DropdownMenuItem asChild>
                        <form action={handleSignOut} className="w-full">
                            <button
                                type="submit"
                                className="w-full flex items-center gap-3 p-2.5 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer text-left"
                            >
                                <LogOut className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-red-500">Sign out</span>
                            </button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

