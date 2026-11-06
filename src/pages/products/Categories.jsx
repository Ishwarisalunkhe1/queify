import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import CategoryForm from "../../components/products/CategoryForm";
import CategoryTable from "../../components/products/CategoryTable";
import EditCategoryModal from "../../components/products/EditCategoryModal";

import {
    getCategories,
    getProductCategoryLinks,
    addCategory,
    updateCategory,
    deleteCategory,
} from "../../services/productService";

import { getCurrentBusinessId } from "../../services/businessService";

function Categories() {
    const navigate = useNavigate();

    // -----------------------------
    // Page data
    // -----------------------------

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    // -----------------------------
    // Add category
    // -----------------------------

    const [categoryName, setCategoryName] = useState("");

    // -----------------------------
    // Edit category
    // -----------------------------

    const [editingCategory, setEditingCategory] = useState(null);
    const [editName, setEditName] = useState("");

    // -----------------------------
    // Search / sort
    // -----------------------------

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("name-asc");

    // -----------------------------
    // Loading states
    // -----------------------------

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // -----------------------------
    // Messages
    // -----------------------------

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // -----------------------------
    // Initial load
    // -----------------------------

    useEffect(() => {
        fetchCategories();
    }, []);

    // -----------------------------
    // Fetch categories + products
    // -----------------------------

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const businessId = await getCurrentBusinessId();

            if (!businessId) {
                throw new Error("Business could not be identified.");
            }

            const [categoryData, productData] = await Promise.all([
                getCategories(businessId),
                getProductCategoryLinks(businessId),
            ]);

            setCategories(categoryData);
            setProducts(productData);
        } catch (error) {
            console.error("Fetch categories error:", error);

            setError(
                error.message || "Failed to load categories."
            );
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------
    // Product count
    // -----------------------------

    const getProductCount = (categoryId) => {
        return products.filter(
            (product) => product.category_id === categoryId
        ).length;
    };

    // -----------------------------
    // Add category
    // -----------------------------

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

            await addCategory(
                businessId,
                categoryName.trim()
            );

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

    // -----------------------------
    // Open edit modal
    // -----------------------------

    const handleEdit = (category) => {
        setError("");
        setSuccess("");

        setEditingCategory(category);
        setEditName(category.name);
    };

    // -----------------------------
    // Close edit modal
    // -----------------------------

    const closeEdit = () => {
        if (saving) {
            return;
        }

        setEditingCategory(null);
        setEditName("");
    };

    // -----------------------------
    // Update category
    // -----------------------------

    const handleUpdate = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!editName.trim()) {
            setError("Category name is required.");
            return;
        }

        if (!editingCategory) {
            return;
        }

        try {
            setSaving(true);

            const businessId = await getCurrentBusinessId();

            if (!businessId) {
                throw new Error("Business could not be identified.");
            }

            await updateCategory(
                editingCategory.id,
                businessId,
                editName.trim()
            );

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

    // -----------------------------
    // Delete category
    // -----------------------------

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

            await deleteCategory(
                category.id,
                businessId
            );

            /*
             * Because products.category_id has
             * ON DELETE SET NULL, the products remain.
             */
            setProducts((currentProducts) =>
                currentProducts.map((product) =>
                    product.category_id === category.id
                        ? {
                              ...product,
                              category_id: null,
                          }
                        : product
                )
            );

            setCategories((currentCategories) =>
                currentCategories.filter(
                    (item) => item.id !== category.id
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

    // -----------------------------
    // Search + sort
    // -----------------------------

    const filteredCategories = useMemo(() => {
        return [...categories]
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
    }, [categories, search, sortBy]);

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-6xl">

                {/* Back button */}
                <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="text-sm sm:text-base font-semibold text-secondary hover:underline"
                >
                    ← Back to Products
                </button>

                {/* Page heading */}
                <div className="mt-5 sm:mt-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-text">
                        Manage Categories
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm sm:text-base text-gray-500">
                        Create and manage categories for your business
                        products.
                    </p>
                </div>

                {/* Add category */}
                <CategoryForm
                    categoryName={categoryName}
                    setCategoryName={(value) => {
                        setCategoryName(value);
                        setError("");
                        setSuccess("");
                    }}
                    onSubmit={handleAddCategory}
                    saving={saving}
                />

                {/* Messages */}
                {error && (
                    <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-600">
                        {success}
                    </div>
                )}

                {/* Category table */}
                <CategoryTable
                    categories={categories}
                    filteredCategories={filteredCategories}
                    search={search}
                    setSearch={setSearch}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    loading={loading}
                    getProductCount={getProductCount}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    deletingId={deletingId}
                />
            </div>

            {/* Edit modal */}
            <EditCategoryModal
                editingCategory={editingCategory}
                editName={editName}
                setEditName={setEditName}
                onSubmit={handleUpdate}
                onClose={closeEdit}
                saving={saving}
            />
        </div>
    );
}

export default Categories;