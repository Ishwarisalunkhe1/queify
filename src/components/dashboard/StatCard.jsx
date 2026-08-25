function StatCard({ title, value, description }) {
    return (
        <div className="bg-card rounded-2xl border border-gray-100 shadow-sm p-6">

            <p className="text-sm font-medium text-gray-500">
                {title}
            </p>

            <h3 className="mt-2 text-3xl font-bold text-text">
                {value}
            </h3>

            <p className="mt-2 text-sm text-gray-400">
                {description}
            </p>

        </div>
    );
}

export default StatCard;