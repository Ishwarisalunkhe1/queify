import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">

      <div className="w-full max-w-4xl">

       

        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold text-text">
            Create your QUEIFY account
          </h1>

          <p className="mt-3 text-gray-500 text-lg">
            Choose how you want to use QUEIFY
          </p>

        </div>


       

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


       

          <div className="bg-card rounded-2xl border border-gray-200 p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">

            <h2 className="text-2xl font-bold text-text">
              Customer
            </h2>

            <p className="mt-3 text-gray-500 leading-relaxed">
              Create an account to shop and use QUEIFY
              self-checkout services.
            </p>

            <button
              type="button"
              onClick={() => navigate("/signup/customer")}
              className="w-full mt-8 bg-primary text-white py-3.5 rounded-xl font-semibold shadow-md transition hover:shadow-lg hover:-translate-y-0.5"
            >
              Sign Up as Customer
            </button>

          </div>


          

          <div className="bg-card rounded-2xl border border-gray-200 p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">

            <h2 className="text-2xl font-bold text-text">
              Business Owner
            </h2>

            <p className="mt-3 text-gray-500 leading-relaxed">
              Register your business and manage your
              products, orders and business operations.
            </p>

            <button
              type="button"
              onClick={() => navigate("/signup/business")}
              className="w-full mt-8 bg-secondary text-white py-3.5 rounded-xl font-semibold shadow-md transition hover:shadow-lg hover:-translate-y-0.5"
            >
              Register Your Business
            </button>

          </div>

        </div>


        

        <div className="text-center mt-8">

          <p className="text-gray-600">

            Already have an account?

            <button
              type="button"
              onClick={() => navigate("/")}
              className="ml-2 text-secondary font-semibold hover:underline"
            >
              Login
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Signup;