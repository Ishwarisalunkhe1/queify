import LoginForm from "../../components/forms/LoginForm";


function Login() {

  return (

    <div className="min-h-screen flex">




      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-secondary to-blue-900 text-white items-center justify-center p-12">

        <div className="max-w-md">


          <h1 className="text-6xl font-bold tracking-wide">
            QUEIFY
          </h1>


          <p className="mt-6 text-2xl font-semibold">
            Queue-less Self Checkout Platform
          </p>


          <p className="mt-5 text-blue-100 leading-relaxed text-lg">

            Empower your business with faster checkout,
            smarter management and real-time insights.

          </p>


          <div className="mt-8 space-y-4">


            <div className=" bg-white/10 p-4 rounded-xl transition duration-300 hover:-translate-y-1 hover:bg-white/20  hover:shadow-lg">

              ✓ Faster customer checkout

            </div>


            <div className="  bg-white/10 p-4 rounded-xl transition duration-300 hover:-translate-y-1 hover:bg-white/20  hover:shadow-lg">

              ✓ Product and order management

            </div>


            <div className=" bg-white/10  p-4 rounded-xl transition duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg">

              ✓ Business analytics dashboard

            </div>


          </div>


        </div>


      </div>


      {/* Right Login Section */}


      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-6">


        <LoginForm />


      </div>


    </div>

  );

}


export default Login;