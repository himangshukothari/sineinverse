/**
 * NextAuth.js Configuration
 * Google OAuth Provider
 */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    callbacks: {
        // Add user ID to session
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },

        // Store user ID in JWT token
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },

    pages: {
        signIn: '/login',
        error: '/login',
    },

    // Use JWT for session (works well with Vercel)
    session: {
        strategy: "jwt",
    },

    // Trust Vercel's proxy
    trustHost: true,
});
