import { supabase } from "../lib/supabase";

// Get all products
export const getProducts = async () => {
    const { data, error } = await supabase
        .from("products")
        .select(`
            id,
            business_id,
            category_id,
            name,
            price,
            stock,
            created_at,
            updated_at,
            categories (
                id,
                name
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return data;
};


// Add a single product
export const addProduct = async ({
    businessId,
    categoryId,
    name,
    price,
    stock,
}) => {
    const { data, error } = await supabase
        .from("products")
        .insert([
            {
                business_id: businessId,
                category_id: categoryId || null,
                name,
                price,
                stock,
            },
        ])
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};


// Update product
export const updateProduct = async (
    productId,
    updates
) => {
    const { data, error } = await supabase
        .from("products")
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq("id", productId)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};


// Delete product
export const deleteProduct = async (productId) => {
    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

    if (error) {
        throw error;
    }
};

// ==============================
// Category Services
// ==============================

// Get all categories for a business
export const getCategories = async (businessId) => {
    const { data, error } = await supabase
        .from("categories")
        .select(
            "id, business_id, name, created_at, updated_at"
        )
        .eq("business_id", businessId)
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        throw error;
    }

    return data || [];
};


// Get products and their category relationships
export const getProductCategoryLinks = async (businessId) => {
    const { data, error } = await supabase
        .from("products")
        .select("id, category_id")
        .eq("business_id", businessId);

    if (error) {
        throw error;
    }

    return data || [];
};


// Add category
export const addCategory = async (
    businessId,
    name
) => {
    const { data, error } = await supabase
        .from("categories")
        .insert({
            business_id: businessId,
            name: name.trim(),
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};


// Update category
export const updateCategory = async (
    categoryId,
    businessId,
    name
) => {
    const { data, error } = await supabase
        .from("categories")
        .update({
            name: name.trim(),
            updated_at: new Date().toISOString(),
        })
        .eq("id", categoryId)
        .eq("business_id", businessId)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};


// Delete category
export const deleteCategory = async (
    categoryId,
    businessId
) => {
    const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId)
        .eq("business_id", businessId);

    if (error) {
        throw error;
    }
};