import { useEffect, useState } from "react";
import Barcode from "react-barcode";

import Sidebar from "../../components/dashboard/Sidebar";
import InventoryFilters from "../../components/inventory/InventoryFilters";
import BarcodePrintButton from "../../components/inventory/BarcodePrintButton";
import { getCurrentBusinessId } from "../../services/businessService";
import { getInventory } from "../../services/inventoryService";
import { supabase } from "../../lib/supabase";

function Inventory() {
    const [inventory, setInventory] = useState([]);
    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");
    const [productFilter, setProductFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchInventory();
        fetchProducts();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            setError("");

            const businessId = await getCurrentBusinessId();

            if (!businessId) {
                throw new Error("Business could not be identified.");
            }

            const data = await getInventory(businessId);
            setInventory(data);
        } catch (error) {
            console.error("Fetch inventory error:", error);
            setError(error.message || "Failed to load inventory.");
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const businessId = await getCurrentBusinessId();

            if (!businessId) {
                throw new Error("Business could not be identified.");
            }

            const { data, error } = await supabase
                .from("products")
                .select("id, name, price")
                .eq("business_id", businessId)
                .order("name", { ascending: true });

            if (error) throw error;

            setProducts(data || []);
        } catch (error) {
            console.error("Fetch products error:", error);
            setError(error.message || "Failed to load products.");
        }
    };

    const escapeHtml = (value) => {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    const handlePrintAll = () => {
        setError("");

        if (filteredInventory.length === 0) {
            setError("There are no inventory units to print.");
            return;
        }

        const printWindow = window.open("", "_blank");

        if (!printWindow) {
            setError("Please allow pop-ups to print inventory barcodes.");
            return;
        }

        const barcodeLabels = filteredInventory
            .map(
                (item) => `
                    <div class="barcode-label">
                        <div class="product-name">
                            ${escapeHtml(item.products?.name || "Unknown Product")}
                        </div>

                        <svg id="barcode-${item.id}"></svg>

                        <div class="barcode-number">
                            ${escapeHtml(item.barcode)}
                        </div>
                    </div>
                `
            )
            .join("");

        const barcodeScripts = filteredInventory
            .map(
                (item) => `
                    JsBarcode(
                        "#barcode-${item.id}",
                        "${escapeHtml(item.barcode)}",
                        {
                            format: "CODE128",
                            width: 1.5,
                            height: 50,
                            displayValue: false,
                            margin: 0
                        }
                    );
                `
            )
            .join("");

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Inventory Barcodes</title>

                <style>
                    body {
                        margin: 0;
                        padding: 20px;
                        font-family: Arial, sans-serif;
                    }

                    .barcode-label {
                        width: 300px;
                        min-height: 130px;
                        margin: 0 auto 20px;
                        padding: 15px;
                        border: 1px solid #ddd;
                        text-align: center;
                        page-break-inside: avoid;
                    }

                    .product-name {
                        font-size: 16px;
                        font-weight: bold;
                        margin-bottom: 8px;
                    }

                    .barcode-label svg {
                        max-width: 100%;
                        height: auto;
                    }

                    .barcode-number {
                        margin-top: 5px;
                        font-size: 13px;
                    }

                    @media print {
                        body {
                            padding: 0;
                        }

                        .barcode-label {
                            border: none;
                            margin-bottom: 15px;
                        }
                    }
                </style>
            </head>

            <body>
                ${barcodeLabels}

                <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>

                <script>
                    window.onload = function () {
                        ${barcodeScripts}

                        setTimeout(function () {
                            window.print();
                        }, 300);
                    };
                </script>
            </body>
            </html>
        `);

        printWindow.document.close();
    };

    const getStatusClasses = (status) => {
        if (status === "available") {
            return "bg-green-100 text-green-700";
        }

        if (status === "reserved") {
            return "bg-yellow-100 text-yellow-700";
        }

        if (status === "sold") {
            return "bg-gray-100 text-gray-700";
        }

        return "bg-gray-100 text-gray-700";
    };

    const filteredInventory = inventory.filter((item) => {
        const searchValue = search.trim().toLowerCase();

        const productName =
            item.products?.name?.toLowerCase() || "";

        const barcode = String(item.barcode);

        const matchesSearch =
            !searchValue ||
            productName.includes(searchValue) ||
            barcode.includes(searchValue);

        const matchesProduct =
            !productFilter ||
            String(item.product_id) === String(productFilter);

        const matchesStatus =
            !statusFilter ||
            item.status === statusFilter;

        return (
            matchesSearch &&
            matchesProduct &&
            matchesStatus
        );
    });

    const availableCount = inventory.filter(
        (item) => item.status === "available"
    ).length;

    const soldCount = inventory.filter(
        (item) => item.status === "sold"
    ).length;

    const reservedCount = inventory.filter(
        (item) => item.status === "reserved"
    ).length;

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />

            <main className="min-w-0 flex-1 p-3 sm:p-6 lg:p-8">
                <div className="mx-auto w-full max-w-7xl">

                    {/* PAGE HEADER */}
                    <div className="mb-6 lg:mb-8">
                        <h1 className="text-2xl font-bold text-text sm:text-3xl">
                            Inventory
                        </h1>

                        <p className="mt-1 text-sm leading-5 text-gray-500 sm:text-base">
                            View physical product units, their unique barcodes,
                            and their current status.
                        </p>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm leading-5 text-red-600">
                            {error}
                        </div>
                    )}

                    {/* INVENTORY SUMMARY */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-gray-100 bg-card p-5 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Available Units
                            </p>

                            <p className="mt-2 text-2xl font-bold text-green-600">
                                {availableCount}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-card p-5 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Sold Units
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-700">
                                {soldCount}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-card p-5 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Reserved Units
                            </p>

                            <p className="mt-2 text-2xl font-bold text-yellow-600">
                                {reservedCount}
                            </p>
                        </div>
                    </div>

                    {/* INVENTORY CONTAINER */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-card shadow-sm">

                        {/* SECTION HEADER */}
                        <div className="border-b border-gray-100 p-4 sm:p-6">
                            <h2 className="text-lg font-bold text-text sm:text-xl">
                                Physical Inventory Units
                            </h2>

                            <p className="mt-1 text-sm leading-5 text-gray-500">
                                Each row represents one physical product unit
                                with its own unique barcode. Status changes
                                automatically when a unit is sold.
                            </p>
                        </div>

                        {/* FILTERS */}
                        <InventoryFilters
                            search={search}
                            setSearch={setSearch}
                            productFilter={productFilter}
                            setProductFilter={setProductFilter}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            products={products}
                            onPrintAll={handlePrintAll}
                        />

                        {/* LOADING */}
                        {loading && (
                            <div className="p-6 text-center text-sm text-gray-500">
                                Loading inventory...
                            </div>
                        )}

                        {/* EMPTY INVENTORY */}
                        {!loading && inventory.length === 0 && (
                            <div className="p-8 text-center">
                                <p className="font-semibold text-text">
                                    No inventory units found.
                                </p>

                                <p className="mt-2 text-sm text-gray-500">
                                    Add a product with an initial stock quantity
                                    from the Products page to generate its
                                    inventory units and barcodes.
                                </p>
                            </div>
                        )}

                        {/* NO FILTER RESULTS */}
                        {!loading &&
                            inventory.length > 0 &&
                            filteredInventory.length === 0 && (
                                <div className="p-6 text-center text-sm text-gray-500">
                                    No inventory units match your filters.
                                </div>
                            )}

                        {/* MOBILE / TABLET */}
                        {!loading && filteredInventory.length > 0 && (
                            <div className="divide-y divide-gray-100 md:hidden">
                                {filteredInventory.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-4 sm:p-5"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="truncate text-base font-semibold text-text">
                                                    {item.products?.name ||
                                                        "Unknown Product"}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    Inventory Unit #{item.id}
                                                </p>
                                            </div>

                                            <span
                                                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                                                    item.status
                                                )}`}
                                            >
                                                {item.status}
                                            </span>
                                        </div>

                                        {/* BARCODE */}
                                        <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-3">
                                            <p className="mb-2 text-xs font-medium text-gray-500">
                                                Scannable Barcode
                                            </p>

                                            <div className="flex justify-center overflow-x-auto">
                                                <Barcode
                                                    value={String(item.barcode)}
                                                    format="CODE128"
                                                    width={1.2}
                                                    height={45}
                                                    displayValue={true}
                                                    fontSize={12}
                                                    margin={0}
                                                />
                                            </div>
                                        </div>

                                        {/* PRICE AND PRINT */}
                                        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3">
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Price
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-text">
                                                    ₹
                                                    {Number(
                                                        item.products?.price || 0
                                                    ).toFixed(2)}
                                                </p>
                                            </div>

                                            <BarcodePrintButton item={item} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* DESKTOP TABLE */}
                        {!loading && filteredInventory.length > 0 && (
                            <div className="hidden overflow-x-auto md:block">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-semibold text-gray-600">
                                                Product
                                            </th>

                                            <th className="px-6 py-4 text-left font-semibold text-gray-600">
                                                Barcode
                                            </th>

                                            <th className="px-6 py-4 text-left font-semibold text-gray-600">
                                                Price
                                            </th>

                                            <th className="px-6 py-4 text-left font-semibold text-gray-600">
                                                Status
                                            </th>

                                            <th className="px-6 py-4 text-left font-semibold text-gray-600">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {filteredInventory.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="transition hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 font-medium text-text">
                                                    {item.products?.name ||
                                                        "Unknown Product"}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <Barcode
                                                        value={String(item.barcode)}
                                                        format="CODE128"
                                                        width={1.2}
                                                        height={45}
                                                        displayValue={true}
                                                        fontSize={12}
                                                        margin={0}
                                                    />
                                                </td>

                                                <td className="px-6 py-4 text-gray-600">
                                                    ₹
                                                    {Number(
                                                        item.products?.price || 0
                                                    ).toFixed(2)}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                                                            item.status
                                                        )}`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <BarcodePrintButton
                                                        item={item}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Inventory;