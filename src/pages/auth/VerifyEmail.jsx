import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useLocation, useNavigate } from "react-router-dom";
import { createBusinessApplication } from "../../services/businessApplicationService";

function VerifyEmail() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        email = "",
        businessName = "",
        ownerName = "",
        phone = "",
    } = location.state || {};

    const [code, setCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        if (code.length !== 8) {
            setErrorMessage("Please enter the 8-digit verification code.");
            return;
        }

        try {
            setLoading(true);

            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token: code,
                type: "email",
            });

            if (error) {
                throw error;
            }

            console.log("Email verified:", data);

            await createBusinessApplication({
                email,
                businessName,
                ownerName,
                phone,
            });

            setSuccessMessage(
                "Email verified and business application submitted successfully!"
            );

            navigate("/");

        } catch (error) {
            console.error("Verification error:", error);
            setErrorMessage(
                error.message || "Invalid verification code."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">

            <form
                onSubmit={handleVerify}
                className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-gray-100 p-10"
            >

                <h2 className="text-3xl font-bold text-text">
                    Verify Your Email
                </h2>

                <p className="mt-3 text-gray-500">
                    We sent an 8-digit verification code to:
                </p>

                <p className="mt-2 font-semibold text-text">
                    {email}
                </p>

                <div className="mt-8">

                    <label className="block text-sm font-medium text-text mb-2">
                        Verification Code
                    </label>

                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={8}
                        placeholder="Enter 8-digit code"
                        value={code}
                        onChange={(e) => {
                            const value = e.target.value
                                .replace(/\D/g, "");

                            setCode(value);
                            setErrorMessage("");
                        }}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-xl tracking-[0.5em] text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                    />

                </div>

                {errorMessage && (
                    <p className="mt-3 text-red-500 text-sm">
                        {errorMessage}
                    </p>
                )}

                {successMessage && (
                    <p className="mt-3 text-green-600 text-sm">
                        {successMessage}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-primary text-white py-3.5 rounded-xl font-semibold shadow-md transition hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? "Verifying..." : "Verify Email"}
                </button>

            </form>

        </div>
    );
}

export default VerifyEmail;