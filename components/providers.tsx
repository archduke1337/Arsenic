"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextUIProvider } from "@nextui-org/react";
import { ReactNode, useState, useEffect } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        retry: 1,
                    },
                },
            })
    );

    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                navigator.serviceWorker.register("/sw.js").then(
                    (registration) => {
                        console.log("ServiceWorker registration successful with scope: ", registration.scope);
                    },
                    (err) => {
                        console.log("ServiceWorker registration failed: ", err);
                    }
                );
            });
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <NextUIProvider>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    <AuthProvider>{children}</AuthProvider>
                </ThemeProvider>
            </NextUIProvider>
        </QueryClientProvider>
    );
}
