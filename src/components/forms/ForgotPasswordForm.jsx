import { useState } from "react";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authService";

function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!email) {
            setError("Email is required");
            return;
        }

        try {
            setLoading(true);

            await forgotPassword(email);

            setSuccess(
                "Password reset link has been sent to your email."
            );

        } catch (error) {
            console.error("Forgot password error:", error);

            setError(
                error.message ||
                "Something went wrong. Please try again."
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
                Forgot Password?
            </h2>

            <p className="mt-3 text-gray-500">
                Enter your email address and we'll send you a
                password reset link.
            </p>

            <div className="mt-8">

                <label className="block text-sm font-medium text-text mb-2">
                    Email Address
                </label>

                <div className="relative">

                    <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                    />

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
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
                {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPasswordForm;