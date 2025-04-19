import React, { useState, useEffect } from 'react';
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Upload,
  ChevronDown,
} from 'lucide-react';
import axios from "../../axiosConfig";

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [tableFilteredChapters, setTableFilteredChapters] = useState([]);
  const [formFilteredChapters, setFormFilteredChapters] = useState([]);
  const [difficultyLevels] = useState([
    { id: 1, name: 'Dễ', value: 'easy' },
    { id: 2, name: 'Trung bình', value: 'medium' },
    { id: 3, name: 'Khó', value: 'hard' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    subject: '',
    chapter: '',
    difficulty: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      await fetchSubjects();
      await fetchChapters();
      await fetchQuestions(1); // Tải trang đầu tiên
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchQuestions(currentPage); // Tải lại khi currentPage thay đổi
  }, [currentPage]);

  useEffect(() => {
    const fetchChaptersBySubject = async () => {
      if (selectedSubject) {
        const subject = subjects.find((s) => s.name === selectedSubject);
        if (subject) {
          try {
            let allChapters = [];
            let page = 1;
            let totalPages = 1;

            while (page <= totalPages) {
              const response = await axios.get(
                `/chapter?subjectId=${subject.id}&page=${page}&limit=10`
              );
              const chapterData = response.data.items || response.data || [];
              totalPages = response.data.totalPages || 1;
              allChapters = [...allChapters, ...chapterData];
              page++;
            }

            setTableFilteredChapters(allChapters);
            setSelectedChapter('');
          } catch (error) {
            console.error('Lỗi khi lấy chương cho bảng:', error);
            setTableFilteredChapters([]);
          }
        } else {
          setTableFilteredChapters(chapters);
        }
      } else {
        setTableFilteredChapters(chapters);
      }
    };

    fetchChaptersBySubject();
  }, [selectedSubject, subjects, chapters]);

  useEffect(() => {
    const fetchChaptersBySubject = async () => {
      if (formData.subject) {
        const subject = subjects.find((s) => s.name === formData.subject);
        if (subject) {
          try {
            let allChapters = [];
            let page = 1;
            let totalPages = 1;

            while (page <= totalPages) {
              const response = await axios.get(
                `/chapter?subjectId=${subject.id}&page=${page}&limit=10`
              );
              const chapterData = response.data.items || response.data || [];
              totalPages = response.data.totalPages || 1;
              allChapters = [...allChapters, ...chapterData];
              page++;
            }

            setFormFilteredChapters(allChapters);
            if (!allChapters.some((chapter) => chapter.name === formData.chapter)) {
              setFormData((prev) => ({
                ...prev,
                chapter: allChapters.length > 0 ? allChapters[0].name : '',
              }));
            }
          } catch (error) {
            console.error('Lỗi khi lấy chương cho form:', error);
            setFormFilteredChapters([]);
            setFormData((prev) => ({ ...prev, chapter: '' }));
          }
        } else {
          setFormFilteredChapters([]);
          setFormData((prev) => ({ ...prev, chapter: '' }));
        }
      } else {
        setFormFilteredChapters(chapters);
        setFormData((prev) => ({
          ...prev,
          chapter: chapters.length > 0 ? chapters[0].name : '',
        }));
      }
    };

    fetchChaptersBySubject();
  }, [formData.subject, subjects, chapters]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/subject');
      const subjectData = response.data.items || response.data || [];
      setSubjects(subjectData);
      if (subjectData.length > 0 && !formData.subject) {
        setFormData((prev) => ({
          ...prev,
          subject: subjectData[0].name,
        }));
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách môn học:', error);
      alert('Không thể tải danh sách môn học.');
      setSubjects([]);
    }
  };

  const fetchChapters = async () => {
    try {
      let allChapters = [];
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        const response = await axios.get(`/chapter?page=${page}&limit=10`);
        const chapterData = response.data.items || response.data || [];
        totalPages = response.data.totalPages || 1;
        allChapters = [...allChapters, ...chapterData];
        page++;
      }

      setChapters(allChapters);
      setTableFilteredChapters(allChapters);
      setFormFilteredChapters(allChapters);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách chương:', error);
      alert('Không thể tải danh sách chương.');
      setChapters([]);
    }
  };

  const fetchQuestions = async (page = 1, limit = questionsPerPage) => {
    try {
      const response = await axios.get('/question?limit=1000&page=1');

      // const response = await axios.get(`/question?page=${page}&limit=${limit}`);
      const questionData = response.data.items || response.data || [];
      const totalItems = response.data.totalItems || questionData.length;
      setQuestions(questionData);
      setTotalItems(totalItems);
      setTotalPages(Math.ceil(totalItems / limit));
      console.log('Trang hiện tại:', page);
      console.log('Danh sách câu hỏi:', questionData);
      console.log('Số lượng câu hỏi:', questionData.length);
      console.log('Tổng số câu hỏi:', totalItems);
      console.log('Tổng số trang:', Math.ceil(totalItems / limit));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách câu hỏi:', error);
      alert('Không thể tải danh sách câu hỏi.');
      setQuestions([]);
      setTotalPages(1);
      setTotalItems(0);
    }
  };

  const mapDifficultyToVietnamese = (difficulty) => {
    const level = difficultyLevels.find((level) => level.value === difficulty);
    return level ? level.name : difficulty;
  };

  const mapDifficultyToEnglish = (difficulty) => {
    const level = difficultyLevels.find((level) => level.name === difficulty);
    return level ? level.value : difficulty;
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.content
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSubject =
      !selectedSubject || q.subject_name === selectedSubject;
    const matchesChapter =
      !selectedChapter || q.chapter_name === selectedChapter;
    const matchesDifficulty =
      !selectedDifficulty || q.difficulty_level === mapDifficultyToEnglish(selectedDifficulty);

    return matchesSearch && matchesSubject && matchesChapter && matchesDifficulty;
  });

  useEffect(() => {
    console.log('Số lượng câu hỏi sau lọc:', filteredQuestions.length);
    const newTotalPages = Math.ceil(totalItems / questionsPerPage);
    setTotalPages(newTotalPages);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages); // Điều chỉnh currentPage nếu vượt quá
    }
  }, [searchTerm, selectedSubject, selectedChapter, selectedDifficulty, totalItems]);

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    const subject = subjects.find((s) => s.name === question.subject_name);
    const fetchChaptersForEdit = async () => {
      if (subject) {
        try {
          let allChapters = [];
          let page = 1;
          let totalPages = 1;

          while (page <= totalPages) {
            const response = await axios.get(
              `/chapter?subjectId=${subject.id}&page=${page}&limit=10`
            );
            const chapterData = response.data.items || response.data || [];
            totalPages = response.data.totalPages || 1;
            allChapters = [...allChapters, ...chapterData];
            page++;
          }

          setFormFilteredChapters(allChapters);
          setFormData({
            question: question.content,
            options: Array.isArray(question.answers)
              ? question.answers.map((ans) => ans.content)
              : ['', '', '', ''],
            correctAnswer: Array.isArray(question.answers)
              ? question.answers.find((ans) => ans.is_correct)?.content || ''
              : '',
            subject: question.subject_name,
            chapter: question.chapter_name || allChapters[0]?.name || '',
            difficulty: mapDifficultyToVietnamese(question.difficulty_level),
          });
        } catch (error) {
          console.error('Lỗi khi lấy chương khi chỉnh sửa:', error);
          setFormFilteredChapters([]);
          setFormData({
            question: question.content,
            options: Array.isArray(question.answers)
              ? question.answers.map((ans) => ans.content)
              : ['', '', '', ''],
            correctAnswer: Array.isArray(question.answers)
              ? question.answers.find((ans) => ans.is_correct)?.content || ''
              : '',
            subject: question.subject_name,
            chapter: '',
            difficulty: mapDifficultyToVietnamese(question.difficulty_level),
          });
        }
      } else {
        setFormFilteredChapters(chapters);
        setFormData({
          question: question.content,
          options: Array.isArray(question.answers)
            ? question.answers.map((ans) => ans.content)
            : ['', '', '', ''],
          correctAnswer: Array.isArray(question.answers)
            ? question.answers.find((ans) => ans.is_correct)?.content || ''
            : '',
          subject: question.subject_name,
          chapter: chapters[0]?.name || '',
          difficulty: mapDifficultyToVietnamese(question.difficulty_level),
        });
      }
    };

    fetchChaptersForEdit();
    setShowModal(true);
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      try {
        await axios.delete(`/question/${id}`);
        fetchQuestions(currentPage);
      } catch (error) {
        console.error('Lỗi khi xóa câu hỏi:', error);
        alert('Xóa câu hỏi thất bại.');
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions,
    });
  };

  const handleSaveQuestion = async () => {
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

    const subject = subjects.find((s) => s.name === formData.subject);
    const chapter = formFilteredChapters.find((c) => c.name === formData.chapter);
    if (!subject || !chapter) {
      alert('Vui lòng chọn môn học và chương hợp lệ.');
      return;
    }

    const apiQuestion = {
      chapterId: chapter.id,
      content: String(formData.question),
      difficulty_level: mapDifficultyToEnglish(formData.difficulty),
      answers: formData.options.map((option) => ({
        content: String(option),
        is_correct: option === formData.correctAnswer,
      })),
    };

    try {
      if (editingQuestion) {
        await axios.put(`/question/${editingQuestion.id}`, apiQuestion);
      } else {
        await axios.post('/question', apiQuestion);
      }
      setShowModal(false);
      fetchQuestions(currentPage);
    } catch (error) {
      console.error('Lỗi khi lưu câu hỏi:', error);
      alert('Lưu câu hỏi thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Quản Lý Câu Hỏi Thi Trắc Nghiệm
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {Search && <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />}
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select
              className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Tất cả môn học</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
            {ChevronDown && <ChevronDown className="absolute right-2 top-2.5 text-gray-500" size={16} />}
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
            >
              <option value="">Tất cả chương</option>
              {tableFilteredChapters.map((chapter) => (
                <option key={chapter.id} value={chapter.name}>
                  {chapter.name}
                </option>
              ))}
            </select>
            {ChevronDown && <ChevronDown className="absolute right-2 top-2.5 text-gray-500" size={16} />}
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="">Tất cả độ khó</option>
              {difficultyLevels.map((level) => (
                <option key={level.id} value={level.name}>
                  {level.name}
                </option>
              ))}
            </select>
            {ChevronDown && <ChevronDown className="absolute right-2 top-2.5 text-gray-500" size={16} />}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingQuestion(null);
              setFormData({
                question: '',
                options: ['', '', '', ''],
                correctAnswer: '',
                subject: subjects[0]?.name || '',
                chapter: formFilteredChapters[0]?.name || '',
                difficulty: difficultyLevels[0]?.name || '',
              });
              setShowModal(true);
            }}
            className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {Plus && <Plus size={18} />} Thêm
          </button>

          <label className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
            {Upload && <Upload size={18} />} Nhập File
            <input
              type="file"
              accept=".docx"
              className="hidden"
            />
          </label>
        </div>
      </div>

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
            {currentQuestions.length > 0 ? (
              currentQuestions.map((q, index) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(currentPage - 1) * questionsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {q.content}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {q.subject_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {q.chapter_name || 'Chưa xác định'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        mapDifficultyToVietnamese(q.difficulty_level) === 'Dễ'
                          ? 'bg-green-100 text-green-800'
                          : mapDifficultyToVietnamese(q.difficulty_level) === 'Trung bình'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {mapDifficultyToVietnamese(q.difficulty_level)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditQuestion(q)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      {Edit && <Edit size={18} />}
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      {Trash2 && <Trash2 size={18} />}
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

      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Hiển thị {(currentPage - 1) * questionsPerPage + 1} -{' '}
          {Math.min(currentPage * questionsPerPage, totalItems)} trong số{' '}
          {totalItems} câu hỏi
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            Trước
          </button>
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => {
                if (typeof page === 'number') {
                  console.log('Chuyển đến trang:', page);
                  setCurrentPage(page);
                }
              }}
              disabled={page === '...' || page === currentPage}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                page === currentPage
                  ? 'bg-blue-500 text-white'
                  : page === '...'
                  ? 'bg-white text-gray-500 cursor-default'
                  : 'bg-white text-gray-700 hover:bg-blue-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            Sau
          </button>
        </div>
      </div>

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
                  <option value="">Chọn môn học</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
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
                  <option value="">Chọn chương</option>
                  {formFilteredChapters.length > 0 ? (
                    formFilteredChapters.map((chapter) => (
                      <option key={chapter.id} value={chapter.name}>
                        {chapter.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Không có chương nào
                    </option>
                  )}
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
                  <option value="">Chọn độ khó</option>
                  {difficultyLevels.map((level) => (
                    <option key={level.id} value={level.name}>
                      {level.name}
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