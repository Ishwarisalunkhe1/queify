function CategoryForm({
    categoryName,
    setCategoryName,
    onSubmit,
    saving,
}) {
    return (
        <form
            onSubmit={onSubmit}
            className="mt-8 bg-card rounded-2xl border border-gray-100 shadow-sm p-6"
        >
            <h2 className="text-xl font-bold text-text">
                Add Category
            </h2>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g. Beverages"
                    disabled={saving}
                    className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 disabled:bg-gray-100"
                />

                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-70"
                >
                    {saving ? "Adding..." : "+ Add Category"}
                </button>
            </div>
        </form>
    );
}

export default CategoryForm;