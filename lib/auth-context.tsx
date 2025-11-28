"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { account } from "@/lib/appwrite";
import { ID, Models } from "appwrite";
import { isAdmin, UserRole } from "./schema";

interface AuthUser extends Models.User<Models.Preferences> {
    role: UserRole;
    isAdmin: boolean;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const enrichUser = useCallback((appwriteUser: Models.User<Models.Preferences>): AuthUser => {
        const email = appwriteUser.email || "";
        const userIsAdmin = isAdmin(email);
        // In a real app, we'd fetch the role from the database. 
        // For now, we default to 'delegate' unless they are in the admin list.
        const role: UserRole = userIsAdmin ? "admin" : "delegate";

        return {
            ...appwriteUser,
            role,
            isAdmin: userIsAdmin,
        };
    }, []);

    const checkUser = useCallback(async () => {
        try {
            const currentUser = await account.get();
            setUser(enrichUser(currentUser));
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, [enrichUser]);

    useEffect(() => {
        checkUser();
    }, [checkUser]);

    async function login(email: string, password: string) {
        await account.createEmailPasswordSession(email, password);
        await checkUser();
    }

    async function register(email: string, password: string, name: string) {
        // 1. Create Appwrite Account
        try {
            await account.create(ID.unique(), email, password, name);
        } catch (error) {
            console.error("Appwrite account creation failed:", error);
            throw new Error(`Appwrite Error: ${error instanceof Error ? error.message : "Unknown error"}`);
        }

        // 2. Create User Document via API (to be implemented fully with roles)
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(`API Error: ${data.error || data.message || "Failed to create user document"}`);
            }
        } catch (e) {
            console.error("Failed to create user document", e);
            throw new Error(`API Connection Failed: ${e instanceof Error ? e.message : "Unknown error"}`);
        }

        // 3. Login
        await login(email, password);
    }

    async function logout() {
        await account.deleteSession("current");
        setUser(null);
    }

    const value = {
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        // Return safe defaults for SSR/prerendering
        return {
            user: null,
            isLoading: true,
            login: async () => {},
            register: async () => {},
            logout: async () => {},
            isAuthenticated: false,
            isAdmin: false,
        } as AuthContextType;
    }
    return context;
}
