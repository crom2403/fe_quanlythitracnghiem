import {
  DotsVerticalIcon,
  UserCircleIcon,
  KeyIcon,
  MoonIcon
} from '@heroicons/react/outline';
import { FaWrench } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Header = ({ classname }) => {
  const location = useLocation();
  return (
    // <div className="flex h-[70px] bg-cyan-600  ">
    <div className={`flex items-center h-16 bg-cyan-600 ${classname}`}>
      {location.pathname === '/home' && (
        <>
          <div className="flex items-center h-full space-x-8 ml-12">
            <a href="#" className="hover:bg-blue-400 rounded">
              <DotsVerticalIcon className="h-6 w-6 text-white cursor-pointer" />
            </a>
            <a href="#" className="hover:bg-blue-400 rounded">
              <FaWrench className="h-6 w-6 text-white cursor-pointer" />
            </a>
          </div>
          <div className="flex items-center h-full space-x-4 ml-auto mr-32">
            <a href="#" className="hover:bg-blue-400 rounded">
              <UserCircleIcon className="h-7 w-7 text-white cursor-pointer" />
            </a>
          </div>
        </>
      )}
      {location.pathname === '/' && (
        <div className="flex ml-auto mr-16 items-center justify-center h-16">
          <button className="mr-4 bg-black text-white flex h-10 items-center justify-center px-4 py-2 rounded-2xl hover:bg-red-600">
            <a href="#" className="flex items-center "></a>
            <MoonIcon className='w-5 h-5' />
          </button>
          <button className="bg-black text-white flex items-center h-10 justify-center px-4 py-2 rounded-2xl hover:bg-red-600">
            <a href="#" className="flex items-center ">
              <KeyIcon className="h-5 w-5 mr-2" />
              Đăng nhập
            </a>
          </button>
        </div>
      )}
    </div>
  );
};

Header.propTypes = {
  classname: PropTypes.string,
};

export default Header;
