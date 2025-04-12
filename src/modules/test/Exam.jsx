import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useExamStore from "../store/examStore";
import axiosInstance from "../../axiosConfig";

export default function ExamPage() {
  const navigate = useNavigate();
  const { examDetail } = useExamStore();
  //console.log("examDetail trong ExamPage:", examDetail);
  const [submitFailed, setSubmitFailed] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState(
    examDetail ? examDetail.duration_minutes * 60 : 600
  );
  const [isSubmitting, setIsSubmitting] = useState(false); // Quản lý trạng thái loading
const [showRetryPopup, setShowRetryPopup] = useState(false); // Hiển thị popup thử lại khi thất bại
  const [examState, setExamState] = useState("ongoing");
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [reviewSettings, setReviewSettings] = useState({
    allow_review: examDetail?.allow_review || false,
    allow_review_point: examDetail?.allow_review_point || false,
  });

  const prevExamDetailRef = useRef(null);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    if (examDetail && examDetail.exam_questions && Array.isArray(examDetail.exam_questions)) {
      const examDetailString = JSON.stringify(examDetail);
      if (examDetailString === JSON.stringify(prevExamDetailRef.current)) {
        return;
      }
      prevExamDetailRef.current = examDetail;

      let mappedQuestions = examDetail.exam_questions.map((q) => {
        if (!q.question || !q.question.content || !q.question.answers) {
          console.warn(`Câu hỏi ID ${q.order_index} không có dữ liệu hợp lệ:`, q);
          return null;
        }

        let options = q.question.answers.map((ans, index) => ({
          id: String.fromCharCode(65 + index),
          text: ans.content,
        }));

        const correctAnswer = q.question.answers.find((ans) => ans.is_correct);
        const correctAnswerId = correctAnswer
          ? String.fromCharCode(65 + q.question.answers.indexOf(correctAnswer))
          : null;

        if (examDetail.is_shuffled_answer) {
          const originalOptions = options.map((opt, index) => ({
            ...opt,
            originalIndex: index,
          }));
          options = shuffleArray(originalOptions);

          const correctOption = options.find(
            (opt) => opt.originalIndex === q.question.answers.indexOf(correctAnswer)
          );
          const newCorrectAnswerId = correctOption ? correctOption.id : null;

          return {
            id: q.order_index,
            text: q.question.content,
            options: options.map(({ originalIndex, ...rest }) => rest),
            selectedAnswer: null,
            correctAnswer: newCorrectAnswerId,
            is_selected: false, // Ban đầu là false (boolean)
          };
        }

        return {
          id: q.order_index,
          text: q.question.content,
          options,
          selectedAnswer: null,
          correctAnswer: correctAnswerId,
          is_selected: false, // Ban đầu là false (boolean)
        };
      }).filter((q) => q !== null);

      if (examDetail.is_shuffled_question) {
        mappedQuestions = shuffleArray(mappedQuestions);
      }

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
            setShowConfirmSubmit(true);
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
        q.id === questionId
          ? { ...q, selectedAnswer: answerId, is_selected: true } // Cập nhật is_selected thành true (boolean)
          : q
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
    setIsSubmitting(true);

    // Helper function để format ngày giờ
    const formatDateToISO = (date) => {
      if (!date) return new Date().toISOString();
      const d = new Date(date);
      return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
    };

    // Chuyển đổi thời gian từ phút sang giây
    const testTimeInSeconds = (examDetail.duration_minutes || 0) * 60;

    // Hàm lấy answer_id gốc từ selectedAnswer
    const getAnswerIdFromOption = (question, selectedAnswer) => {
      // Nếu không có đáp án được chọn, trả về undefined thay vì null
      if (!selectedAnswer) return undefined;

      const originalQuestion = examDetail.exam_questions.find(
        (q) => q.order_index === question.id
      );

      if (!originalQuestion?.question?.answers) {
        return undefined;
      }

      // Lấy index của đáp án được chọn (A=0, B=1, etc.)
      const selectedIndex = selectedAnswer.charCodeAt(0) - 65;
      
      // Lấy answer_id gốc từ danh sách đáp án
      const originalAnswer = originalQuestion.question.answers[selectedIndex];
      return originalAnswer?.id;
    };

    // Chuẩn bị danh sách câu hỏi và đáp án
    const prepareQuestions = () => {
      return questions.map((q) => {
        const answerId = getAnswerIdFromOption(q, q.selectedAnswer);
        
        return {
          question_id: q.id,
          // Nếu không có đáp án được chọn, gửi null thay vì xóa trường answer_id
          anwer_id: answerId !== undefined ? answerId : null,
          is_selected: Boolean(q.selectedAnswer), // Đảm bảo giá trị boolean
        };
      });
    };

    // Tạo dữ liệu gửi đi
    const submissionData = {
      exam_id: examDetail.id,
      tab_switch_count: tabSwitchCount,
      start_time: formatDateToISO(examDetail.start_time),
      end_time: formatDateToISO(examDetail.end_time),
      test_time: testTimeInSeconds,
      list_question: prepareQuestions(),
    };

    console.log("Dữ liệu nộp bài chi tiết:", submissionData);

    try {
      const response = await axiosInstance.post("/exam-attempt", submissionData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success === true) {
        console.log("Nộp bài thành công:", response.data);
        setExamState("submitted");
        setShowConfirmSubmit(false);
        setShowRetryPopup(false);
        setSubmitFailed(false);
      } else {
        console.error("Nộp bài thất bại:", response.data);
        setShowConfirmSubmit(false);
        setShowRetryPopup(true);
        setSubmitFailed(true);
      }
    } catch (err) {
      console.error("Lỗi khi nộp bài:", err);
      if (err.response?.data) {
        console.error("Chi tiết lỗi từ API:", err.response.data);
      }
      setShowConfirmSubmit(false);
      setShowRetryPopup(true);
      setSubmitFailed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToQuestion = (questionId) => {
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const calculateScore = () => {
    let count = 0;
    questions.forEach((q) => {
      if (q.selectedAnswer && q.selectedAnswer === q.correctAnswer) {
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
              disabled={isSubmitting}
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
                          disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                  {isSubmitting ? "Đang nộp bài..." : "Bạn có chắc chắn muốn nộp bài ?"}
                </h2>
                {!isSubmitting && (
                  <p className="text-gray-600">
                    Khi xác nhận nộp bài, bạn sẽ không thể sửa lại bài thi của mình. Chúc bạn may mắn!
                  </p>
                )}
                {isSubmitting ? (
                  <div className="flex justify-center items-center">
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="flex space-x-4 mt-4">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      onClick={() => {
                        handleSubmitExam();
                      }}
                      disabled={isSubmitting}
                    >
                      Vâng, chắc chắn!
                    </button>
                    <button
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                      onClick={handleCloseConfirmSubmit}
                      disabled={isSubmitting}
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

  
        {showRetryPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm backdrop-filter transition-all ease-in-out duration-300 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-red-500 text-5xl">⚠️</div>
                <h2 className="text-xl font-bold text-red-600">
                  Nộp bài thất bại
                </h2>
                <p className="text-gray-600">
                  Không thể nộp bài. Vui lòng thử lại hoặc quay lại sau.
                </p>
                {isSubmitting ? (
                  <div className="flex justify-center items-center">
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="flex space-x-4 mt-4">
                
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => {
                      handleSubmitExam();
                    }}
                    disabled={isSubmitting}
                  >
                    Thử lại
                  </button>
                </div>
                )}
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
    const scoreOutOf10 = (correctAnswers / totalQuestions) * 10;

    if (!reviewSettings.allow_review && !reviewSettings.allow_review_point) {
      return null;
    }

    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
        {reviewSettings.allow_review_point && (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-2xl text-center mb-8">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
              Kết quả làm bài
            </h2>
            <div className="mb-6 flex flex-col items-center space-y-2">
              <div className="text-5xl font-bold text-blue-600">
                {scoreOutOf10.toFixed(2)}/10
              </div>
              <p className="text-lg text-gray-600">
                Số câu đúng: {correctAnswers}/{totalQuestions}
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
          </div>
        )}

        {reviewSettings.allow_review && (
          <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-700">
              Danh sách câu hỏi
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {questions.map((q) => {
                const userAnswer = q.selectedAnswer;
                const isAnswered = userAnswer !== null;
                const correctAns = q.correctAnswer;
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
        )}
        <div className="max-w-3xl mx-auto mt-8 text-center">
          <button
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg text-lg font-bold hover:bg-gray-300 transition duration-300 shadow-lg mt-6"
            onClick={() => navigate("/dashboard")}
          >
            Quay về trang đề thi
          </button>
        </div>
      </div>
    );
  };

  return examState === "ongoing" ? renderOngoingExam() : renderSubmittedExam();
}