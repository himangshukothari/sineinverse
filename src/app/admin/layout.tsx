import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
    title: 'SineInverse Admin',
    description: 'Admin panel — manage payments, cards, and settings',
    manifest: '/admin-manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'SI Admin',
    },
};

export const viewport: Viewport = {
    themeColor: '#7c3aed',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <link rel="apple-touch-icon" href="/logo-static.png" />
            {children}
        </>
    );
}
