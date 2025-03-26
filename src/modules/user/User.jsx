import {
  PlusIcon,
  PencilIcon,
  XIcon,
  SearchIcon,
} from '@heroicons/react/outline';
import PaginatedTable from '../../components/pagination/PaginatedTable';
import { useState, useEffect } from 'react';
import CustomModal from '../../components/modal/CustomModal';
import CustomButton from '../../components/button/CustomButton';
import { Radio } from '@mui/material';

const roles = ['Tất cả', 'Giảng viên', 'Sinh viên', 'Admin'];
const defaultUsers = [
  {
    mssv: 'DH52100000',
    hoten: 'Trần Thanh Sơn',
    gioitinh: 'Nam',
    ngaysinh: '2003-2-2',
    nhomquyen: 'Admin',
    ngaythamgia: '2025-1-1',
    trangthai: 'Hoạt động',
  },
];
const User = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isBoy, setIsBoy] = useState(false);

  const [users, setUsers] = useState(defaultUsers);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [activeUser, setActiveUser] = useState(true);
  const handleActiveUser = () => {
    setActiveUser(!activeUser);
  };
  const handleSexChange = () => {
    setIsBoy(!isBoy);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(index);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openModal = () => {
    setIsOpenModal(true);
    // setModalName(modalName);
  };
  const closeModal = () => {
    setIsOpenModal(false);
    // setModalName('');
  };
  const [activeTab, setActiveTab] = useState('them-thu-cong');
  const handleActiceTab = (tabName) => {
    setActiveTab(tabName);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const [currentData, setCurrentData] = useState([]);

  useEffect(() => {
    const data = users.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    setCurrentData(data);
  }, [users, currentPage]);

  const modalContent = () => {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{ fontFamily: 'Playfair display' }}
      >
        <div className="w-full flex items-center">
          <div
            className={`p-2 bg-black text-white ${activeTab === 'them-thu-cong' ? 'bg-blue-800 rounded-tr-xl' : 'bg-black'}`}
            onClick={() => handleActiceTab('them-thu-cong')}
          >
            Thêm thủ công
          </div>
          <div
            className={`p-2 bg-black text-white ${activeTab === 'them-tu-file' ? 'bg-blue-800 rounded-tl-xl' : 'bg-black'}`}
            onClick={() => handleActiceTab('them-tu-file')}
          >
            Thêm từ file
          </div>
        </div>
        <div className="w-full">{renderContent()}</div>
      </div>
    );
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'them-thu-cong':
        return (
          <div className="w-full mt-4">
            <div className="flex justify-evenly space-y-6">
              <div>
                <p className="text-cyan-700">MSSV</p>
                <input
                  type="text"
                  className="w-42 border p-1 rounded-sm bg-gray-100"
                  placeholder="Nhập mssv..."
                />
              </div>
              <div>
                <p className="text-cyan-700">Họ tên</p>
                <input
                  type="text"
                  className="w-64 border p-1 rounded-sm bg-gray-100"
                  placeholder="Nhập họ tên..."
                />
              </div>
              <div>
                <p className="text-cyan-700">Email</p>
                <input
                  type="text"
                  className="w-64 border p-1 rounded-sm bg-gray-100"
                  placeholder="Nhập Email..."
                />
              </div>
            </div>
            <div className="flex justify-evenly">
              <div className="">
                <p className="text-cyan-700">Ngày sinh</p>
                <input type="date" className="w-42 border p-1 rounded-sm" />
              </div>
              <div className="">
                <p className="text-cyan-700">Giới tính</p>
                Nam
                <Radio
                  title="Nam"
                  name="gt"
                  onClick={() => {
                    handleSexChange();
                  }}
                  checked={isBoy}
                />
                Nữ
                <Radio
                  title="Nữ"
                  name="gt"
                  onClick={() => {
                    handleSexChange();
                  }}
                  checked={!isBoy}
                />
              </div>
              <div>
                <p className="text-cyan-700">Nhóm quyền</p>
                <select className="w-46 border p-1 rounded-sm">
                  {roles.map((role, index) => (
                    <option key={index} value={index}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-evenly space-y-6">
              <div>
                <p className="text-cyan-700">Mật khẩu</p>
                <input
                  type="password"
                  className="w-64 border p-1 rounded-sm bg-gray-100"
                  placeholder="Nhập mật khẩu cho sinh viên..."
                  required
                />
              </div>
              <div>
                <p className="text-cyan-700">Trạng thái</p>
                <div className="flex w-36 h-10 space-x-4">
                  <p
                    className={`${activeUser ? 'text-green-600 italic' : 'text-gray-700'}`}
                  >
                    Active
                  </p>
                  <div className="w-14 h-6 bg-gray-300 rounded-4xl">
                    <button
                      onClick={handleActiveUser}
                      className={`w-8 h-6 rounded-4xl transition-all duration-300 transform ${activeUser ? 'bg-blue-700 translate-x-6' : 'bg-gray-500'}`}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center">
              <CustomButton
                title="Thêm sinh viên"
                classname="w-1/3 p-2 text-xl"
              />
            </div>
          </div>
        );
      case 'them-tu-file':
        return (
          <div className="w-full mt-20 text-xl">
            <div className="w-full flex items-center space-x-4">
              <p className="text-cyan-700">Mật khẩu</p>
              <input
                type="password"
                className="flex-1 border p-1 rounded-sm bg-gray-100"
                placeholder="Nhập mật khẩu cho sinh viên..."
                required
              />
            </div>
            <div className="w-full flex items-center space-x-4 mt-8">
              <p className="text-cyan-700">Chọn file</p>
              <input
                type="file"
                className="flex-1 border p-1 rounded-sm bg-gray-100"
                placeholder="Nhập mật khẩu cho sinh viên..."
                required
              />
            </div>
            <p className="mt-4 w-full text-center text-blue-700">
              Vui lòng soạn file theo đúng định dạng.{' '}
              <a
                className="text-red-700 italic hover:underline"
                href="/files/mauNguoiDung.xlsx"
              >
                Tải file excel mẫu
              </a>
            </p>
            <div className="w-full flex justify-center mt-8">
              <CustomButton
                title="THÊM VÀO HỆ THỐNG"
                classname="w-3/5 p-2 text-xl"
              />
            </div>
          </div>
        );
    }
  };
  return (
    <div
      className="w-full min-h-screen bg-gray-100 flex justify-center"
      style={{ fontFamily: 'PlayFair Display' }}
    >
      <CustomModal
        isOpen={isOpenModal}
        onClose={closeModal}
        className="bg-white rounded-xl p-6 min-w-200 min-h-120 overflow-auto max-h-140 mx-auto z-40 mt-20 border-2 border-black"
        title="THem nguoi dung"
      >
        {modalContent()}
      </CustomModal>
      <div className="w-9/10 h-full bg-white mt-8 rounded-2xl">
        <div className="w-full flex bg-gray-200 items-center pt-4 pl-8 pr-8 pb-4 rounded-t-xl">
          <p>Tất cả người dùng</p>
          <div
            onClick={() => {
              openModal();
            }}
            className="flex space-x-2 ml-auto h-3/4 items-center bg-red-700 text-white p-2 rounded-xl hover:bg-blue-900"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            THÊM NGƯỜI DÙNG
          </div>
        </div>
        <div className="flex items-center space-x-8 mt-8 ml-8">
          <select
            className="w-40 border-2 p-2 rounded-xl bg-blue-50 text-blue-800"
            name="sl-monhoc"
            // value={}
            // onChange={}
          >
            {roles.map((role, index) => (
              <option key={index} value={index}>
                {role}
              </option>
            ))}
          </select>
          <div className="min-w-96 flex items-center space-x-2">
            <input
              type="search"
              placeholder="Tìm kiếm người dùng..."
              className="w-full bg-gray-100 rounded-xl p-2 text-black border focus:outline-none focus:border-3 focus:ring-blue-300 focus:border-blue-300 focus:shadow-md focus:shadow-blue-300 focus:bg-white"
            />
            <div className="bg-blue-800 text-white rounded-xl w-10 h-10 flex items-center justify-center hover:bg-black">
              <SearchIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-8 mt-4 ml-8 mr-8 max-h-140">
          <table className="w-full mt-2">
            <thead>
              <tr className="w-full">
                <th className="text-center min-w-16">MSSV</th>
                <th className="text-center min-w-64">Họ tên</th>
                <th className="text-center min-w-16">Giới tính</th>
                <th className="text-center min-w-32">Ngày sinh</th>
                <th className="text-center min-w-16">Nhóm quyền</th>
                <th className="text-center ">Ngày tham gia</th>
                <th className="text-center ">Trạng thái</th>
                <th className="text-center ">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index} className="hover:bg-black hover:text-white">
                  <td className="text-center py-4 text-blue-600 font-bold">
                    mssv
                  </td>
                  <td>
                    <div
                      className={`flex-1 max-w-90 text-center ${expandedIndex === index ? 'whitespace-normal' : 'overflow-hidden text-ellipsis whitespace-nowrap'} break-words`}
                      onClick={() => toggleExpand(index)}
                    >
                      hoten
                    </div>
                  </td>
                  <td className="text-center overflow-hidden ">Giới tính</td>
                  <td className="text-center min-w-32">Ngày sinh</td>
                  <td className="text-center ">Nhóm quyền</td>
                  <td className="text-center ">Ngày tham gia</td>
                  <td className="text-center ">Trạng thái</td>
                  <td className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="text-white bg-blue-900 rounded-2xl p-1">
                        <PencilIcon className="w-5 h-5" />
                      </div>
                      <div className="text-white bg-red-700 rounded-2xl p-1">
                        <XIcon className="w-5 h-5" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-8 mb-8">
          <PaginatedTable
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default User;
