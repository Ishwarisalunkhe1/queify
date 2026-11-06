function EditCategoryModal({
    editingCategory,
    editName,
    setEditName,
    onSubmit,
    onClose,
    saving,
}) {
    if (!editingCategory) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div
                className="w-full max-w-md rounded-2xl bg-card p-6 sm:p-8 shadow-xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-category-title"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2
                            id="edit-category-title"
                            className="text-xl sm:text-2xl font-bold text-text"
                        >
                            Edit Category
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Update the category name for your products.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Close"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={onSubmit}
                    className="mt-6"
                >
                    <label
                        htmlFor="edit-category-name"
                        className="mb-2 block text-sm font-medium text-text"
                    >
                        Category Name
                    </label>

                    <input
                        id="edit-category-name"
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        disabled={saving}
                        autoFocus
                        placeholder="e.g. Beverages"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20 disabled:bg-gray-100"
                    />

                    {/* Actions */}
                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditCategoryModal;