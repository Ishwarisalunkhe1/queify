import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Phone, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../services/authService";
import { createBusinessApplication } from "../../services/businessApplicationService";

function BusinessSignupForm() {

    const navigate = useNavigate();

    const [ownerName, setOwnerName] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({}); const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const validateForm = () => {
        let newErrors = {};

        if (!ownerName.trim()) {
            newErrors.ownerName = "Owner name is required";
        }

        if (!businessName.trim()) {
            newErrors.businessName = "Business name is required";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = "Enter a valid 10-digit phone number";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    return (
        <form onSubmit={async (e) => {
            e.preventDefault();

            setErrorMessage("");

            const isValid = validateForm();

            if (!isValid) return;

            try {
                setLoading(true);
                console.log("Signup data:", {
                    email,
                    ownerName,
                    phone,
                });

                const data = await signupUser(
                    email,
                    password,
                    ownerName,
                    phone
                );

                console.log("Signup successful:", data);
                navigate("/verify-email", {
                    state: {
                        email,
                        businessName,
                        ownerName,
                        phone,
                    },
                });

                console.log("Business application created");

            } catch (error) {
                console.error("Signup error:", error);
                setErrorMessage(error.message);
            } finally {
                setLoading(false);
            }
        }} >

            {/* Heading */}

            <h2 className="text-4xl font-bold text-text">
                Register Your Business
            </h2>

            <p className="mt-3 text-gray-500">
                Submit your business for approval on QUEIFY.
            </p>


            {/* Owner Name */}

            <div className="mt-8">

                <label className="block text-sm font-medium text-text mb-2">
                    Owner Name
                </label>

                <div className="relative">

                    <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                    />

                    <input
                        type="text"
                        placeholder="Enter owner name"
                        value={ownerName}
                        onChange={(e) => {
                            setOwnerName(e.target.value);

                            if (errors.ownerName) {
                                setErrors({
                                    ...errors,
                                    ownerName: ""
                                });
                            }
                        }}
                        className="w-full rounded-xl border border-gray-300 pl-12 pr-4 py-3 text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                    />
                    {errors.ownerName && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.ownerName}
                        </p>
                    )}

                </div>

            </div>


            {/* Business Name */}

            <div className="mt-5">

                <label className="block text-sm font-medium text-text mb-2">
                    Business Name
                </label>

                <div className="relative">

                    <Store
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                    />

                    <input
                        type="text"
                        placeholder="Enter business name"
                        value={businessName}
                        onChange={(e) => {
                            setBusinessName(e.target.value);

                            if (errors.businessName) {
                                setErrors({
                                    ...errors,
                                    businessName: ""
                                });
                            }
                        }}
                        className="w-full rounded-xl border border-gray-300 pl-12 pr-4 py-3 text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                    />
                    {errors.businessName && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.businessName}
                        </p>
                    )}

                </div>

            </div>


            {/* Email */}

            <div className="mt-5">

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
                        placeholder="Enter business owner email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);

                            if (errors.email) {
                                setErrors({
                                    ...errors,
                                    email: ""
                                });
                            }
                        }}
                        className="w-full rounded-xl border border-gray-300 pl-12 pr-4 py-3 text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.email}
                        </p>
                    )}

                </div>

            </div>


            {/* Phone */}

            <div className="mt-5">

                <label className="block text-sm font-medium text-text mb-2">
                    Phone Number
                </label>

                <div className="relative">

                    <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                    />

                    <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value);

                            if (errors.phone) {
                                setErrors({
                                    ...errors,
                                    phone: ""
                                });
                            }
                        }}
                        className="w-full rounded-xl border border-gray-300 pl-12 pr-4 py-3 text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.phone}
                        </p>
                    )}

                </div>

            </div>


            {/* Password */}

            <div className="mt-5">

                <label className="block text-sm font-medium text-text mb-2">
                    Password
                </label>

                <div className="relative">

                    <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                    />

                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);

                            if (errors.password) {
                                setErrors({
                                    ...errors,
                                    password: ""
                                });
                            }
                        }}
                        className="w-full rounded-xl border border-gray-300 pl-12 pr-12 py-3 text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.password}
                        </p>
                    )}

                    {showPassword ? (
                        <EyeOff
                            onClick={() => setShowPassword(false)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            size={20}
                        />
                    ) : (
                        <Eye
                            onClick={() => setShowPassword(true)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            size={20}
                        />
                    )}

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
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);

                            if (errors.confirmPassword) {
                                setErrors({
                                    ...errors,
                                    confirmPassword: ""
                                });
                            }
                        }}
                        className="w-full rounded-xl border border-gray-300 pl-12 pr-12 py-3 text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.confirmPassword}
                        </p>
                    )}

                    {showConfirmPassword ? (
                        <EyeOff
                            onClick={() => setShowConfirmPassword(false)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            size={20}
                        />
                    ) : (
                        <Eye
                            onClick={() => setShowConfirmPassword(true)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            size={20}
                        />
                    )}

                </div>

            </div>


            {/* Submit */}

            {errorMessage && (
                <p className="text-red-500 text-sm mt-4">
                    {errorMessage}
                </p>
            )}
            <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-primary text-white py-3.5 rounded-xl font-semibold shadow-md transition hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? "Creating Account..." : "Submit Application"}
            </button>


            {/* Login */}

            <p className="text-center mt-6 text-gray-600">

                Already have an account?

                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="ml-2 text-secondary font-semibold hover:underline"
                >
                    Login
                </button>

            </p>

        </form>
    );
}

export default BusinessSignupForm;