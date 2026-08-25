import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { getCurrentBusinessId } from "../../services/businessService";

function AddProduct() {
    const navigate = useNavigate();

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");
    const [brandId, setBrandId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

    const [loading, setLoading] = useState(false);
    const [loadingOptions, setLoadingOptions] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
        try {
            setLoadingOptions(true);
            setError("");

            const businessId = await getCurrentBusinessId();

            const [
                { data: brandData, error: brandError },
                { data: categoryData, error: categoryError },
            ] = await Promise.all([
                supabase
                    .from("brands")
                    .select("id, name")
                    .eq("business_id", businessId)
                    .order("name"),

                supabase
                    .from("categories")
                    .select("id, name")
                    .eq("business_id", businessId)
                    .order("name"),
            ]);

            if (brandError) {
                throw brandError;
            }

            if (categoryError) {
                throw categoryError;
            }

            setBrands(brandData || []);
            setCategories(categoryData || []);

        } catch (error) {
            console.error("Fetch options error:", error);

            setError(
                error.message || "Failed to load brands and categories."
            );
        } finally {
            setLoadingOptions(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("Product name is required.");
            return;
        }

        if (!brandId) {
            setError("Please select a brand.");
            return;
        }

        if (!categoryId) {
            setError("Please select a category.");
            return;
        }

        if (price === "" || Number(price) < 0) {
            setError("Please enter a valid price.");
            return;
        }

        if (stock === "" || Number(stock) < 0) {
            setError("Please enter a valid stock quantity.");
            return;
        }

        try {
            setLoading(true);

            const businessId = await getCurrentBusinessId();

            const { data, error } = await supabase
                .from("products")
                .insert({
                    business_id: businessId,
                    brand_id: brandId,
                    category_id: categoryId,
                    name: name.trim(),
                    price: Number(price),
                    stock: Number(stock),
                })
                .select()
                .single();

            if (error) {
                throw error;
            }

            console.log("Product created:", data);

            setSuccess(
                `Product added successfully. Product ID: ${data.id}`
            );

            setName("");
            setBrandId("");
            setCategoryId("");
            setPrice("");
            setStock("");

        } catch (error) {
            console.error("Add product error:", error);

            setError(
                error.message || "Failed to add product."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">

            <div className="max-w-2xl mx-auto">

                <button
                    onClick={() => navigate("/products")}
                    className="text-secondary font-semibold hover:underline"
                >
                    ← Back to Products
                </button>

                <h1 className="text-3xl font-bold text-text mt-6">
                    Add Product
                </h1>

                <p className="mt-2 text-gray-500">
                    Add a new product to your inventory.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 bg-card rounded-2xl border border-gray-100 shadow-sm p-8"
                >

                    <div>
                        <label className="block text-sm font-medium text-text mb-2">
                            Product Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Coke 500ml"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                        />
                    </div>

                    <div className="mt-5">
                        <label className="block text-sm font-medium text-text mb-2">
                            Brand
                        </label>

                        <select
                            value={brandId}
                            onChange={(e) => setBrandId(e.target.value)}
                            disabled={loadingOptions}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                        >
                            <option value="">
                                {loadingOptions
                                    ? "Loading brands..."
                                    : "Select Brand"}
                            </option>

                            {brands.map((brand) => (
                                <option
                                    key={brand.id}
                                    value={brand.id}
                                >
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-5">
                        <label className="block text-sm font-medium text-text mb-2">
                            Category
                        </label>

                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            disabled={loadingOptions}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                        >
                            <option value="">
                                {loadingOptions
                                    ? "Loading categories..."
                                    : "Select Category"}
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-5">
                        <label className="block text-sm font-medium text-text mb-2">
                            Price
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="e.g. 40"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                        />
                    </div>

                    <div className="mt-5">
                        <label className="block text-sm font-medium text-text mb-2">
                            Stock
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            placeholder="e.g. 50"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                        />
                    </div>

                    {error && (
                        <p className="mt-4 text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="mt-4 text-sm text-green-600">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || loadingOptions}
                        className="w-full mt-8 bg-primary text-white py-3.5 rounded-xl font-semibold disabled:opacity-70"
                    >
                        {loading ? "Adding Product..." : "Add Product"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AddProduct;