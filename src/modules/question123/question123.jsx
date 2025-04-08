import React, { useState, useEffect } from 'react';
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Upload,
  Filter,
  ChevronDown,
} from 'lucide-react';

// Dữ liệu mẫu
const initialQuestions = [
  {
    id: 1,
    question:
      'Ngôn ngữ lập trình nào được sử dụng để phát triển ứng dụng React?',
    options: ['Java', 'C++', 'JavaScript', 'Python'],
    correctAnswer: 'JavaScript',
    subject: 'Lập trình',
    chapter: 'Ngôn ngữ lập trình',
    difficulty: 'Dễ',
  },
  {
    id: 2,
    question: 'HTML là viết tắt của?',
    options: [
      'Hyper Text Markup Language',
      'High Tech Machine Learning',
      'Hyper Transfer Mode Language',
      'Home Tool Markup Language',
    ],
    correctAnswer: 'Hyper Text Markup Language',
    subject: 'Web',
    chapter: 'Cơ bản',
    difficulty: 'Dễ',
  },
  {
    id: 3,
    question: 'CSS được sử dụng để làm gì?',
    options: [
      'Tạo cấu trúc trang web',
      'Tạo kiểu cho trang web',
      'Xử lý dữ liệu',
      'Lưu trữ dữ liệu',
    ],
    correctAnswer: 'Tạo kiểu cho trang web',
    subject: 'Web',
    chapter: 'CSS',
    difficulty: 'Trung bình',
  },
];

// Danh sách các môn học, chương, độ khó
const subjects = [
  'Tất cả',
  'Lập trình',
  'Web',
  'Cơ sở dữ liệu',
  'Mạng máy tính',
];
const chapters = [
  'Tất cả',
  'Cơ bản',
  'Ngôn ngữ lập trình',
  'CSS',
  'JavaScript',
  'React',
  'SQL',
];
const difficultyLevels = ['Tất cả', 'Dễ', 'Trung bình', 'Khó'];

