import {
  QuestionMarkCircleIcon,
  ViewGridIcon,
  UsersIcon,
  UserIcon,
  BookOpenIcon,
  ClipboardIcon,
  CheckCircleIcon,
  BellIcon,
} from '@heroicons/react/outline';
import { Link, useNavigate } from 'react-router-dom';
import path from '../../utils/path';
import { useState } from 'react';

const Sitebar = () => {
  const role = sessionStorage.getItem('role');
  const loggedIn = sessionStorage.getItem('loggedIn');
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(null);
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const getLinkClass = (link) => {
    return activeLink === link
      ? 'bg-red-700 text-white'
      : 'text-black hover:bg-red-700 hover:text-white';
  };
  if (!loggedIn) {
    navigate('/login')
  }

  if (role === 'admin') {
    return (
      <div
        className="w-full h-full bg-white-200"
        style={{ fontFamily: 'Playfair Display' }}
      >
        <div className="flex items-center justify-center h-16 bg-red-700 text-white">
          <h1 className="text-2xl font-bold">STU Test</h1>
        </div>
        <div className="mt-10 pt-2 pb-2 w-9/10 mx-auto text-lg font-semibold flex items-center bg-black rounded-xl text-white">
          <ViewGridIcon className="h-6 w-6 text-white mr-2 pl-2" />
          Tổng quan
        </div>

        <div className="flex flex-col p-4 space-y-2">
          <Link
            to={path.GROUP}
            onClick={() => handleLinkClick(path.GROUP)}
            className={`p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105 ${getLinkClass(path.GROUP)}`}
          >
            <UsersIcon className="h-6 w-6 hover:text-white text-black mr-2" />
            Nhóm học phần
          </Link>
          <Link
            to={path.QUESTION}
            onClick={() => handleLinkClick(path.QUESTION)}
            className="text-black hover:bg-red-700 hover:text-white p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105"
          >
            {/* lớp transform cho phép các hiệu ứng biến đổi như scale, rotate, translate,...*/}
            {/* transition-all áp dụng hiệu ứng chuyển tiếp cho tất cả các thuộc tính có thể thay đổi, tạo hiệu ứng mượt mà */}
            <QuestionMarkCircleIcon className="h-6 w-6 hover:text-white text-black mr-2" />
            Câu hỏi
          </Link>
          <a
            href="#"
            className="text-black hover:bg-red-700 hover:text-white p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105"
          >
            <UserIcon className="h-6 w-6 hover:text-white text-black mr-2" />
            Thông tin cá nhân
          </a>
          
          <a
            href="#"
            className="text-black hover:bg-red-700 hover:text-white p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105"
          >
            <BookOpenIcon className="h-6 w-6 hover:text-white text-black mr-2" />
            Môn học
          </a>
          <a
            href="#"
            className="text-black hover:bg-red-700 hover:text-white p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105"
          >
            <ClipboardIcon className="h-6 w-6 hover:text-white text-black mr-2" />
            Phân công
          </a>
          <a
            href="#"
            className="text-black hover:bg-red-700 hover:text-white p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105"
          >
            <CheckCircleIcon className="h-6 w-6 hover:text-white text-black mr-2" />
            Đã kiểm tra
          </a>
          <a
            href="#"
            className="text-black hover:bg-red-700 hover:text-white p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105"
          >
            <BellIcon className="h-6 w-6 hover:text-white text-black mr-2" />
            Thông báo
          </a>
        </div>
      </div>
    );
  } else if (role === 'giangvien') {
    return (
      <div>
        <h1>GIẢNG VIÊN SIDEBAR</h1>
      </div>
    );
  } else {
    return (
      <div
        className="w-full h-full bg-white-200"
        style={{ fontFamily: 'Playfair Display' }}
      >
        <div className="flex items-center justify-center h-16 bg-red-700 text-white">
          <h1 className="text-2xl font-bold">STU Test</h1>
        </div>
        <div className="mt-10 pt-2 pb-2 w-9/10 mx-auto text-lg font-semibold flex items-center bg-black rounded-xl text-white">
          <ViewGridIcon className="h-6 w-6 text-white mr-2 pl-2" />
          Tổng quan
        </div>

        <div className="flex flex-col p-4 space-y-2">
          <Link
            to={path.Course}
            onClick={() => handleLinkClick(path.Course)}
            className={`p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105 ${getLinkClass(path.GROUP)}`}
          >
            <UsersIcon className="h-6 w-6 hover:text-white text-black mr-2" />
            Nhóm học phần
          </Link>
          <Link
            to={path.TEST}
            onClick={() => handleLinkClick(path.TEST)}
            className="text-black hover:bg-red-700 hover:text-white p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105"
          >
            {/* lớp transform cho phép các hiệu ứng biến đổi như scale, rotate, translate,...*/}
            {/* transition-all áp dụng hiệu ứng chuyển tiếp cho tất cả các thuộc tính có thể thay đổi, tạo hiệu ứng mượt mà */}
            <QuestionMarkCircleIcon className="h-6 w-6 hover:text-white text-black mr-2" />
            Bài kiểm tra
          </Link>

          
         
        </div>
      </div>
    );
  }
};

export default Sitebar;
