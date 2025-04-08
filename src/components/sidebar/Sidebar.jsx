import {
  QuestionMarkCircleIcon,
  ViewGridIcon,
  UsersIcon,
  BookOpenIcon,
  ClipboardIcon,
  CheckCircleIcon,
  BellIcon,
} from '@heroicons/react/outline';
import { GiNotebook } from 'react-icons/gi';
import { Link, useNavigate } from 'react-router-dom';
import path from '../../utils/path';
import { useState, useEffect } from 'react';

const Sitebar = () => {
  const loggedIn = sessionStorage.getItem('user-info');
  const role = loggedIn ? JSON.parse(sessionStorage.getItem('user-info')).role.name : null;
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(sessionStorage.getItem('activeLink') || null);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    sessionStorage.setItem('activeLink', link); // Lưu link được chọn vào sessionStorage
  };

  const getLinkClass = (link) => {
    return activeLink === link
      ? 'bg-red-700 text-white'
      : 'text-black hover:bg-red-700 hover:text-white';
  };

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    }
  }, [loggedIn, navigate]);

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
            <GiNotebook className={`h-6 w-6 mr-2 ${activeLink === path.GROUP ? 'text-white' : 'text-black hover:text-white'}`} />
            Nhóm học phần
          </Link>
          <Link
            to={path.QUESTION}
            onClick={() => handleLinkClick(path.QUESTION)}
            className={`p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105 ${getLinkClass(path.QUESTION)}`}
          >
            <QuestionMarkCircleIcon className={`h-6 w-6 mr-2 ${activeLink === path.QUESTION ? 'text-white' : 'text-black hover:text-white'}`} />
            Câu hỏi
          </Link>
          <Link
            to={path.USER}
            onClick={() => handleLinkClick(path.USER)}
            className={`p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105 ${getLinkClass(path.USER)}`}
          >
            <UsersIcon className={`h-6 w-6 mr-2 ${activeLink === path.USER ? 'text-white' : 'text-black hover:text-white'}`} />
            Người dùng
          </Link>
          <Link
            to={path.SUBJECT}
            onClick={() => handleLinkClick(path.SUBJECT)}
            className={`p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105 ${getLinkClass(path.SUBJECT)}`}
          >
            <BookOpenIcon className={`h-6 w-6 mr-2 ${activeLink === path.SUBJECT ? 'text-white' : 'text-black hover:text-white'}`} />
            Môn học
          </Link>
          <Link
            to={path.ASSIGNMENT}
            onClick={() => handleLinkClick(path.ASSIGNMENT)}
            className={`p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105 ${getLinkClass(path.ASSIGNMENT)}`}
          >
            <ClipboardIcon className={`h-6 w-6 mr-2 ${activeLink === path.ASSIGNMENT ? 'text-white' : 'text-black hover:text-white'}`} />
            Phân công
          </Link>
          <Link
            to={path.EXAMPAPER}
            onClick={() => handleLinkClick(path.EXAMPAPER)}
            className={`p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105 ${getLinkClass(path.EXAMPAPER)}`}
          >
            <CheckCircleIcon className={`h-6 w-6 mr-2 ${activeLink === path.EXAMPAPER ? 'text-white' : 'text-black hover:text-white'}`} />
            Đã kiểm tra
          </Link>
          <Link
            to={path.NOTIFICATION}
            onClick={() => handleLinkClick(path.NOTIFICATION)}
            className={`p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105 ${getLinkClass(path.NOTIFICATION)}`}
          >
            <BellIcon className={`h-6 w-6 mr-2 ${activeLink === path.NOTIFICATION ? 'text-white' : 'text-black hover:text-white'}`} />
            Thông báo
          </Link>
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
            className={`p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105 ${getLinkClass(path.Course)}`}
          >
            <UsersIcon className={`h-6 w-6 mr-2 ${activeLink === path.Course ? 'text-white' : 'text-black hover:text-white'}`} />
            Nhóm học phần
          </Link>
          <Link
            to={path.TEST}
            onClick={() => handleLinkClick(path.TEST)}
            className={`p-2 flex items-center rounded transform transition-all duration-200 hover:scale-105 ${getLinkClass(path.TEST)}`}
          >
            <QuestionMarkCircleIcon className={`h-6 w-6 mr-2 ${activeLink === path.TEST ? 'text-white' : 'text-black hover:text-white'}`} />
            Bài kiểm tra
          </Link>
        </div>
      </div>
    );
  }
};

export default Sitebar;