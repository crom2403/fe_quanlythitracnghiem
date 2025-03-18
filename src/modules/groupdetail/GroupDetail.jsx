import {
  PlusIcon,
  SearchIcon,
  CogIcon,
  UserCircleIcon,
  XIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from '@heroicons/react/outline';
import { useState } from 'react';
import { FaFile } from 'react-icons/fa';
const GroupDetail = () => {
  const hocphan = [
    ['CS0000-Cấu trúc dữ liệu và giải thuật-NH2025-HK1-Nhóm 1'],
    23,
    ['Lê Yến Đan', 'DH52101497', 'Nữ', '15/02/2003'],
    ['Trần Thanh Sơn', 'DH5210000', 'Nam', '31/02/2000'],
    ['Nguyễn Dư Ngọc Thiện', 'DH5210001', 'Nam', '31/11/2000'],
    ['Võ Minh Thiện', 'DH5210002', 'Nam', '1/11/2000'],
    ['Phan Anh Tuấn', 'DH5210003', 'Nam', '1/6/2000'],
    ['Phan Anh Dũng', 'DH5210003', 'Nam', '1/6/2000'],
    ['Phan Minh Tuấn', 'DH5210003', 'Nam', '1/6/2000'],
  ];
  const Modal = ({ isOpen, closeModal }) => {
    if (!isOpen) return null;
    return (
        <>
        {/* Modal content */}
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-96">
            <h2 className="text-xl font-semibold mb-4">Hộp Thoại</h2>
            <p className="mb-4">Đây là nội dung của hộp thoại.</p>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };
  const [isOpenModal, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div
      className="w-full min-h-screen flex flex-col bg-gray-100 "
      style={{ fontFamily: 'PlayFair Display' }}
    >
      <div className="flex h-10 mt-8 items-center ml-16">
        <div className="h-10">
          <input
            type="search"
            className="w-96 h-10 pl-4 border-1 mr-1 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:text-xl"
            placeholder="Nhập thông tin tìm kiếm..."
          />
        </div>
        <div className="flex h-10 border-1 border-black bg-white text-black pl-2 pr-2 rounded-2xl items-center hover:bg-black hover:text-white">
          <SearchIcon className="w-5 h-5" />
        </div>
        <div className="flex ml-auto items-center h-10 rounded-2xl pl-4 pr-4 border-2 border-white text-white bg-black hover:bg-blue-900">
          <FaFile className="w-4 h-4 text-white mr-2" />
          Xuất danh sách SV
        </div>
        <div className="flex ml-4 items-center h-10 rounded-2xl pl-4 pr-4 border-2 border-white text-white bg-black hover:bg-blue-900 ">
          <FaFile className="w-4 h-4 text-white mr-2" />
          Xuất bảng điểm
        </div>
        <div onClick={openModal} className="flex ml-4 items-center h-10 rounded-2xl pl-4 pr-4 border-2 border-white text-white bg-black hover:bg-blue-900">
          <PlusIcon className="w-4 h-4 text-white mr-2" />
          Thêm sinh viên
        </div>
        <div className="flex ml-4 items-center h-10 mr-16 rounded-2xl pl-4 pr-4 border-2 border-white text-white bg-black hover:bg-blue-900 hover:text-xl">
          <CogIcon className="w-5 h-5 text-white" />
        </div>
        <Modal isOpen={isOpenModal} closeModal={closeModal} />
      </div>
      <div className="ml-16 mr-16 mt-8 bg-white rounded-t-xl">
        <div className="w-full h-16 bg-gray-200 text-xl flex items-center rounded-t-xl">
          {hocphan[0][0]}
          <p className="ml-auto mr-8 text-gray-500">Sĩ số: {hocphan[1]} </p>
        </div>
        <div className="overflow-auto max-h-140">
          <table className="w-full h-auto mt-4">
            <thead>
              <tr className="text-xl">
                <th className="">STT</th>
                <th className="text-left flex items-center">
                  Họ tên <SortAscendingIcon className="w-5 h-5 ml-2" />
                  <SortDescendingIcon className="w-5 h-5 ml-2" />
                </th>
                <th className="">Mã sinh viên</th>
                <th className="">Giới tính</th>
                <th className="">Ngày sinh</th>
                <th className="">Hành động</th>
              </tr>
            </thead>
            <tbody className="">
              {hocphan.slice(2).map((item, index) => (
                <tr key={index} className="text-center space-y-8 text-xl">
                  <td className="">{index + 1}</td>
                  <td className="text-left flex items-center align-middle pt-8">
                    <UserCircleIcon className="w-10 h-10 text-gray-600 mr-2" />{' '}
                    <p className="text-blue-600">{item[0]}</p>
                  </td>
                  <td>{item[1]}</td>
                  <td>{item[2]}</td>
                  <td>{item[3]}</td>
                  <td className="flex flex-col items-center">
                    <div className="text-center bg-black text-white rounded-xl">
                      <XIcon className="w-5 h-5 m-2" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
