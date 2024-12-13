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
    <div className="flex justify-center items-center bg-slate-100 min-h-screen">
      <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md">
        <h1 className="mb-6 font-semibold text-2xl text-center text-sky-600">
          Sign In
        </h1>
        <form onSubmit={submitHandler}>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="border-gray-300 mt-2 px-4 py-2 border rounded-lg focus:ring focus:ring-sky-300 w-full focus:outline-none"
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
              className="border-gray-300 mt-2 px-4 py-2 border rounded-lg focus:ring focus:ring-sky-300 w-full focus:outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-lg w-full font-semibold text-white transition duration-200"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            New Customer?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-sky-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
