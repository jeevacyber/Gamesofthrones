import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
    const { user, isLoading } = useAuth();

    // While checking authentication, show nothing or a loading spinner
    if (isLoading) {
        return null;
    }

    // If no user is logged in, redirect to landing page
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // If route requires admin but user is not admin, redirect to landing page
    if (adminOnly && user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    // User is authenticated and authorized
    return <>{children}</>;
};

export default ProtectedRoute;
