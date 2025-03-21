import {
  PlusIcon,
  SearchIcon,
  CogIcon,
  UserCircleIcon,
  XIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  ClipboardIcon,
  BellIcon,
  ClockIcon,
} from '@heroicons/react/outline';
import { useState } from 'react';
import { FaFile } from 'react-icons/fa';
import Modal from 'react-modal';
import CustomModal from '../../components/modal/CustomModal';
import { createInviteCode } from './groupdetailService';
import { Link } from 'react-router-dom';
import path from '../../utils/path';

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
  const de = [
    ['Đề tạo thủ công', '12:00:00 01/01/2025', '12:00:00 02/01/2025'],
    ['Đề kiểm tra tuần 12', '12:00:00 01/09/2025', '12:00:00 02/01/2025'],
    ['Đề kiểm tra tuần 2', '12:00:00 01/08/2025', '12:00:00 02/01/2025'],
    ['Đề khảo hạch', '12:00:00 05/03/2025', '12:00:00 02/01/2025'],
    ['Đề khảo hạch', '12:00:00 05/03/2025', '12:00:00 02/01/2025'],
    ['Đề khảo hạch', '12:00:00 05/03/2025', '12:00:00 02/01/2025'],
    ['Đề khảo hạch', '12:00:00 05/03/2025', '12:00:00 02/01/2025'],
    ['Đề khảo hạch', '12:00:00 05/03/2025', '12:00:00 02/01/2025'],
    ['Đề khảo hạch', '12:00:00 05/03/2025', '12:00:00 02/01/2025'],
  ];
  const [activeModal, setActiveModal] = useState(null);
  const [activeTab, setActiveTab] = useState('manual');
  const [inviteCode, setInviteCode] = useState(null);
  const [setActiveLink] = useState(path.EXAMPAPER);
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };
  const handleCreateInviteCode = async () => {
    try {
      const response = await createInviteCode();
      setInviteCode(response.data.code);
    } catch (error) {
      alert('Co loi xay ra: ' + error);
    }
  };
  const openModal = (modalName) => {
    setActiveModal(modalName);
  };
  const closeModal = () => {
    setActiveModal(null);
  };
  // Chuyển đổi nội dung theo tab được chọn
  const renderContent = () => {
    switch (activeTab) {
      case 'manual':
        return (
          <div className="" style={{ fontFamily: 'Playfair Display' }}>
            <div className="flex flex-col space-x-8">
              <lable className="text-blue-900 text-xl">Mã số sinh viên</lable>
              <input
                type="text"
                className="w-full h-auto border-1 bg-white text-xl pl-2 rounded-xl"
              />
            </div>
            <div className="flex flex-col space-x-7 mt-2">
              <lable className="text-blue-900 text-xl">Họ tên sinh viên</lable>
              <input
                type="text"
                className="w-full h-auto border-1 bg-white text-xl pl-2 rounded-xl"
              />
            </div>
            <div className="flex flex-col space-x-2 mt-2">
              <lable className="text-blue-900 text-xl">
                Mật khẩu sinh viên
              </lable>
              <input
                type="text"
                className="w-full h-auto border-1 bg-white text-xl pl-2 rounded-xl"
              />
            </div>
            <div className="mt-4 text-center">
              <button className="border-2 bg-white text-xl text-black border-black p-2 rounded-xl hover:bg-black hover:text-white">
                Thêm sinh viên
              </button>
            </div>
          </div>
        );
      case 'code':
        return (
          <div
            className="flex flex-col items-center"
            style={{ fontFamily: 'Playfair Display' }}
          >
            <div className="min-h-32 min-w-96 bg-blue-900 text-white text-2xl flex items-center justify-center rounded-2xl">
              <span>{inviteCode ? inviteCode : 'Did not create yet'} </span>
            </div>
            <div
              className="w-32 bg-white text-black border-1 text-center pt-2 pb-2 rounded-2xl mt-4 hover:bg-black hover:text-white"
              onClick={handleCreateInviteCode}
            >
              Tạo mã mời
            </div>
          </div>
        );
      case 'file':
        return (
          <div style={{ fontFamily: 'Playfair Display' }}>
            <div className="flex space-x-2">
              <lable className="text-black">Mật khẩu</lable>
              <input
                type="password"
                className="w-64 bg-white pl-2 text-xl p-1 rounded-2xl"
              />
            </div>
            <div className="mt-4 flex space-x-2">
              <label className="text-black">Chọn file</label>
              <input
                type="file"
                className="border-1 bg-white p-1 rounded-2xl"
              />
            </div>
            <h2 className="mt-4 text-blue-900 italic">
              Vui lòng sử dụng file theo mẫu.{' '}
              <a
                href="/files/mauTest.xlsx"
                download="Mau.xlsx"
                className="text-red-400"
              >
                Tải xuống mẫu
              </a>
            </h2>
          </div>
        );
      default:
        return null;
    }
  };
  const [settingActiveTab, setSettingActiveTab] = useState('manual');
  const openSettingTab = (settingTab) => {
    setSettingActiveTab(settingTab);
  };
  const settingRenderContent = () => {
    switch (settingActiveTab) {
      case 'manual':
        return (
          <div className="max-h-[500px] overflow-y-auto">
            {de.map((item, index) => {
              return (
                <div
                  key={index}
                  className="w-full text-black space-y-2 mt-4 bg-blue-50 pl-4 h-25 pt-4 border-l-3 border-blue-900 rounded-2xl"
                >
                  <div className="text-2xl text-blue-800">
                    <Link to={path.EXAMPAPER} onClick={()=>handleLinkClick(path.EXAMPAPER)}>{item[0]}</Link>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="w-4 h-4" />{' '}
                    <p className="text-sm">
                      Diễn ra từ {item[1]} đến {item[2]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        );
      case 'notifications':
        return <div>NOTIFICATIONS CONTENT</div>;
    }
  };
  const setting = () => {
    return (
      <div className="" style={{ fontFamily: 'Playfair Display' }}>
        <div className="flex items-center min-h-16">
          <h2 className=" font-bold text-center">
            CS0000-Lập trình hướng đối tượng-NH2025-HK1-Nhóm 1
          </h2>
        </div>
        <div className="flex justify-center items-center w-full bg-red-700 text-white">
          <div
            className={`w-1/2 flex justify-center items-center min-h-16 ${settingActiveTab === 'manual' ? 'bg-red-700' : 'bg-black'}`}
            onClick={() => openSettingTab('manual')}
          >
            <ClipboardIcon className="w-5 h-5 mr-2" /> Đề kiểm tra
          </div>
          <div
            className={`w-1/2 flex justify-center items-center min-h-16 ${settingActiveTab === 'notifications' ? 'bg-red-700' : 'bg-black'}`}
            onClick={() => openSettingTab('notifications')}
          >
            <BellIcon className="w-5 h-5 mr-2" /> Thông báo
          </div>
        </div>

        <div className="">{settingRenderContent()}</div>
      </div>
    );
  };
  const themSinhVienModal = () => {
    return (
      <div>
        <h2
          className="text-xl font-semibold mb-4 text-blue-800"
          style={{ fontFamily: 'Playfair Display' }}
        >
          Thêm sinh viên
        </h2>

        <div className="flex mb-4" style={{ fontFamily: 'Playfair Display' }}>
          <span
            onClick={() => setActiveTab('manual')}
            className={`cursor-pointer py-2 text-center pl-2 pr-2 ${activeTab === 'manual' ? 'bg-blue-800 text-white rounded-tr-xl' : 'bg-gray-200 text-black'}`}
          >
            Thêm thủ công
          </span>

          <span
            onClick={() => setActiveTab('code')}
            className={`cursor-pointer py-2 text-center pl-2 pr-2 ${activeTab === 'code' ? 'bg-blue-800 text-white rounded-t-xl' : 'bg-gray-200 text-black'}`}
          >
            Thêm bằng mã
          </span>

          <span
            onClick={() => setActiveTab('file')}
            className={`cursor-pointer py-2 text-center pl-2 pr-2 ${activeTab === 'file' ? 'bg-blue-800 text-white rounded-tl-xl' : 'bg-gray-200 text-black'}`}
          >
            Thêm từ file
          </span>
        </div>

        <div className="mb-4">{renderContent()}</div>

        <div className="flex justify-end mb-0">
          <button
            onClick={closeModal}
            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-black"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  };
  return (
    <div
      className="w-full min-h-screen flex flex-col bg-gray-100"
      style={{ fontFamily: 'PlayFair Display' }}
    >
      {activeModal === 'themsinhvien-modal' && (
        <div className="inset-0 z-40"></div>
      )}
      {/* Cai modal them sinh vien */}
      <CustomModal
        isOpen={activeModal === 'themsinhvien-modal'}
        onClose={closeModal}
        title="Them sinh vien modal"
        className="bg-blue-50 rounded-xl p-6 w-150 mx-auto z-40 min-h-64 mt-40 border-2 border-black"
      >
        {themSinhVienModal()}
      </CustomModal>
      {/* Cai modal khi nhan icon setting */}
      <CustomModal
        isOpen={activeModal === 'setting-modal'}
        onClose={closeModal}
        title="Setting modal"
        className="max-w-3/7 min-h-screen bg-white text-xl ml-auto"
      >
        {setting()}
      </CustomModal>
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
          onClick={() => {
            openModal('themsinhvien-modal');
          }}
          className="flex ml-4 items-center h-10 rounded-2xl pl-4 pr-4 border-2 border-white text-white bg-black hover:bg-blue-900"
        >
          <PlusIcon className="w-4 h-4 text-white mr-2" />
          Thêm sinh viên
        </div>

        <div
          onClick={() => {
            openModal('setting-modal');
          }}
          className="flex ml-4 items-center h-10 mr-16 rounded-2xl pl-4 pr-4 border-2 border-white text-white bg-black hover:bg-blue-900 hover:text-xl"
        >
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
