import { supabase } from "../lib/supabase";

// Get all inventory units for the current business
export const getInventory = async (businessId) => {
    const { data, error } = await supabase
        .from("product_inventory")
        .select(`
            id,
            business_id,
            product_id,
            barcode,
            status,
            created_at,
            updated_at,
            products (
                id,
                name,
                price,
                brand_id,
                category_id,
                brands (
                    id,
                    name
                ),
                categories (
                    id,
                    name
                )
            )
        `)
        .eq("business_id", businessId)
        .order("id", { ascending: true });

    if (error) {
        throw error;
    }

    return data || [];
};
export const addInventoryUnits = async (productId, quantity) => {
    const { error } = await supabase.rpc("add_inventory_units", {
        p_product_id: productId,
        p_quantity: quantity,
    });

    if (error) {
        throw error;
    }
};
// Get one inventory unit by its barcode
export const getInventoryByBarcode = async (barcode) => {
    const { data, error } = await supabase
        .from("product_inventory")
        .select(`
            id,
            business_id,
            product_id,
            barcode,
            status,
            created_at,
            updated_at,
            products (
                id,
                name,
                price,
                brand_id,
                category_id,
                brands (
                    id,
                    name
                ),
                categories (
                    id,
                    name
                )
            )
        `)
        .eq("barcode", barcode)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
};