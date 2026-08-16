import ForgotPasswordForm from "../../components/forms/ForgotPasswordForm";

function ForgotPassword() {
  return (
    <div className="min-h-screen flex">

      {/* Left Information Section */}

      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-secondary to-blue-900 text-white items-center justify-center p-12">

        <div className="max-w-md">

          <h1 className="text-6xl font-bold tracking-wide">
            QUEIFY
          </h1>

          <p className="mt-6 text-2xl font-semibold">
            Reset Your Password
          </p>

          <p className="mt-5 text-blue-100 leading-relaxed text-lg">
            Enter your registered email address and
            we'll help you securely reset your password.
          </p>

          <div className="mt-8 space-y-4">

            <div className="bg-white/10 p-4 rounded-xl">
              ✓ Secure password recovery
            </div>

            <div className="bg-white/10 p-4 rounded-xl">
              ✓ Email-based verification
            </div>

            <div className="bg-white/10 p-4 rounded-xl">
              ✓ Create a new password securely
            </div>

          </div>

        </div>

      </div>

      {/* Right Forgot Password Section */}

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-6">

        <ForgotPasswordForm />

      </div>

    </div>
  );
}

export default ForgotPassword;