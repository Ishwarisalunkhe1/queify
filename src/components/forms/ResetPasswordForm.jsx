
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const handleRecoverySession = async () => {

            const { error } =
                await supabase.auth.getSession();

            if (error) {
                console.error(
                    "Recovery session error:",
                    error
                );

                setError(
                    "This password reset link is invalid or expired."
                );
            }
        };

        handleRecoverySession();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!password || !confirmPassword) {
            setError("Please fill in both password fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await resetPassword(password);

            setSuccess(
                "Password updated successfully. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {
            console.error("Reset password error:", error);

            setError(
                error.message ||
                "Unable to reset password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-gray-100 p-10"
        >

            <h2 className="text-4xl font-bold text-text">
                Reset Password
            </h2>

            <p className="mt-3 text-gray-500">
                Enter your new password below.
            </p>

            {/* New Password */}

            <div className="mt-8">

                <label className="block text-sm font-medium text-text mb-2">
                    New Password
                </label>

                <div className="relative">

                    <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                    />

                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                            setSuccess("");
                        }}
                        className="w-full rounded-xl border border-gray-300 pl-12 pr-4 py-3 text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                    />

                </div>

            </div>

            {/* Confirm Password */}

            <div className="mt-5">

                <label className="block text-sm font-medium text-text mb-2">
                    Confirm Password
                </label>

                <div className="relative">

                    <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                    />

                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setError("");
                            setSuccess("");
                        }}
                        className="w-full rounded-xl border border-gray-300 pl-12 pr-4 py-3 text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                    />

                </div>

            </div>

            {error && (
                <p className="mt-3 text-red-500 text-sm">
                    {error}
                </p>
            )}

            {success && (
                <p className="mt-3 text-green-600 text-sm">
                    {success}
                </p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-primary text-white py-3.5 rounded-xl font-semibold shadow-md transition hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? "Updating..." : "Update Password"}
            </button>

            <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full mt-4 text-secondary font-semibold hover:underline"
            >
                Back to Login
            </button>

        </form>
    );
}

export default ResetPasswordForm;