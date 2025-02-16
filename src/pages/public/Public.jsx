import { Outlet } from 'react-router-dom';
import Header from '../../modules/header/Header';
import Sitebar from '../../modules/sitebar/Sitebar';
const Public = () => {
  return (
    <div className="w-full h-screen flex ">
      <div className="w-1/6">
        <Sitebar />
      </div>
      <div className="w-5/6 flex flex-col">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default Public;
