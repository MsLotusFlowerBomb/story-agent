"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
    name: string;
    role: "kid" | "parent";
}

interface AuthContextType {
    user: User | null;
    login: (name: string, role: "kid" | "parent") => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const login = (name: string, role: "kid" | "parent") => {
        setUser({ name, role });
        // Redirect based on role
        if (role === "parent") {
            router.push("/parent-zone");
        } else {
            router.push("/");
        }
    };

    const logout = () => {
        setUser(null);
        router.push("/login"); // Assuming we have a login page
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
