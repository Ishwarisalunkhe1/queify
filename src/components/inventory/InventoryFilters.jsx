function InventoryFilters({
    search,
    setSearch,
    productFilter,
    setProductFilter,
    statusFilter,
    setStatusFilter,
    products,
    onPrintAll,
}) {
    const hasFilters =
        search ||
        productFilter ||
        statusFilter;

    const handleClearFilters = () => {
        setSearch("");
        setProductFilter("");
        setStatusFilter("");
    };

    return (
        <div className="border-b border-gray-100 p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_180px_auto]">

                {/* Search */}
                <div>
                    <label
                        htmlFor="inventory-search"
                        className="sr-only"
                    >
                        Search inventory
                    </label>

                    <input
                        id="inventory-search"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search product or barcode..."
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-text outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                {/* Product Filter */}
                <div>
                    <label
                        htmlFor="inventory-product-filter"
                        className="sr-only"
                    >
                        Filter by product
                    </label>

                    <select
                        id="inventory-product-filter"
                        value={productFilter}
                        onChange={(e) =>
                            setProductFilter(e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">
                            All Products
                        </option>

                        {products.map((product) => (
                            <option
                                key={product.id}
                                value={product.id}
                            >
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div>
                    <label
                        htmlFor="inventory-status-filter"
                        className="sr-only"
                    >
                        Filter by status
                    </label>

                    <select
                        id="inventory-status-filter"
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">
                            All Status
                        </option>

                        <option value="available">
                            Available
                        </option>

                        <option value="reserved">
                            Reserved
                        </option>

                        <option value="sold">
                            Sold
                        </option>
                    </select>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        disabled={!hasFilters}
                        className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Clear Filters
                    </button>

                    <button
                        type="button"
                        onClick={onPrintAll}
                        className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        Print All
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InventoryFilters;