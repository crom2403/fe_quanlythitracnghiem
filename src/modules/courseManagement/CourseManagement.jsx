import { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [courseForm, setCourseForm] = useState({
    id: '',
    public_id: '',
    name: '',
    credits: '',
    theory_hours: '',
    practical_hours: '',
  });
  const [chapterForm, setChapterForm] = useState({
    id: null,
    courseId: null,
    name: '',
    description: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const coursesResponse = await axios.get(
          `/subject?page=${currentPage}&limit=${itemsPerPage}`
        );
        const { items, totalPages } = coursesResponse.data || {};

        if (items && Array.isArray(items)) {
          const mappedCourses = items.map((item) => ({
            id: item.public_id,
            name: item.name,
            credits: item.credits,
            theory: item.theory_hours,
            practice: item.practical_hours,
          }));
          setCourses(mappedCourses);
        } else {
          setCourses([]);
          showNotification('Không có dữ liệu môn học', 'warning');
        }

        setTotalPages(totalPages || 1);
      } catch (error) {
        showNotification('Lỗi khi lấy dữ liệu từ API', 'error');
        console.error(error);
        setCourses([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCourseChapters = chapters.filter(
    (chapter) => selectedCourse && chapter.courseId === selectedCourse.id
  );

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setChapterForm({
      id: null,
      courseId: course.id,
      name: '',
      description: '',
    });
  };

  const handleSaveCourse = async () => {
    if (!courseForm.public_id || !courseForm.name || !courseForm.credits) {
      showNotification('Vui lòng nhập đầy đủ thông tin môn học', 'error');
      return;
    }

    const courseData = {
      public_id: courseForm.public_id,
      name: courseForm.name,
      credits: parseInt(courseForm.credits) || 0,
      theory_hours: parseInt(courseForm.theory_hours) || 0,
      practical_hours: parseInt(courseForm.practical_hours) || 0,
    };

    try {
      if (isEditing) {
        await axios.put(`/subject/${courseForm.public_id}`, courseData);
        setCourses(
          courses.map((course) =>
            course.id === courseForm.public_id
              ? { id: courseForm.public_id, ...courseData }
              : course
          )
        );
        showNotification('Cập nhật môn học thành công');
      } else {
        const response = await axios.post('/subject', courseData);
        setCourses([
          ...courses,
          { id: response.data.public_id, ...courseData },
        ]);
        showNotification('Thêm môn học thành công');
      }

      setShowAddModal(false);
      setCourseForm({
        id: '',
        public_id: '',
        name: '',
        credits: '',
        theory_hours: '',
        practical_hours: '',
      });
      setIsEditing(false);
    } catch (error) {
      showNotification('Lỗi khi lưu môn học', 'error');
      console.error(error);
    }
  };

  const handleAddCourseButton = () => {
    setCourseForm({
      id: '',
      public_id: '',
      name: '',
      credits: '',
      theory_hours: '',
      practical_hours: '',
    });
    setIsEditing(false);
    setShowAddModal(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa môn học này?')) {
      try {
        await axios.delete(`/subject/${courseId}`);
        setCourses(courses.filter((course) => course.id !== courseId));
        setChapters(
          chapters.filter((chapter) => chapter.courseId !== courseId)
        );

        if (selectedCourse && selectedCourse.id === courseId) {
          setSelectedCourse(null);
        }

        showNotification('Xóa môn học thành công');
      } catch (error) {
        showNotification('Lỗi khi xóa môn học', 'error');
        console.error(error);
      }
    }
  };

  const handleEditCourse = (course) => {
    setCourseForm({
      id: course.id,
      public_id: course.id,
      name: course.name,
      credits: course.credits,
      theory_hours: course.theory,
      practical_hours: course.practice,
    });
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleAddChapter = async () => {
    if (!chapterForm.name) {
      showNotification('Vui lòng nhập tên chương', 'error');
      return;
    }

    const chapterData = {
      courseId: selectedCourse.id,
      name: chapterForm.name,
      description: chapterForm.description,
    };

    try {
      if (chapterForm.id) {
        await axios.put(`/chapter/${chapterForm.id}`, chapterData);
        setChapters(
          chapters.map((chapter) =>
            chapter.id === chapterForm.id ? { ...chapterForm } : chapter
          )
        );
        showNotification('Cập nhật chương thành công');
      } else {
        const response = await axios.post('/chapter', chapterData);
        setChapters([...chapters, { id: response.data.id, ...chapterData }]);
        showNotification('Thêm chương thành công');
      }

      setChapterForm({
        id: null,
        courseId: selectedCourse.id,
        name: '',
        description: '',
      });
    } catch (error) {
      showNotification('Lỗi khi lưu chương', 'error');
      console.error(error);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    try {
      await axios.delete(`/chapter/${chapterId}`);
      setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
      showNotification('Xóa chương thành công');
    } catch (error) {
      showNotification('Lỗi khi xóa chương', 'error');
      console.error(error);
    }
  };

  const handleEditChapter = (chapter) => {
    setChapterForm({ ...chapter });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {notification.show && (
        <div
          className={`fixed top-4 right-4 mb-4 p-3 rounded shadow-lg ${notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
        >
          {notification.message}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Danh sách môn học</h2>
        </div>

        <div className="mb-6 relative">
          <input
            type="text"
            className="w-full p-3 pr-10 border rounded-lg bg-gray-50"
            placeholder="Tìm kiếm môn học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute right-3 top-3 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3 px-4">Mã môn</th>
                <th className="py-3 px-4">Tên môn</th>
                <th className="py-3 px-4 text-center">Số tín chỉ</th>
                <th className="py-3 px-4 text-center">Số tiết lý thuyết</th>
                <th className="py-3 px-4 text-center">Số tiết thực hành</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    {loading && (
                      <div className="flex justify-center items-center my-6">
                        <svg
                          className="animate-spin h-8 w-8 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{course.id}</td>
                    <td className="py-3 px-4">{course.name}</td>
                    <td className="py-3 px-4 text-center">{course.credits}</td>
                    <td className="py-3 px-4 text-center">{course.theory}</td>
                    <td className="py-3 px-4 text-center">{course.practice}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2"></div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-end mt-4 space-x-1">
            <button
              className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            <button
              className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              ‹
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100"
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              ›
            </button>
            <button
              className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {isEditing ? 'Cập nhật môn học' : 'Thêm môn học mới'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mã môn học
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={courseForm.public_id}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, public_id: e.target.value })
                  }
                  disabled={isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên môn học
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={courseForm.name}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Số tín chỉ
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={courseForm.credits}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      credits: parseInt(e.target.value) || '',
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Số tiết lý thuyết
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={courseForm.theory_hours}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      theory_hours: parseInt(e.target.value) || '',
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Số tiết thực hành
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={courseForm.practical_hours}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      practical_hours: parseInt(e.target.value) || '',
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => setShowAddModal(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSaveCourse}
              >
                {isEditing ? 'Cập nhật' : 'Thêm môn học'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCourse && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Quản lý chương cho môn: {selectedCourse.name}
          </h2>

          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h3 className="font-medium mb-3">
              {chapterForm.id ? 'Sửa chương' : 'Thêm chương mới'}
            </h3>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Tên chương
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={chapterForm.name}
                onChange={(e) =>
                  setChapterForm({ ...chapterForm, name: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <textarea
                className="w-full p-2 border rounded"
                value={chapterForm.description}
                onChange={(e) =>
                  setChapterForm({
                    ...chapterForm,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleAddChapter}
              >
                {chapterForm.id ? 'Cập nhật' : 'Thêm chương'}
              </button>
              {chapterForm.id && (
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  onClick={() =>
                    setChapterForm({
                      id: null,
                      courseId: selectedCourse.id,
                      name: '',
                      description: '',
                    })
                  }
                >
                  Hủy
                </button>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Danh sách chương</h3>
            {selectedCourseChapters.length === 0 ? (
              <p className="text-gray-500">Môn học này chưa có chương nào</p>
            ) : (
              <div className="space-y-2">
                {selectedCourseChapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="p-3 border rounded flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium">{chapter.name}</h4>
                      <p className="text-sm text-gray-600">
                        {chapter.description}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="p-1 text-blue-600 hover:text-blue-800"
                        onClick={() => handleEditChapter(chapter)}
                      >
                        Sửa
                      </button>
                      <button
                        className="p-1 text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteChapter(chapter.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
