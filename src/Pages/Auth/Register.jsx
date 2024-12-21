import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

function Register() {
  // User registration state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // User register API call
  const [register, { isLoading }] = useRegisterMutation();

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  // Check if user is already logged in
  const { userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please enter all the fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const user = await register({ username, email, password }).unwrap();
      dispatch(setCredentials(user));
      navigate("/login");
      toast.success("User registered successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.data.message || "Failed to register user");
    }
  };

  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          padding: "30px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <form onSubmit={submitHandler}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#007bff",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Register
          </h1>

          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="name"
              style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              style={{
                marginTop: "5px",
                padding: "10px",
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
                color: "#333",
              }}
              placeholder="Enter name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="email"
              style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              style={{
                marginTop: "5px",
                padding: "10px",
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
                color: "#333",
              }}
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="password"
              style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              style={{
                marginTop: "5px",
                padding: "10px",
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
                color: "#333",
              }}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="confirmPassword"
              style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              style={{
                marginTop: "5px",
                padding: "10px",
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
                color: "#333",
              }}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "#ffffff",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              width: "100%",
            }}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          <p
            style={{
              marginTop: "15px",
              fontSize: "14px",
              textAlign: "center",
              color: "#666",
            }}
          >
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              style={{
                color: "#007bff",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Register;
