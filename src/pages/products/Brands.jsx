import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { getCurrentBusinessId } from "../../services/businessService";

function Brands() {
    const [brandName, setBrandName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!brandName.trim()) {
            setError("Brand name is required.");
            return;
        }

        try {
            setLoading(true);

            const businessId = await getCurrentBusinessId();

            const { error } = await supabase
                .from("brands")
                .insert({
                    business_id: businessId,
                    name: brandName.trim(),
                });

            if (error) {
                throw error;
            }

            setSuccess("Brand added successfully.");
            setBrandName("");
        } catch (error) {
            console.error("Add brand error:", error);
            setError(error.message || "Failed to add brand.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-xl mx-auto">

                <button
                    onClick={() => navigate("/products")}
                    className="text-secondary font-semibold hover:underline"
                >
                    ← Back to Products
                </button>

                <h1 className="text-3xl font-bold text-text mt-6">
                    Manage Brands
                </h1>

                <p className="mt-2 text-gray-500">
                    Add brands for your business products.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 bg-card rounded-2xl border border-gray-100 shadow-sm p-6"
                >
                    <label className="block text-sm font-medium text-text mb-2">
                        Brand Name
                    </label>

                    <input
                        type="text"
                        value={brandName}
                        onChange={(e) => {
                            setBrandName(e.target.value);
                            setError("");
                            setSuccess("");
                        }}
                        placeholder="e.g. Coca-Cola"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                    />

                    {error && (
                        <p className="mt-3 text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="mt-3 text-sm text-green-600">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-5 w-full bg-primary text-white py-3 rounded-xl font-semibold disabled:opacity-70"
                    >
                        {loading ? "Adding..." : "Add Brand"}
                    </button>
                </form>

            </div>
        </div>
    );
}

export default Brands;