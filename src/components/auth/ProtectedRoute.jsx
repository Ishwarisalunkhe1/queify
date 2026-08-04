import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    console.log("Protected Route:", {
        user,
        loading
    });


    // Wait until Supabase finishes checking the session
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-medium text-gray-600">
                    Loading...
                </p>
            </div>
        );
    }

    // No logged-in user → redirect to login
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Logged-in user → allow access
    return children;
}

export default ProtectedRoute;