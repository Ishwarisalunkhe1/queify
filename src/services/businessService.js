import { supabase } from "../lib/supabase";

export const getCurrentBusinessId = async () => {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
        throw userError;
    }

    if (!user) {
        throw new Error("User is not logged in.");
    }

    const { data: application, error: applicationError } =
        await supabase
            .from("business_applications")
            .select("id, status")
            .eq("user_id", user.id)
            .eq("status", "approved")
            .maybeSingle();

    if (applicationError) {
        throw applicationError;
    }

    if (!application) {
        throw new Error("Approved business application not found.");
    }

    return application.id;
};