/* eslint-disable no-unused-vars */
import {
  PlusIcon,
  CogIcon,
  UserGroupIcon,
  TrashIcon,
  ClockIcon,
  UsersIcon,
} from '@heroicons/react/outline';
import { FaWrench, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getGroupedCoursesData, createGroup } from './groupService';
import path from '../../utils/path';
import PaginatedTable from '../../components/pagination/PaginatedTable';
import CustomModal from '../../components/modal/CustomModal';
import { getAllSubjectResponse } from '../subject/SubjectService';
import { getUsersByRole } from '../user/UserService';

const Group = () => {
  // const navigate = useNavigate();
  const [groupedCourses, setGroupedCourses] = useState(new Map());
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalPages: 1,
    total: 0,
  });
  const [visibleMenu, setVisibleMenu] = useState({
    groupIndex: null,
    subGroupIndex: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    note: '',
    teacher_id: '',
    subject_id: '',
    semester_id: '',
    academic_year_id: '1', // Giá trị mặc định là 1
  });
  const [displayYear, setDisplayYear] = useState('2025'); // Giá trị hiển thị mặc định trong input
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const date = new Date();
  const currentYear = date.getFullYear();

  useEffect(() => {
    const fetchGroupedCourses = async () => {
      setIsLoading(true);
      try {
        const result = await getGroupedCoursesData(
          pagination.page,
          pagination.limit
        );
        setGroupedCourses(result.groupedCourses);
        setPagination({
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
          total: result.total,
        });
      } catch (error) {
        setError('Lỗi khi tải danh sách nhóm học');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupedCourses();
  }, [pagination.page, pagination.limit]);

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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setFormData({
      name: '',
      note: '',
      teacher_id: '',
      subject_id: '',
      semester_id: '',
      academic_year_id: '1', // Giá trị mặc định là 1 khi mở modal
    });
    setDisplayYear('2025'); // Reset giá trị hiển thị về 2025
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const fetchSubjects = async () => {
    const result = await getAllSubjectResponse();
    if (result) {
      setSubjects(result);
    }
  };

  const fetchTeachers = async () => {
    const result = await getUsersByRole('teacher');
    if (result) {
      setTeachers(result);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'academic_year_id') {
      setDisplayYear(value); // Cập nhật giá trị hiển thị
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Kiểm tra displayYear
      const enteredYear = parseInt(displayYear, 10);
      if (isNaN(enteredYear) || enteredYear < currentYear) {
        throw new Error(`Năm học phải là số và không nhỏ hơn ${currentYear}`);
      }

      // Chuyển đổi các trường ID sang số, academic_year_id luôn là 1
      const payload = {
        name: formData.name,
        note: formData.note,
        teacher_id: parseInt(formData.teacher_id, 10),
        subject_id: parseInt(formData.subject_id, 10),
        semester_id: parseInt(formData.semester_id, 10),
        academic_year_id: 1, // Luôn gửi 1
      };

      await createGroup(payload);

      // Tải lại danh sách nhóm học phần
      const result = await getGroupedCoursesData(
        pagination.page,
        pagination.limit
      );
      setGroupedCourses(result.groupedCourses);
      setPagination({
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        total: result.total,
      });

      // Đóng modal
      handleCloseModal();
    } catch (error) {
      setError('Lỗi khi tạo nhóm học: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Học kỳ: chỉ bao gồm Học kỳ 1, Học kỳ 2, Học kỳ hè
  const semesters = [
    { id: 1, name: 'Học kỳ 1' },
    { id: 2, name: 'Học kỳ 2' },
    { id: 3, name: 'Học kỳ hè' },
  ];

  return (
    <div
      className="w-full min-h-screen flex flex-col bg-gray-100"
      style={{ fontFamily: 'PlayFair Display' }}
    >
      <div className="flex h-10 mt-8 items-center ml-16">
        <div className="h-10">
          <input
            type="search"
            className="w-96 h-10 pl-4 border-1 ml-2 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập tên học phần cần tìm kiếm..."
          />
        </div>
        <div
          className="flex ml-auto items-center h-10 mr-16 rounded-2xl pl-4 pr-4 border-2 border-white text-white bg-blue-900 hover:bg-blue-600 cursor-pointer"
          onClick={handleOpenModal}
        >
          <PlusIcon className="w-4 h-4 text-white mr-2" />
          Thêm nhóm
        </div>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="flex justify-center mt-4">Đang tải...</div>
        ) : (
          Array.from(groupedCourses.entries()).map(
            ([key, courseGroup], index) => (
              <div
                key={key}
                className="min-h-46 w-full text-black text-xl mt-4"
              >
                <p>{`${courseGroup.subjectName} - ${courseGroup.academicYear} - ${courseGroup.semesterName}`}</p>
                <div className="flex flex-wrap">
                  {courseGroup.groups.map((group, subIndex) => (
                    <div
                      key={subIndex}
                      className="bg-white min-h-56 min-w-64 ml-4 mt-2 rounded-3xl shadow-md"
                    >
                      <div className="flex bg-blue-100 h-16 text-blue-700 rounded-t-3xl items-center">
                        <p className="pl-4">{group.name}</p>
                        <div
                          className="ml-auto mr-4 flex relative"
                          onClick={() => toggleMenu(index, subIndex)}
                        >
                          <CogIcon className="w-5 h-5 text-black cursor-pointer" />
                          {visibleMenu.groupIndex === index &&
                            visibleMenu.subGroupIndex === subIndex && (
                              <ul className="ml-4 absolute bg-white shadow-lg rounded-lg mt-8 p-2 w-64 border-2 border-gray-200 text-black z-10 text-sm">
                                <li className="p-2 hover:bg-gray-200">
                                  <Link
                                    to={path.GROUPDETAIL}
                                    state={{
                                      selectedGroupDetail: {
                                        studentCount: group.studentCount,
                                        groupName: group.name,
                                        groupId: group.id,
                                      },
                                    }}
                                    className="flex items-center"
                                  >
                                    <UserGroupIcon className="w-5 h-5 text-blue-900 mr-2" />
                                    Danh sách sinh viên
                                  </Link>
                                </li>
                                <li className="p-2 hover:bg-gray-200">
                                  <div className="flex items-center">
                                    <FaWrench className="w-5 h-5 text-blue-900 mr-2" />
                                    Sửa thông tin
                                  </div>
                                </li>
                                <li className="p-2 hover:bg-gray-200">
                                  <div className="flex items-center">
                                    <FaEyeSlash className="w-5 h-5 text-blue-900 mr-2" />
                                    Ẩn nhóm
                                  </div>
                                </li>
                                <li className="p-2 hover:bg-gray-200 text-red-600">
                                  <div className="flex items-center">
                                    <TrashIcon className="w-5 h-5 text-blue-900 mr-2" />
                                    Xóa nhóm
                                  </div>
                                </li>
                              </ul>
                            )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 text-base text-xl space-y-4">
                        <p className="flex items-center space-x-2">
                          <ClockIcon className="w-5 h-5 text-violet-700" />
                          Thời gian:{' '}
                          <span className="font-medium text-blue-700">
                            {group.note}
                          </span>
                        </p>
                        <p className="flex items-center space-x-2">
                          <UsersIcon className="w-5 h-5 text-violet-700" />
                          Sĩ số:{' '}
                          <span className="font-medium text-blue-700">
                            {group.studentCount}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )
        )}
      </div>

      {/* Modal thêm nhóm học phần */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Thêm nhóm học phần mới"
        className="max-w-2xl mx-auto mt-10"
      >
        <h2 className="text-2xl font-bold mb-4">Thêm nhóm học phần mới</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên nhóm
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ghi chú
            </label>
            <input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giáo viên
            </label>
            <select
              name="teacher_id"
              value={formData.teacher_id}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Chọn giáo viên</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.fullname}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Môn học
            </label>
            <select
              name="subject_id"
              value={formData.subject_id}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Chọn môn học</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Học kỳ
            </label>
            <select
              name="semester_id"
              value={formData.semester_id}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Chọn học kỳ</option>
              {semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  {semester.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Năm học
            </label>
            <input
              type="number"
              name="academic_year_id"
              value={displayYear}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Nhập năm học (ví dụ: 2025)"
              min={currentYear}
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-900 text-white rounded-md disabled:opacity-50"
            >
              {isLoading ? 'Đang tạo...' : 'Tạo nhóm'}
            </button>
          </div>
        </form>
      </CustomModal>

      {/* Phân trang */}
      <div className="flex justify-center mt-4">
        <PaginatedTable
          totalPages={pagination.totalPages}
          currentPage={pagination.page}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Group;
