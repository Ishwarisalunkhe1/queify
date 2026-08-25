import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { getCurrentBusinessId } from "../../services/businessService";

function Categories() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    const [categoryName, setCategoryName] = useState("");

    const [editingCategory, setEditingCategory] = useState(null);
    const [editName, setEditName] = useState("");

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("name-asc");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const businessId = await getCurrentBusinessId();

            if (!businessId) {
                throw new Error("Business could not be identified.");
            }

            const [
                { data: categoryData, error: categoryError },
                { data: productData, error: productError },
            ] = await Promise.all([
                supabase
                    .from("categories")
                    .select("id, name, created_at, updated_at")
                    .eq("business_id", businessId),

                supabase
                    .from("products")
                    .select("id, category_id")
                    .eq("business_id", businessId),
            ]);

            if (categoryError) {
                throw categoryError;
            }

            if (productError) {
                throw productError;
            }

            setCategories(categoryData || []);
            setProducts(productData || []);

        } catch (error) {
            console.error("Fetch categories error:", error);

            setError(
                error.message || "Failed to load categories."
            );
        } finally {
            setLoading(false);
        }
    };

    const getProductCount = (categoryId) => {
        return products.filter(
            (product) => product.category_id === categoryId
        ).length;
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!categoryName.trim()) {
            setError("Category name is required.");
            return;
        }

        try {
            setSaving(true);

            const businessId = await getCurrentBusinessId();

            if (!businessId) {
                throw new Error("Business could not be identified.");
            }

            const { error } = await supabase
                .from("categories")
                .insert({
                    business_id: businessId,
                    name: categoryName.trim(),
                });

            if (error) {
                throw error;
            }

            setCategoryName("");
            setSuccess("Category added successfully.");

            await fetchCategories();

        } catch (error) {
            console.error("Add category error:", error);

            setError(
                error.message || "Failed to add category."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (category) => {
        setError("");
        setSuccess("");

        setEditingCategory(category);
        setEditName(category.name);
    };

    const closeEdit = () => {
        if (saving) {
            return;
        }

        setEditingCategory(null);
        setEditName("");
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!editName.trim()) {
            setError("Category name is required.");
            return;
        }

        try {
            setSaving(true);

            const businessId = await getCurrentBusinessId();

            if (!businessId) {
                throw new Error("Business could not be identified.");
            }

            const { error } = await supabase
                .from("categories")
                .update({
                    name: editName.trim(),
                    updated_at: new Date().toISOString(),
                })
                .eq("id", editingCategory.id)
                .eq("business_id", businessId);

            if (error) {
                throw error;
            }

            setEditingCategory(null);
            setEditName("");
            setSuccess("Category updated successfully.");

            await fetchCategories();

        } catch (error) {
            console.error("Update category error:", error);

            setError(
                error.message || "Failed to update category."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (category) => {
        const productCount = getProductCount(category.id);

        const message =
            productCount > 0
                ? `Are you sure you want to delete "${category.name}"? ${productCount} product(s) are currently using this category. The products will remain, but their category will be removed.`
                : `Are you sure you want to delete "${category.name}"?`;

        const confirmed = window.confirm(message);

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(category.id);
            setError("");
            setSuccess("");

            const businessId = await getCurrentBusinessId();

            if (!businessId) {
                throw new Error("Business could not be identified.");
            }

            const { error } = await supabase
                .from("categories")
                .delete()
                .eq("id", category.id)
                .eq("business_id", businessId);

            if (error) {
                throw error;
            }

            setCategories((currentCategories) =>
                currentCategories.filter(
                    (item) => item.id !== category.id
                )
            );

            setProducts((currentProducts) =>
                currentProducts.map((product) =>
                    product.category_id === category.id
                        ? { ...product, category_id: null }
                        : product
                )
            );

            setSuccess("Category deleted successfully.");

        } catch (error) {
            console.error("Delete category error:", error);

            setError(
                error.message || "Failed to delete category."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const filteredCategories = categories
        .filter((category) =>
            category.name
                .toLowerCase()
                .includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "name-asc") {
                return a.name.localeCompare(b.name);
            }

            if (sortBy === "name-desc") {
                return b.name.localeCompare(a.name);
            }

            if (sortBy === "newest") {
                return (
                    new Date(b.created_at) -
                    new Date(a.created_at)
                );
            }

            if (sortBy === "oldest") {
                return (
                    new Date(a.created_at) -
                    new Date(b.created_at)
                );
            }

            return 0;
        });

    return (
        <div className="min-h-screen bg-background p-8">

            <div className="max-w-6xl mx-auto">

                <button
                    onClick={() => navigate("/products")}
                    className="text-secondary font-semibold hover:underline"
                >
                    ← Back to Products
                </button>

                <div className="mt-6">
                    <h1 className="text-3xl font-bold text-text">
                        Manage Categories
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage categories for your business products.
                    </p>
                </div>

                {/* ADD CATEGORY */}

                <form
                    onSubmit={handleAddCategory}
                    className="mt-8 bg-card rounded-2xl border border-gray-100 shadow-sm p-6"
                >

                    <h2 className="text-xl font-bold text-text">
                        Add Category
                    </h2>

                    <div className="mt-4 flex gap-3">

                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => {
                                setCategoryName(e.target.value);
                                setError("");
                                setSuccess("");
                            }}
                            placeholder="e.g. Beverages"
                            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                        />

                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-70"
                        >
                            {saving ? "Adding..." : "+ Add Category"}
                        </button>

                    </div>

                </form>

                {/* MESSAGES */}

                {error && (
                    <div className="mt-5 p-4 rounded-xl bg-red-50 text-red-600">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mt-5 p-4 rounded-xl bg-green-50 text-green-600">
                        {success}
                    </div>
                )}

                {/* CATEGORY LIST */}

                <div className="mt-6 bg-card rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    <div className="p-6">

                        <div className="flex items-center justify-between gap-4">

                            <div>
                                <h2 className="text-xl font-bold text-text">
                                    Categories
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    {categories.length} categor{categories.length === 1 ? "y" : "ies"} in your business.
                                </p>
                            </div>

                            <div className="flex gap-3">

                                {/* SEARCH */}

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Search categories..."
                                    className="w-64 rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                                />

                                {/* SORT */}

                                <select
                                    value={sortBy}
                                    onChange={(e) =>
                                        setSortBy(e.target.value)
                                    }
                                    className="rounded-xl border border-gray-300 px-4 py-2.5 bg-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                                >
                                    <option value="name-asc">
                                        Name A-Z
                                    </option>

                                    <option value="name-desc">
                                        Name Z-A
                                    </option>

                                    <option value="newest">
                                        Newest
                                    </option>

                                    <option value="oldest">
                                        Oldest
                                    </option>
                                </select>

                            </div>

                        </div>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50 border-y border-gray-200">

                                <tr>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Category
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Products
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Created
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {loading ? (

                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center py-16 text-gray-400"
                                        >
                                            Loading categories...
                                        </td>
                                    </tr>

                                ) : filteredCategories.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center py-16 text-gray-400"
                                        >
                                            {search
                                                ? "No categories match your search."
                                                : "No categories added yet."}
                                        </td>
                                    </tr>

                                ) : (

                                    filteredCategories.map((category) => (

                                        <tr
                                            key={category.id}
                                            className="border-b border-gray-100"
                                        >

                                            <td className="px-6 py-4 font-medium text-text">
                                                {category.name}
                                            </td>

                                            <td className="px-6 py-4">
                                                {getProductCount(category.id)}
                                            </td>

                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(
                                                    category.created_at
                                                ).toLocaleDateString()}
                                            </td>

                                            <td className="px-6 py-4">

                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(category)
                                                        }
                                                        className="px-3 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(category)
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            category.id
                                                        }
                                                        className="px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60"
                                                    >
                                                        {deletingId ===
                                                            category.id
                                                            ? "Deleting..."
                                                            : "Delete"}
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {/* EDIT CATEGORY MODAL */}

            {editingCategory && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

                    <div className="bg-card w-full max-w-md rounded-2xl shadow-xl p-8">

                        <div className="flex items-center justify-between">

                            <div>

                                <h2 className="text-2xl font-bold text-text">
                                    Edit Category
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Update category name.
                                </p>

                            </div>

                            <button
                                onClick={closeEdit}
                                className="text-gray-500 hover:text-gray-800 text-2xl"
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={handleUpdate}
                            className="mt-6"
                        >

                            <label className="block text-sm font-medium text-text mb-2">
                                Category Name
                            </label>

                            <input
                                type="text"
                                value={editName}
                                onChange={(e) =>
                                    setEditName(e.target.value)
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                            />

                            <div className="mt-6 flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={closeEdit}
                                    disabled={saving}
                                    className="px-5 py-3 rounded-xl border border-gray-300 font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-60"
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Categories;