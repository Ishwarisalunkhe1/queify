function EditProductModal({
    editingProduct,
    editName,
    setEditName,
    editBrandId,
    setEditBrandId,
    editCategoryId,
    setEditCategoryId,
    editPrice,
    setEditPrice,

    brands,
    categories,
    saving,
    onSubmit,
    onClose,
}) {
    if (!editingProduct) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
            <div className="flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-2xl bg-card shadow-xl sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl">

                {/* Header */}
                <div className="flex shrink-0 items-start justify-between border-b border-gray-100 p-5 sm:p-6">
                    <div className="min-w-0 pr-4">
                        <h2 className="text-xl font-bold text-text sm:text-2xl">
                            Edit Product
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Product ID: {editingProduct.id}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Close"
                        className="shrink-0 rounded-lg px-2 py-1 text-2xl leading-none text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50"
                    >
                        ×
                    </button>
                </div>

                {/* Scrollable Form Area */}
                <div className="overflow-y-auto">
                    <form
                        onSubmit={onSubmit}
                        className="p-5 sm:p-6"
                    >
                        {/* Product Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-text">
                                Product Name
                            </label>

                            <input
                                type="text"
                                value={editName}
                                onChange={(e) =>
                                    setEditName(e.target.value)
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                            />
                        </div>

                        {/* Brand */}
                        <div className="mt-5">
                            <label className="mb-2 block text-sm font-medium text-text">
                                Brand
                            </label>

                            <select
                                value={editBrandId}
                                onChange={(e) =>
                                    setEditBrandId(e.target.value)
                                }
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
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

                        {/* Category */}
                        <div className="mt-5">
                            <label className="mb-2 block text-sm font-medium text-text">
                                Category
                            </label>

                            <select
                                value={editCategoryId}
                                onChange={(e) =>
                                    setEditCategoryId(e.target.value)
                                }
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
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

                        {/* Price */}
                        <div className="mt-5">
                            <label className="mb-2 block text-sm font-medium text-text">
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
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                            />
                        </div>



                        {/* Actions */}
                        <div className="mt-7 grid grid-cols-1 gap-3 sm:flex sm:justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={saving}
                                className="w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60 sm:w-auto"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProductModal;