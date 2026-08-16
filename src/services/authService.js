import { supabase } from "../lib/supabase";


export const loginUser = async (email, password) => {

    const { data, error } =
        await supabase.auth.signInWithPassword({
            email,
            password,
        });

    if (error) {
        throw error;
    }

    const user = data.user;

    // Check if this user has a business application
    const { data: application, error: applicationError } =
        await supabase
            .from("business_applications")
            .select("status, active, session_expiry, rejection_reason")
            .eq("user_id", user.id)
            .maybeSingle();

    if (applicationError) {
        // Logout because we don't want an uncertain state
        await supabase.auth.signOut();
        throw applicationError;
    }

    // If this is a business user, check approval
    if (application) {

        if (application.status === "pending") {
            await supabase.auth.signOut();
            throw new Error(
                "Your business application is still pending approval."
            );
        }

        if (application.status === "rejected") {
            await supabase.auth.signOut();
            throw new Error(
                application.rejection_reason
                    ? `Your business application was rejected: ${application.rejection_reason}`
                    : "Your business application was rejected."
            );
        }

        if (application.status !== "approved") {
            await supabase.auth.signOut();
            throw new Error(
                "Your business application has not been approved."
            );
        }

        if (!application.active) {
            await supabase.auth.signOut();
            throw new Error(
                "Your business account is currently inactive."
            );
        }

        if (
            application.session_expiry &&
            new Date(application.session_expiry) <= new Date()
        ) {
            await supabase.auth.signOut();
            throw new Error(
                "Your business account session has expired."
            );
        }
    }

    return data;
};

export const signupUser = async (email, password, name, phone) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                phone,
            },
        },
    });

    if (error) {
        throw error;
    }

    return data;
};
export const forgotPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
            redirectTo:
                `${window.location.origin}/queify/reset-password`,
        }
    );

    if (error) {
        throw error;
    }
};
export const resetPassword = async (password) => {

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        throw error;
    }
};