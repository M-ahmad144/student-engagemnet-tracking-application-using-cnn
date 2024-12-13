import { Outlet } from "react-router-dom";
import Navigation from "./Pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

export default function App() {
  return (
    <>
      <ToastContainer />
      <Navigation />
      {/* outlet - this is where the child routes will be rendered */}
      <main className="py-3">
        <Outlet />
      </main>
    </>
  );
}