const QuestionManagement = () => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Tất cả');
  const [selectedChapter, setSelectedChapter] = useState('Tất cả');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Tất cả');

  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Form state cho việc thêm/sửa câu hỏi
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    subject: '',
    chapter: '',
    difficulty: 'Dễ',
  });

  // Xử lý tìm kiếm và lọc
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSubject =
      selectedSubject === 'Tất cả' || q.subject === selectedSubject;
    const matchesChapter =
      selectedChapter === 'Tất cả' || q.chapter === selectedChapter;
    const matchesDifficulty =
      selectedDifficulty === 'Tất cả' || q.difficulty === selectedDifficulty;

    return (
      matchesSearch && matchesSubject && matchesChapter && matchesDifficulty
    );
  });

  // Xử lý thêm câu hỏi mới
  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      subject: subjects[1],
      chapter: chapters[1],
      difficulty: 'Dễ',
    });
    setShowModal(true);
  };

  // Xử lý sửa câu hỏi
  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      subject: question.subject,
      chapter: question.chapter,
      difficulty: question.difficulty,
    });
    setShowModal(true);
  };

  // Xử lý xóa câu hỏi
  const handleDeleteQuestion = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  // Xử lý thay đổi form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Xử lý thay đổi lựa chọn
  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions,
    });
  };

  // Xử lý lưu câu hỏi
  const handleSaveQuestion = () => {
    if (
      formData.question.trim() === '' ||
      formData.options.some((opt) => opt.trim() === '') ||
      formData.correctAnswer.trim() === ''
    ) {
      alert('Vui lòng điền đầy đủ thông tin cho câu hỏi!');
      return;
    }

    if (!formData.options.includes(formData.correctAnswer)) {
      alert('Đáp án đúng phải là một trong các lựa chọn!');
      return;
    }

    if (editingQuestion) {
      // Cập nhật câu hỏi hiện có
      setQuestions(
        questions.map((q) =>
          q.id === editingQuestion.id ? { ...q, ...formData } : q
        )
      );
    } else {
      // Thêm câu hỏi mới
      const newQuestion = {
        id:
          questions.length > 0
            ? Math.max(...questions.map((q) => q.id)) + 1
            : 1,
        ...formData,
      };
      setQuestions([...questions, newQuestion]);
    }

    setShowModal(false);
  };

  // Xử lý import file
  const handleWordFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;

      // Sử dụng mammoth để chuyển đổi docx sang HTML
      mammoth
        .convertToHtml({ arrayBuffer })
        .then((result) => {
          const html = result.value;

          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const paragraphs = doc.querySelectorAll('p');

          const questionsData = [];
          let currentQuestion = null;

          for (let i = 0; i < paragraphs.length; i++) {
            const text = paragraphs[i].textContent.trim();

            if (text.startsWith('Câu hỏi:')) {

              if (currentQuestion && currentQuestion.question) {
                questionsData.push(currentQuestion);
              }

              currentQuestion = {
                question: text.replace('Câu hỏi:', '').trim(),
                options: [],
                correctAnswer: '',
                subject: 'Lập trình', // Mặc định
                chapter: 'Cơ bản', // Mặc định
                difficulty: 'Dễ', // Mặc định
              };
            } else if (text.match(/^[A-D]\.\s/) && currentQuestion) {

              const option = text.replace(/^[A-D]\.\s/, '').trim();
              currentQuestion.options.push(option);
            } else if (text.startsWith('Đáp án:') && currentQuestion) {

              const answer = text.replace('Đáp án:', '').trim();

              if (answer.match(/^[A-D]$/)) {
                const index = answer.charCodeAt(0) - 65; 
                if (currentQuestion.options[index]) {
                  currentQuestion.correctAnswer =
                    currentQuestion.options[index];
                }
              }
            } else if (text.startsWith('Môn học:') && currentQuestion) {
              currentQuestion.subject = text.replace('Môn học:', '').trim();
            } else if (text.startsWith('Chương:') && currentQuestion) {
              currentQuestion.chapter = text.replace('Chương:', '').trim();
            } else if (text.startsWith('Độ khó:') && currentQuestion) {
              currentQuestion.difficulty = text.replace('Độ khó:', '').trim();
            }
          }


          if (currentQuestion && currentQuestion.question) {
            questionsData.push(currentQuestion);
          }


          if (questionsData.length > 0) {
            const maxId =
              questions.length > 0
                ? Math.max(...questions.map((q) => q.id))
                : 0;
            const newQuestions = questionsData.map((q, index) => ({
              ...q,
              id: maxId + index + 1,
            }));

            setQuestions([...questions, ...newQuestions]);
            alert(
              `Đã nhập thành công ${newQuestions.length} câu hỏi từ file Word!`
            );
          } else {
            alert(
              'Không tìm thấy câu hỏi nào trong file. Vui lòng kiểm tra định dạng!'
            );
          }
        })
        .catch((error) => {
          alert('Lỗi khi đọc file Word: ' + error.message);
        });
    };

    reader.readAsArrayBuffer(file);
    e.target.value = null; 
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Quản Lý Câu Hỏi Thi Trắc Nghiệm
      </h1>

      {/* Thanh công cụ */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
        {/* Tìm kiếm */}
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute right-3 top-2.5 text-gray-400"
            size={20}
          />
        </div>

        {/* Bộ lọc */}
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select
              className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-2.5 text-gray-500"
              size={16}
            />
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
            >
              {chapters.map((chapter) => (
                <option key={chapter} value={chapter}>
                  {chapter}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-2.5 text-gray-500"
              size={16}
            />
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              {difficultyLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-2.5 text-gray-500"
              size={16}
            />
          </div>
        </div>

        {/* Nút thêm và nhập */}
        <div className="flex gap-2">
          <button
            onClick={handleAddQuestion}
            className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={18} /> Thêm
          </button>

          <label className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
            <Upload size={18} /> Nhập File
            <input
              type="file"
              accept=".json,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                if (file.name.endsWith('.json')) {
                  handleFileImport(e);
                } else if (file.name.endsWith('.docx')) {
                  handleWordFileImport(e);
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Danh sách câu hỏi */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Câu hỏi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Môn học
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chương
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Độ khó
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q, index) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {q.question}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {q.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {q.chapter}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        q.difficulty === 'Dễ'
                          ? 'bg-green-100 text-green-800'
                          : q.difficulty === 'Trung bình'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditQuestion(q)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Không tìm thấy câu hỏi nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa câu hỏi */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Câu hỏi
              </label>
              <textarea
                name="question"
                rows="2"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.question}
                onChange={handleFormChange}
                placeholder="Nhập nội dung câu hỏi..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Các lựa chọn
              </label>
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center mb-2">
                  <span className="mr-2 font-medium">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <input
                    type="text"
                    className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Lựa chọn ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đáp án đúng
              </label>
              <select
                name="correctAnswer"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.correctAnswer}
                onChange={handleFormChange}
              >
                <option value="">-- Chọn đáp án đúng --</option>
                {formData.options.map(
                  (option, index) =>
                    option.trim() !== '' && (
                      <option key={index} value={option}>
                        {String.fromCharCode(65 + index)}. {option}
                      </option>
                    )
                )}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Môn học
                </label>
                <select
                  name="subject"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.subject}
                  onChange={handleFormChange}
                >
                  {subjects
                    .filter((s) => s !== 'Tất cả')
                    .map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chương
                </label>
                <select
                  name="chapter"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.chapter}
                  onChange={handleFormChange}
                >
                  {chapters
                    .filter((c) => c !== 'Tất cả')
                    .map((chapter) => (
                      <option key={chapter} value={chapter}>
                        {chapter}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Độ khó
                </label>
                <select
                  name="difficulty"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.difficulty}
                  onChange={handleFormChange}
                >
                  {difficultyLevels
                    .filter((d) => d !== 'Tất cả')
                    .map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveQuestion}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionManagement;
