import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#000000" },
    ],
};

export const metadata: Metadata = {
    metadataBase: new URL("https://arsenicsummit.com"),
    title: {
        default: "Arsenic Summit | Premier Parliamentary Simulation Platform",
        template: "%s | Arsenic Summit",
    },
    description: "Join the ultimate Model United Nations and Youth Parliament experience. Register for committees, manage allocations, and connect with delegates worldwide.",
    keywords: ["MUN", "Model United Nations", "Youth Parliament", "Debate", "Conference", "Arsenic Summit"],
    authors: [{ name: "Arsenic Team" }],
    creator: "Arsenic Summit",
    manifest: "/manifest.json",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://arsenic-summit.com",
        siteName: "Arsenic Summit",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Arsenic Summit Platform",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Arsenic Summit | Premier Parliamentary Simulation Platform",
        description: "Join the ultimate Model United Nations and Youth Parliament experience.",
        images: ["/og-image.jpg"],
        creator: "@arsenic_summit",
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Arsenic Summit",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} bg-white text-slate-900 dark:bg-black dark:text-white`}>
                <Providers>
                    <div className="flex flex-col min-h-screen relative">
                        <div className="bg-noise" />
                        <Navbar />
                        <main className="flex-grow">{children}</main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
