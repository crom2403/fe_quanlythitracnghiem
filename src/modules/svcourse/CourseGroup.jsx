import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../axiosConfig";

const CourseGroups = () => {
  const [courseGroups, setCourseGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState(null);
  const [inviteCode, setInviteCode] = useState('');
  const [joinStatus, setJoinStatus] = useState({ show: false, success: false, message: '' });
  const navigate = useNavigate();

  // Hàm parse chuỗi name để lấy thông tin semester, academic_year, subject
  const parseGroupName = (name) => {
    const parts = name.split(' - ');
    if (parts.length < 3) {
      return {
        subject: name,
        semester: 'Không xác định',
        academic_year: 'Không xác định',
      };
    }

    if (parts.length === 3) {
      const [_, subject, year] = parts;
      return {
        subject: subject || 'Không xác định',
        semester: 'Không xác định',
        academic_year: year?.replace('NH', '') || 'Không xác định',
      };
    }

    const [_, subject, year, semester] = parts;
    return {
      subject: subject || 'Không xác định',
      semester: semester || 'Không xác định',
      academic_year: year?.replace('NH', '') || 'Không xác định',
    };
  };

  const fetchCourseGroups = async () => {
    setLoading(true);
    setError(null);

    const userInfo = sessionStorage.getItem('user-info');
    if (!userInfo) {
      setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
      setLoading(false);
      navigate('/login'); 
      return;
    }

    let studentCode;
    try {
      const user = JSON.parse(userInfo);
      studentCode = user.student_code; 
      if (!studentCode) {
        throw new Error('Không tìm thấy mã sinh viên trong thông tin người dùng.');
      }
    } catch (err) {
      setError('Lỗi khi lấy thông tin người dùng. Vui lòng đăng nhập lại.');
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      const response = await axiosInstance.get(`/study-group/student/${studentCode}`);
      console.log('Dữ liệu từ API:', response.data);

      if (!Array.isArray(response.data)) {
        throw new Error('Dữ liệu trả về không đúng định dạng: không phải là mảng');
      }

      const formattedGroups = response.data.flatMap(group => {
        if (!group || !Array.isArray(group.studyGroups)) {
          return [];
        }

        return group.studyGroups.map(studyGroup => ({
          id: studyGroup.id,
          name: group.name?.split(' - ')[0] || 'Không xác định',
          name_group: studyGroup.name,
          student_count: studyGroup.student_count || 0,
          note: studyGroup.note || 'Không có ghi chú',
          ...parseGroupName(group.name || ''),
          teacher: { fullname: 'Không xác định' },
          
        }));
      });

      setCourseGroups(formattedGroups);
      setLoading(false);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách nhóm học phần:', err);
      let errorMessage = 'Không thể tải danh sách nhóm học phần. Vui lòng thử lại.';
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Yêu cầu đã hết thời gian. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.';
      } else if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Bạn chưa đăng nhập hoặc không có quyền truy cập. Vui lòng đăng nhập lại.';
          navigate('/login');
        } else if (err.response.status === 404) {
          errorMessage = 'Không tìm thấy dữ liệu nhóm học phần cho sinh viên này.';
        } else if (err.response.status === 500) {
          errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
        }
      } else if (err.request) {
        errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseGroups();
  }, []);

  useEffect(() => {
    console.log('State courseGroups đã cập nhật:', courseGroups);
  }, [courseGroups]);

  const fetchStudents = async (groupId) => {
    setStudentsLoading(true);
    setStudentsError(null);
    try {
      const response = await axiosInstance.get(`/study-group/detail/${groupId}`);
      
      const formattedStudents = response.data.map(student => ({
        id: student.id,
        fullName: student.fullname,
        studentId: student.student_code,
        gender: student.gender,
        birthDate: student.birthday
      }));
      
      setStudents(formattedStudents);
      setStudentsLoading(false);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách sinh viên:', err);
      let errorMessage = 'Không thể tải danh sách sinh viên.';
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = `Không tìm thấy danh sách sinh viên cho nhóm học phần ID ${groupId}.`;
        } else if (err.response.status === 401) {
          errorMessage = 'Bạn chưa đăng nhập hoặc không có quyền truy cập.';
          navigate('/login');
        } else if (err.response.status === 500) {
          errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
        }
      } else if (err.request) {
        errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
      }
      setStudentsError(errorMessage);
      setStudentsLoading(false);
    }
  };

  const handleViewStudents = (groupId) => {
    console.log('groupId:', groupId);
    setSelectedGroupId(groupId);
    setShowStudentsModal(true);
    fetchStudents(groupId);
  };

  const filteredCourses = courseGroups.filter((course) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      course.name?.toLowerCase().includes(lowerSearch) ||
      course.subject?.toLowerCase().includes(lowerSearch) ||
      course.name_group?.toLowerCase().includes(lowerSearch)
    );
  });

  const handleViewAnnouncements = (groupId) => {
    console.log(`Đang xem thông báo cho nhóm học phần ID: ${groupId}`);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleGoToTests = () => {
    navigate('/dashboard/test');
  };

  const handleJoinWithInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post('/study-group/invite', { 
        invite_code: inviteCode  
      });
      setJoinStatus({
        show: true,
        success: true,
        message: response.data.message || `Đã tham gia thành công lớp học với mã mời ${inviteCode}`,
      });
      
      setTimeout(() => {
        fetchCourseGroups();
      }, 1000); 
    } catch (err) {
      let errorMessage = '';

        if (err.response && err.response.data && err.response.data.message) {
          if (err.response.data.message === 'Student already in study group') {
            errorMessage = 'Bạn đã tham gia nhóm học này rồi.';
          } if (err.response.data.message === 'Study group not found') {
            errorMessage = 'Mã mời không hợp lệ.';
          }else {
            errorMessage = err.response.data.message;
          }
        }

        setJoinStatus({
          show: true,
          success: false,
          message: errorMessage,
        });
    } finally {
      setLoading(false);
      setShowInviteModal(false);
      setInviteCode('');
      setTimeout(() => setJoinStatus({ show: false, success: false, message: '' }), 3000);
    }
  };

  const renderInviteModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm duration-300 " onClick={() => setShowInviteModal(false)}></div>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-10">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Tham gia qua mã mời của giảng viên</h3>
        <form onSubmit={handleJoinWithInvite}>
          <div className="mb-4">
            <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-1">
              Mã mời
            </label>
            <input
              type="text"
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Nhập mã mời"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#725C3A]"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Nhập mã mời trực tiếp từ giảng viên của bạn</p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-[#725C3A] hover:bg-[#5A4A2E] rounded-md transition-colors duration-300"
              disabled={!inviteCode.trim() || loading}
            >
              {loading ? 'Đang xử lý...' : 'Tham gia với mã mời'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderStudentsModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setShowStudentsModal(false)}></div>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl z-10">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Danh sách sinh viên</h3>
        {studentsLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#725C3A]"></div>
          </div>
        ) : studentsError ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
            <p>{studentsError}</p>
            <button
              onClick={() => fetchStudents(selectedGroupId)}
              className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md transition-colors duration-300"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">STT</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Họ tên</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Mã sinh viên</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Giới tính</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Ngày sinh</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b text-sm text-gray-700">{index + 1}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">{student.fullName}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">{student.studentId}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">{student.gender}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-700">{student.birthDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setShowStudentsModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-300"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );

  const renderStatusNotification = () => {
    if (!joinStatus.show) return null;
    return (
      <div
        className={`fixed bottom-4 right-4 max-w-sm bg-white border rounded-lg shadow-lg p-4 z-50 transform transition-all duration-500 ease-in-out ${
          joinStatus.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${joinStatus.success ? 'text-green-500' : 'text-red-500'}`}>
            {joinStatus.success ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${joinStatus.success ? 'text-green-800' : 'text-red-800'}`}>{joinStatus.message}</p>
          </div>
          <button onClick={() => setJoinStatus({ ...joinStatus, show: false })} className="ml-4 text-gray-400 hover:text-gray-500">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderCourseList = () => {
    console.log('filteredCourses:', filteredCourses);
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#725C3A]"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
          <p>{error}</p>
          <button
            onClick={() => fetchCourseGroups()}
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md transition-colors duration-300"
          >
            Thử lại
          </button>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setShowPopup(false)}></div>
            <div className="bg-white rounded-lg shadow-xl p-6 z-10">
              <div className="flex flex-col items-center">
                <div className="text-[#725C3A] mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Coming Soon!</h3>
                <p className="text-gray-600 text-center">Tính năng thông báo đang được phát triển và sẽ sớm ra mắt.</p>
                <button
                  onClick={() => setShowPopup(false)}
                  className="mt-4 bg-[#725C3A] hover:bg-[#5A4A2E] text-white px-6 py-2 rounded-lg shadow-md transition-colors duration-300"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6">
          <div className="bg-gray-50 p-4 flex items-center justify-between border-b border-gray-200 flex-wrap gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm nhóm học phần, môn học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#725C3A] focus:border-transparent transition-all duration-300"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center px-4 py-2 bg-[#725C3A] hover:bg-[#5A4A2E] text-white rounded-lg transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Tham gia qua mã mời
              </button>
            </div>
          </div>

          <div className="p-4">
            {filteredCourses.length === 0 ? (
              <p className="text-gray-600 text-center py-4">Không có nhóm học phần phù hợp.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((group) => (
                  <div
                    key={group.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:border-[#725C3A] hover:scale-[1.02]"
                  >
                    <div className="bg-[#725C3A] p-4">
                      <h2 className="text-lg font-bold text-white truncate">{group.name_group}</h2>
                    
                    </div>
                    <div className="p-4">
                    <p className="text-gray-700 mb-4">Tên môn học: {group.subject}</p>

                    <p className="text-gray-700 mb-4">Ghi chú: {group.note}</p>
                      <p className="text-gray-700 mb-2">Thời gian: {group.semester} - {group.academic_year}</p>
                      <div className="flex justify-end space-x-3 mt-2">
                        <div className="relative group">
                          <button
                            onClick={() => handleViewStudents(group.id)}
                            className="bg-[#725C3A] hover:bg-[#5A4A2E] text-white p-2 rounded-full shadow-md transition-all duration-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </button>
                          <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full -top-2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                            Xem danh sách sinh viên
                          </span>
                        </div>

                        <div className="relative group">
                          <button
                            onClick={handleGoToTests}
                            className="bg-[#725C3A] hover:bg-[#5A4A2E] text-white p-2 rounded-full shadow-md transition-all duration-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                              />
                            </svg>
                          </button>
                          <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full -top-2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                            Đi tới bài kiểm tra
                          </span>
                        </div>

                        <div className="relative group">
                          <button
                            onClick={() => handleViewAnnouncements(group.id)}
                            className="bg-[#725C3A] hover:bg-[#5A4A2E] text-white p-2 rounded-full shadow-md transition-all duration-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                              />
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
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 flex flex-col w-full min-h-screen bg-gray-50">
      {renderCourseList()}
      {showInviteModal && renderInviteModal()}
      {showStudentsModal && renderStudentsModal()}
      {renderStatusNotification()}
    </main>
  );
};

export default CourseGroups;