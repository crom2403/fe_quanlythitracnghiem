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
import mammoth from 'mammoth';

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [filteredChapters, setFilteredChapters] = useState([]);
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
      await fetchChapters(); // Đảm bảo fetchChapters hoàn thành trước
      await fetchQuestions(); // Sau đó mới gọi fetchQuestions
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      const subject = subjects.find((s) => s.name === selectedSubject);
      if (subject) {
        const filtered = chapters.filter((chapter) => chapter.subject_id === subject.id);
        setFilteredChapters(filtered);
        setSelectedChapter('');
      }
    } else {
      setFilteredChapters(chapters);
    }
  }, [selectedSubject, chapters]);

  useEffect(() => {
    if (formData.subject) {
      fetchChaptersBySubject();
    }
  }, [formData.subject]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/subject');
      const subjectData = response.data.items || [];
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

      // Lặp qua tất cả các trang để lấy toàn bộ chương
      while (page <= totalPages) {
        const response = await axios.get(`/chapter?page=${page}&limit=10`);
        const chapterData = response.data.items || [];
        totalPages = response.data.totalPages || 1;
        allChapters = [...allChapters, ...chapterData];
        page++;
      }

      setChapters(allChapters);
      setFilteredChapters(allChapters);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách chương:', error);
      alert('Không thể tải danh sách chương.');
      setChapters([]);
    }
  };

  const fetchChaptersBySubject = async () => {
    if (!formData.subject) return;
    const subject = subjects.find((s) => s.name === formData.subject);
    if (!subject) return;

    try {
      let allChapters = [];
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        const response = await axios.get(`/chapter?subjectId=${subject.id}&page=${page}&limit=10`);
        const chapterData = response.data.items || [];
        totalPages = response.data.totalPages || 1;
        allChapters = [...allChapters, ...chapterData];
        page++;
      }

      setFilteredChapters(allChapters);
      if (allChapters.length > 0) {
        setFormData((prev) => ({
          ...prev,
          chapter: allChapters[0].name,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          chapter: '',
        }));
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách chương theo môn học:', error);
      alert('Không thể tải danh sách chương theo môn học.');
      setFilteredChapters([]);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/question');
      const questionData = response.data.items || [];
      // Ánh xạ chapter_name từ chapter_id
      const updatedQuestions = questionData.map((q) => {
        const chapter = chapters.find((c) => c.id === q.chapter_id);
        return {
          ...q,
          chapter_name: chapter ? chapter.name : 'Chưa xác định',
        };
      });
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách câu hỏi:', error);
      alert('Không thể tải danh sách câu hỏi.');
      setQuestions([]);
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

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      subject: subjects[0]?.name || '',
      chapter: filteredChapters[0]?.name || chapters[0]?.name || '',
      difficulty: difficultyLevels[0]?.name || '',
    });
    setShowModal(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setFormData({
      question: question.content,
      options: Array.isArray(question.answers) ? question.answers.map((ans) => ans.content) : ['', '', '', ''],
      correctAnswer: Array.isArray(question.answers) ? question.answers.find((ans) => ans.is_correct)?.content || '' : '',
      subject: question.subject_name,
      chapter: question.chapter_name || filteredChapters[0]?.name || chapters[0]?.name || '',
      difficulty: mapDifficultyToVietnamese(question.difficulty_level),
    });
    setShowModal(true);
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      try {
        await axios.delete(`/question/${id}`);
        fetchQuestions();
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
    const chapter = filteredChapters.find((c) => c.name === formData.chapter);
    if (!subject || !chapter) {
      alert('Vui lòng chọn môn học và chương hợp lệ.');
      return;
    }

    const apiQuestion = {
      chapter_id: chapter.id,
      content: formData.question,
      difficulty_level: mapDifficultyToEnglish(formData.difficulty),
      answers: formData.options.map((option) => ({
        content: option,
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
      fetchQuestions();
    } catch (error) {
      console.error('Lỗi khi lưu câu hỏi:', error);
      alert('Lưu câu hỏi thất bại.');
    }
  };

  const handleWordFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;

      try {
        const result = await mammoth.convertToHtml({ arrayBuffer });
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
              subject: subjects[0]?.name || '',
              chapter: chapters[0]?.name || '',
              difficulty: difficultyLevels[0]?.name || '',
            };
          } else if (text.match(/^[A-D]\.\s/) && currentQuestion) {
            const option = text.replace(/^[A-D]\.\s/, '').trim();
            currentQuestion.options.push(option);
          } else if (text.startsWith('Đáp án:') && currentQuestion) {
            const answer = text.replace('Đáp án:', '').trim();
            if (answer.match(/^[A-D]$/)) {
              const index = answer.charCodeAt(0) - 65;
              if (currentQuestion.options[index]) {
                currentQuestion.correctAnswer = currentQuestion.options[index];
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
          for (const question of questionsData) {
            const subject = subjects.find((s) => s.name === question.subject);
            const chapter = chapters.find((c) => c.name === question.chapter && c.subject_id === subject?.id);
            if (!subject || !chapter) {
              console.warn(`Không tìm thấy môn học hoặc chương cho ${question.subject} - ${question.chapter}`);
              continue;
            }

            const apiQuestion = {
              chapter_id: chapter.id,
              content: question.question,
              difficulty_level: mapDifficultyToEnglish(question.difficulty),
              answers: question.options.map((option) => ({
                content: option,
                is_correct: option === question.correctAnswer,
              })),
            };

            try {
              await axios.post('/question', apiQuestion);
            } catch (error) {
              console.error('Lỗi khi nhập câu hỏi từ file:', error);
            }
          }

          fetchQuestions();
          alert(`Đã nhập thành công ${questionsData.length} câu hỏi từ file Word!`);
        } else {
          alert('Không tìm thấy câu hỏi nào trong file. Vui lòng kiểm tra định dạng!');
        }
      } catch (error) {
        alert('Lỗi khi đọc file Word: ' + error.message);
      }
    };

    reader.readAsArrayBuffer(file);
    e.target.value = null;
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
          <Search
            className="absolute right-3 top-2.5 text-gray-400"
            size={20}
          />
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
              <option value="">Tất cả chương</option>
              {filteredChapters.map((chapter) => (
                <option key={chapter.id} value={chapter.name}>
                  {chapter.name}
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
              <option value="">Tất cả độ khó</option>
              {difficultyLevels.map((level) => (
                <option key={level.id} value={level.name}>
                  {level.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-2.5 text-gray-500"
              size={16}
            />
          </div>
        </div>

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
              accept=".docx"
              className="hidden"
              onChange={handleWordFileImport}
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
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q, index) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
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
                  {filteredChapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.name}>
                      {chapter.name}
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