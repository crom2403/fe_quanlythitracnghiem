import { useState, useEffect } from "react";

export default function ExamPage() {
  // Thời gian làm bài (ví dụ 10 phút = 600 giây)
  const [timeRemaining, setTimeRemaining] = useState(600);
  // Trạng thái bài thi: "ongoing" (đang làm) hoặc "submitted" (đã nộp)
  const [examState, setExamState] = useState("ongoing");

  // Danh sách câu hỏi (ví dụ)
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "Đối với quyền truy cập nào thì cho phép truy cập các lớp con cùng gói với lớp cha?",
      options: [
        { id: "A", text: "A private, friendly, protected." },
        { id: "B", text: "Friendly, protected, public." },
        { id: "C", text: "Public, protected." },
        { id: "D", text: "Friendly, public." },
      ],
      selectedAnswer: null,
    },
    {
      id: 2,
      text: "Từ khóa nào được sử dụng để khai báo một phương thức được ghi đè trong Java?",
      options: [
        { id: "A", text: "Super" },
        { id: "B", text: "Overload" },
        { id: "C", text: "Tất cả đều đúng" },
        { id: "D", text: "Override" },
      ],
      selectedAnswer: null,
    },
    {
      id: 3,
      text: "Khi một thành phần của class được khai báo modifier là friendly thì thành phần đó:",
      options: [
        { id: "A", text: "Cho phép các đối tượng thuộc các class cùng package truy cập." },
        { id: "B", text: "Cho phép các đối tượng thuộc class cùng package như class truy cập." },
        { id: "C", text: "Cho phép các đối tượng thuộc lớp con truy cập." },
        { id: "D", text: "Cho phép truy cập." },
      ],
      selectedAnswer: null,
    },
    {
      id: 4,
      text: "Câu hỏi 4 là gì?",
      options: [
        { id: "A", text: "Đáp án A" },
        { id: "B", text: "Đáp án B" },
        { id: "C", text: "Đáp án C" },
        { id: "D", text: "Đáp án D" },
      ],
      selectedAnswer: null,
    },
    {
      id: 5,
      text: "Câu hỏi 5 là gì?",
      options: [
        { id: "A", text: "Đáp án A" },
        { id: "B", text: "Đáp án B" },
        { id: "C", text: "Đáp án C" },
        { id: "D", text: "Đáp án D" },
      ],
      selectedAnswer: null,
    },
    {
      id: 6,
      text: "Câu hỏi 6 là gì?",
      options: [
        { id: "A", text: "Đáp án A" },
        { id: "B", text: "Đáp án B" },
        { id: "C", text: "Đáp án C" },
        { id: "D", text: "Đáp án D" },
      ],
      selectedAnswer: null,
    },
  ]);

  // -------------------------
  // Đếm ngược thời gian
  // -------------------------
  useEffect(() => {
    let timer;
    if (examState === "ongoing") {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examState]);

  // -------------------------
  // Định dạng thời gian mm:ss
  // -------------------------
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // -------------------------
  // Chọn đáp án cho câu hỏi
  // -------------------------
  const handleSelectAnswer = (questionId, answerId) => {
    if (examState !== "ongoing") return;
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, selectedAnswer: answerId } : q
      )
    );
  };

  // -------------------------
  // Nộp bài thi
  // -------------------------
  const handleSubmitExam = () => {
    setExamState("submitted");
  };

  // -------------------------
  // Cuộn đến câu hỏi tương ứng
  // -------------------------
  const scrollToQuestion = (questionId) => {
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // -------------------------
  // Tính điểm (ví dụ)
  // -------------------------
  const calculateScore = () => {
    const correct = { 1: "B", 2: "D", 3: "A", 4: "A", 5: "C", 6: "D" };
    let count = 0;
    questions.forEach((q) => {
      if (correct[q.id] && q.selectedAnswer === correct[q.id]) {
        count++;
      }
    });
    return count;
  };

  // -------------------------
  // Giao diện khi đang làm bài
  // -------------------------
  const renderOngoingExam = () => {
    return (
      <div className="min-h-screen bg-gray-100 relative">
        {/* HEADER FIXED */}
        <div className="fixed top-0 left-0 right-0 bg-white shadow p-4 flex justify-between items-center z-50">
          <button className="bg-red-500 text-white px-4 py-2 rounded">
            THOÁT
          </button>
          <div className="font-bold text-xl">Sinh Viên: Aliliiii</div>
          <div className="flex items-center space-x-4">
            <div className="text-red-600 font-bold text-lg">
              {formatTime(timeRemaining)}
            </div>
            <button
              onClick={handleSubmitExam}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Nộp Bài
            </button>
          </div>
        </div>

        {/* Nội dung bài thi, đẩy xuống dưới header */}
        <div className="max-w-4xl mx-auto px-4 py-6 mt-20 mr-80">
          {questions.map((q) => (
            <div
              key={q.id}
              id={`question-${q.id}`}
              className="bg-white p-4 rounded shadow mb-4"
            >
              <div className="font-bold mb-2">
                {q.id}. {q.text}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {q.options.map((opt) => {
                  const selected = q.selectedAnswer === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectAnswer(q.id, opt.id)}
                      className={`flex items-center p-3 rounded border transition 
                        ${
                          selected
                            ? "border-blue-500 bg-blue-100"
                            : "border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 font-bold
                          ${
                            selected
                              ? "bg-blue-500 text-white"
                              : "bg-white border-2 border-gray-300"
                          }`}
                      >
                        {opt.id}
                      </div>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>


        {/* Cột chọn câu hỏi cố định dưới header, bên phải */}
        <div className="fixed top-20 right-5 w-72 bg-white shadow rounded-lg p-4 max-h-[calc(100vh-4rem)] overflow-auto">
          <div className="text-center font-bold mb-4">Chọn Câu Hỏi</div>
          <div className="flex flex-col gap-2">
            {questions.map((q) => (
              <button
                key={q.id}
                onClick={() => scrollToQuestion(q.id)}
                className={`px-4 py-2 rounded border font-bold transition text-center 
                  ${
                    q.selectedAnswer
                      ? "bg-green-100 border-green-400 text-green-700"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {q.id}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // -------------------------
  // Giao diện khi đã nộp bài
  // -------------------------
  const renderSubmittedExam = () => {
    const score = calculateScore();
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4">Kết quả bài thi</h2>
          <div className="text-6xl font-bold text-green-600 mb-4">
            {score}/10
          </div>
          <div className="text-lg">
            Số câu đúng: {score} / {questions.length}
          </div>
        </div>
      </div>
    );
  };

  return examState === "ongoing" ? renderOngoingExam() : renderSubmittedExam();
}
