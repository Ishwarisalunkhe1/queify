import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";
import { supabase } from "../../lib/supabase";
import { getCurrentBusinessId } from "../../services/businessService";

function Products() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Edit product state
    const [editingProduct, setEditingProduct] = useState(null);

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    const [editName, setEditName] = useState("");
    const [editBrandId, setEditBrandId] = useState("");
    const [editCategoryId, setEditCategoryId] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editStock, setEditStock] = useState("");

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const businessId = await getCurrentBusinessId();

            const { data, error } = await supabase
                .from("products")
                .select(`
                    id,
                    name,
                    price,
                    stock,
                    created_at,
                    updated_at,
                    brand_id,
                    category_id,
                    brands (
                        id,
                        name
                    ),
                    categories (
                        id,
                        name
                    )
                `)
                .eq("business_id", businessId)
                .order("id", { ascending: true });

            if (error) {
                throw error;
            }

            setProducts(data || []);

        } catch (error) {
            console.error("Fetch products error:", error);

            setError(
                error.message || "Failed to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchEditOptions = async () => {
        try {
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
            console.error("Fetch edit options error:", error);

            setError(
                error.message || "Failed to load brands and categories."
            );
        }
    };

    const handleEdit = async (product) => {
        setError("");

        setEditingProduct(product);

        setEditName(product.name || "");
        setEditBrandId(product.brand_id || "");
        setEditCategoryId(product.category_id || "");
        setEditPrice(product.price ?? "");
        setEditStock(product.stock ?? "");

        await fetchEditOptions();
    };

    const closeEditModal = () => {
        if (saving) {
            return;
        }

        setEditingProduct(null);

        setEditName("");
        setEditBrandId("");
        setEditCategoryId("");
        setEditPrice("");
        setEditStock("");
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        setError("");

        if (!editName.trim()) {
            setError("Product name is required.");
            return;
        }

        if (!editBrandId) {
            setError("Please select a brand.");
            return;
        }

        if (!editCategoryId) {
            setError("Please select a category.");
            return;
        }

        if (editPrice === "" || Number(editPrice) < 0) {
            setError("Please enter a valid price.");
            return;
        }

        if (editStock === "" || Number(editStock) < 0) {
            setError("Please enter a valid stock quantity.");
            return;
        }

        try {
            setSaving(true);

            const businessId = await getCurrentBusinessId();

            const { error } = await supabase
                .from("products")
                .update({
                    name: editName.trim(),
                    brand_id: editBrandId,
                    category_id: editCategoryId,
                    price: Number(editPrice),
                    stock: Number(editStock),
                    updated_at: new Date().toISOString(),
                })
                .eq("id", editingProduct.id)
                .eq("business_id", businessId);

            if (error) {
                throw error;
            }

            closeEditModal();

            await fetchProducts();

        } catch (error) {
            console.error("Update product error:", error);

            setError(
                error.message || "Failed to update product."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (product) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(product.id);
            setError("");

            const businessId = await getCurrentBusinessId();

            const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", product.id)
                .eq("business_id", businessId);

            if (error) {
                throw error;
            }

            setProducts((currentProducts) =>
                currentProducts.filter(
                    (item) => item.id !== product.id
                )
            );

        } catch (error) {
            console.error("Delete product error:", error);

            setError(
                error.message || "Failed to delete product."
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-background flex">

            <Sidebar />

            <main className="flex-1 p-8">

                <div className="flex items-center justify-between mb-8">

                    <div>
                        <h1 className="text-3xl font-bold text-text">
                            Products
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Manage your products and stock.
                        </p>
                    </div>

                    <div className="flex gap-3">

                        <button
                            onClick={() => navigate("/products/add")}
                            className="bg-primary text-white px-5 py-3 rounded-xl font-semibold hover:opacity-90"
                        >
                            + Add Product
                        </button>

                        <button
                            onClick={() => navigate("/products/brands")}
                            className="border border-primary text-primary px-5 py-3 rounded-xl font-semibold hover:bg-primary/10"
                        >
                            Manage Brands
                        </button>

                        <button
                            onClick={() => navigate("/products/categories")}
                            className="border border-primary text-primary px-5 py-3 rounded-xl font-semibold hover:bg-primary/10"
                        >
                            Manage Categories
                        </button>

                        <button
                            onClick={() => navigate("/products/bulk-upload")}
                            className="border border-primary text-primary px-5 py-3 rounded-xl font-semibold hover:bg-primary/10"
                        >
                            Bulk Upload
                        </button>

                    </div>

                </div>

                {error && (
                    <div className="mb-5 p-4 rounded-xl bg-red-50 text-red-600">
                        {error}
                    </div>
                )}

                <div className="bg-card rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    <div className="p-6">

                        <h2 className="text-xl font-bold text-text">
                            Product List
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Products added to your business.
                        </p>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50 border-y border-gray-200">

                                <tr>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        ID
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Product
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Brand
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Category
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Price
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Stock
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Barcode
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
                                            colSpan="8"
                                            className="text-center py-16 text-gray-400"
                                        >
                                            Loading products...
                                        </td>
                                    </tr>

                                ) : products.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-16 text-gray-400"
                                        >
                                            No products added yet.
                                        </td>
                                    </tr>

                                ) : (

                                    products.map((product) => (

                                        <tr
                                            key={product.id}
                                            className="border-b border-gray-100"
                                        >

                                            <td className="px-6 py-4 font-medium">
                                                {product.id}
                                            </td>

                                            <td className="px-6 py-4">
                                                {product.name}
                                            </td>

                                            <td className="px-6 py-4">
                                                {product.brands?.name || "-"}
                                            </td>

                                            <td className="px-6 py-4">
                                                {product.categories?.name || "-"}
                                            </td>

                                            <td className="px-6 py-4">
                                                ₹{product.price}
                                            </td>

                                            <td className="px-6 py-4">
                                                {product.stock}
                                            </td>

                                            <td className="px-6 py-4">
                                                <Barcode
                                                    value={String(product.id)}
                                                    format="CODE128"
                                                    width={1.5}
                                                    height={45}
                                                    displayValue={true}
                                                    fontSize={12}
                                                    margin={0}
                                                />
                                            </td>

                                            <td className="px-6 py-4">

                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(product)
                                                        }
                                                        className="px-3 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(product)
                                                        }
                                                        disabled={
                                                            deletingId === product.id
                                                        }
                                                        className="px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60"
                                                    >
                                                        {deletingId === product.id
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

            </main>

            {/* EDIT PRODUCT MODAL */}

            {editingProduct && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

                    <div className="bg-card w-full max-w-2xl rounded-2xl shadow-xl p-8 max-h-[90vh] overflow-y-auto">

                        <div className="flex items-center justify-between">

                            <div>

                                <h2 className="text-2xl font-bold text-text">
                                    Edit Product
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Product ID: {editingProduct.id}
                                </p>

                            </div>

                            <button
                                onClick={closeEditModal}
                                className="text-gray-500 hover:text-gray-800 text-2xl"
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={handleUpdate}
                            className="mt-6"
                        >

                            <div>

                                <label className="block text-sm font-medium text-text mb-2">
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) =>
                                        setEditName(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                                />

                            </div>

                            <div className="mt-5">

                                <label className="block text-sm font-medium text-text mb-2">
                                    Brand
                                </label>

                                <select
                                    value={editBrandId}
                                    onChange={(e) =>
                                        setEditBrandId(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                                >

                                    <option value="">
                                        Select Brand
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
                                    value={editCategoryId}
                                    onChange={(e) =>
                                        setEditCategoryId(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                                >

                                    <option value="">
                                        Select Category
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
                                    value={editPrice}
                                    onChange={(e) =>
                                        setEditPrice(e.target.value)
                                    }
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
                                    value={editStock}
                                    onChange={(e) =>
                                        setEditStock(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                                />

                            </div>

                            <div className="mt-8 flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={closeEditModal}
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

export default Products;