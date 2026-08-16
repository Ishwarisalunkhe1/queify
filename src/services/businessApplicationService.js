import { supabase } from "../lib/supabase";

export const createBusinessApplication = async ({
    email,
    businessName,
    ownerName,
    phone,
}) => {

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
        throw userError;
    }

    if (!user) {
        throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
        .from("business_applications")
        .insert({
            user_id: user.id,
            email: email,
            business_name: businessName,
            owner_name: ownerName,
            phone: phone,
            status: "pending",
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};