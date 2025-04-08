import React, { useState, useEffect } from 'react';

const CourseManagement = () => {
  // State cho danh sách môn học với cấu trúc mới theo yêu cầu
  const [courses, setCourses] = useState([
    { id: '841021', name: 'Kiến trúc máy tính', credits: 3, theory: 30, practice: 30 },
    { id: '841058', name: 'Hệ điều hành mã nguồn mở', credits: 3, theory: 30, practice: 30 },
    { id: '841059', name: 'Lập trình hướng đối tượng', credits: 4, theory: 45, practice: 30 },
    { id: '841107', name: 'Lập trình Java', credits: 4, theory: 45, practice: 30 },
    { id: '841464', name: 'Lập trình web và ứng dụng nâng cao', credits: 4, theory: 45, practice: 30 },
  ]);

  // State cho danh sách chương (giữ nguyên để tương thích với phần còn lại của ứng dụng)
  const [chapters, setChapters] = useState([
    { id: 1, courseId: '841021', name: 'Kiến trúc tập lệnh', description: 'Giới thiệu về kiến trúc tập lệnh' },
    { id: 2, courseId: '841021', name: 'Đơn vị xử lý trung tâm', description: 'Cấu trúc và hoạt động của CPU' },
    { id: 3, courseId: '841058', name: 'Giới thiệu Linux', description: 'Tổng quan về hệ điều hành Linux' },
  ]);


  const [courseForm, setCourseForm] = useState({ 
    id: '', 
    name: '', 
    credits: '', 
    theory: '', 
    practice: '' 
  });
  
 
  const [chapterForm, setChapterForm] = useState({ id: null, courseId: null, name: '', description: '' });
  

  const [searchTerm, setSearchTerm] = useState('');
  

  const [selectedCourse, setSelectedCourse] = useState(null);
  

  const [isEditing, setIsEditing] = useState(false);
  

  const [showAddModal, setShowAddModal] = useState(false);
  

  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const filteredCourses = courses.filter(course => 
    course.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);


  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const selectedCourseChapters = chapters.filter(chapter => 
    selectedCourse && chapter.courseId === selectedCourse.id
  );

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };


  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setChapterForm({ id: null, courseId: course.id, name: '', description: '' });
  };


  const handleSaveCourse = () => {
    if (!courseForm.id || !courseForm.name || !courseForm.credits) {
      showNotification('Vui lòng nhập đầy đủ thông tin môn học', 'error');
      return;
    }

    if (isEditing) {

      setCourses(courses.map(course => 
        course.id === courseForm.id ? { ...courseForm } : course
      ));
      showNotification('Cập nhật môn học thành công');
    } else {

      if (courses.some(course => course.id === courseForm.id)) {
        showNotification('Mã môn học đã tồn tại', 'error');
        return;
      }
      

      setCourses([...courses, courseForm]);
      showNotification('Thêm môn học thành công');
    }
    

    setShowAddModal(false);
    setCourseForm({ id: '', name: '', credits: '', theory: '', practice: '' });
    setIsEditing(false);
  };


  const handleAddCourseButton = () => {
    setCourseForm({ id: '', name: '', credits: '', theory: '', practice: '' });
    setIsEditing(false);
    setShowAddModal(true);
  };


  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa môn học này?')) {
 
      setCourses(courses.filter(course => course.id !== courseId));
      

      setChapters(chapters.filter(chapter => chapter.courseId !== courseId));
      

      if (selectedCourse && selectedCourse.id === courseId) {
        setSelectedCourse(null);
      }
      
      showNotification('Xóa môn học thành công');
    }
  };

  // Xử lý chỉnh sửa môn học
  const handleEditCourse = (course) => {
    setCourseForm({ ...course });
    setIsEditing(true);
    setShowAddModal(true);
  };

  // Xử lý thêm chương mới
  const handleAddChapter = () => {
    if (!chapterForm.name) {
      showNotification('Vui lòng nhập tên chương', 'error');
      return;
    }

    if (chapterForm.id) {
      // Cập nhật chương
      setChapters(chapters.map(chapter => 
        chapter.id === chapterForm.id ? { ...chapterForm } : chapter
      ));
      showNotification('Cập nhật chương thành công');
    } else {
      // Thêm chương mới
      const newChapter = {
        ...chapterForm,
        id: Date.now()
      };
      setChapters([...chapters, newChapter]);
      showNotification('Thêm chương thành công');
    }
    
    // Reset form
    setChapterForm({ id: null, courseId: selectedCourse.id, name: '', description: '' });
  };

  // Xử lý xóa chương
  const handleDeleteChapter = (chapterId) => {
    setChapters(chapters.filter(chapter => chapter.id !== chapterId));
    showNotification('Xóa chương thành công');
  };

  // Xử lý chỉnh sửa chương
  const handleEditChapter = (chapter) => {
    setChapterForm({ ...chapter });
  };

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Thông báo */}
      {notification.show && (
        <div className={`fixed top-4 right-4 mb-4 p-3 rounded shadow-lg ${notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {notification.message}
        </div>
      )}
      
      {/* Phần quản lý môn học */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Danh sách môn học</h2>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            onClick={handleAddCourseButton}
          >
            <span className="mr-1">+</span> THÊM MÔN HỌC
          </button>
        </div>
        
        {/* Tìm kiếm môn học */}
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* Bảng danh sách môn học */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3 px-4">Mã môn</th>
                <th className="py-3 px-4">Tên môn</th>
                <th className="py-3 px-4 text-center">Số tín chỉ</th>
                <th className="py-3 px-4 text-center">Số tiết lý thuyết</th>
                <th className="py-3 px-4 text-center">Số tiết thực hành</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentCourses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                    Không tìm thấy môn học nào
                  </td>
                </tr>
              ) : (
                currentCourses.map(course => (
                  <tr key={course.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{course.id}</td>
                    <td className="py-3 px-4">{course.name}</td>
                    <td className="py-3 px-4 text-center">{course.credits}</td>
                    <td className="py-3 px-4 text-center">{course.theory}</td>
                    <td className="py-3 px-4 text-center">{course.practice}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        <button 
                          className="p-1 text-blue-600 hover:text-blue-800 rounded-full bg-blue-100"
                          title="Thông tin"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1
                             0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button 
                          className="p-1 text-blue-600 hover:text-blue-800 rounded-full bg-blue-100"
                          onClick={() => handleEditCourse(course)}
                          title="Sửa"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          className="p-1 text-red-600 hover:text-red-800 rounded-full bg-red-100"
                          onClick={() => handleDeleteCourse(course.id)}
                          title="Xóa"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Phân trang */}
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
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
      
      {/* Modal thêm/sửa môn học */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Cập nhật môn học' : 'Thêm môn học mới'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mã môn học</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded" 
                  value={courseForm.id}
                  onChange={(e) => setCourseForm({...courseForm, id: e.target.value})}
                  disabled={isEditing}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tên môn học</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded" 
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Số tín chỉ</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded" 
                  value={courseForm.credits}
                  onChange={(e) => setCourseForm({...courseForm, credits: parseInt(e.target.value) || ''})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Số tiết lý thuyết</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded" 
                  value={courseForm.theory}
                  onChange={(e) => setCourseForm({...courseForm, theory: parseInt(e.target.value) || ''})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Số tiết thực hành</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded" 
                  value={courseForm.practice}
                  onChange={(e) => setCourseForm({...courseForm, practice: parseInt(e.target.value) || ''})}
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

      {/* Chỉ giữ phần chương nếu cần */}
      {selectedCourse && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quản lý chương cho môn: {selectedCourse.name}</h2>
          
          {/* Form thêm/sửa chương */}
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h3 className="font-medium mb-3">{chapterForm.id ? 'Sửa chương' : 'Thêm chương mới'}</h3>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Tên chương</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded" 
                value={chapterForm.name}
                onChange={(e) => setChapterForm({...chapterForm, name: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <textarea 
                className="w-full p-2 border rounded" 
                value={chapterForm.description}
                onChange={(e) => setChapterForm({...chapterForm, description: e.target.value})}
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
                  onClick={() => setChapterForm({ id: null, courseId: selectedCourse.id, name: '', description: '' })}
                >
                  Hủy
                </button>
              )}
            </div>
          </div>
          
          {/* Danh sách chương */}
          <div>
            <h3 className="font-medium mb-2">Danh sách chương</h3>
            {selectedCourseChapters.length === 0 ? (
              <p className="text-gray-500">Môn học này chưa có chương nào</p>
            ) : (
              <div className="space-y-2">
                {selectedCourseChapters.map(chapter => (
                  <div 
                    key={chapter.id} 
                    className="p-3 border rounded flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium">{chapter.name}</h4>
                      <p className="text-sm text-gray-600">{chapter.description}</p>
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