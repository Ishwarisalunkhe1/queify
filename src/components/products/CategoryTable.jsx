function CategoryTable({
    categories,
    filteredCategories,
    search,
    setSearch,
    sortBy,
    setSortBy,
    loading,
    getProductCount,
    onEdit,
    onDelete,
    deletingId,
}) {
    return (
        <div className="mt-8 bg-card rounded-2xl border border-gray-100 shadow-sm">
            {/* Header / Filters */}
            <div className="p-5 sm:p-6 border-b border-gray-100">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-text">
                            Categories
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {categories.length}{" "}
                            {categories.length === 1
                                ? "category"
                                : "categories"}{" "}
                            created
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search categories..."
                            className="w-full sm:w-64 rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                        />

                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(e.target.value)
                            }
                            className="w-full sm:w-48 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                        >
                            <option value="name-asc">
                                Name: A → Z
                            </option>

                            <option value="name-desc">
                                Name: Z → A
                            </option>

                            <option value="newest">
                                Newest First
                            </option>

                            <option value="oldest">
                                Oldest First
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 text-left">
                            <th className="px-5 py-4 font-semibold text-text">
                                Category
                            </th>

                            <th className="px-5 py-4 font-semibold text-text">
                                Products
                            </th>

                            <th className="px-5 py-4 font-semibold text-text">
                                Created
                            </th>

                            <th className="px-5 py-4 font-semibold text-text">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-5 py-12 text-center text-gray-500"
                                >
                                    Loading categories...
                                </td>
                            </tr>
                        ) : filteredCategories.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-5 py-12 text-center"
                                >
                                    <div className="text-gray-500">
                                        {search.trim()
                                            ? "No categories match your search."
                                            : "No categories found."}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredCategories.map((category) => (
                                <tr
                                    key={category.id}
                                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                                >
                                    <td className="px-5 py-4">
                                        <div className="font-semibold text-text">
                                            {category.name}
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                            {getProductCount(
                                                category.id
                                            )}{" "}
                                            {getProductCount(
                                                category.id
                                            ) === 1
                                                ? "Product"
                                                : "Products"}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 text-gray-500">
                                        {new Date(
                                            category.created_at
                                        ).toLocaleDateString()}
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit(category)
                                                }
                                                className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDelete(category)
                                                }
                                                disabled={
                                                    deletingId ===
                                                    category.id
                                                }
                                                className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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
    );
}

export default CategoryTable;