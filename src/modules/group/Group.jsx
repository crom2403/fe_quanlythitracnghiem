import { useState } from 'react';
import {
  PlusIcon,
  CogIcon,
  UserGroupIcon,
  TrashIcon,
} from '@heroicons/react/outline';
import { FaWrench, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import path from '../../utils/path';

const Group = () => {
  const [setActiveLink] = useState(path.GROUPDETAIL);
  const handleLinkClick = (link) =>{
    setActiveLink(link);
  }
  // Lưu trạng thái của menu đang hiển thị, đây là một đối tượng chứa index của nhóm và index của nhóm con
  const [visibleMenu, setVisibleMenu] = useState({
    groupIndex: null,
    subGroupIndex: null,
  });

  const list = [
    [
      'CS0000',
      'Lập trình hướng đối tượng',
      'NH2025',
      'HK1',
      [
        ['Nhóm 1', 'Sáng thứ 2', '15'],
        ['Nhóm 2', 'Sáng thứ 3', '9'],
      ],
    ],
    [
      'CS0001',
      'Cấu trúc dữ liệu và giải thuật',
      'NH2025',
      'HK1',
      [
        ['Nhóm 1', 'Chiều thứ 2', '4'],
        ['Nhóm 2', 'Sáng thứ 3', '9'],
        ['Nhóm 3', 'Sáng thứ 5', '19'],
      ],
    ],
  ];

  const toggleMenu = (groupIndex, subGroupIndex) => {
    if (
      visibleMenu.groupIndex === groupIndex &&
      visibleMenu.subGroupIndex === subGroupIndex
    ) {
      setVisibleMenu({ groupIndex: null, subGroupIndex: null }); 
    } else {
      setVisibleMenu({ groupIndex, subGroupIndex });
    }
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col bg-gray-100"
      style={{ fontFamily: 'PlayFair Display' }}
    >
      <div className="flex h-10 mt-8 items-center ml-16">
        <div className="flex h-10 border-2 border-black bg-white text-black rounded-2xl items-center">
          <select className="pl-2 pr-2">
            <option className="bg-black text-white">Đang giảng dạy</option>
            <option className="bg-black text-white">Đã xong</option>
            <option className="bg-black text-white">...</option>
          </select>
        </div>
        <div className="h-10">
          <input
            type="search"
            className="w-96 h-10 pl-4 border-1 ml-2 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:text-xl"
            placeholder="Nhập thông tin tìm kiếm..."
          />
        </div>
        <div className="flex ml-auto items-center h-10 mr-16 rounded-2xl pl-4 pr-4 border-2 border-white text-white bg-black hover:bg-blue-900 hover:text-xl">
          <PlusIcon className="w-4 h-4 text-white mr-2" />
          Thêm nhóm
        </div>
      </div>

      <div className="mt-4">
        {list.map((item, groupIndex) => (
          <div
            key={groupIndex}
            className="min-h-46 w-full text-black text-xl mt-4"
          >
            <h2 className="pl-16">
              {item[0]}-{item[1]}-{item[2]}-{item[3]}
            </h2>
            <div className="flex ml-16">
              {item[item.length - 1].map((group, subGroupIndex) => (
                <div
                  key={subGroupIndex}
                  className=" bg-white min-h-56 min-w-64 ml-4 mt-2 rounded-3xl "
                >
                  <div className="flex bg-blue-100 h-16 text-blue-700 rounded-t-3xl items-center">
                    <p className="pl-4">{group[0]}</p>
                    <div
                      className="ml-auto mr-4 flex"
                      onClick={() => toggleMenu(groupIndex, subGroupIndex)}
                    >
                      <CogIcon className="w-5 h-5 text-black" />
                      {/* Hiển thị menu chỉ khi visibleMenu trùng với cả nhóm và nhóm con */}
                      {visibleMenu.groupIndex === groupIndex &&
                        visibleMenu.subGroupIndex === subGroupIndex && (
                          <ul className="ml-4 absolute bg-white shadow-lg rounded-lg mt-2 p-2 w-auto border-2 border-gray-200 text-black">
                            <li className="p-2 hover:bg-gray-200">
                              <Link
                                to={path.GROUPDETAIL}
                                onClick={()=>handleLinkClick(path.GROUPDETAIL)}
                                className="flex items-center"
                              >
                                <UserGroupIcon className="w-5 h-5 text-blue-900 mr-2" />{' '}
                                Danh sách sinh viên
                              </Link>
                            </li>
                            <li className="p-2 hover:bg-gray-200">
                              <div className="flex items-center">
                                <FaWrench className="w-5 h-5 text-blue-900 mr-2" />{' '}
                                Sửa thông tin
                              </div>
                            </li>
                            <li className="p-2 hover:bg-gray-200">
                              <div className="flex items-center">
                                <FaEyeSlash className="w-5 h-5 text-blue-900 mr-2" />{' '}
                                Ẩn nhóm
                              </div>
                            </li>
                            <li className="p-2 hover:bg-gray-200 text-red-600">
                              <div className="flex items-center">
                                <TrashIcon className="w-5 h-5 text-blue-900 mr-2" />{' '}
                                Xóa nhóm
                              </div>
                            </li>
                          </ul>
                        )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center w-full h-2/3">
                    <p className="mt-16">{group[1]}</p>
                    <p className="mt-auto">Sĩ số: {group[2]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Group;
