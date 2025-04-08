import {
  QuestionMarkCircleIcon,
  ViewGridIcon,
  UsersIcon,
  BookOpenIcon,
  ClipboardIcon,
  CheckCircleIcon,
  BellIcon,
} from '@heroicons/react/outline';
import {GiNotebook} from 'react-icons/gi';
import { Link, useNavigate } from 'react-router-dom';
import path from '../../utils/path';
import { useState } from 'react';
import useUserStore from '../../modules/user/useUserStore';

const Sitebar = () => {
  const loggedIn = sessionStorage.getItem('user-info');
  const role = JSON.parse(sessionStorage.getItem('user-info')).role.name;
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
            <GiNotebook className="h-6 w-6 hover:text-white text-black mr-2" />
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
          <Link
            to={path.USER}
            onClick={() => handleLinkClick(path.USER)}
            className="text-black hover:bg-red-700 hover:text-white p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105"
          >
            <UsersIcon className="h-6 w-6 hover:text-white text-black mr-2" />
            Người dùng
          </Link>
          
          <Link
            to={path.SUBJECT}
            onClick={() => handleLinkClick(path.SUBJECT)}
            className="text-black hover:bg-red-700 hover:text-white p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105"
          >
            <BookOpenIcon className="h-6 w-6 hover:text-white text-black mr-2" />
            Môn học
          </Link>
          <Link
           to={path.ASSIGNMENT}
           onClick={() => handleLinkClick(path.ASSIGNMENT)}
            className="text-black hover:bg-red-700 hover:text-white p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105"
          >
            <ClipboardIcon className="h-6 w-6 hover:text-white text-black mr-2" />
            Phân công
          </Link>
          <Link
            to={path.EXAMPAPER}
            onClick={() => handleLinkClick(path.EXAMPAPER)}
            className="text-black hover:bg-red-700 hover:text-white p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105"
          >
            <CheckCircleIcon className="h-6 w-6 hover:text-white text-black mr-2" />
            Đã kiểm tra
          </Link>
          <Link
            to={path.NOTIFICATION}
            onClick={() => handleLinkClick(path.NOTIFICATION)}
            className="text-black hover:bg-red-700 hover:text-white p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105"
          >
            <BellIcon className="h-6 w-6 hover:text-white text-black mr-2" />
            Thông báo
          </Link>
        </div>
      </div>
    );
  } else if (role === 'teacher') {
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
            to={path.COURSEGROUP}
            onClick={() => handleLinkClick(path.COURSEGROUP)}
            className={`p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105 ${getLinkClass(path.COURSEGROUP)}`}
          >
            <UsersIcon className="h-6 w-6 hover:text-white text-black mr-2" />
            Nhóm học phần
          </Link>
          <Link
            to={path.TEST}
            onClick={() => handleLinkClick(path.TEST)}
            className={`p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105 ${getLinkClass(path.TEST)}`}
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
