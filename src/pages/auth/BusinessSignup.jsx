import BusinessSignupForm from "../../components/forms/BusinessSignupForm";

function BusinessSignup() {
    return (
        <div className="min-h-screen flex">

            {/* Left Information Section */}

            <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-secondary to-blue-900 text-white items-center justify-center p-12">

                <div className="max-w-md">

                    <h1 className="text-6xl font-bold tracking-wide">
                        QUEIFY
                    </h1>

                    <p className="mt-6 text-2xl font-semibold">
                        Grow Your Business with QUEIFY
                    </p>

                    <p className="mt-5 text-blue-100 leading-relaxed text-lg">
                        Manage your products, orders and business
                        operations with a smarter self-checkout platform.
                    </p>

                    <div className="mt-8 space-y-4">

                        <div className="bg-white/10 p-4 rounded-xl transition duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg">
                            ✓ Manage products and categories
                        </div>

                        <div className="bg-white/10 p-4 rounded-xl transition duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg">
                            ✓ Manage orders and customers
                        </div>

                        <div className="bg-white/10 p-4 rounded-xl transition duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg">
                            ✓ Get real-time business insights
                        </div>

                    </div>

                </div>

            </div>


            {/* Right Signup Section */}

            <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-6 py-12">

                <BusinessSignupForm />

            </div>

        </div>
    );
}

export default BusinessSignup;