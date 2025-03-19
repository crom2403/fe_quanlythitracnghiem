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
import Modal from 'react-modal';
import { createInviteCode } from './groupdetailService';

Modal.setAppElement('#root');

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');
  const [inviteCode, setInviteCode] = useState(null);

  const handleCreateInviteCode = async () => {
    try {
      const response = await createInviteCode();
      setInviteCode(response.data.code);
    } catch (error) {
      alert('Co loi xay ra');
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  // Chuyển đổi nội dung theo tab được chọn
  const renderContent = () => {
    switch (activeTab) {
      case 'manual':
        return (
          <div>
            <div className="flex space-x-2">
              <label>Mã số sinh viên</label>
              <input
                type="text"
                className="w-96 h-auto border-1 bg-white text-xl pl-2"
              />
            </div>
            <div className="mt-4">
              <button className="border-1 bg-blue-200 text-black p-2 rounded-xl hover:bg-black hover:text-white">
                Thêm sinh viên
              </button>
            </div>
          </div>
        );
      case 'code':
        return (
          <div className="flex flex-col items-center">
            <div className="min-h-32 min-w-96 bg-white text-2xl flex items-center justify-center">
              <span>{inviteCode ? inviteCode : 'Did not created yet'} </span>
            </div>
            <div
              className="w-32 bg-blue-700 text-white border-1 text-center pt-2 pb-2 rounded-2xl mt-4"
              onClick={handleCreateInviteCode}
            >
              Tạo mã mời
            </div>
          </div>
        );
      case 'file':
        return (
          <div>
            <div className='flex space-x-2'>
              <lable>Mật khẩu</lable>
              <input type='password' className='w-64 bg-white pl-2 text-xl'/>
            </div>
            <div className='mt-4 flex space-x-2'>
              <label>Chọn file</label>
              <input type='file' className='border-1' />
            </div>
            <h2 className='mt-4'>Vui lòng sử dụng file theo mẫu. <a href='../public/files/mau.xlsx' download className='text-red-600'>Tải xuống mẫu</a></h2>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div
      className="w-full min-h-screen flex flex-col bg-gray-100 "
      style={{ fontFamily: 'PlayFair Display' }}
    >
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Thêm sinh viên modal"
        className="bg-gray-100 rounded-xl p-6 w-192 mx-auto relative z-50 min-h-64"
        overlayClassName="fixed inset-0 bg-opacity-50 z-40 flex items-center justify-center"
      >
        <h2 className="text-xl font-semibold mb-4">Thêm sinh viên</h2>

        {/* Các thẻ (tabs) */}
        <div className="flex mb-4">
          {/* Thẻ "Thêm thủ công" */}
          <span
            onClick={() => setActiveTab('manual')}
            className={`cursor-pointer py-2 text-center pl-2 pr-2 ${activeTab === 'manual' ? 'bg-blue-500 text-white rounded-r-xl' : 'bg-gray-200 text-black'}`}
          >
            Thêm thủ công
          </span>

          {/* Thẻ "Thêm bằng mã" */}
          <span
            onClick={() => setActiveTab('code')}
            className={`cursor-pointer py-2 text-center pl-2 pr-2 ${activeTab === 'code' ? 'bg-blue-500 text-white rounded-xl' : 'bg-gray-200 text-black'}`}
          >
            Thêm bằng mã
          </span>

          {/* Thẻ "Thêm từ file" */}
          <span
            onClick={() => setActiveTab('file')}
            className={`cursor-pointer py-2 text-center pl-2 pr-2 ${activeTab === 'file' ? 'bg-blue-500 text-white rounded-l-xl' : 'bg-gray-200 text-black'}`}
          >
            Thêm từ file
          </span>
        </div>
        {/* Nội dung thay đổi theo lựa chọn hehe */}
        <div className="mb-4">{renderContent()}</div>

        <div className="flex justify-end mb-0">
          <button
            onClick={closeModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Đóng
          </button>
        </div>
      </Modal>
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
        <div
          onClick={openModal}
          className="flex ml-4 items-center h-10 rounded-2xl pl-4 pr-4 border-2 border-white text-white bg-black hover:bg-blue-900"
        >
          <PlusIcon className="w-4 h-4 text-white mr-2" />
          Thêm sinh viên
        </div>

        <div className="flex ml-4 items-center h-10 mr-16 rounded-2xl pl-4 pr-4 border-2 border-white text-white bg-black hover:bg-blue-900 hover:text-xl">
          <CogIcon className="w-5 h-5 text-white" />
        </div>
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
