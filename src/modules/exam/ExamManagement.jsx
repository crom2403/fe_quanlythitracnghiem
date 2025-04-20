
import React, { useState, useEffect } from 'react';
import { Search, BookOpen, HelpCircle, Clock, Plus, Eye, Edit, Trash2, Calendar, Users, AlertCircle, CheckCircle, BarChart2, ArrowLeft } from 'lucide-react';
import axios from "../../axiosConfig";

const ExamManagement = () => {

const [selectedExamAttemptId, setSelectedExamAttemptId] = useState(null);
  const [exams, setExams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('list');
  const [selectedExam, setSelectedExam] = useState(null);
  const [examPerTest, setExamPerTest] = useState([]); 
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [listStudyGroups, setListStudyGroups] = useState([]);
  const [selectStudyGroup, setSelectStudyGroup] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelSelect, setLevelSelect] = useState(""); 
  const [chapterSelect, setChapterSelect] = useState(""); 
  const [listChapters, setListChapters] = useState([]); 
  const [answerPerExam, setAnswerPerExam] = useState([]); 

  const [answers, setAnswers] = useState([]); 
const [selectedAnswers, setSelectedAnswers] = useState([]); 
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState(() => {
    
    const saved = localStorage.getItem('selectedQuestions');
    return saved ? JSON.parse(saved) : [];
  }); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [limit] = useState(10); 

  const difficultyLabels = [
    {
      value: "easy",
      label: "Dễ"
    },
    {
      value: "medium",
      label: "Trung bình"
    },
    {
      value: "hard",
      label: "Khó"
    }
  ];
  
  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800"
  };
  
  const [error, setError] = useState({
    date: '',
    duration: ''
  });
  
  const [newExam, setNewExam] = useState({
    title: '',
    course: '',
    group: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    duration: '',
    easyQuestions: '',
    mediumQuestions: '',
    hardQuestions: '',
    questions: []
  });
  
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctOption: 0
  });
  
  const [listStudyGroupSelect, setListStudyGroupSelect] = useState([]);

  
  useEffect(() => {
    localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestions));
  }, [selectedQuestions]);

 
  const countQuestionsByDifficulty = (difficulty) => {
    return selectedQuestions.filter(q => q.difficulty === difficulty).length;
  };

  
  useEffect(() => {
    console.log('levelSelect thay đổi:', levelSelect);
  }, [levelSelect]);

 
  useEffect(() => {
    const fetchStudyGroups = async () => {
      try {
        const response = await axios.get(`https://inevitable-justinn-tsondev-41d66d2f.koyeb.app/api/v1/study-group/teacher`);
        setListStudyGroups(response.data);
      } catch (error) {
        console.error('Error fetching study groups:', error);
      }
    };
    fetchStudyGroups();
  }, []);

  
  useEffect(() => {
    if (view !== 'add-question' || !listStudyGroups[selectStudyGroup]) return;

    const fetchChapters = async () => {
      try {
        const response = await axios.get(`https://inevitable-justinn-tsondev-41d66d2f.koyeb.app/api/v1/chapter?subjectId=${listStudyGroups[selectStudyGroup].subject_id}`);
        setListChapters(response.data);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    };
    fetchChapters();
  }, [view, selectStudyGroup, listStudyGroups]);
   
    useEffect(() => {
      const fetchExamsPerTest = async (examId) => {
        setLoading(true);
        try {
          const response = await axios.get(`https://inevitable-justinn-tsondev-41d66d2f.koyeb.app/api/v1/exam-attempt/get-all-exam-attempt-of-exam/${examId}`);
          const examAttempts = response.data;
    
          if (!examAttempts || examAttempts.length === 0) {
            console.warn("Không có bài thi nào được trả về từ API.");
            return;
          }
    
          const mappedExams = await Promise.all(
            examAttempts.map(async (exam) => {
              let questions = [];
              let answers = [];
              let selectedAnswers = [];
              try {
                const detailRes = await axios.get(`https://inevitable-justinn-tsondev-41d66d2f.koyeb.app/api/v1/exam-attempt/get-detail-of-exam-attempt/${exam.id}`);
                const detailData = detailRes.data;
    
                console.log("👉 Dữ liệu chi tiết trả về từ API:", detailData);
    
                const selectedMap = new Map();
                detailData.listAnswerStudentSelected.forEach(ans => {
                  if (!selectedMap.has(ans.question_id)) selectedMap.set(ans.question_id, []);
                  selectedMap.get(ans.question_id).push(ans.answer_id);
                });
    
                questions = detailData.listQuestion.map(q => ({
                  id: q.question_id,
                  content: q.question_content,
                  order: q.order_index,
                  answers: q.list_anwers.map(ans => ({
                    id: ans.id,
                    content: ans.content,
                    isCorrect: ans.is_correct,
                    isSelected: selectedMap.get(q.question_id)?.includes(ans.id) || false
                  }))
                }));
    
              
                answers = detailData.listQuestion.flatMap(q => q.list_anwers);
                selectedAnswers = detailData.listAnswerStudentSelected.map(ans => ans.answer_id);
    
                console.log("👉 Questions sau khi ánh xạ:", questions);
              } catch (error) {
                console.warn(`Không thể lấy chi tiết examAttemptID ${exam.id}`, error);
              }
    
              return {
                id: exam.id,
                exam_id: exam.exam_id,
                title: exam.name,
                course: exam.group_student_name,
                group: '',
                switch: exam.tab_switch_count,
                test_time: exam.test_time,
                startDate: exam.start_time,
                endDate: exam.end_time,
                status: 'closed',
                user: exam.user ? {
                  id_stu: exam.user.id,
                  student_code: exam.user.student_code,
                  email: exam.user.email,
                  fullname: exam.user.fullname
                } : null,
                completedDate: exam.completed_date || "Chưa nộp",
                score: exam.score || 0,
                questions: questions,
                answers: answers,
                selectedAnswers: selectedAnswers
              };
            })
          );
    
          setExamPerTest(mappedExams);
    
          const allAnswers = mappedExams.flatMap(exam => exam.answers || []);
          const allSelectedAnswers = mappedExams.flatMap(exam => exam.selectedAnswers || []);
          setAnswers(allAnswers);
          setSelectedAnswers(allSelectedAnswers);
    
        } catch (error) {
          setErrorMessage('Không thể tải danh sách đề thi. Vui lòng thử lại sau.');
          console.error('Error fetching exams:', error);
        } finally {
          setLoading(false);
        }
      };
    
      if (selectedExam?.id) {
        fetchExamsPerTest(selectedExam.id);
      }
    }, [selectedExam]);
    


    useEffect(() => {
      if (examPerTest && examPerTest.length > 0) {
        console.log("Danh sách đề thi đã load:", examPerTest);
        console.log(examPerTest.questions);
      }
    }, [examPerTest]);

const handleViewDetail = (examId) => {
  console.log("👉 ID đề thi đang click:", examId);
  console.log("👉 Danh sách bài làm (examPerTest):", examPerTest);


  if (!examId) {
    console.error("Lỗi: ID đề thi không hợp lệ:", examId);
    return;
  }


  if (!examPerTest || examPerTest.length === 0) {
    console.error("Lỗi: Danh sách bài làm rỗng hoặc chưa được tải:", examPerTest);
    return;
  }

 
  const exam = examPerTest.find((exam) => exam.id === examId);

  console.log("👉 Kết quả tìm kiếm đề thi:", exam);

  if (exam) {
    
    const questions = exam.questions || [];
    console.log("👉 Danh sách câu hỏi của đề thi:", questions);

  
    setSelectedQuestions(questions);
    setView("studentDetail");
  } else {
    console.warn("Không tìm thấy đề thi này trong danh sách.");
  }
};

    useEffect(() => {
      const fetchExams = async () => {
        setLoading(true);
        try {
          const response = await axios.get('https://inevitable-justinn-tsondev-41d66d2f.koyeb.app/api/v1/exam/get-all-by-teacher');
          const mappedExams = response.data.map(exam => ({
            id: exam.id,
            title: exam.name,
            course: exam.group_student_name,
            group: '',
            startDate: exam.start_time,
            endDate: exam.end_time,
            status: 'closed',
            students: {
              total: 0,
              completed: 0,
              notStarted: 0,
              averageScore: 0
            },
            questions: []
          }));
          setExams(mappedExams);
        } catch (error) {
          setErrorMessage('Không thể tải danh sách đề thi. Vui lòng thử lại sau.');
          console.error('Error fetching exams:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchExams();
    }, []);
    
   
 
  useEffect(() => {
    if (view !== 'add-question') return;

    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://inevitable-justinn-tsondev-41d66d2f.koyeb.app/api/v1/question?difficulty_level=${levelSelect}&chapterId=${chapterSelect}&subjectId=${listStudyGroups[selectStudyGroup].subject_id}&limit=${limit}&page=${currentPage}`
        );
        
        const { items, total, page, totalPages } = response.data;

      
        const mappedQuestions = items.map(item => ({
          id: item.id,
          text: item.content,
          difficulty: item.difficulty_level,
          checked: selectedQuestions.some(q => q.id === item.id) 
        }));

        setQuestions(mappedQuestions);
        setTotalPages(totalPages);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setErrorMessage('Không thể tải danh sách câu hỏi. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [view, currentPage, levelSelect, chapterSelect, listStudyGroups, selectStudyGroup, limit]);

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCreateExam = () => {
    setView('create');
    setNewExam({
      title: '',
      course: '',
      group: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      duration: '',
      easyQuestions: '',
      mediumQuestions: '',
      hardQuestions: '',
      questions: []
    });
  };

  useEffect(() => {
    const { startDate, endDate } = newExam;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end <= start) {
        setError(prev => ({ ...prev, date: "Thời gian kết thúc phải sau thời gian bắt đầu." }));
      } else {
        setError(prev => ({ ...prev, date: "" }));
      }
    }
  }, [newExam.startDate, newExam.endDate]);

  const handleExamSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d+$/.test(newExam.duration) || parseInt(newExam.duration) <= 0) {
      setError(prev => ({
        ...prev,
        duration: 'Vui lòng nhập số nguyên dương'
      }));
      return;
    }

    const examData = {
      name: newExam.title,
      start_time: newExam.startDate.toString(),
      end_time: newExam.endDate.toString(),
      duration_minutes: parseInt(newExam.duration),
      is_shuffled_question: false,
      is_shuffled_answer: false,
      allow_review: true,
      allow_review_point: false,
      listIdStudyGroups: listStudyGroupSelect,
      exam_type: "manual",
      listExamConfigs: [
        { difficulty_level: "easy", question_count: parseInt(newExam.easyQuestions) || 0 },
        { difficulty_level: "medium", question_count: parseInt(newExam.mediumQuestions) || 0 },
        { difficulty_level: "hard", question_count: parseInt(newExam.hardQuestions) || 0 }
      ]
    };

    try {
      const response = await axios.post('/exam/create-manual', examData);
      setSelectedExam({ id: response.data.id }); 
      setView('add-question');
    } catch (error) {
      console.error('Error creating exam:', error);
      setError(prev => ({
        ...prev,
        duration: 'Không thể tạo đề thi. Vui lòng thử lại.'
      }));
    }
  };

  const handleAddQuestion = () => {
    setNewExam({
      ...newExam,
      questions: [...newExam.questions, { ...newQuestion }]
    });
    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctOption: 0
    });
  };

  const handleDeleteExam = (id) => {
    setExams(exams.filter(exam => exam.id !== id));
  };

  const handleViewExamDetails = (exam) => {
    setSelectedExam(exam);
    setView('detail');
  };

  const handleViewStudentExam = (student) => {
    setSelectedStudent(student);
    setView('studentDetail');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedExam(null);
    setSelectedStudent(null);
  };

  const handleBackToDetail = () => {
    setView('detail');
    setSelectedStudent(null);
  };

  
  const handleQuestionToggle = (question) => {
    if (selectedQuestions.some(q => q.id === question.id)) {
      
      const updated = selectedQuestions.filter(q => q.id !== question.id);
      setSelectedQuestions(updated);
    } else {
      
      setSelectedQuestions([...selectedQuestions, { ...question, checked: true }]);
    }

    
    const updatedQuestions = questions.map(q =>
      q.id === question.id ? { ...q, checked: !q.checked } : q
    );
    setQuestions(updatedQuestions);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {view === 'list' && (
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <div className="relative">
                <button className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md">
                  Tất cả
                </button>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-blue-800">▼</span>
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm đề thi..."
                  className="border rounded-md px-4 py-2 w-96"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <button
              onClick={handleCreateExam}
              className="bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>TẠO ĐỀ THI</span>
            </button>
          </div>

          {loading && <p className="text-gray-600">Đang tải...</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {!loading && !errorMessage && (
            <div className="space-y-4">
              {filteredExams.map((exam) => (
                <div key={exam.id} className="bg-white rounded-md shadow p-4 border-l-4 border-gray-300">
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold">{exam.title}</h2>
                    {exam.group && (
                      <div className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm mt-2 w-fit">
                        {exam.group}
                      </div>
                    )}
                    <div className="mt-2 text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>{exam.course}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Diễn ra từ {exam.startDate} đến {exam.endDate}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                     
                      <button
                        onClick={() => handleViewExamDetails(exam)}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-md flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Xem chi tiết</span>
                      </button>
                      <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md flex items-center space-x-1">
                        <Edit className="h-4 w-4" />
                        <span>Chỉnh sửa</span>
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md flex items-center space-x-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Xoá đề</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'create' && (
        <div className="max-w-4xl mx-auto bg-white rounded-md shadow p-6">
          <h2 className="text-xl font-semibold border-b pb-4 mb-6">Tạo mới đề thi</h2>

          <form onSubmit={handleExamSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Tên đề kiểm tra</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Nhập tên đề kiểm tra"
                  value={newExam.title}
                  onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Thời gian bắt đầu</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="datetime-local"
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Từ"
                    value={newExam.startDate}
                    onChange={(e) =>
                      setNewExam({ ...newExam, startDate: e.target.value })
                    }
                    required
                  />
                  <input
                    type="datetime-local"
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Đến"
                    value={newExam.endDate}
                    onChange={(e) =>
                      setNewExam({ ...newExam, endDate: e.target.value })
                    }
                    required
                  />
                </div>
                {error.date && (
                  <p className="text-red-500 text-sm mt-1 col-span-2">{error.date}</p>
                )}
              </div>

              <div className="flex items-center">
                <div className="flex-grow">
                  <label className="block mb-2 font-medium text-gray-700">Thời gian làm bài</label>
                  <div className="flex">
                    <input
                      type="text"
                      className={`flex-grow border rounded-l-md px-3 py-2 ${
                        error.duration ? 'border-red-500' : ''
                      }`}
                      placeholder="00"
                      value={newExam.duration}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
                          setNewExam({ ...newExam, duration: value });
                          setError(prev => ({ ...prev, duration: '' }));
                        } else {
                          setError(prev => ({
                            ...prev,
                            duration: 'Vui lòng nhập số nguyên dương'
                          }));
                        }
                      }}
                      required
                    />
                    <div className="border rounded-r-md px-3 py-2 bg-gray-100 text-center w-20">
                      phút
                    </div>
                  </div>
                  {error.duration && (
                    <p className="text-red-500 text-sm mt-1">{error.duration}</p>
                  )}
                </div>
                <div className="flex-grow"></div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Giao cho</label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={selectStudyGroup}
                  onChange={(e) => {
                    setListStudyGroupSelect([]);
                    setSelectStudyGroup(e.target.value);
                  }}
                >
                  <option value="">Chọn nhóm học phần giảng dạy...</option>
                  {listStudyGroups.map((group, index) => (
                    <option key={index} value={index}>{group.name}</option>
                  ))}
                </select>
                <div className="mt-4 h-32 flex p-4 border rounded-md bg-gray-50">
                  <div className="text-center text-gray-400">
                    {listStudyGroups[selectStudyGroup]?.studyGroups?.map((group, index) => (
                      <div key={index} className='flex items-center'>
                        <input
                          onClick={() => {
                            if (listStudyGroupSelect.includes(group.id)) {
                              setListStudyGroupSelect(listStudyGroupSelect.filter(id => id !== group.id));
                            } else {
                              setListStudyGroupSelect([...listStudyGroupSelect, group.id]);
                            }
                          }}
                          type="checkbox"
                          className="mr-2"
                        />
                        <p className='text-black'>{group.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Số câu dễ</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="0"
                    value={newExam.easyQuestions}
                    onChange={(e) => setNewExam({ ...newExam, easyQuestions: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Số câu trung bình</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="0"
                    value={newExam.mediumQuestions}
                    onChange={(e) => setNewExam({ ...newExam, mediumQuestions: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Số câu khó</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="0"
                    value={newExam.hardQuestions}
                    onChange={(e) => setNewExam({ ...newExam, hardQuestions: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-medium py-3 px-6 rounded-md"
                >
                  Tạo đề thi
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {view === 'detail' && selectedExam && (
        <div className="max-w-4xl mx-auto bg-white rounded-md shadow p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToList}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold">Chi tiết đề thi</h2>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold">{selectedExam.title}</h3>
            {selectedExam.group && (
              <div className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm mt-2">
                {selectedExam.group}
              </div>
            )}
            <p className="mt-2 text-gray-600">{selectedExam.course}</p>
            <p className="mt-1 text-gray-600 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Diễn ra từ {selectedExam.startDate} đến {selectedExam.endDate}</span>
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="text-blue-800 font-medium flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Tổng sinh viên
              </div>
              <div className="text-2xl font-bold mt-2">{selectedExam.students.total}</div>
            </div>

            <div className="bg-green-50 p-4 rounded-md">
              <div className="text-green-800 font-medium flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Đã làm bài
              </div>
              <div className="text-2xl font-bold mt-2">{selectedExam.students.completed}</div>
            </div>

            <div className="bg-amber-50 p-4 rounded-md">
              <div className="text-amber-800 font-medium flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Chưa làm bài
              </div>
              <div className="text-2xl font-bold mt-2">{selectedExam.students.notStarted}</div>
            </div>

            <div className="bg-purple-50 p-4 rounded-md">
              <div className="text-purple-800 font-medium flex items-center">
                <BarChart2 className="h-5 w-5 mr-2" />
                Điểm trung bình
              </div>
              <div className="text-2xl font-bold mt-2">{selectedExam.students.averageScore}</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Danh sách sinh viên đã làm bài</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">STT</th>
                    <th className="py-3 px-4 text-left">Họ tên</th>
                    <th className="py-3 px-4 text-left">Thời gian nộp</th>
                    <th className="py-3 px-4 text-left">Điểm số</th>
                    <th className="py-3 px-4 text-left">Lan chuyen tab</th>
                    <th className="py-3 px-4 text-left">Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                {examPerTest.map((student, index) => (
    <tr key={student.id_stu} className="border-t">
      <td className="py-3 px-4 text-center">{index + 1}</td> {/* STT */}
      <td className="py-3 px-4">{student.user?.fullname || "N/A"}</td> {/* Họ tên */}
      <td className="py-3 px-4">{student.score > 0 ? "Da nộp" : "chua nop"}</td> {/* Thời gian nộp */}
      <td className="py-3 px-4 text-center">{student.score || "0"}</td> {/* Điểm số */}
      <td className="py-3 px-4 text-center">{student.switch || "0"}</td> {/* Điểm số */}

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleViewDetail(student.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Xem chi tiết
                        </button>
                                        
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

{view === 'studentDetail' && (
  <div className="max-w-4xl mx-auto bg-white rounded-md shadow p-6">
    <div className="flex items-center mb-6">
      <button
        onClick={() => setView('list')}
        className="mr-4 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h2 className="text-2xl font-bold">Answer Result</h2>
    </div>

    <div className="space-y-6">
      {selectedQuestions.map((q, index) => (
        <div key={q.id} className="border rounded-md p-4">
          <div className="flex items-start">
            {/* Số thứ tự câu hỏi */}
            <div
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-3 flex items-center justify-center"
              style={{ minWidth: "50px", height: "50px" }}
            >
              <span className="text-lg font-bold">Câu {index + 1}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{q.content}</p>
              <div className="mt-2 ml-4 space-y-2">
                {q.answers.map((ans, ansIndex) => (
                  <div
                    key={ans.id}
                    className={`flex items-center ${
                      ans.isCorrect
                        ? "text-green-700"
                        : ans.isSelected && !ans.isCorrect
                        ? "text-red-700"
                        : "text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                        ans.isCorrect
                          ? "bg-green-500 text-white"
                          : ans.isSelected && !ans.isCorrect
                          ? "bg-red-200"
                          : "bg-gray-200"
                      }`}
                    >
                      {String.fromCharCode(65 + ansIndex)} {/* A, B, C, D */}
                    </div>
                    <span>{ans.content}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      {view === 'add-question' && (
        <div className="flex h-screen bg-gray-100 -mx-4">
          <div className="flex w-full">
            {/* Left Panel */}
            <div className="w-5/12 pl-3 pr-6 py-6 bg-white shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm câu hỏi</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nhập từ khóa..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chương</label>
                  <select
                    value={chapterSelect}
                    onChange={(e) => setChapterSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tất cả chương</option>
                    {listChapters?.map((chapter, index) => (
                      <option key={index} value={chapter.id}>
                        {chapter.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Độ khó</label>
                  <select
                    value={levelSelect}
                    onChange={(e) => setLevelSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tất cả độ khó</option>
                    {difficultyLabels.map((item, index) => (
                      <option key={index} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {loading && (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
              {errorMessage && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{errorMessage}</div>
              )}
              {!loading && !errorMessage && (
                <div className="space-y-3">
                  {questions
                    .filter((question) =>
                      question.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
                      (!levelSelect || question.difficulty === levelSelect)
                    )
                    .map((question) => (
                      <div
                        key={question.id}
                        className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all border border-gray-200"
                      >
                        <input
                          type="checkbox"
                          className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-1"
                          checked={question.checked || false}
                          onChange={() => handleQuestionToggle(question)}
                        />
                        <div className="ml-3 flex-1">
                          <p className="text-sm text-gray-800">{question.text}</p>
                          <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${difficultyColors[question.difficulty]}`}>
                            {difficultyLabels.find(label => label.value === question.difficulty)?.label}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Pagination */}
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trang trước
                </button>
                <span className="text-sm text-gray-600">Trang {currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trang sau
                </button>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-7/12 p-6 bg-gray-50">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">{newExam.title}</h2>
                    <span className="text-sm text-gray-500">Thời gian: {newExam.duration} phút</span>
                  </div>
                  <button
                    onClick={async () => {
                      const easyCount = countQuestionsByDifficulty("easy");
                      const mediumCount = countQuestionsByDifficulty("medium");
                      const hardCount = countQuestionsByDifficulty("hard");

                      if (
                        easyCount !== parseInt(newExam.easyQuestions) ||
                        mediumCount !== parseInt(newExam.mediumQuestions) ||
                        hardCount !== parseInt(newExam.hardQuestions)
                      ) {
                        alert(
                          `Vui lòng chọn đúng số lượng câu hỏi: ${newExam.easyQuestions} dễ, ${newExam.mediumQuestions} trung bình, ${newExam.hardQuestions} khó.`
                        );
                        return;
                      }

              
                      const selected = JSON.parse(localStorage.getItem('selectedQuestions') || '[]');
                      const listQuestion = selected.map((q, index) => ({
                        question_id: q.id,
                        order_index: index + 1 
                      }));

                      try {
                        const response = await axios.post(`/exam/add-question-to-exam/${selectedExam?.id}`, {
                          list_question: listQuestion
                        });

                        setExams((prev) =>
                          prev.map((exam) =>
                            exam.id === selectedExam?.id
                              ? { ...exam, questions: selected }
                              : exam
                          )
                        );

                        
                        setSelectedQuestions([]);
                        localStorage.removeItem('selectedQuestions');

                       
                        setView('list');
                      } catch (error) {
                        console.error('Error adding questions:', error);
                        alert('Không thể thêm câu hỏi. Vui lòng thử lại.');
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Hoàn tất đề thi
                  </button>
                </div>

                <div className="flex gap-4 mb-6">
                  <div className="flex-1 bg-green-50 p-3 rounded-lg text-center">
                    <span className="text-sm font-medium text-green-800">Dễ</span>
                    <p className="text-lg font-bold text-green-900">{countQuestionsByDifficulty("easy")}/{newExam.easyQuestions}</p>
                  </div>
                  <div className="flex-1 bg-yellow-50 p-3 rounded-lg text-center">
                    <span className="text-sm font-medium text-yellow-800">Trung bình</span>
                    <p className="text-lg font-bold text-yellow-900">{countQuestionsByDifficulty("medium")}/{newExam.mediumQuestions}</p>
                  </div>
                  <div className="flex-1 bg-red-50 p-3 rounded-lg text-center">
                    <span className="text-sm font-medium text-red-800">Khó</span>
                    <p className="text-lg font-bold text-red-900">{countQuestionsByDifficulty("hard")}/{newExam.hardQuestions}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Câu hỏi đã chọn</h3>
                  {selectedQuestions.length > 0 ? (
                    <div className="space-y-4">
                      {selectedQuestions.map((question) => (
                        <div
                          key={question.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all"
                        >
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{question.text}</p>
                            <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${difficultyColors[question.difficulty]}`}>
                              {difficultyLabels.find(label => label.value === question.difficulty)?.label}
                            </span>
                          </div>
                          <button
                            onClick={() => handleQuestionToggle(question)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center">Chưa có câu hỏi nào được chọn.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamManagement;