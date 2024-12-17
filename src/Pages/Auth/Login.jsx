import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    try {
      const user = await login({ email, password }).unwrap();
      dispatch(setCredentials(user));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to sign in");
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-slate-100 to-sky-100 min-h-screen">
      <div className="relative bg-white shadow-xl p-8 rounded-lg w-full max-w-lg">
        {/* Decorative Circle */}
        <div className="-top-12 left-1/2 absolute flex justify-center items-center bg-sky-600 shadow-md rounded-full w-20 h-20 transform -translate-x-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5v-3a4.5 4.5 0 10-9 0v3m12 0a3 3 0 11-6 0m6 0a3 3 0 11-6 0M15 12h-6m9 0v5.25a2.25 2.25 0 01-2.25 2.25H7.5a2.25 2.25 0 01-2.25-2.25V12m13.5 0h-15"
            />
          </svg>
        </div>

        <h1 className="mb-6 font-semibold text-2xl text-center text-sky-600">
          Welcome Back
        </h1>
        <p className="mb-8 text-center text-gray-500">
          Please sign in to continue
        </p>

        <form onSubmit={submitHandler}>
          {/* Email Input */}
          <div className="mb-5">
            <label htmlFor="email" className="block font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="border-gray-300 mt-2 px-4 py-3 border rounded-lg focus:ring focus:ring-sky-300 w-full text-gray-800 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border-gray-300 mt-2 px-4 py-3 border rounded-lg focus:ring focus:ring-sky-300 w-full text-gray-800 focus:outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center items-center bg-sky-600 hover:bg-sky-700 px-4 py-3 rounded-lg w-full font-semibold text-white transition duration-200"
          >
            {isLoading ? (
              <svg
                className="w-5 h-5 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex justify-between items-center mt-6">
          <hr className="border-gray-300 w-full" />
          <span className="mx-4 text-gray-400">OR</span>
          <hr className="border-gray-300 w-full" />
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            New Customer?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="font-semibold text-sky-600 hover:underline"
            >
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
