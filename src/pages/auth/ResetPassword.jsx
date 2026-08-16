import ResetPasswordForm from "../../components/forms/ResetPasswordForm";

function ResetPassword() {
  return (
    <div className="min-h-screen flex">

      {/* Left Information Section */}

      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-secondary to-blue-900 text-white items-center justify-center p-12">

        <div className="max-w-md">

          <h1 className="text-6xl font-bold tracking-wide">
            QUEIFY
          </h1>

          <p className="mt-6 text-2xl font-semibold">
            Create a New Password
          </p>

          <p className="mt-5 text-blue-100 leading-relaxed text-lg">
            Choose a strong new password to secure your
            QUEIFY account.
          </p>

          <div className="mt-8 space-y-4">

            <div className="bg-white/10 p-4 rounded-xl">
              ✓ Secure password recovery
            </div>

            <div className="bg-white/10 p-4 rounded-xl">
              ✓ Create a new password
            </div>

            <div className="bg-white/10 p-4 rounded-xl">
              ✓ Secure your account
            </div>

          </div>

        </div>

      </div>

      {/* Right Reset Password Section */}

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-6">

        <ResetPasswordForm />

      </div>

    </div>
  );
}

export default ResetPassword;