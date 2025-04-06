import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CourseGroups = () => {
  const [courseGroups, setCourseGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const mockApiData = {
    "items": [
      {
        "id": 1,
        "name": "Nhóm học phần 1",
        "semester": { "id": 1, "name": "Học kỳ 1" },
        "academic_year": { "id": 1, "start_year": "2023" },
        "subject": { "id": 1, "name": "Lập trình hướng đối tượng" },
        "teacher": { "id": 10, "fullname": "ThS. Nguyễn Văn A" }
      },
      {
        "id": 2,
        "name": "Nhóm học phần 2",
        "semester": { "id": 1, "name": "Học kỳ 1" },
        "academic_year": { "id": 1, "start_year": "2023" },
        "subject": { "id": 2, "name": "Cấu trúc dữ liệu và giải thuật" },
        "teacher": { "id": 11, "fullname": "TS. Trần Thị B" }
      },
      {
        "id": 3,
        "name": "Nhóm học phần 3",
        "semester": { "id": 2, "name": "Học kỳ 2" },
        "academic_year": { "id": 1, "start_year": "2023" },
        "subject": { "id": 3, "name": "Cơ sở dữ liệu" },
        "teacher": { "id": 12, "fullname": "PGS. Lê Văn C" }
      },
      {
        "id": 4,
        "name": "Nhóm học phần 4",
        "semester": { "id": 2, "name": "Học kỳ 2" },
        "academic_year": { "id": 1, "start_year": "2023" },
        "subject": { "id": 4, "name": "Trí tuệ nhân tạo" },
        "teacher": { "id": 13, "fullname": "TS. Phạm Văn D" }
      },
      {
        "id": 5,
        "name": "Nhóm học phần 5",
        "semester": { "id": 1, "name": "Học kỳ 1" },
        "academic_year": { "id": 2, "start_year": "2024" },
        "subject": { "id": 5, "name": "Mạng máy tính" },
        "teacher": { "id": 14, "fullname": "ThS. Hoàng Thị E" }
      },
      {
        "id": 6,
        "name": "Nhóm học phần 6",
        "semester": { "id": 1, "name": "Học kỳ 1" },
        "academic_year": { "id": 2, "start_year": "2024" },
        "subject": { "id": 6, "name": "Hệ điều hành" },
        "teacher": { "id": 15, "fullname": "ThS. Ngô Thị F" }
      }
    ],
    "total": 6,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setCourseGroups(mockApiData.items);
        setTotalPages(mockApiData.totalPages);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải danh sách nhóm học phần');
        setLoading(false);
        console.error('Lỗi khi tải dữ liệu giả lập:', err);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setLoading(true);
  };

  const filteredCourses = courseGroups.filter((course) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      course.name?.toLowerCase().includes(lowerSearch) ||
      course.subject?.name?.toLowerCase().includes(lowerSearch) ||
      course.teacher?.fullname?.toLowerCase().includes(lowerSearch);
    return matchesSearch;
  });

  const handleViewAnnouncements = (groupId) => {
    console.log(`Đang xem thông báo cho nhóm học phần ID: ${groupId}`);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const handleGoToTests = () => {
    // Điều hướng đến trang danh sách bài kiểm tra
    navigate('/dashboard/test');
  };

  const renderCourseList = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A8D6]"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
          <p>{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setCourseGroups(mockApiData.items);
                setTotalPages(mockApiData.totalPages);
                setLoading(false);
                setError(null);
              }, 800);
            }}
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md transition-colors duration-300"
          >
            Thử lại
          </button>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Pop-up "Coming Soon" */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setShowPopup(false)}></div>
            <div className="bg-white rounded-lg shadow-xl p-6 z-10 transform transition-all ease-in-out duration-300 scale-100">
              <div className="flex flex-col items-center">
                <div className="text-purple-600 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Coming Soon!</h3>
                <button
                  onClick={() => setShowPopup(false)}
                  className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg shadow-md transition-colors duration-300"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6">
          <div className="bg-gray-50 p-4 flex items-center border-b border-gray-200">
            <input
              type="text"
              placeholder="Tìm kiếm nhóm học phần, môn học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div className="p-4">
            {filteredCourses.length === 0 && (
              <p className="text-gray-600 text-center py-4">
                Không có nhóm học phần phù hợp.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((group) => (
                <div
                  key={group.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:border-purple-300 hover:scale-[1.02] relative group/item"
                >
                  <div className="bg-[#D4A8D6] p-4">
                    <h2 className="text-lg font-bold text-white truncate">{group.name}</h2>
                  </div>
                  <div className="p-4 relative">
                    <p className="text-gray-700 mb-2">Môn học: {group.subject?.name}</p>
                    <p className="text-gray-700 mb-2">Học kỳ: {group.semester?.name}</p>
                    <p className="text-gray-700 mb-2">Giảng viên: {group.teacher?.fullname}</p>
                    <p className="text-gray-700 mb-4">Năm học: {group.academic_year?.start_year}</p>

                    <div className="flex justify-end space-x-3 mt-2">
                      {/* Nút Đi tới bài kiểm tra */}
                      <div className="relative group">
                        <button
                          onClick={handleGoToTests}
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-md transition-all duration-300 flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </button>
                        <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full -top-2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                          Đi tới bài kiểm tra
                        </span>
                      </div>
                      
                      {/* Nút Xem thông báo */}
                      <div className="relative group">
                        <button
                          onClick={() => handleViewAnnouncements(group.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md transition-all duration-300 flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </button>
                        <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full -top-2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                          Xem thông báo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Phân trang">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Trước</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage ? 'z-10 bg-[#D4A8D6] border-purple-500 text-white' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Tiếp</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 flex flex-col w-full min-h-screen bg-gray-50">
      {renderCourseList()}
    </main>
  );
};

export default CourseGroups;