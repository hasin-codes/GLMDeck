import Link from "next/link";
import { Sparkles } from "lucide-react";
import { withAuth, getSignUpUrl } from "@workos-inc/authkit-nextjs";
import ProfileDropdown from "@/components/kokonutui/profile-dropdown";

export async function Navbar() {
    const { user } = await withAuth();
    const signUpUrl = await getSignUpUrl();

    return (
        <header className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer transition-transform active:scale-95">
                <div className="h-10 w-10 bg-brand rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(52,178,123,0.4)]">
                    <Sparkles className="text-black h-6 w-6" fill="currentColor" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    GLM Deck
                </span>
            </Link>

            <nav className="flex items-center gap-4">
                <button className="text-sm font-medium text-muted hover:text-foreground transition-colors">Documentation</button>

                {!user ? (
                    <>
                        <a
                            href="/login"
                            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
                        >
                            Sign in
                        </a>
                        <Link
                            href={signUpUrl}
                            className="px-4 py-2 rounded-lg bg-brand text-black text-sm font-semibold hover:bg-brand/90 transition-colors"
                        >
                            Sign up
                        </Link>
                    </>
                ) : (
                    <ProfileDropdown user={user} />
                )}
            </nav>
        </header>
    );
}


