import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import API_URL from "@/config/api";


// Mock User Type
export type MockUser = {
  id: string;
  email: string;
  role: "admin" | "participant";
  teamName?: string;
};

interface AuthContextType {
  user: MockUser | null;
  login: (email: string, password: string) => Promise<{ user: MockUser | null; error: string | null }>;
  register: (email: string, password: string, teamName: string, teamMember1: string, teamMember2: string, teamMember3: string, collegeName: string) => Promise<{ user: MockUser | null; error: string | null }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin Credentials
const MOCK_ADMIN = {
  email: "admin@ctf.com",
  password: "admin",
  role: "admin" as const,
  id: "admin-123",
  teamName: "Admin Team"
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(() => {
    try {
      const storedUser = localStorage.getItem("mock_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse stored user", error);
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    // Check hardcoded admin first
    if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
      const u = { ...MOCK_ADMIN };
      setUser(u);
      localStorage.setItem("mock_user", JSON.stringify(u));
      setIsLoading(false);
      return { user: u, error: null };
    }

    // Try database for participants
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem("mock_user", JSON.stringify(data.user));
        return { user: data.user, error: null };
      } else {
        return { user: null, error: data.error };
      }
    } catch (error) {
      return { user: null, error: "Network error" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, teamName: string, teamMember1: string, teamMember2: string, teamMember3: string, collegeName: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, teamName, teamMember1, teamMember2, teamMember3, collegeName }),
      });
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem("mock_user", JSON.stringify(data.user));
        return { user: data.user, error: null };
      } else {
        return { user: null, error: data.error };
      }
    } catch (error) {
      return { user: null, error: "Network error" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mock_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
