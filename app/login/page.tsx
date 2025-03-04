"use client";
import Navbar from "../components/navbar";

export default function Login() {
  return (
    <main className="min-h-screen flex flex-col itemscenter">
      <Navbar currentPage="login" />
      <div className="flex-1 flex flex-col items-center justify-center -mt-20 ">
        <form className="w-full max-w-xs space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="jecal@hanap.me"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="password"
              required
            />
          </div>
          <div>
            <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
              login
            </button>
          </div>
          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div>google stuff goes here</div> */}
          <p className="pt-2 mt-8 text-xs text-center text-gray-500">
            Don't have an account?{" "}
            <button className="text-sky-600 hover:text-sky-500">
              Sign up here
            </button>
          </p>
        </form>
      </div>
    </main>
  );
}
