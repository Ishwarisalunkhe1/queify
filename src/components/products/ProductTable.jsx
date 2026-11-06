function ProductTable({
    filteredProducts,
    loading,
    onEdit,
    onDelete,
    deletingId,
}) {
    if (loading) {
        return (
            <div className="px-5 py-12 text-center text-gray-500 sm:px-6">
                Loading products...
            </div>
        );
    }

    if (filteredProducts.length === 0) {
        return (
            <div className="px-5 py-12 text-center text-gray-500 sm:px-6">
                No products found.
            </div>
        );
    }

    return (
        <>
            {/* MOBILE PRODUCT CARDS */}
            <div className="space-y-4 p-4 md:hidden">
                {filteredProducts.map((product) => {
                    const availableStock = Number(
                        product.availableStock || 0
                    );

                    const isInStock = availableStock > 0;

                    return (
                        <div
                            key={product.id}
                            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                        >
                            {/* Product Header */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h3 className="break-words text-base font-bold text-text">
                                        {product.name}
                                    </h3>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Product ID: {product.id}
                                    </p>
                                </div>

                                <div className="shrink-0 text-right">
                                    <p className="text-base font-bold text-text">
                                        ₹
                                        {Number(product.price).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-gray-50 p-3">
                                    <p className="text-xs text-gray-500">
                                        Brand
                                    </p>

                                    <p className="mt-1 break-words text-sm font-semibold text-text">
                                        {product.brands?.name || "—"}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-gray-50 p-3">
                                    <p className="text-xs text-gray-500">
                                        Category
                                    </p>

                                    <p className="mt-1 break-words text-sm font-semibold text-text">
                                        {product.categories?.name || "—"}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-gray-50 p-3">
                                    <p className="text-xs text-gray-500">
                                        Available Units
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-text">
                                        {availableStock}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-gray-50 p-3">
                                    <p className="text-xs text-gray-500">
                                        Stock Status
                                    </p>

                                    <span
                                        className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isInStock
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {isInStock
                                            ? "In Stock"
                                            : "Out of Stock"}
                                    </span>
                                </div>
                            </div>

                            {/* Product ID */}
                            <div className="mt-3 rounded-xl bg-gray-50 p-3">
                                <p className="text-xs text-gray-500">
                                    Product ID
                                </p>

                                <p className="mt-1 text-sm font-semibold text-text">
                                    #{product.id}
                                </p>
                            </div>

                            <p className="mt-3 text-xs leading-5 text-gray-500">
                                Individual unit barcodes and their sold or
                                available status can be viewed on the
                                Inventory page.
                            </p>

                            {/* Actions */}
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => onEdit(product)}
                                    className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onDelete(product)}
                                    disabled={deletingId === product.id}
                                    className="rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {deletingId === product.id
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* TABLET / DESKTOP TABLE */}
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px] text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 text-left">
                            <th className="px-4 py-3 font-semibold text-text">
                                ID
                            </th>

                            <th className="px-4 py-3 font-semibold text-text">
                                Product
                            </th>

                            <th className="px-4 py-3 font-semibold text-text">
                                Brand
                            </th>

                            <th className="px-4 py-3 font-semibold text-text">
                                Category
                            </th>

                            <th className="px-4 py-3 font-semibold text-text">
                                Price
                            </th>

                            <th className="px-4 py-3 font-semibold text-text">
                                Available Units
                            </th>

                            <th className="px-4 py-3 font-semibold text-text">
                                Status
                            </th>

                            <th className="px-4 py-3 font-semibold text-text">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProducts.map((product) => {
                            const availableStock = Number(
                                product.availableStock || 0
                            );

                            const isInStock = availableStock > 0;

                            return (
                                <tr
                                    key={product.id}
                                    className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-4 text-gray-600">
                                        {product.id}
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="font-semibold text-text">
                                            {product.name}
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 text-gray-600">
                                        {product.brands?.name || "—"}
                                    </td>

                                    <td className="px-4 py-4 text-gray-600">
                                        {product.categories?.name || "—"}
                                    </td>

                                    <td className="px-4 py-4 font-semibold text-text">
                                        ₹
                                        {Number(product.price).toFixed(2)}
                                    </td>

                                    <td className="px-4 py-4 font-semibold text-text">
                                        {availableStock}
                                    </td>

                                    <td className="px-4 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isInStock
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {isInStock
                                                ? "In Stock"
                                                : "Out of Stock"}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(product)}
                                                className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onDelete(product)}
                                                disabled={
                                                    deletingId === product.id
                                                }
                                                className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {deletingId === product.id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ProductTable;