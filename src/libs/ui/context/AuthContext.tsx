import { createContext, useState, useContext, ReactNode } from "react";
type UserRole = "admin" | "user" | "editor";
interface AuthType {
    isLogin: boolean; 
    login: (userRole: UserRole) => void;
    logout: () => void;
    role: UserRole | null
}

const AuthContext = createContext<AuthType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLogin, setIsLogin] = useState<boolean>(
        localStorage.getItem("isLogIn") === "true"
    );
    const [role, setRole] = useState<UserRole | null>(
        (localStorage.getItem("role") as UserRole) || null
    );
    const login = (userRole: UserRole) => {
        localStorage.setItem("isLogIn", "true");
        localStorage.setItem("role", userRole);
        setIsLogin(true);
        setRole(userRole);
    };

    const logout = () => {
        localStorage.removeItem("isLogIn");
        localStorage.removeItem("role");
        setIsLogin(false);
        setRole(null);
    };
    
    return (
        <AuthContext.Provider value={{ isLogin, login, logout, role }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
