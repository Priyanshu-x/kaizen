import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        // Optional: Add a loading spinner here
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return user ? children : <Navigate to="/login" />;
}
