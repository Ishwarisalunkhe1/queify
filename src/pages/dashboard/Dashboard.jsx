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

      const {
        count: productCount,
        error: productCountError,
      } = await supabase
        .from("products")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("business_id", businessId);

      if (productCountError) {
        throw productCountError;
      }

      setTotalProducts(productCount || 0);

      /*
       * TOTAL AVAILABLE PHYSICAL INVENTORY UNITS
       */

      const {
        count: availableCount,
        error: inventoryCountError,
      } = await supabase
        .from("product_inventory")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("business_id", businessId)
        .eq("status", "available");

      if (inventoryCountError) {
        throw inventoryCountError;
      }

      setTotalStock(availableCount || 0);

      /*
       * TOTAL CATEGORIES
       */

      const {
        count: categoryCount,
        error: categoryCountError,
      } = await supabase
        .from("categories")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("business_id", businessId);

      if (categoryCountError) {
        throw categoryCountError;
      }

      setTotalCategories(categoryCount || 0);

      /*
       * RECENT PRODUCTS
       */

      const {
        data: recentProductData,
        error: recentProductError,
      } = await supabase
        .from("products")
        .select(`
                    id,
                    name,
                    price,
                    created_at,
                    brands (
                        name
                    ),
                    categories (
                        name
                    )
                `)
        .eq("business_id", businessId)
        .order("created_at", {
          ascending: false,
        })
        .limit(5);

      if (recentProductError) {
        throw recentProductError;
      }

      /*
       * GET AVAILABLE UNITS FOR RECENT PRODUCTS
       */

      const recentProductIds = (recentProductData || []).map(
        (product) => product.id
      );

      let stockCounts = {};

      if (recentProductIds.length > 0) {
        const {
          data: inventoryData,
          error: recentInventoryError,
        } = await supabase
          .from("product_inventory")
          .select("product_id")
          .eq("business_id", businessId)
          .eq("status", "available")
          .in("product_id", recentProductIds);

        if (recentInventoryError) {
          throw recentInventoryError;
        }

        stockCounts = (inventoryData || []).reduce(
          (counts, item) => {
            counts[item.product_id] =
              (counts[item.product_id] || 0) + 1;

            return counts;
          },
          {}
        );
      }

      const productsWithStock = (recentProductData || []).map(
        (product) => ({
          ...product,
          availableStock: stockCounts[product.id] || 0,
        })
      );

      setRecentProducts(productsWithStock);

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
    <div className="flex min-h-screen bg-background">

      <Sidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

        <DashboardHeader />

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* STAT CARDS */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          <StatCard
            title="Total Products"
            value={loading ? "..." : totalProducts}
            description="Products added so far"
          />

          <StatCard
            title="Total Stock"
            value={loading ? "..." : totalStock}
            description="Available physical inventory units"
          />

          <StatCard
            title="Categories"
            value={loading ? "..." : totalCategories}
            description="Product categories"
          />

        </div>

        {/* RECENT PRODUCTS */}

        <div className="mt-8 rounded-2xl border border-gray-100 bg-card p-4 shadow-sm sm:p-6">

          <div>
            <h3 className="text-xl font-bold text-text">
              Recent Products
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Your recently added products and their current
              available physical stock.
            </p>
          </div>

          {loading ? (

            <div className="mt-8 py-12 text-center text-gray-400">
              Loading recent products...
            </div>

          ) : recentProducts.length === 0 ? (

            <div className="mt-8 py-12 text-center text-gray-400">
              No products added yet.
            </div>

          ) : (

            <div className="mt-6 overflow-x-auto">

              <table className="w-full min-w-[650px]">

                <thead className="border-y border-gray-200 bg-gray-50">

                  <tr>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Product
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Brand
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Category
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Price
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      Available Stock
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recentProducts.map((product) => (

                    <tr
                      key={product.id}
                      className="border-b border-gray-100"
                    >

                      <td className="px-4 py-4 font-medium text-text">
                        {product.name}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {product.brands?.name || "-"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {product.categories?.name || "-"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        ₹
                        {Number(
                          product.price || 0
                        ).toFixed(2)}
                      </td>

                      <td className="px-4 py-4 font-semibold text-text">
                        {product.availableStock}
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