import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute() {
  const userInfo = useSelector((state) => state.auth.userInfo);

  // If user is logged in, render the child routes, otherwise redirect to login
  return userInfo ? <Outlet /> : <Navigate to="/login" />;
}
