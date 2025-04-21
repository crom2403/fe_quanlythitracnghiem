import { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  XIcon,
  SearchIcon,
} from '@heroicons/react/outline';
import { usersResponse, createUser, deleteUser } from './UserService';
import { Radio } from '@mui/material';
import CustomModal from '../../components/modal/CustomModal';
import CustomButton from '../../components/button/CustomButton';
import PaginatedTable from '../../components/pagination/PaginatedTable';

const roles = ['Tất cả', 'Teacher', 'Student', 'Admin'];
const ITEMS_PER_PAGE = 10;

const User = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isBoy, setIsBoy] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [activeUser, setActiveUser] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRole, setSelectedRole] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    studentCode: '',
    fullname: '',
    email: '',
    birthday: '',
    password: '',
  });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      let allUsers = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const data = await usersResponse(page);
        if (data && data.items) {
          allUsers = [...allUsers, ...data.items];
          hasMore = page < data.totalPages;
          page++;
        } else {
          hasMore = false;
        }
      }

      setUsers(allUsers);
    } catch (error) {
      setError('Có lỗi xảy ra khi tải danh sách người dùng: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Lọc và phân trang người dùng
  useEffect(() => {
    let filtered = [...users];

    if (selectedRole !== 0) {
      filtered = filtered.filter(
        (item) => item.role?.name?.toLowerCase() === roles[selectedRole].toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.student_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);

    const total = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    setTotalPages(total > 0 ? total : 1);

    if (currentPage > total && total > 0) {
      setCurrentPage(total);
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setDisplayedUsers(filtered.slice(start, end));
  }, [users, selectedRole, searchQuery, currentPage]);

  const handleChangeRole = (event) => {
    setSelectedRole(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id.replace('n-', '')]: value,
    }));
  };

  const handleDeleteUser = async (userId) => {
    try {
      const result = await deleteUser(userId);
      if (result && result.status === 200) {
        alert('Đã xóa người dùng thành công!');
        await fetchUsers(); 
      } else {
        setError('Xóa người dùng thất bại: ' + (result.message || 'Lỗi không xác định'));
      }
    } catch (error) {
      setError('Xóa người dùng thất bại: ' + error.message);
    }
  };

  const validateForm = () => {
    const { studentCode, fullname, email, password } = formData;
    if (!studentCode) return 'Vui lòng nhập MSSV';
    if (!fullname) return 'Vui lòng nhập họ tên';
    if (!email || !/\S+@\S+\.\S+/.test(email)) return 'Vui lòng nhập email hợp lệ';
    if (!password || password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
    return null;
  };

  const handleCreateUser = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { studentCode, fullname, email, birthday, password } = formData;
      const role = roles[selectedRole];
      const status = activeUser;
      const gender = isBoy ? 'Nam' : 'Nữ';

      const createResult = await createUser(
        studentCode,
        email,
        fullname,
        gender,
        birthday,
        password,
        status,
        role
      );

      if (createResult.status === 201) {
        await fetchUsers();
        setIsOpenModal(false);
        setFormData({
          studentCode: '',
          fullname: '',
          email: '',
          birthday: '',
          password: '',
        });
        alert(`Tạo người dùng '${fullname}' thành công!`);
      } else {
        setError(`Tạo người dùng thất bại: ${createResult.message || 'Lỗi không xác định'}`);
      }
    } catch (error) {
      setError(`Tạo người dùng thất bại: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActiveUser = () => {
    setActiveUser(!activeUser);
  };

  const handleSexChange = () => {
    setIsBoy(!isBoy);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openModal = () => {
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setError(null);
    setFormData({
      studentCode: '',
      fullname: '',
      email: '',
      birthday: '',
      password: '',
    });
  };

  const [activeTab, setActiveTab] = useState('them-thu-cong');
  const handleActiceTab = (tabName) => {
    setActiveTab(tabName);
  };

  const modalContent = () => {
    return (
      <div className="flex flex-col items-center justify-center" style={{ fontFamily: 'Playfair Display' }}>
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
            {error && <p className="text-red-600 text-center">{error}</p>}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-cyan-700">MSSV</p>
                <input
                  id="n-studentCode"
                  type="text"
                  className="w-full border p-2 rounded-md bg-gray-100"
                  placeholder="Nhập MSSV..."
                  value={formData.studentCode}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <p className="text-cyan-700">Họ tên</p>
                <input
                  id="n-fullname"
                  type="text"
                  className="w-full border p-2 rounded-md bg-gray-100"
                  placeholder="Nhập họ tên..."
                  value={formData.fullname}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <p className="text-cyan-700">Email</p>
                <input
                  id="n-email"
                  type="text"
                  className="w-full border p-2 rounded-md bg-gray-100"
                  placeholder="Nhập Email..."
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <p className="text-cyan-700">Ngày sinh</p>
                <input
                  id="n-birthday"
                  type="date"
                  className="w-full border p-2 rounded-md"
                  value={formData.birthday}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <p className="text-cyan-700">Giới tính</p>
                <div className="flex space-x-4">
                  <label>
                    Nam
                    <Radio
                      name="gt"
                      onClick={handleSexChange}
                      checked={isBoy}
                    />
                  </label>
                  <label>
                    Nữ
                    <Radio
                      name="gt"
                      onClick={handleSexChange}
                      checked={!isBoy}
                    />
                  </label>
                </div>
              </div>
              <div>
                <p className="text-cyan-700">Nhóm quyền</p>
                <select
                  className="w-full border p-2 rounded-md"
                  value={selectedRole}
                  onChange={handleChangeRole}
                >
                  {roles.map((role, index) => (
                    <option key={index} value={index}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-cyan-700">Mật khẩu</p>
                <input
                  id="n-password"
                  type="password"
                  className="w-full border p-2 rounded-md bg-gray-100"
                  placeholder="Nhập mật khẩu..."
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <p className="text-cyan-700">Trạng thái</p>
                <div className="flex items-center space-x-4">
                  <span className={activeUser ? 'text-green-600' : 'text-gray-700'}>
                    {activeUser ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={handleActiveUser}
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      activeUser ? 'bg-blue-700' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white transform transition-transform ${
                        activeUser ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <CustomButton
                title={isLoading ? 'Đang xử lý...' : 'Thêm sinh viên'}
                className="w-1/3 p-2 text-xl"
                onClick={handleCreateUser}
                disabled={isLoading}
              />
            </div>
          </div>
        );
      case 'them-tu-file':
        return (
          <div className="w-full mt-8">
            <div className="space-y-4">
              <div>
                <p className="text-cyan-700">Mật khẩu</p>
                <input
                  type="password"
                  className="w-full border p-2 rounded-md bg-gray-100"
                  placeholder="Nhập mật khẩu cho sinh viên..."
                  required
                />
              </div>
              <div>
                <p className="text-cyan-700">Chọn file</p>
                <input
                  type="file"
                  className="w-full border p-2 rounded-md bg-gray-100"
                  required
                />
              </div>
              <p className="text-center text-blue-700">
                Vui lòng soạn file theo đúng định dạng.{' '}
                <a
                  className="text-red-700 italic hover:underline"
                  href="/files/mauNguoiDung.xlsx"
                >
                  Tải file excel mẫu
                </a>
              </p>
              <div className="flex justify-center">
                <CustomButton
                  title="THÊM VÀO HỆ THỐNG"
                  className="w-3/5 p-2 text-xl"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-gray-100 flex justify-center p-4"
      style={{ fontFamily: 'Playfair Display' }}
    >
      <CustomModal
        isOpen={isOpenModal}
        onClose={closeModal}
        className="bg-white rounded-xl ml-80 mt-30 p-6 w-full max-w-4xl max-h-[90vh] overflow-auto mt-20 border-2 border-black"
        title="Thêm người dùng"
      >
        {modalContent()}
      </CustomModal>
      <div className="w-full max-w-7xl bg-white mt-8 rounded-2xl shadow-lg">
        <div className="w-full flex bg-gray-200 items-center p-4 rounded-t-xl">
          <p className="text-xl font-bold">Tất cả người dùng</p>
          <button
            onClick={openModal}
            className="flex items-center space-x-2 ml-auto bg-red-700 text-white p-2 rounded-xl hover:bg-blue-900"
          >
            <PlusIcon className="w-4 h-4" />
            <span>THÊM NGƯỜI DÙNG</span>
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4">
          <select
            className="w-full sm:w-40 border-2 p-2 rounded-xl bg-blue-50 text-blue-800"
            value={selectedRole}
            onChange={handleChangeRole}
          >
            {roles.map((role, index) => (
              <option key={index} value={index}>
                {role}
              </option>
            ))}
          </select>
          <div className="w-full sm:w-96 flex items-center space-x-2">
            <input
              type="search"
              placeholder="Tìm kiếm người dùng..."
              className="w-full bg-gray-100 rounded-xl p-2 border focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className="bg-blue-800 text-white rounded-xl w-10 h-10 flex items-center justify-center hover:bg-black">
              <SearchIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-4">
          {isLoading ? (
            <p className="text-center">Đang tải...</p>
          ) : displayedUsers.length === 0 ? (
            <p className="text-center">Không tìm thấy người dùng</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-4 text-left">MSSV</th>
                    <th className="p-4 text-left">Họ tên</th>
                    <th className="p-4 text-left">Giới tính</th>
                    <th className="p-4 text-left">Ngày sinh</th>
                    <th className="p-4 text-left">Nhóm quyền</th>
                    <th className="p-4 text-left">Ngày tham gia</th>
                    <th className="p-4 text-left">Trạng thái</th>
                    <th className="p-4 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedUsers.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-blue-50">
                      <td className="p-4 text-blue-600 font-bold">
                        {item.student_code || 'N/A'}
                      </td>
                      <td
                        className={`p-4 cursor-pointer ${
                          expandedIndex === index ? 'whitespace-normal' : 'truncate max-w-xs'
                        }`}
                        onClick={() => toggleExpand(index)}
                      >
                        {item.fullname || 'N/A'}
                      </td>
                      <td className="p-4">{item.gender || 'N/A'}</td>
                      <td className="p-4">{item.birthday || 'N/A'}</td>
                      <td className="p-4">{item.role?.name || 'N/A'}</td>
                      <td className="p-4" style={{ fontFamily: 'serif' }}>
                        {item.created_at || 'N/A'}
                      </td>
                      <td className="p-4">
                        <span
                          className={
                            item.status ? 'text-green-600' : 'text-red-600'
                          }
                        >
                          {item.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button className="bg-blue-900 text-white p-2 rounded-xl hover:bg-blue-700">
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            className="bg-red-700 text-white p-2 rounded-xl hover:bg-red-500"
                            onClick={() => handleDeleteUser(item.id)}
                          >
                            <XIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="flex justify-center p-4">
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