function ProductFilters({
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    categories,
    brands,
    priceMin,
    priceMax,
    onClearFilters,
}) {
    return (
        <div className="mt-6 rounded-2xl border border-gray-100 bg-card p-4 shadow-sm sm:p-6">
            {/* Header */}
            <div className="flex flex-col gap-3">
                <div>
                    <h2 className="text-lg font-bold text-text sm:text-xl">
                        Filter Products
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-gray-500">
                        Search and filter products by category, brand, and price.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClearFilters}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 sm:w-fit"
                >
                    Clear Filters
                </button>
            </div>

            {/* Search */}
            <div className="mt-5">
                <label
                    htmlFor="product-search"
                    className="mb-2 block text-sm font-medium text-text"
                >
                    Search
                </label>

                <input
                    id="product-search"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by product name..."
                    className="w-full min-w-0 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                />
            </div>

            {/* Category + Brand */}
            <div className="mt-5 grid grid-cols-1 gap-4">
                <div>
                    <label
                        htmlFor="product-category-filter"
                        className="mb-2 block text-sm font-medium text-text"
                    >
                        Category
                    </label>

                    <select
                        id="product-category-filter"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full min-w-0 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                    >
                        <option value="">All Categories</option>

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

                <div>
                    <label
                        htmlFor="product-brand-filter"
                        className="mb-2 block text-sm font-medium text-text"
                    >
                        Brand
                    </label>

                    <select
                        id="product-brand-filter"
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="w-full min-w-0 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                    >
                        <option value="">All Brands</option>

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
            </div>

            {/* Price */}
            <div className="mt-6 border-t border-gray-100 pt-5">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-text">
                        Price Range
                    </label>

                    <span className="text-sm font-semibold text-primary">
                        ₹{minPrice} - ₹{maxPrice}
                    </span>
                </div>

                {/* Price Inputs */}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                        <label
                            htmlFor="minimum-price"
                            className="mb-2 block text-xs font-medium text-gray-500"
                        >
                            Minimum Price
                        </label>

                        <input
                            id="minimum-price"
                            type="number"
                            min={priceMin}
                            max={maxPrice}
                            step="0.01"
                            value={minPrice}
                            onChange={(e) => {
                                const value = Number(e.target.value);

                                if (value <= maxPrice) {
                                    setMinPrice(value);
                                }
                            }}
                            className="w-full min-w-0 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                        />
                    </div>

                    <div className="min-w-0">
                        <label
                            htmlFor="maximum-price"
                            className="mb-2 block text-xs font-medium text-gray-500"
                        >
                            Maximum Price
                        </label>

                        <input
                            id="maximum-price"
                            type="number"
                            min={minPrice}
                            max={priceMax}
                            step="0.01"
                            value={maxPrice}
                            onChange={(e) => {
                                const value = Number(e.target.value);

                                if (value >= minPrice) {
                                    setMaxPrice(value);
                                }
                            }}
                            className="w-full min-w-0 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                        />
                    </div>
                </div>

                {/* Price Sliders */}
                <div className="mt-5 space-y-4">
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label
                                htmlFor="minimum-price-range"
                                className="text-xs text-gray-500"
                            >
                                Minimum
                            </label>

                            <span className="text-xs font-medium text-gray-600">
                                ₹{minPrice}
                            </span>
                        </div>

                        <input
                            id="minimum-price-range"
                            type="range"
                            min={priceMin}
                            max={priceMax}
                            step="0.01"
                            value={minPrice}
                            onChange={(e) => {
                                const value = Number(e.target.value);

                                if (value <= maxPrice) {
                                    setMinPrice(value);
                                }
                            }}
                            className="w-full accent-primary"
                        />
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label
                                htmlFor="maximum-price-range"
                                className="text-xs text-gray-500"
                            >
                                Maximum
                            </label>

                            <span className="text-xs font-medium text-gray-600">
                                ₹{maxPrice}
                            </span>
                        </div>

                        <input
                            id="maximum-price-range"
                            type="range"
                            min={priceMin}
                            max={priceMax}
                            step="0.01"
                            value={maxPrice}
                            onChange={(e) => {
                                const value = Number(e.target.value);

                                if (value >= minPrice) {
                                    setMaxPrice(value);
                                }
                            }}
                            className="w-full accent-primary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductFilters;