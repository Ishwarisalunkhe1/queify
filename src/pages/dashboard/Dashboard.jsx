import { useEffect, useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import { supabase } from "../../lib/supabase";
import { getCurrentBusinessId } from "../../services/businessService";

function Dashboard() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [recentProducts, setRecentProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const businessId = await getCurrentBusinessId();

      if (!businessId) {
        throw new Error("Business could not be identified.");
      }

      /*
       * TOTAL PRODUCTS
       */

      const { count: productCount, error: productCountError } =
        await supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("business_id", businessId);

      if (productCountError) {
        throw productCountError;
      }

      setTotalProducts(productCount || 0);

      /*
       * TOTAL STOCK
       */

      const { data: stockData, error: stockError } =
        await supabase
          .from("products")
          .select("stock")
          .eq("business_id", businessId);

      if (stockError) {
        throw stockError;
      }

      const stockTotal = (stockData || []).reduce(
        (total, product) => total + (product.stock || 0),
        0
      );

      setTotalStock(stockTotal);

      /*
       * TOTAL CATEGORIES
       */

      const { count: categoryCount, error: categoryCountError } =
        await supabase
          .from("categories")
          .select("id", { count: "exact", head: true })
          .eq("business_id", businessId);

      if (categoryCountError) {
        throw categoryCountError;
      }

      setTotalCategories(categoryCount || 0);

      /*
       * RECENT PRODUCTS
       */

      const { data: recentProductData, error: recentProductError } =
        await supabase
          .from("products")
          .select(`
                        id,
                        name,
                        price,
                        stock,
                        created_at,
                        brands (
                            name
                        ),
                        categories (
                            name
                        )
                    `)
          .eq("business_id", businessId)
          .order("created_at", { ascending: false })
          .limit(5);

      if (recentProductError) {
        throw recentProductError;
      }

      setRecentProducts(recentProductData || []);

    } catch (error) {
      console.error("Dashboard data error:", error);

      setError(
        error.message || "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">

      <Sidebar />

      <main className="flex-1 p-8">

        <DashboardHeader />

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <StatCard
            title="Total Products"
            value={loading ? "..." : totalProducts}
            description="Products added so far"
          />

          <StatCard
            title="Total Stock"
            value={loading ? "..." : totalStock}
            description="Current available stock"
          />

          <StatCard
            title="Categories"
            value={loading ? "..." : totalCategories}
            description="Product categories"
          />

        </div>

        <div className="mt-8 bg-card rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-xl font-bold text-text">
                Recent Products
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Your recently added products will appear here.
              </p>
            </div>

          </div>

          {loading ? (

            <div className="mt-8 text-center py-12 text-gray-400">
              Loading recent products...
            </div>

          ) : recentProducts.length === 0 ? (

            <div className="mt-8 text-center py-12 text-gray-400">
              No products added yet.
            </div>

          ) : (

            <div className="mt-6 overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 border-y border-gray-200">

                  <tr>

                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                      Product
                    </th>

                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                      Brand
                    </th>

                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                      Category
                    </th>

                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                      Price
                    </th>

                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                      Stock
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recentProducts.map((product) => (

                    <tr
                      key={product.id}
                      className="border-b border-gray-100"
                    >

                      <td className="px-4 py-4 font-medium">
                        {product.name}
                      </td>

                      <td className="px-4 py-4">
                        {product.brands?.name || "-"}
                      </td>

                      <td className="px-4 py-4">
                        {product.categories?.name || "-"}
                      </td>

                      <td className="px-4 py-4">
                        ₹{product.price}
                      </td>

                      <td className="px-4 py-4">
                        {product.stock}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default Dashboard;