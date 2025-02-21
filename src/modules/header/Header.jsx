import { DotsVerticalIcon, UserCircleIcon } from '@heroicons/react/outline';
import { FaWrench } from 'react-icons/fa';

const Header = () => {
  return (
    <div className="flex h-[70px] bg-cyan-600">
      <div className="flex items-center h-full space-x-8 ml-12">
        <a href="#" className="hover:bg-blue-400 bg-cyan-800 rounded">
          <DotsVerticalIcon className="h-6 w-6 text-white cursor-pointer" />
        </a>
        <a href="#" className="hover:bg-blue-400 bg-cyan-800 rounded">
          <FaWrench className="h-6 w-6 text-white cursor-pointer" />
        </a>
      </div>
      <div className="flex items-center h-full space-x-4 ml-auto mr-32">
        <a href="#" className="hover:bg-blue-400 bg-cyan-800 rounded">
          <UserCircleIcon className="h-7 w-7 text-white cursor-pointer" />
        </a>
      </div>
    </div>
  );
};

export default Header;
