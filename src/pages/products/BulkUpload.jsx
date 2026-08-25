import { useState } from "react";
import * as XLSX from "xlsx";
import Sidebar from "../../components/dashboard/Sidebar";
import { supabase } from "../../lib/supabase";
import { getCurrentBusinessId } from "../../services/businessService";

function BulkUpload() {
    const [file, setFile] = useState(null);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        setError("");
        setProducts([]);

        if (!selectedFile) {
            return;
        }

        if (
            !selectedFile.name.endsWith(".xlsx") &&
            !selectedFile.name.endsWith(".xls")
        ) {
            setError("Please upload an Excel file (.xlsx or .xls).");
            return;
        }

        setFile(selectedFile);

        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);

                const workbook = XLSX.read(data, {
                    type: "array",
                });

                const firstSheet = workbook.Sheets[
                    workbook.SheetNames[0]
                ];

                const rows = XLSX.utils.sheet_to_json(firstSheet);

                if (rows.length === 0) {
                    setError("The Excel file is empty.");
                    return;
                }

                setProducts(rows);

            } catch (error) {
                console.error("Excel reading error:", error);
                setError("Unable to read the Excel file.");
            }
        };

        reader.readAsArrayBuffer(selectedFile);
    };
    const handleBulkUpload = async () => {
        try {
            setUploading(true);
            setError("");
            setSuccessMessage("");

            if (products.length === 0) {
                setError("Please upload an Excel file first.");
                return;
            }

            const businessId = await getCurrentBusinessId();

            if (!businessId) {
                throw new Error("Business could not be identified.");
            }

            const productRows = [];

            for (const product of products) {

                if (
                    !product.name ||
                    product.price === undefined ||
                    product.stock === undefined
                ) {
                    throw new Error(
                        `Invalid product data for "${product.name || "Unknown product"}".`
                    );
                }

                /*
                 * BRAND
                 */

                let brandId = null;

                if (product.brand) {

                    const { data: existingBrand, error: brandError } =
                        await supabase
                            .from("brands")
                            .select("id")
                            .eq("business_id", businessId)
                            .eq("name", String(product.brand).trim())
                            .maybeSingle();

                    if (brandError) {
                        throw brandError;
                    }

                    if (existingBrand) {

                        brandId = existingBrand.id;

                    } else {

                        const { data: newBrand, error: newBrandError } =
                            await supabase
                                .from("brands")
                                .insert({
                                    business_id: businessId,
                                    name: String(product.brand).trim(),
                                })
                                .select("id")
                                .single();

                        if (newBrandError) {
                            throw newBrandError;
                        }

                        brandId = newBrand.id;
                    }
                }

                /*
                 * CATEGORY
                 */

                let categoryId = null;

                if (product.category) {

                    const { data: existingCategory, error: categoryError } =
                        await supabase
                            .from("categories")
                            .select("id")
                            .eq("business_id", businessId)
                            .eq("name", String(product.category).trim())
                            .maybeSingle();

                    if (categoryError) {
                        throw categoryError;
                    }

                    if (existingCategory) {

                        categoryId = existingCategory.id;

                    } else {

                        const { data: newCategory, error: newCategoryError } =
                            await supabase
                                .from("categories")
                                .insert({
                                    business_id: businessId,
                                    name: String(product.category).trim(),
                                })
                                .select("id")
                                .single();

                        if (newCategoryError) {
                            throw newCategoryError;
                        }

                        categoryId = newCategory.id;
                    }
                }

                /*
                 * PRODUCT
                 */

                productRows.push({
                    business_id: businessId,
                    brand_id: brandId,
                    category_id: categoryId,
                    name: String(product.name).trim(),
                    price: Number(product.price),
                    stock: Number(product.stock),
                });
            }

            /*
             * INSERT ALL PRODUCTS
             */

            const { error: productError } = await supabase
                .from("products")
                .insert(productRows);

            if (productError) {
                throw productError;
            }

            setSuccessMessage(
                `${productRows.length} product(s) uploaded successfully.`
            );

            setProducts([]);

            setFile(null);

        } catch (error) {

            console.error("Bulk upload error:", error);

            setError(
                error.message || "Failed to upload products."
            );

        } finally {

            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex">

            <Sidebar />

            <main className="flex-1 p-8">

                <div className="max-w-6xl mx-auto">

                    <h1 className="text-3xl font-bold text-text">
                        Bulk Upload Products
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Upload multiple products using an Excel file.
                    </p>

                    {/* Excel format */}

                    <div className="mt-6 bg-card rounded-2xl border border-gray-100 shadow-sm p-6">

                        <h2 className="text-lg font-bold text-text">
                            Excel Format
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Your Excel file should contain these columns:
                        </p>

                        <div className="overflow-x-auto mt-4">

                            <table className="w-full border border-gray-200">

                                <thead className="bg-gray-50">

                                    <tr>
                                        <th className="border px-4 py-3 text-left">
                                            name
                                        </th>

                                        <th className="border px-4 py-3 text-left">
                                            brand
                                        </th>

                                        <th className="border px-4 py-3 text-left">
                                            category
                                        </th>

                                        <th className="border px-4 py-3 text-left">
                                            price
                                        </th>

                                        <th className="border px-4 py-3 text-left">
                                            stock
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    <tr>
                                        <td className="border px-4 py-3">
                                            Coke
                                        </td>

                                        <td className="border px-4 py-3">
                                            Coca-Cola
                                        </td>

                                        <td className="border px-4 py-3">
                                            Beverages
                                        </td>

                                        <td className="border px-4 py-3">
                                            20
                                        </td>

                                        <td className="border px-4 py-3">
                                            20
                                        </td>
                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>

                    {/* Upload */}

                    <div className="mt-6 bg-card rounded-2xl border border-gray-100 shadow-sm p-6">

                        <label className="block text-sm font-medium text-text mb-3">
                            Select Excel File
                        </label>

                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            className="block w-full border border-gray-300 rounded-xl p-3"
                        />

                        {file && (
                            <p className="mt-3 text-sm text-gray-600">
                                Selected file:{" "}
                                <span className="font-semibold">
                                    {file.name}
                                </span>
                            </p>
                        )}

                    </div>

                    {/* Error */}

                    {error && (
                        <div className="mt-5 p-4 rounded-xl bg-red-50 text-red-600">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mt-5 p-4 rounded-xl bg-green-50 text-green-600">
                            {successMessage}
                        </div>
                    )}

                    {/* Preview */}

                    {products.length > 0 && (

                        <div className="mt-6 bg-card rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                            <div className="p-6">

                                <h2 className="text-xl font-bold text-text">
                                    Preview
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    {products.length} product(s) found in the Excel file.
                                </p>

                            </div>

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gray-50 border-y border-gray-200">

                                        <tr>

                                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                                Name
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                                Brand
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                                Category
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                                Price
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                                Stock
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {products.map((product, index) => (

                                            <tr
                                                key={index}
                                                className="border-b border-gray-100"
                                            >

                                                <td className="px-6 py-4">
                                                    {product.name || "-"}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {product.brand || "-"}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {product.category || "-"}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {product.price ?? "-"}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {product.stock ?? "-"}
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    )}
                    {products.length > 0 && (
                        <div className="mt-6 flex justify-end">

                            <button
                                onClick={handleBulkUpload}
                                disabled={uploading}
                                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-60"
                            >
                                {uploading
                                    ? "Uploading..."
                                    : `Upload ${products.length} Product(s)`}
                            </button>

                        </div>
                    )}

                </div>

            </main>

        </div>
    );
}

export default BulkUpload;