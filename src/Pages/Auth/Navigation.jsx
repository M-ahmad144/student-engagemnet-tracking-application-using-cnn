import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { FaChartBar } from "react-icons/fa"; // Import the analytics icon
import "./Navigation.css";

function Navigation() {
  const currentUser = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Close dropdown if clicked outside
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      id="navigation-container"
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 shadow-lg bg-slate-100 text-[0.6rem] h-[100vh] fixed`}
    >
      {/* Sidebar Links */}
      <div className="flex flex-col justify-center">
        {/* Home Icon */}
        <Link
          to="/"
          className="flex items-center transform transition-transform hover:translate-x-2"
        >
          <AiOutlineHome className="mt-[3rem] mr-2 text-sky-500" size={26} />
          <span className="hidden nav-item-name mt-[3rem] text-black text-sm">
            Home
          </span>
        </Link>

        {/* Analytics Icon */}
        <Link
          to="/analysis-result"
          className="flex items-center transform transition-transform hover:translate-x-2"
        >
          <FaChartBar className="mt-[2rem] mr-2 text-sky-500" size={26} />
          <span className="hidden nav-item-name mt-[2rem] text-black text-sm">
            Analytics
          </span>
        </Link>
      </div>

      {/* Dropdown Menu for User Profile */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-black hover:text-sky-500 focus:outline-none"
        >
          {currentUser && (
            <span className="mr-2 font-medium text-sky-500">
              {currentUser.data.username}
            </span>
          )}
          {currentUser && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-3 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          )}
        </button>

        {dropdownOpen && currentUser && (
          <ul
            className={`absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg ring-1  ring-opacity-55 ${
              !currentUser.data.isAdmin ? "-top-20" : "-top-72"
            }`}
          >
            <li>
              <Link
                to="/profile"
                className="block hover:bg-sky-600 px-4 py-2 text-black text-sm"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block hover:bg-sky-600 px-4 py-2 rounded-b-md w-full text-black text-left text-sm"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>

      {/* Login/Register Links */}
      {!currentUser && (
        <ul>
          <li>
            <Link
              to="/login"
              className="flex items-center mt-5 transform transition-transform hover:translate-x-2"
            >
              <AiOutlineLogin
                className="mt-[4px] mr-2 text-sky-500"
                size={26}
              />
              <span className="hidden nav-item-name text-sky-700">LOGIN</span>
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="flex items-center mt-5 transform transition-transform hover:translate-x-2"
            >
              <AiOutlineUserAdd className="text-sky-500" size={26} />
              <span className="hidden nav-item-name text-sky-700">
                REGISTER
              </span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Navigation;
