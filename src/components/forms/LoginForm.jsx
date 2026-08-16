import React from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useNavigate } from 'react-router-dom'


function LoginForm() {
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const validateForm = () => {


        let newErrors = {};


        if (!email) {

            newErrors.email = "Email is required";

        }


        if (!password) {

            newErrors.password = "Password is required";

        }


        setErrors(newErrors);


        return Object.keys(newErrors).length === 0;


    };
    const handleSubmit = async (e) => {
        setErrorMessage("");


        e.preventDefault();


        const isValid = validateForm();


        if (!isValid) return;


        try {


            setLoading(true);


            const data = await loginUser(
                email,
                password
            );


            console.log("Login successful", data);
            navigate('/dashboard')


        }
        catch (error) {


            if (error.message === "Invalid login credentials") {
                setErrorMessage("Invalid email or password");
            }
            else {
                setErrorMessage("Something went wrong. Please try again.");
            }


        }
        finally {


            setLoading(false);


        }


    };

    return (
        <form action="" onSubmit={handleSubmit} className=" w-full max-w-md bg-card   rounded-2xl  shadow-2xl border  border-gray-100  p-10 transition duration-300 hover:-translate-y-2  hover:shadow-2xl ">

            <h2 className="text-4xl font-bold text-text">Welcome Back</h2>

            <p className="mt-3 text-gray-500">
                Sign in to continue to your dashboard.
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
                            setErrorMessage("");


                            if (errors.email) {

                                setErrors({
                                    ...errors,
                                    email: ""
                                });

                            }

                        }}
                        className=" w-full rounded-xl border border-gray-300 pl-12 pr-4 py-3 text-text outline-none transition  focus:border-primary focus:ring-4    focus:ring-primary/20"
                    />
                    {
                        errors.email && (

                            <p className="text-red-500 text-sm mt-2">
                                {errors.email}
                            </p>

                        )
                    }
                </div>
            </div>
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
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {

                            setPassword(e.target.value);
                            setErrorMessage("");


                            if (errors.password) {

                                setErrors({
                                    ...errors,
                                    password: ""
                                });

                            }

                        }}
                        className=" w-full rounded-xl border border-gray-300 pl-12  pr-12  py-3  text-text  outline-none  transition  focus:border-primary focus:ring-4 focus:ring-primary/20"
                    />
                    {
                        errors.password && (

                            <p className="text-red-500 text-sm mt-2">
                                {errors.password}
                            </p>

                        )
                    }


                    {showPassword ? (

                        <EyeOff
                            onClick={() => setShowPassword(false)}
                            className=" absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer "
                            size={20}
                        />

                    ) : (

                        <Eye
                            onClick={() => setShowPassword(true)}
                            className=" absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer "
                            size={20}
                        />

                    )}
                </div>
            </div>
            <div className="flex justify-end mt-3">
                <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-secondary hover:underline"
                >
                    Forgot Password?
                </button>
            </div>
            {errorMessage && (
                <p className="text-red-500 text-sm">
                    {errorMessage}
                </p>
            )}
            <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-primary text-white py-3.5 rounded-xl font-semibold shadow-md transition hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-center mt-6 text-gray-600">
                Don't have an account?
                <button type="button" onClick={() => navigate("/signup")} className="ml-2 text-secondary font-semibold hover:underline">
                    Sign Up
                </button>
            </p>

        </form>
    );
}

export default LoginForm;
