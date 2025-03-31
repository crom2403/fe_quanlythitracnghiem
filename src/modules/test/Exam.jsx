import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ExamPage() {
  const navigate = useNavigate();

  // Thời gian làm bài (ví dụ 10 phút = 600 giây)
  const [timeRemaining, setTimeRemaining] = useState(600);
  // Trạng thái bài thi: "ongoing" (đang làm) hoặc "submitted" (đã nộp)
  const [examState, setExamState] = useState("ongoing");

  // Hiển thị pop-up xác nhận nộp bài
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);


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
  // Mở pop-up xác nhận nộp bài
  // -------------------------
  const handleOpenConfirmSubmit = () => {
    setShowConfirmSubmit(true);
  };

  // -------------------------
  // Đóng pop-up xác nhận nộp bài
  // -------------------------
  const handleCloseConfirmSubmit = () => {
    setShowConfirmSubmit(false);
  };

  // -------------------------
  // Thực sự nộp bài
  // -------------------------
  const handleSubmitExam = () => {
    setExamState("submitted");
  };

  // -------------------------
  // Cuộn đến câu hỏi tương ứng (khi đang làm)
  // -------------------------
  const scrollToQuestion = (questionId) => {
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // -------------------------
  // Tính điểm
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
              onClick={handleOpenConfirmSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Nộp Bài
            </button>
          </div>
        </div>

        {/* Nội dung bài thi */}
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
                      className={`flex items-center p-3 rounded border transition ${
                        selected
                          ? "border-blue-500 bg-blue-100"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 font-bold ${
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

        {/* Cột chọn câu hỏi cố định bên phải */}
        <div className="fixed top-20 right-5 w-72 bg-white shadow rounded-lg p-4 max-h-[calc(100vh-4rem)] overflow-auto">
          <div className="text-center font-bold mb-4">Chọn Câu Hỏi</div>
          <div className="flex flex-col gap-2">
            {questions.map((q) => (
              <button
                key={q.id}
                onClick={() => scrollToQuestion(q.id)}
                className={`px-4 py-2 rounded border font-bold transition text-center ${
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

        {/* Pop-up xác nhận nộp bài */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm backdrop-filter
           transition-all ease-in-out duration-300  bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-blue-500 text-5xl">ℹ</div>
                <h2 className="text-xl font-bold">
                  Bạn có chắc chắn muốn nộp bài ?
                </h2>
                <p className="text-gray-600">
                  Khi xác nhận nộp bài, bạn sẽ không thể sửa lại bài thi của
                  mình. Chúc bạn may mắn!
                </p>
                <div className="flex space-x-4 mt-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => {
                      handleSubmitExam();
                      handleCloseConfirmSubmit();
                    }}
                  >
                    Vâng, chắc chắn!
                  </button>
                  <button
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                    onClick={handleCloseConfirmSubmit}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // -------------------------
  // Giao diện khi đã nộp bài
  // -------------------------
  const renderSubmittedExam = () => {
    const totalQuestions = questions.length;
    const correctAnswers = calculateScore();
    const answeredCount = questions.filter((q) => q.selectedAnswer !== null).length;
    const wrongAnswers = answeredCount - correctAnswers;
    const skipped = totalQuestions - answeredCount;
    const totalTime = 600; // Tổng thời gian làm bài (giây)
    const timeUsed = totalTime - timeRemaining;
    const timeUsedFormatted = formatTime(timeUsed);
    const accuracy = (correctAnswers / totalQuestions) * 100;

    // Định nghĩa đáp án đúng cho từng câu hỏi
    const correctMapping = { 1: "B", 2: "D", 3: "A", 4: "A", 5: "C", 6: "D" };

    // Layout: hiển thị kết quả chung + danh sách câu hỏi bên dưới
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
        {/* Kết quả chung */}
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-2xl text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
            Kết quả làm bài
          </h2>
          <div className="mb-6 flex flex-col items-center space-y-2">
            <div className="text-5xl font-bold text-blue-600">
              {correctAnswers}/{totalQuestions}
            </div>
            <p className="text-lg text-gray-600">
              Điểm số: {accuracy.toFixed(2)}%
            </p>
            <p className="text-lg text-gray-600">
              Thời gian hoàn thành:{" "}
              <span className="font-semibold text-blue-600">
                {timeUsedFormatted}
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-6 space-y-3 sm:space-y-0 mb-6 text-lg">
            <div>
              Đúng: <span className="font-semibold text-green-600">{correctAnswers}</span>
            </div>
            <div>
              Sai: <span className="font-semibold text-red-600">{wrongAnswers}</span>
            </div>
            <div>
              Bỏ qua: <span className="font-semibold text-gray-500">{skipped}</span>
            </div>
          </div>

          <button
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg text-lg font-bold hover:bg-gray-300 transition duration-300 shadow-lg"
            onClick={() => navigate("/dashboard/test")}
          >
            Quay về trang đề thi
          </button>
        </div>

        {/* Danh sách câu hỏi - dạng lưới nhiều cột */}
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-2xl">
          <h3 className="text-2xl font-bold mb-4 text-gray-700">
            Danh sách câu hỏi
          </h3>

          {/* Chia làm nhiều cột (có thể tùy chỉnh grid-cols-2,3,4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {questions.map((q) => {
              // Kiểm tra xem người dùng có chọn đáp án không
              const userAnswer = q.selectedAnswer;
              const isAnswered = userAnswer !== null;
              // Đáp án đúng
              const correctAns = correctMapping[q.id];
              // Xác định đúng/sai
              const isCorrect = userAnswer === correctAns;

              let summaryText = `Câu ${q.id}: `;
              if (!isAnswered) {
                summaryText += "chưa trả lời";
              } else {
                // Vd: "Câu 1: A (✓)" hoặc "Câu 1: C (✗)"
                summaryText += userAnswer;
                summaryText += isCorrect ? " (✓)" : " (✗)";
              }

              return (
                <div
                  key={q.id}
                  className="border rounded-lg p-4 text-sm text-gray-700"
                >
                  <div className="font-semibold mb-1">{summaryText}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return examState === "ongoing" ? renderOngoingExam() : renderSubmittedExam();
}
