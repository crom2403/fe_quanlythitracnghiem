import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useExamStore from "../store/examStore";
import axiosInstance from "../../axiosConfig";

export default function ExamPage() {
  const navigate = useNavigate();
  const { examDetail } = useExamStore();
  console.log("examDetail trong ExamPage:", examDetail);

  const [timeRemaining, setTimeRemaining] = useState(
    examDetail ? examDetail.duration_minutes * 60 : 600
  );
  const [examState, setExamState] = useState("ongoing");
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (examDetail && examDetail.exam_questions && Array.isArray(examDetail.exam_questions)) {
      const mappedQuestions = examDetail.exam_questions.map((q) => {
        if (!q.question || !q.question.content || !q.question.answers) {
          console.warn(`Câu hỏi ID ${q.id} không có dữ liệu hợp lệ:`, q);
          return null;
        }
        console.log(`Dữ liệu câu hỏi ID ${q.id}:`, q.question);
        const options = q.question.answers.map((ans) => {
          console.log(`Đáp án của câu hỏi ID ${q.id}:`, ans);
          return {
            id: ans.id.toString(),
            text: ans.content,
          };
        });
        return {
          id: q.id,
          text: q.question.content,
          options: options,
          selectedAnswer: null,
        };
      }).filter(q => q !== null);
      setQuestions(mappedQuestions);
      console.log("Danh sách câu hỏi:", mappedQuestions);
    } else {
      console.warn("Không có exam_questions trong examDetail:", examDetail);
    }
  }, [examDetail]);

  if (!examDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Không thể tải chi tiết đề thi. Vui lòng thử lại.</p>
      </div>
    );
  }

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

  useEffect(() => {
    if (examState !== "ongoing") return;

    const handleVisibilityChange = () => {
      if (document.hidden && examState === "ongoing") {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;
          if (newCount === 1) {
            setWarningMessage("Bạn đã chuyển khỏi tab thi lần 1. Lần tiếp theo bạn sẽ bị buộc nộp bài!");
            setShowWarning(true);
          } else if (newCount >= 2) {
            handleSubmitExam();
          }
          return newCount;
        });
      }
    };

    const handleBeforeUnload = (e) => {
      if (examState === "ongoing") {
        e.preventDefault();
        e.returnValue = "Bạn không thể đóng tab trong khi làm bài thi. Vui lòng nộp bài trước khi thoát.";
        setWarningMessage("Bạn không thể đóng tab trong khi làm bài thi. Vui lòng nộp bài trước khi thoát.");
        setShowWarning(true);
        return e.returnValue;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [examState, tabSwitchCount]);

  const handleCloseWarning = () => {
    setShowWarning(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (questionId, answerId) => {
    if (examState !== "ongoing") return;
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, selectedAnswer: answerId } : q
      )
    );
  };

  const handleOpenConfirmSubmit = () => {
    setShowConfirmSubmit(true);
  };

  const handleCloseConfirmSubmit = () => {
    setShowConfirmSubmit(false);
  };

  const handleSubmitExam = async () => {
    setExamState("submitted");
    const submissionData = {
      examId: examDetail.id,
      list_question: questions.map((q) => ({
        questionId: q.id,
        list_answer: q.selectedAnswer ? [parseInt(q.selectedAnswer)] : [],
      })),
      is_selected: true,
    };

    try {
      const response = await axiosInstance.post("/exam", submissionData);
      console.log("Nộp bài thành công:", response.data);
    } catch (err) {
      console.error("Lỗi khi nộp bài:", err);
      setWarningMessage("Không thể nộp bài. Vui lòng thử lại sau.");
      setShowWarning(true);
    }

    console.log("Thống kê hành vi:", { tabSwitchCount });
  };

  const scrollToQuestion = (questionId) => {
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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

  const renderOngoingExam = () => {
    return (
      <div className="min-h-screen bg-gray-100 relative">
        <div className="fixed top-0 left-0 right-0 bg-white shadow p-4 flex justify-between items-center z-50">

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

        <div className="max-w-4xl mx-auto px-4 py-6 mt-20 mr-80">
          {questions.length === 0 ? (
            <p className="text-gray-600 text-center">Không có câu hỏi nào để hiển thị.</p>
          ) : (
            questions.map((q) => (
              <div
                key={q.id}
                id={`question-${q.id}`}
                className="bg-white p-4 rounded shadow mb-4"
              >
                <div className="font-bold mb-2">
                  {q.id}. {q.text}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Array.isArray(q.options) && q.options.length > 0 ? (
                    q.options.map((opt) => {
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
                            {opt.id || "N/A"}
                          </div>
                          <span>{opt.text || "Không có nội dung"}</span>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-red-600">Không có đáp án cho câu hỏi này.</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

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

        {showConfirmSubmit && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm backdrop-filter transition-all ease-in-out duration-300 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-blue-500 text-5xl">ℹ</div>
                <h2 className="text-xl font-bold">
                  Bạn có chắc chắn muốn nộp bài ?
                </h2>
                <p className="text-gray-600">
                  Khi xác nhận nộp bài, bạn sẽ không thể sửa lại bài thi của mình. Chúc bạn may mắn!
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

        {showWarning && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm backdrop-filter transition-all ease-in-out duration-300 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-yellow-500 text-5xl">⚠️</div>
                <h2 className="text-xl font-bold text-red-600">
                  Cảnh Báo!
                </h2>
                <p className="text-gray-700">{warningMessage}</p>
                <div className="flex space-x-4 mt-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={handleCloseWarning}
                  >
                    Tôi đã hiểu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSubmittedExam = () => {
    const totalQuestions = questions.length;
    const correctAnswers = calculateScore();
    const answeredCount = questions.filter((q) => q.selectedAnswer !== null).length;
    const wrongAnswers = answeredCount - correctAnswers;
    const skipped = totalQuestions - answeredCount;
    const totalTime = examDetail ? examDetail.duration_minutes * 60 : 600;
    const timeUsed = totalTime - timeRemaining;
    const timeUsedFormatted = formatTime(timeUsed);
    const accuracy = (correctAnswers / totalQuestions) * 100;

    const correctMapping = { 1: "B", 2: "D", 3: "A", 4: "A", 5: "C", 6: "D" };

    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
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

          <div className="border-t pt-4 mt-4">
            <p className="text-md text-gray-700 mb-2">
              <span className="font-medium">Số lần chuyển tab:</span>{" "}
              <span className="text-red-600">{tabSwitchCount}</span>
            </p>
          </div>

          <button
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg text-lg font-bold hover:bg-gray-300 transition duration-300 shadow-lg mt-6"
            onClick={() => navigate("/dashboard")}
          >
            Quay về trang đề thi
          </button>
        </div>

        <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-2xl">
          <h3 className="text-2xl font-bold mb-4 text-gray-700">
            Danh sách câu hỏi
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {questions.map((q) => {
              const userAnswer = q.selectedAnswer;
              const isAnswered = userAnswer !== null;
              const correctAns = correctMapping[q.id];
              const isCorrect = userAnswer === correctAns;

              let summaryText = `Câu ${q.id}: `;
              if (!isAnswered) {
                summaryText += "chưa trả lời";
              } else {
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