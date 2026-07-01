import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;