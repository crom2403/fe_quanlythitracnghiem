import { useState, useEffect } from "react";
import dayjs from "dayjs";
import ExamComponent from "./Exam.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import useExamStore from "../store/examStore";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function TestLayout() {
  const navigate = useNavigate();
  const { testId } = useParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTest, setSelectedTest] = useState(null);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchingDetail, setFetchingDetail] = useState(false);
  const [attemptedTests, setAttemptedTests] = useState(new Set());

  const { setExamDetail } = useExamStore();

  const checkStudentExamStatus = async (examId) => {
    try {
      const response = await axiosInstance.get(`/exam-attempt/check-student-can-take-exam/${examId}`);
      return {
        canTake: response.data.success === true,
        hasAttempted: response.data.success === false, // hoặc !response.data.success
      };

    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái thi:", error);
      return { canTake: true, hasAttempted: false };
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/exam/get-all-exams-of-student");
        const apiTests = response.data;

        const mappedTests = apiTests.map((test) => ({
          id: test.id || 0,
          exam_id: test.exam_id,
          title: typeof test.name_exam === "string" && test.name_exam.trim() !== "" ? test.name_exam : "Không có tiêu đề",
          subject: typeof test.group_student_name === "string" ? test.group_student_name : "Không có môn học",
          startTime: dayjs(test.start_time, "DD/MM/YYYY, hh:mm A").toISOString(),
          endTime: dayjs(test.end_time, "DD/MM/YYYY, hh:mm A").toISOString(),
        }));
        console.log(apiTests);
        console.log("api đã map",mappedTests);

        const statusChecks = await Promise.all(
          mappedTests.map((test) =>
            checkStudentExamStatus(test.exam_id).then(res => ({
              exam_id: test.exam_id,
              hasAttempted: res.hasAttempted,
            }))
          )
        );
        
        const attemptedSet = new Set(
          statusChecks
            .filter((status) => status.hasAttempted)
            .map((status) => status.exam_id)
        );

        setTests(mappedTests);
        setAttemptedTests(attemptedSet);
      } catch (err) {
        setError("Không thể tải danh sách đề thi. Vui lòng thử lại sau.");
        console.error("Lỗi khi gọi API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  useEffect(() => {
    if (testId) {
      const test = tests.find((t) => t.courseGroupId === parseInt(testId));
      if (test) {
        setSelectedTest(test);
      }
    }
  }, [testId, tests]);

  const getTestStatus = (startTime, endTime, examId) => {
    if (attemptedTests.has(examId)) {
      return "Đã thi";
    }
    if (!startTime || !endTime) {
      return "Không xác định";
    }
    const now = dayjs();
    const start = dayjs(startTime);
    const end = dayjs(endTime);

    if (now.isBefore(start)) {
      return "Chưa mở";
    } else if (now.isAfter(end)) {
      return "Đã đóng";
    } else {
      return "Đang mở";
    }
  };

  const filteredTests = tests.filter((test) => {
    const lowerSearch = searchTerm.toLowerCase();
    const title = typeof test.title === "string" ? test.title.toLowerCase() : "";
    const subject = typeof test.subject === "string" ? test.subject.toLowerCase() : "";
    const matchesSearch = title.includes(lowerSearch) || subject.includes(lowerSearch);

    const status = getTestStatus(test.startTime, test.endTime, test.exam_id);
    const matchesStatus = statusFilter === "all" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetail = async (test) => {
    try {
      setFetchingDetail(true);
      // Gọi API để lấy chi tiết đề thi
      const response = await axiosInstance.get(`/exam/${test.exam_id}`);
      const examDetail = response.data;
      console.log("Dữ liệu chi tiết đề thi:", examDetail);
      console.log("Id đề thi:", test.exam_id);
      // Lưu chi tiết đề thi vào store
      setExamDetail(examDetail);
      setSelectedTest(test);
      setIsExamStarted(false);
  
    
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết đề thi:", err);
      setError("Không thể lấy chi tiết đề thi. Vui lòng thử lại sau.");
    } finally {
      setFetchingDetail(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedTest(null);
    setIsExamStarted(false);
    navigate("/dashboard/test");
  };

  const handleStartExam = async () => {
    if (fetchingDetail) {
      return;
    }

    try {
      const { canTake } = await checkStudentExamStatus(selectedTest.exam_id);

      if (!canTake) {
        setError("Bạn đã làm bài thi này rồi!");
        return;
      }

      setIsExamStarted(true);
      navigate("/dashboard/exam");
    } catch (error) {
      console.error("Lỗi khi bắt đầu thi:", error);
      setError("Có lỗi xảy ra khi bắt đầu thi. Vui lòng thử lại.");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleStatusSelect = (status) => {
    setStatusFilter(status);
    setIsDropdownOpen(false);
  };

  const renderTestDetail = (test) => {
    const status = getTestStatus(test.startTime, test.endTime, test.exam_id);
    const isAttempted = attemptedTests.has(test.exam_id);
    
    if (isExamStarted && !isAttempted) {
      return <ExamComponent test={test} onExit={handleCloseDetail} />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl rounded-xl overflow-hidden w-full max-w-md transform transition-all duration-300 hover:scale-105">
          <div
            className={`p-6 text-center ${
              status === "Chưa mở"
                ? "bg-gray-100"
                : status === "Đang mở"
                ? "bg-green-50"
                : status === "Đã thi"
                ? "bg-blue-50"
                : "bg-red-50"
            }`}
          >
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4 tracking-tight">
              {isAttempted ? "Kết quả bài thi" : "Chuẩn bị làm bài thi"}
            </h2>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">Tên bài thi:</span>
                <span className="font-bold text-gray-800">{test.title}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">Môn học:</span>
                <span className="font-bold text-gray-800">{test.subject}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">Bắt đầu:</span>
                <span className="font-bold text-blue-700">
                  {test.startTime ? dayjs(test.startTime).format("DD/MM/YYYY HH:mm") : "Không xác định"}
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">Kết thúc:</span>
                <span className="font-bold text-red-700">
                  {test.endTime ? dayjs(test.endTime).format("DD/MM/YYYY HH:mm") : "Không xác định"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-600">Trạng thái:</span>
                <span
                  className={`font-bold ${
                    status === "Chưa mở"
                      ? "text-gray-500"
                      : status === "Đang mở"
                      ? "text-green-600"
                      : status === "Đã thi"
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              {status === "Đang mở" && !isAttempted ? (
                <button
                  onClick={handleStartExam}
                  className={`bg-blue-600 text-white px-6 py-3 rounded-lg 
                    hover:bg-blue-700 transition-colors duration-300 
                    shadow-md hover:shadow-lg 
                    ${fetchingDetail ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={fetchingDetail}
                >
                  {fetchingDetail ? "Đang tải..." : "Bắt đầu làm bài"}
                </button>
              ) : (
                <button
                  className="bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed opacity-70"
                  disabled
                >
                  {isAttempted ? "Đã hoàn thành" : "Bắt đầu làm bài"}
                </button>
              )}
              <button
                onClick={handleCloseDetail}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-300"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTestList = () => {
    if (loading) {
      return (
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Đang tải danh sách đề thi...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6">
          <div className="bg-gray-50 p-4 flex items-center border-b border-gray-200">
            <div className="relative mr-4">
              <button
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
                onClick={toggleDropdown}
              >
                {statusFilter === "all" ? "Tất cả" : statusFilter}
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 w-40 bg-white border border-gray-200 rounded-lg shadow-lg mt-2">
                  <ul className="py-1">
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => handleStatusSelect("all")}
                      >
                        Tất cả
                      </button>
                    </li>
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => handleStatusSelect("Chưa mở")}
                      >
                        Chưa mở
                      </button>
                    </li>
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => handleStatusSelect("Đang mở")}
                      >
                        Đang mở
                      </button>
                    </li>
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => handleStatusSelect("Đã đóng")}
                      >
                        Đã đóng
                      </button>
                    </li>
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => handleStatusSelect("Đã thi")}
                      >
                        Đã thi
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm đề thi, tên môn học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          <div className="p-4">
            {filteredTests.length === 0 && (
              <p className="text-gray-600 text-center py-4">Không có đề thi phù hợp.</p>
            )}
            {filteredTests.map((test, index) => {
              const status = getTestStatus(test.startTime, test.endTime, test.exam_id);
              const isAttempted = attemptedTests.has(test.exam_id);

  return (
    <div
      key={`${test.exam_id}-${index}`}
      className="bg-white border border-gray-200 rounded-lg mb-4 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300 hover:scale-[1.02]"
    >
      <div className="p-4 flex justify-between items-center">
        <div className="flex-1 pr-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{test.title}</h3>
          <p className="text-sm text-gray-600 mb-1 flex items-center">
            <span className="mr-2">📚</span>
            {test.subject}
          </p>
          <p className="text-sm italic text-gray-500 flex items-center">
            <span className="mr-2">⏰</span>
            Diễn ra từ{" "}
            {test.startTime ? dayjs(test.startTime).format("DD/MM/YYYY HH:mm") : "Không xác định"} đến{" "}
            {test.endTime ? dayjs(test.endTime).format("DD/MM/YYYY HH:mm") : "Không xác định"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span
            className={`font-bold ${
              status === "Chưa mở"
                ? "text-gray-500"
                : status === "Đang mở"
                ? "text-green-600"
                : status === "Đã đóng"
                ? "text-red-600"
                : "text-blue-600"
            }`}
          >
            {status}
          </span>
          {status !== "Đã thi" && (
            <button
              onClick={() => handleViewDetail(test)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {isAttempted ? "Xem bài thi" : "Xem chi tiết"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
})}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 flex flex-col w-full h-80">
      {selectedTest ? renderTestDetail(selectedTest) : renderTestList()}
    </main>
  );
}