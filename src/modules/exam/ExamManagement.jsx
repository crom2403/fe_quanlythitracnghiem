import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Calendar, Users, AlertCircle, CheckCircle, BarChart2, ArrowLeft } from 'lucide-react';

// Mock data - replace with actual API calls in production
const initialExams = [
  {
    id: 1,
    title: "Đề thi 100 câu",
    group: "Nhóm 4",
    course: "Lập trình web và ứng dụng nâng cao - NH2022 - HK2",
    startDate: "05/08/2023, 05:05 PM",
    endDate: "05/08/2023, 05:35 PM",
    status: "closed",
    students: {
      total: 35,
      completed: 28,
      notStarted: 7,
      averageScore: 7.8
    },
    questions: []
  },
  {
    id: 2,
    title: "Đề kiểm tra Lập trình web và ứng dụng nâng cao !",
    course: "Lập trình web và ứng dụng nâng cao - NH2022 - HK2",
    startDate: "05/08/2023, 04:49 PM",
    endDate: "05/12/2023, 05:21 PM",
    status: "closed",
    students: {
      total: 40,
      completed: 38,
      notStarted: 2,
      averageScore: 8.2
    },
    questions: []
  },
  {
    id: 3,
    title: "Đề tạo thử công",
    course: "Lập trình hướng đối tượng - NH2022 - HK1",
    startDate: "05/08/2023, 12:00 PM",
    endDate: "05/09/2023, 12:00 PM",
    status: "closed",
    students: {
      total: 32,
      completed: 30,
      notStarted: 2,
      averageScore: 6.5
    },
    questions: []
  }
];

const mockStudentExams = [
  {
    studentId: 1,
    name: "Nguyễn Văn A",
    examId: 1,
    score: 8.5,
    completedDate: "05/08/2023, 05:25 PM",
    answers: [/* answer details */]
  },
  {
    studentId: 2,
    name: "Trần Thị B",
    examId: 1,
    score: 7.0,
    completedDate: "05/08/2023, 05:30 PM",
    answers: [/* answer details */]
  }
];

