import { useState } from "react";
import dayjs from "dayjs";
import ExamComponent from "./Exam.jsx"; 

const mockTests = [
  {
    id: 1,
    title: "Test 2",
    subject: "Lập trình hướng đối tượng - NH2022 - HK1",
    startTime: "2025-03-29T10:00:00",
    endTime: "2025-03-30T12:00:00",
  },
  {
    id: 2,
    title: "Test 1",
    subject: "Lập trình hướng đối tượng - NH2022 - HK1",
    startTime: "2025-03-24T10:00:00",
    endTime: "2025-03-25T09:00:00",
  },
  {
    id: 3,
    title: "Test Selenium",
    subject: "Lập trình web và ứng dụng nâng cao - NH2022 - HK2",
    startTime: "2025-03-27T09:00:00",
    endTime: "2025-03-29T12:00:00",
  },
];

function getTestStatus(startTime, endTime) {
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
}

export default function TestLayout() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTest, setSelectedTest] = useState(null);
  const [isExamStarted, setIsExamStarted] = useState(false);

  const filteredTests = mockTests.filter((test) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      test.title.toLowerCase().includes(lowerSearch) ||
      test.subject.toLowerCase().includes(lowerSearch)
    );
  });

  const handleViewDetail = (test) => {
    setSelectedTest(test);
    setIsExamStarted(false);
  };

  const handleCloseDetail = () => {
    setSelectedTest(null);
    setIsExamStarted(false);
  };

  const handleStartExam = () => {
    setIsExamStarted(true);
  };

  const renderTestDetail = (test) => {
    const status = getTestStatus(test.startTime, test.endTime);

    if (isExamStarted) {
      return <ExamComponent test={test} onExit={handleCloseDetail} />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl rounded-xl overflow-hidden w-full max-w-md transform transition-all duration-300 hover:scale-105">
          <div className={`p-6 text-center ${
            status === "Chưa mở"
              ? "bg-gray-100"
              : status === "Đang mở"
              ? "bg-green-50"
              : "bg-red-50"
          }`}>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4 tracking-tight">
              Chuẩn bị làm bài thi
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
                  {dayjs(test.startTime).format("DD/MM/YYYY HH:mm")}
                </span>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-semibold text-gray-600">Kết thúc:</span>
                <span className="font-bold text-red-700">
                  {dayjs(test.endTime).format("DD/MM/YYYY HH:mm")}
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
                      : "text-red-600"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              {status === "Đang mở" ? (
                <button 
                  onClick={handleStartExam}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                  Bắt đầu làm bài
                </button>
              ) : (
                <button
                  className="bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed opacity-70"
                  disabled
                >
                  Bắt đầu làm bài
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
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6">
          <div className="bg-gray-50 p-4 flex items-center border-b border-gray-200">
            <button
              className="mr-4 bg-blue-600 text-white px-5 py-2 rounded-lg 
                         hover:bg-blue-700 transition-colors duration-300 
                         shadow-md hover:shadow-lg focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => setSearchTerm("")}
            >
              Tất cả
            </button>
            <input
              type="text"
              placeholder="Tìm kiếm đề thi, tên môn học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent transition-all duration-300"
            />
          </div>

          <div className="p-4">
            {filteredTests.length === 0 && (
              <p className="text-gray-600 text-center py-4">
                Không có đề thi phù hợp.
              </p>
            )}

            {filteredTests.map((test) => {
              const status = getTestStatus(test.startTime, test.endTime);
              return (
                <div
                  key={test.id}
                  className="bg-white border border-gray-200 rounded-lg mb-4 
                             overflow-hidden shadow-sm hover:shadow-md 
                             transition-all duration-300 hover:border-blue-300 
                             hover:scale-[1.02]"
                >
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex-1 pr-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {test.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1 flex items-center">
                        <span className="mr-2">📚</span>{test.subject}
                      </p>
                      <p className="text-sm italic text-gray-500 flex items-center">
                        <span className="mr-2">⏰</span>
                        Diễn ra từ{" "}
                        {dayjs(test.startTime).format("DD/MM/YYYY HH:mm")} đến{" "}
                        {dayjs(test.endTime).format("DD/MM/YYYY HH:mm")}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`font-bold ${
                          status === "Chưa mở"
                            ? "text-gray-500"
                            : status === "Đang mở"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {status}
                      </span>
                      <button
                        onClick={() => handleViewDetail(test)}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg 
                                   hover:bg-blue-700 transition-colors duration-300 
                                   shadow-md hover:shadow-lg focus:outline-none 
                                   focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        Xem chi tiết
                      </button>
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