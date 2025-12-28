import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

// Page-based auth: protected routes are determined via withAuth({ ensureSignedIn: true })
export default authkitMiddleware();

// Match against pages that require authentication
export const config = {
    matcher: ['/', '/p/:path*', '/callback', '/login'],
};
