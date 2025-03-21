import { Outlet } from 'react-router-dom';
import Header from '../../components/header/Header';
import Sitebar from '../../components/sidebar/Sidebar';
import Footer from '../../components/footer/Footer';
import { useLocation } from 'react-router-dom';
import path from '../../utils/path';
import Community from '../../modules/community/Community';

const Public = () => {
  const location = useLocation();
  const isPublicPage = location.pathname === path.PUBLIC;

  return (
    <div className="w-full min-h-screen flex">
      {!isPublicPage && (
        <div className="w-1/6">
          <Sitebar />
        </div>
      )}
      <div className={`flex flex-col flex-grow items-center ${isPublicPage ? 'w-full' : 'w-5/6'}`}>
        <Header />
        {isPublicPage && <Community />}
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default Public;
