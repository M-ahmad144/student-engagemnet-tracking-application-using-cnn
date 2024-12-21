import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useProfileMutation } from "../../redux/api/userApiSlice"; // Assuming this hooks into the backend controller
import { setCredentials } from "../../redux/features/auth/authSlice";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");

  const { userInfo } = useSelector((state) => state.auth); // Assume userInfo holds the current user info

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation(); // Assume this mutation calls your backend to update the profile
  const theme = useTheme();

  useEffect(() => {
    console.log(userInfo);
    if (userInfo?.data) {
      setUserName(userInfo.data.username);
      setEmail(userInfo.data.email);
    }
  }, [userInfo]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();

    // Check if userInfo and userInfo.data.id are available
    if (!userInfo.data.email) {
      toast.error("User not found");
      return;
    }

    if (!username || !email) {
      toast.error("Username and Email are required");
      return;
    }

    try {
      const updateData = {
        username,
        email,
      };

      const res = await updateProfile(updateData).unwrap();
      dispatch(setCredentials({ ...res })); // Update the Redux state
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(
        err?.data?.message || err.error || "Failed to update profile"
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="shadow-xl p-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="mb-6 font-bold text-3xl text-center text-sky-500">
          Update Profile
        </h2>
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-gray-300 text-sm">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              className="border-gray-600 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 w-full text-black transition duration-200 focus:outline-none"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              aria-label="Username"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-300 text-sm">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="border-gray-600 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 w-full text-black transition duration-200 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
              required
            />
          </div>

          <div className="flex justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loadingUpdateProfile}
              className="flex justify-center items-center bg-sky-500 hover:bg-sky-600 focus:ring-opacity-50 px-6 py-3 rounded-lg focus:ring-2 focus:ring-pink-500 w-full text-white transition duration-200 focus:outline-none"
            >
              {loadingUpdateProfile ? (
                <svg
                  className="mr-3 w-10 h-5 text-white animate-spin"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Update"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
