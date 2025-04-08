import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/header/Header";
import Sitebar from "../../components/sidebar/Sidebar";
import Footer from "../../components/footer/Footer";
import path from "../../utils/path";
import Community from "../../modules/community/Community";

const Public = () => {
  const location = useLocation();
  const isPublicPage = location.pathname === path.PUBLIC;
  const isHideSidebar = isPublicPage || location.pathname === "/dashboard/exam"; // Ẩn sidebar ở /dashboard/exam

  return (
    <div className="w-full min-h-screen flex">
      {!isHideSidebar && (
        <div className="w-1/6">
          <Sitebar />
        </div>
      )}
      <div className={`flex flex-col flex-grow items-center ${isHideSidebar ? "w-full" : "w-5/6"}`}>
        <Header />
        {isPublicPage && <Community />}
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default Public;