const ExamManagement = () => {
  const [exams, setExams] = useState(initialExams);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('list'); // list, create, detail, studentDetail
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
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

  const handleExamSubmit = (e) => {
    e.preventDefault();
    
    const formattedStartDate = `${newExam.startDate}, ${newExam.startTime}`;
    const formattedEndDate = `${newExam.endDate}, ${newExam.endTime}`;
    
    const examToAdd = {
      id: exams.length + 1,
      title: newExam.title,
      course: newExam.course,
      group: newExam.group,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      duration: newExam.duration,
      status: 'open',
      students: {
        total: 0,
        completed: 0,
        notStarted: 0,
        averageScore: 0
      },
      questions: newExam.questions
    };
    
    setExams([...exams, examToAdd]);
    setView('list');
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
                    <div className="bg-red-100 text-red-800 px-3 py-1 rounded-md">
                      Đã đóng
                    </div>
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
            onChange={(e) => setNewExam({...newExam, title: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Thời gian bắt đầu</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              placeholder="Từ"
              value={newExam.startDate}
              onChange={(e) => setNewExam({...newExam, startDate: e.target.value})}
              required
            />
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              placeholder="Đến"
              value={newExam.endDate}
              onChange={(e) => setNewExam({...newExam, endDate: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex-grow">
            <label className="block mb-2 font-medium text-gray-700">Thời gian làm bài</label>
            <div className="flex">
              <input
                type="text"
                className="flex-grow border rounded-l-md px-3 py-2"
                placeholder="00"
                value={newExam.duration}
                onChange={(e) => setNewExam({...newExam, duration: e.target.value})}
                required
              />
              <div className="border rounded-r-md px-3 py-2 bg-gray-100 text-center w-20">
                phút
              </div>
            </div>
          </div>
          <div className="flex-grow"></div>
        </div>
        
        <div>
          <label className="block mb-2 font-medium text-gray-700">Giao cho</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={newExam.group}
            onChange={(e) => setNewExam({...newExam, group: e.target.value})}
          >
            <option value="">Chọn nhóm học phần giảng dạy...</option>
            <option value="Nhóm 1">Nhóm 1</option>
            <option value="Nhóm 2">Nhóm 2</option>
            <option value="Nhóm 3">Nhóm 3</option>
            <option value="Nhóm 4">Nhóm 4</option>
          </select>
          <div className="mt-4 h-32 flex items-center justify-center border rounded-md bg-gray-50">
            <div className="text-center text-gray-400">
              <img src="/api/placeholder/80/80" alt="placeholder" className="mx-auto mb-2 opacity-25" />
              <div>Chưa chọn nhóm giảng dạy</div>
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Chương</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={newExam.chapter}
            onChange={(e) => setNewExam({...newExam, chapter: e.target.value})}
          >
            <option value="">Chọn nhiều chương...</option>
            <option value="Chương 1">Chương 1</option>
            <option value="Chương 2">Chương 2</option>
            <option value="Chương 3">Chương 3</option>
          </select>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Số câu dễ</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              placeholder="0"
              value={newExam.easyQuestions}
              onChange={(e) => setNewExam({...newExam, easyQuestions: e.target.value})}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700">Số câu trung bình</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              placeholder="0"
              value={newExam.mediumQuestions}
              onChange={(e) => setNewExam({...newExam, mediumQuestions: e.target.value})}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700">Số câu khó</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              placeholder="0"
              value={newExam.hardQuestions}
              onChange={(e) => setNewExam({...newExam, hardQuestions: e.target.value})}
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
                    <th className="py-3 px-4 text-left">Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudentExams.map((student, index) => (
                    <tr key={student.studentId} className="border-t">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{student.name}</td>
                      <td className="py-3 px-4">{student.completedDate}</td>
                      <td className="py-3 px-4">{student.score}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleViewStudentExam(student)}
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

      {view === 'studentDetail' && selectedStudent && (
        <div className="max-w-4xl mx-auto bg-white rounded-md shadow p-6">
          <div className="flex items-center mb-6">
            <button 
              onClick={handleBackToDetail}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold">Chi tiết bài làm</h2>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold">{selectedExam.title}</h3>
            <p className="mt-2 font-medium">Sinh viên: {selectedStudent.name}</p>
            <div className="mt-4 flex space-x-4">
              <div>
                <span className="text-gray-600">Thời gian nộp:</span>
                <span className="ml-2 font-medium">{selectedStudent.completedDate}</span>
              </div>
              <div>
                <span className="text-gray-600">Điểm số:</span>
                <span className="ml-2 font-medium">{selectedStudent.score}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Câu trả lời</h3>
            
            <div className="space-y-6">
              {/* Mock student answers - replace with actual data */}
              <div className="border rounded-md p-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-3">
                    Câu 1
                  </div>
                  <div>
                    <p className="font-medium">Thuật ngữ SPA trong phát triển web là viết tắt của?</p>
                    <div className="mt-2 ml-4">
                      <div className="flex items-center mt-1 text-gray-800">
                        <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center mr-2">A</div>
                        <span>Single Page Application</span>
                        <span className="ml-2 text-green-600">(Đúng)</span>
                      </div>
                      <div className="flex items-center mt-1 text-gray-500">
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center mr-2">B</div>
                        <span>System Page Access</span>
                      </div>
                      <div className="flex items-center mt-1 text-gray-500">
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center mr-2">C</div>
                        <span>Service Provider Application</span>
                      </div>
                      <div className="flex items-center mt-1 text-gray-500">
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center mr-2">D</div>
                        <span>Server Process Application</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-3">
                    Câu 2
                  </div>
                  <div>
                    <p className="font-medium">Framework JavaScript nào không thuộc nhóm SPA?</p>
                    <div className="mt-2 ml-4">
                      <div className="flex items-center mt-1 text-gray-500">
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center mr-2">A</div>
                        <span>React</span>
                      </div>
                      <div className="flex items-center mt-1 text-gray-500">
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center mr-2">B</div>
                        <span>Angular</span>
                      </div>
                      <div className="flex items-center mt-1 text-red-800">
                        <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center mr-2">C</div>
                        <span>jQuery</span>
                        <span className="ml-2 text-red-600">(Đã chọn - Sai)</span>
                      </div>
                      <div className="flex items-center mt-1 text-gray-500">
                        <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center mr-2">D</div>
                        <span>Vue</span>
                        <span className="ml-2 text-green-600">(Đúng)</span>
                      </div>
                    </div>
                  </div>
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