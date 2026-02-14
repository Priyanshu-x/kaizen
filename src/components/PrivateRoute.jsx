import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "./LoadingScreen";

export function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        // Optional: Add a loading spinner here
        return <LoadingScreen />;
    }

    return user ? children : <Navigate to="/login" />;
}
