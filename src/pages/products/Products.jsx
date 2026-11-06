import { useEffect, useState, useMemo } from "react";

import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";
import { supabase } from "../../lib/supabase";
import { getCurrentBusinessId } from "../../services/businessService";
import ProductFilters from "../../components/products/ProductFilters";
import ProductTable from "../../components/products/ProductTable";
import EditProductModal from "../../components/products/EditProductModal";

function Products() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Product filter state
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(0);

    // Edit product state
    const [editingProduct, setEditingProduct] = useState(null);

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    const [editName, setEditName] = useState("");
    const [editBrandId, setEditBrandId] = useState("");
    const [editCategoryId, setEditCategoryId] = useState("");
    const [editPrice, setEditPrice] = useState("");
   

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchEditOptions();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const businessId = await getCurrentBusinessId();

            // Fetch products and their inventory units together.
            const [
                { data: productData, error: productError },
                { data: inventoryData, error: inventoryError },
            ] = await Promise.all([
                supabase
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
                    .order("id", { ascending: true }),

                supabase
                    .from("product_inventory")
                    .select("product_id, status")
                    .eq("business_id", businessId),
            ]);

            if (productError) {
                throw productError;
            }

            if (inventoryError) {
                throw inventoryError;
            }

            // Count only AVAILABLE physical inventory units
            // for each product.
            const availableStockMap = {};

            (inventoryData || []).forEach((item) => {
                if (item.status === "available") {
                    availableStockMap[item.product_id] =
                        (availableStockMap[item.product_id] || 0) + 1;
                }
            });

            // Attach calculated inventory stock to each product.
            const productsWithInventoryStock = (productData || []).map(
                (product) => ({
                    ...product,
                    availableStock:
                        availableStockMap[product.id] || 0,
                })
            );

            setProducts(productsWithInventoryStock);

            const prices = (productData || [])
                .map((product) => Number(product.price))
                .filter((price) => Number.isFinite(price));

            if (prices.length > 0) {
                const lowestPrice = Math.min(...prices);
                const highestPrice = Math.max(...prices);

                setPriceMin(lowestPrice);
                setPriceMax(highestPrice);

                setMinPrice(lowestPrice);
                setMaxPrice(highestPrice);
            } else {
                setPriceMin(0);
                setPriceMax(0);
                setMinPrice(0);
                setMaxPrice(0);
            }
        } catch (error) {
            console.error("Fetch products error:", error);

            setError(
                error.message || "Failed to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const productName = product.name?.toLowerCase() || "";
            const searchValue = search.trim().toLowerCase();

            const matchesSearch =
                productName.includes(searchValue);

            const matchesCategory =
                !selectedCategory ||
                product.category_id === selectedCategory;

            const matchesBrand =
                !selectedBrand ||
                product.brand_id === selectedBrand;

            const productPrice = Number(product.price);

            const matchesPrice =
                productPrice >= minPrice &&
                productPrice <= maxPrice;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesBrand &&
                matchesPrice
            );
        });
    }, [
        products,
        search,
        selectedCategory,
        selectedBrand,
        minPrice,
        maxPrice,
    ]);

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
                error.message ||
                    "Failed to load brands and categories."
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

            <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8">
                {/* Page Header */}
                <div className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold text-text sm:text-3xl">
                            Products
                        </h1>

                        <p className="mt-1 text-sm text-gray-500 sm:text-base">
                            Manage your products and stock.
                        </p>
                    </div>

                    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:w-auto lg:flex lg:flex-wrap lg:gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/products/add")}
                            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 sm:px-5 sm:text-base lg:w-auto"
                        >
                            + Add Product
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/products/brands")}
                            className="w-full rounded-xl border border-primary px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10 sm:px-5 sm:text-base lg:w-auto"
                        >
                            Manage Brands
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/products/categories")}
                            className="w-full rounded-xl border border-primary px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10 sm:px-5 sm:text-base lg:w-auto"
                        >
                            Manage Categories
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/products/bulk-upload")
                            }
                            className="w-full rounded-xl border border-primary px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10 sm:px-5 sm:text-base lg:w-auto"
                        >
                            Bulk Upload
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Filters */}
                <ProductFilters
                    search={search}
                    setSearch={setSearch}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedBrand={selectedBrand}
                    setSelectedBrand={setSelectedBrand}
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    categories={categories}
                    brands={brands}
                    priceMin={priceMin}
                    priceMax={priceMax}
                    onClearFilters={() => {
                        setSearch("");
                        setSelectedCategory("");
                        setSelectedBrand("");
                        setMinPrice(priceMin);
                        setMaxPrice(priceMax);
                    }}
                />

                {/* Product List */}
                <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-card shadow-sm sm:mt-8">
                    <div className="p-4 sm:p-6">
                        <h2 className="text-lg font-bold text-text sm:text-xl">
                            Product List
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Products added to your business.
                        </p>
                    </div>

                    <ProductTable
                        filteredProducts={filteredProducts}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        deletingId={deletingId}
                    />
                </div>
            </main>

            <EditProductModal
                editingProduct={editingProduct}
                editName={editName}
                setEditName={setEditName}
                editBrandId={editBrandId}
                setEditBrandId={setEditBrandId}
                editCategoryId={editCategoryId}
                setEditCategoryId={setEditCategoryId}
                editPrice={editPrice}
                setEditPrice={setEditPrice}
                
                brands={brands}
                categories={categories}
                saving={saving}
                onSubmit={handleUpdate}
                onClose={closeEditModal}
            />
        </div>
    );
}

export default Products;