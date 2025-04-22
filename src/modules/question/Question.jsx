import {
  PlusIcon,
  PencilIcon,
  XIcon,
  SearchIcon,
  ArrowDownIcon,
} from '@heroicons/react/outline';
import { useState, useEffect } from 'react';
import { questions } from './QuestionService';
import { subjectsResponse, subjectChaptersResponse } from '../subject/SubjectService';
import { Radio } from '@mui/material';
import CustomModal from '../../components/modal/CustomModal';
import CustomButton from '../../components/button/CustomButton';
import PaginatedTable from '../../components/pagination/PaginatedTable';
import axiosInstance from '../../axiosConfig';

// Danh sách độ khó
const levels = ['Tất cả', 'Hard', 'Medium', 'Easy'];

const Question = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalName, setModalName] = useState('them-cau-hoi');
  const [isRequestAddAnswer, setIsRequestedAddAnswer] = useState(false);
  const [isExistedAnswer, setIsExistedAnswer] = useState(false);
  const [answerContent, setAnswerContent] = useState('');
  const [listAnswer, setListAnswer] = useState([]);
  const [questionContent, setQuestionContent] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState(0);
  const [selectedSubjectId, setSelectedSubjectId] = useState(0);
  const [questionCorrectAnswerIndex, setQuestionCorrectAnswerIndex] = useState(-1);
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [expandedColumn, setExpandedColumn] = useState(null);
  const [isRequestedClearTextarea, setIsRequestedClearTextarea] = useState(false);
  const [questionsData, setQuestionsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(10);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [error, setError] = useState(null);

  const toggleExpand = (index, column) => {
    if (expandedIndex === index && expandedColumn === column) {
      setExpandedIndex(null);
      setExpandedColumn(null);
    } else {
      setExpandedIndex(index);
      setExpandedColumn(column);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openModal = (modalName) => {
    setIsOpenModal(true);
    setModalName(modalName);
    setError(null);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setModalName('');
    setListAnswer([]);
    setAnswerContent('');
    setQuestionContent('');
    setIsRequestedAddAnswer(false);
    setIsExistedAnswer(false);
    setSelectedSubjectId(0);
    setSelectedChapterId(0);
    setSelectedLevelIndex(0);
    setQuestionCorrectAnswerIndex(-1);
    setError(null);
  };

  const [activeTab, setActiveTab] = useState('them-thu-cong');
  const handleActiveTab = (tabName) => {
    setActiveTab(tabName);
  };

  const showAnswerContentContainer = () => {
    setIsRequestedAddAnswer(true);
  };

  const showAnswerContainer = () => {
    setIsExistedAnswer(true);
  };

  const createNewAnswer = (content) => {
    setAnswerContent(content);
  };

  const addNewAnswer = () => {
    if (answerContent.trim()) {
      setListAnswer((prevList) => [...prevList, answerContent.trim()]);
      setAnswerContent('');
      setIsExistedAnswer(true);
    }
  };

  const createNewQuestion = (question) => {
    setQuestionContent(question);
  };

  const handleSubjectChange = (event) => {
    const newSubjectId = parseInt(event.target.value);
    setSelectedSubjectId(newSubjectId);
    setSelectedChapterId(0); // Reset chapter khi đổi subject
    setCurrentPage(1); // Reset về trang 1 khi lọc
  };

  const handleChapterChange = (event) => {
    const newChapterId = parseInt(event.target.value);
    setSelectedChapterId(newChapterId);
    setCurrentPage(1); // Reset về trang 1 khi lọc
  };

  const handleLevelChange = (event) => {
    const newLevelIndex = parseInt(event.target.value);
    setSelectedLevelIndex(newLevelIndex);
    setCurrentPage(1); // Reset về trang 1 khi lọc
  };

  const checkCorrectQuestionAnswerIndex = (index) => {
    return questionCorrectAnswerIndex === index;
  };

  const updateCorrectQuestionAnswerIndex = (index) => {
    setQuestionCorrectAnswerIndex(index);
  };

  const handleTextareaContent = (isRequestedClear) => {
    if (isRequestedClear) {
      setIsRequestedClearTextarea(false);
      return '';
    }
    return questionContent;
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjectResult = await subjectsResponse(currentPage);
        if (subjectResult && subjectResult.items) {
          setSubjects(subjectResult.items);
        } else {
          console.error('Fetch subjects response failed!');
          setSubjects([]);
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        if (selectedSubjectId === 0) {
          setChapters([]);
          return;
        }
        const chaptersResult = await subjectChaptersResponse(selectedSubjectId);
        console.log('Chapters response:', chaptersResult); // Debug dữ liệu
        if (chaptersResult && chaptersResult.items) {
          setChapters(chaptersResult.items);
        } else {
          console.error('No chapters found for subject:', selectedSubjectId);
          setChapters([]);
        }
      } catch (err) {
        console.error('Error fetching chapters:', err);
        setChapters([]);
      }
    };
    fetchChapters();
  }, [selectedSubjectId]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const difficultyLevel = selectedLevelIndex > 0 ? levels[selectedLevelIndex].toLowerCase() : '';
        const result = await questions(
          currentPage,
          limit,
          selectedSubjectId,
          selectedChapterId,
          difficultyLevel
        );
        if (result && result.items) {
          setQuestionsData(result.items);
          setTotalPages(result.totalPages || 1);
          setTotalItems(result.total || 0);
          setLimit(result.limit || 10);
        } else {
          setQuestionsData([]);
          setTotalPages(1);
          setTotalItems(0);
        }
      } catch (err) {
        console.error("Lấy câu hỏi thất bại: " + err.message);
        setQuestionsData([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    };
    fetchQuestions();
  }, [currentPage, limit, selectedSubjectId, selectedChapterId, selectedLevelIndex]);

  const handleSaveQuestion = async () => {
    if (!questionContent.trim()) {
      setError('Vui lòng nhập nội dung câu hỏi.');
      return;
    }
    if (selectedSubjectId === 0) {
      setError('Vui lòng chọn môn học.');
      return;
    }
    if (selectedChapterId === 0) {
      setError('Vui lòng chọn chương.');
      return;
    }
    if (selectedLevelIndex === 0) {
      setError('Vui lòng chọn độ khó.');
      return;
    }
    if (listAnswer.length < 2) {
      setError('Vui lòng thêm ít nhất 2 đáp án.');
      return;
    }
    if (questionCorrectAnswerIndex === -1) {
      setError('Vui lòng chọn đáp án đúng.');
      return;
    }

    const payload = {
      chapterId: selectedChapterId,
      content: questionContent.trim(),
      difficulty_level: levels[selectedLevelIndex].toLowerCase(),
      answers: listAnswer.map((content, index) => ({
        content: content.trim(),
        is_correct: index === questionCorrectAnswerIndex,
      })),
    };

    try {
      await axiosInstance.post('/question', payload);
      const result = await questions(
        currentPage,
        limit,
        selectedSubjectId,
        selectedChapterId,
        selectedLevelIndex > 0 ? levels[selectedLevelIndex].toLowerCase() : ''
      );
      setQuestionsData(result.items);
      setTotalPages(result.totalPages || 1);
      setTotalItems(result.total || 0);
      closeModal();
    } catch (err) {
      console.error('Lỗi khi thêm câu hỏi:', err);
      setError('Lỗi khi thêm câu hỏi: ' + err.message);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'them-thu-cong':
        return (
          <div className="w-full bg-white mt-4">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex items-center justify-center">
              <div className="w-full flex justify-evenly">
                <div className="flex flex-col">
                  <p className="text-blue-800">Môn học</p>
                  <select
                    value={selectedSubjectId}
                    onChange={handleSubjectChange}
                    className="w-60 border-1 p-1 mt-1 rounded-md"
                    id="subjects"
                  >
                    <option value={0}>Chọn môn học</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <p className="text-blue-800">Chương</p>
                  <select
                    value={selectedChapterId}
                    onChange={handleChapterChange}
                    className="w-60 border-1 p-1 mt-1 rounded-md"
                    id="chapters"
                  >
                    <option value={0}>Chọn chương</option>
                    {chapters.length > 0 ? (
                      chapters.map((chapter) => (
                        <option key={chapter.id} value={chapter.id}>
                          {chapter.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Không có chương</option>
                    )}
                  </select>
                </div>
                <div className="flex flex-col">
                  <p className="text-blue-800">Độ khó</p>
                  <select
                    value={selectedLevelIndex}
                    onChange={handleLevelChange}
                    className="w-60 border-1 p-1 mt-1 rounded-md"
                  >
                    <option value={0}>Chọn độ khó</option>
                    {levels.slice(1).map((level, index) => (
                      <option key={index + 1} value={index + 1}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <textarea
              value={handleTextareaContent(isRequestedClearTextarea)}
              onChange={(e) => createNewQuestion(e.target.value)}
              className="w-full p-2 mt-4 min-h-60 border rounded-xl focus:border-3 focus:outline-none focus:border-blue-400 focus:shadow-blue-300 focus:shadow-lg"
              placeholder="Nhập nội dung câu hỏi..."
            />
            <div className="w-full flex flex-col mt-8 mr-8 justify-center items-center">
              <p className="font-bold mb-2 text-blue-800">Danh sách đáp án</p>
              {isExistedAnswer && (
                <div className="w-full h-auto">
                  <ul>
                    {listAnswer.map((answer, index) => (
                      <li key={index} className="hover:bg-blue-800 hover:text-white">
                        <div className="w-full flex items-center justify-evenly">
                          <div className="min-w-8 text-xl">{index + 1}</div>
                          <div
                            className={`flex-1 max-w-96 ${expandedIndex === index ? 'whitespace-normal' : 'overflow-hidden text-ellipsis whitespace-nowrap'} break-words`}
                            onClick={() => toggleExpand(index)}
                          >
                            {answer}
                          </div>
                          <div className="w-20 ml-8 flex items-center">
                            <Radio
                              title="Đáp án đúng"
                              name="answers"
                              checked={checkCorrectQuestionAnswerIndex(index)}
                              onClick={() => updateCorrectQuestionAnswerIndex(index)}
                            />
                            Chọn
                          </div>
                          <div className="flex items-center space-x-2">
                            <PencilIcon className="w-5 h-5" />
                            <XIcon className="w-5 h-5" />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div
                className="flex items-center space-x-2 p-2 bg-black mt-4 text-white text-center rounded-md hover:bg-red-700"
                onClick={() => showAnswerContentContainer()}
              >
                <p>THÊM CÂU TRẢ LỜI</p> <ArrowDownIcon className="w-4 h-4" />
              </div>
            </div>
            {isRequestAddAnswer && (
              <div className="flex flex-col w-full min-h-64 space-y-4 mt-4">
                <p className="text-lg font-bold">Nội dung câu trả lời</p>
                <textarea
                  value={answerContent}
                  onChange={(e) => createNewAnswer(e.target.value)}
                  placeholder="Nhập câu trả lời..."
                  className="w-full min-h-32 bg-white border-2 border-gray-300 p-2 rounded-xl focus:outline-none focus:border-3 focus:border-blue-400 focus:shadow-blue-300 focus:shadow-lg"
                />
                <CustomButton
                  classname="w-1/5 p-2"
                  title="Lưu câu trả lời"
                  onClick={() => {
                    showAnswerContainer();
                    addNewAnswer();
                  }}
                />
              </div>
            )}
            <CustomButton
              classname="p-2 text-xl w-4/5 ml-20 mt-8 bg-red-700"
              title="LƯU CÂU HỎI"
              onClick={handleSaveQuestion}
            />
          </div>
        );
      case 'them-tu-file':
        return (
          <div className="w-full bg-white mt-4 flex flex-col justify-center items-center text-xl">
            <div className="w-full flex justify-evenly items-center mt-8 space-x-4">
              <div className="w-1/2 flex flex-col space-y-2">
                <p>Môn học</p>
                <select
                  className="w-full border"
                  value={selectedSubjectId}
                  onChange={handleSubjectChange}
                >
                  <option value={0}>Chọn môn học</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/2 flex flex-col space-y-2">
                <p>Chương</p>
                <select
                  className="w-full border"
                  value={selectedChapterId}
                  onChange={handleChapterChange}
                >
                  <option value={0}>Chọn chương</option>
                  {chapters.length > 0 ? (
                    chapters.map((chapter) => (
                      <option key={chapter.id} value={chapter.id}>
                        {chapter.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Không có chương</option>
                  )}
                </select>
              </div>
            </div>
            <div className="w-full mt-8">
              <p>Chọn file</p>
              <input className="w-4/5 border mt-4" type="file" />
              <p className="mt-4 text-blue-700">
                Vui lòng soạn câu hỏi theo đúng định dạng.{' '}
                <a className="text-red-700 italic hover:underline" href="/files/mauCauHoi.xlsx">
                  Tải mẫu
                </a>
              </p>
            </div>
            <div className="w-full flex mt-16 justify-evenly">
              <CustomButton title="Thêm file excel" classname="pl-16 pr-16 pt-2 pb-2 rounded-sm" />
              <CustomButton title="Thêm vào hệ thống" classname="pl-16 pr-16 pt-2 pb-2 rounded-sm" />
            </div>
          </div>
        );
    }
  };

  const modalContent = () => {
    switch (modalName) {
      case 'them-cau-hoi':
        return (
          <div className="flex flex-col items-center justify-center" style={{ fontFamily: 'Playfair display' }}>
            <div className="w-full flex items-center">
              <div
                className={`p-2 bg-black text-white ${activeTab === 'them-thu-cong' ? 'bg-blue-800 rounded-tr-xl' : 'bg-black'}`}
                onClick={() => handleActiveTab('them-thu-cong')}
              >
                Thêm thủ công
              </div>
              <div
                className={`p-2 bg-black text-white ${activeTab === 'them-tu-file' ? 'bg-blue-800 rounded-tl-xl' : 'bg-black'}`}
                onClick={() => handleActiveTab('them-tu-file')}
              >
                Thêm từ file
              </div>
            </div>
            <div className="w-full">{renderContent()}</div>
          </div>
        );
      case 'sua-cau-hoi':
        return (
          <div className="w-full bg-white mt-4">
            <div className="flex items-center justify-center">
              <div className="w-full flex justify-evenly">
                <div className="flex flex-col">
                  <p className="text-blue-800">Môn học</p>
                  <select
                    value={selectedSubjectId}
                    onChange={handleSubjectChange}
                    className="w-60 border-1 p-1 mt-1 rounded-md"
                    id="subjects"
                  >
                    <option value={0}>Chọn môn học</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <p className="text-blue-800">Chương</p>
                  <select
                    value={selectedChapterId}
                    onChange={handleChapterChange}
                    className="w-60 border-1 p-1 mt-1 rounded-md"
                    id="chapters"
                  >
                    <option value={0}>Chọn chương</option>
                    {chapters.length > 0 ? (
                      chapters.map((chapter) => (
                        <option key={chapter.id} value={chapter.id}>
                          {chapter.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Không có chương</option>
                    )}
                  </select>
                </div>
                <div className="flex flex-col">
                  <p className="text-blue-800">Độ khó</p>
                  <select
                    value={selectedLevelIndex}
                    onChange={handleLevelChange}
                    className="w-60 border-1 p-1 mt-1 rounded-md"
                  >
                    <option value={0}>Chọn độ khó</option>
                    {levels.slice(1).map((level, index) => (
                      <option key={index + 1} value={index + 1}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <textarea
              value={handleTextareaContent(isRequestedClearTextarea)}
              onChange={(e) => createNewQuestion(e.target.value)}
              className="w-full p-2 mt-4 min-h-60 border rounded-xl focus:border-3 focus:outline-none focus:border-blue-400 focus:shadow-blue-300 focus:shadow-lg"
              placeholder="Nhập nội dung câu hỏi..."
            />
            <CustomButton
              classname="p-2 text-xl w-4/5 ml-20 mt-8 bg-red-700"
              title="LƯU THAY ĐỔI"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center" style={{ fontFamily: 'PlayFair Display' }}>
      <div className="w-9/10 h-full bg-white mt-8 rounded-2xl flex flex-col">
        <CustomModal
          isOpen={isOpenModal}
          onClose={closeModal}
          title="Thêm câu hỏi modal"
          className="bg-white rounded-xl p-6 min-w-200 min-h-100 overflow-auto max-h-140 mx-auto z-40 mt-20 border-2 border-black"
        >
          {modalContent()}
        </CustomModal>
        <div className="w-full flex bg-gray-200 items-center pt-4 pl-8 pr-8 pb-4 rounded-t-xl">
          <p className="font-bold text-xl">Tất cả câu hỏi</p>
          <div
            onClick={() => openModal('them-cau-hoi')}
            className="flex p-2 space-x-2 ml-auto h-3/4 items-center bg-red-700 text-white p-2 rounded-xl hover:bg-blue-900"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            THÊM CÂU HỎI MỚI
          </div>
        </div>
        <div className="flex items-center space-x-8 mt-8 ml-8">
          <select
            className="w-64 border-2 p-2 rounded-xl bg-blue-50 text-blue-800"
            name="sl-monhoc"
            value={selectedSubjectId}
            onChange={handleSubjectChange}
          >
            <option value={0}>Tất cả môn học</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          <select
            className="w-64 border-2 p-2 rounded-xl bg-blue-50 text-blue-800"
            name="sl-chuong"
            value={selectedChapterId}
            onChange={handleChapterChange}
          >
            <option value={0}>Tất cả chương</option>
            {chapters.length > 0 ? (
              chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.name}
                </option>
              ))
            ) : (
              <option disabled>Không có chương</option>
            )}
          </select>
          <div className="flex space-x-2 items-center ml-auto mr-8">
            Độ khó:
            <select
              className="ml-4 w-32 border-2 p-2 rounded-xl bg-blue-50 text-blue-800"
              name="sl-dokho"
              value={selectedLevelIndex}
              onChange={handleLevelChange}
            >
              {levels.map((level, index) => (
                <option key={index} value={index}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4 ml-8 mr-8">
          <input
            type="search"
            placeholder="Nội dung câu hỏi..."
            className="w-full bg-gray-100 rounded-xl p-2 text-black border focus:outline-none focus:border-3 focus:ring-blue-300 focus:border-blue-300 focus:shadow-md focus:shadow-blue-300 focus:bg-white"
          />
          <div className="bg-blue-800 text-white rounded-xl w-10 h-10 flex items-center justify-center hover:bg-black">
            <SearchIcon className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 ml-8 mr-8 flex-grow">
          <div className="max-h-[600px] overflow-y-auto overflow-x-hidden">
            <table className="w-full border-collapse table-fixed">
              <thead className="sticky top-0 bg-blue-900 text-white">
                <tr>
                  <th className="text-center py-3 w-[5%]">STT</th>
                  <th className="text-center py-3 w-[45%]">Nội dung câu hỏi</th>
                  <th className="text-center py-3 w-[20%]">Môn học</th>
                  <th className="text-center py-3 w-[15%]">Độ khó</th>
                  <th className="text-center py-3 w-[15%]">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {questionsData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-blue-100 even:bg-gray-50 transition-all duration-300 ${expandedIndex === index ? 'h-auto' : 'h-12'}`}
                  >
                    <td className="text-center py-3 text-blue-600 font-bold">
                      {(currentPage - 1) * limit + index + 1}
                    </td>
                    <td className="py-3 px-2">
                      <div
                        className={`text-center ${expandedIndex === index && expandedColumn === 'content' ? 'whitespace-normal break-words' : 'overflow-hidden text-ellipsis whitespace-nowrap'}`}
                        onClick={() => toggleExpand(index, 'content')}
                      >
                        {item.content}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div
                        className={`text-center ${expandedIndex === index && expandedColumn === 'subject' ? 'whitespace-normal break-words' : 'overflow-hidden text-ellipsis whitespace-nowrap'}`}
                        onClick={() => toggleExpand(index, 'subject')}
                      >
                        {item.subject_name}
                      </div>
                    </td>
                    <td className="text-center py-3 px-2">
                      {item.difficulty_level.charAt(0).toUpperCase() + item.difficulty_level.slice(1)}
                    </td>
                    <td className="text-center py-3 px-2">
                      <div className="flex items-center justify-center space-x-2">
                        <div
                          onClick={() => openModal('sua-cau-hoi')}
                          className="text-white bg-blue-900 rounded-2xl p-1 hover:bg-blue-700 cursor-pointer"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </div>
                        <div
                          className="text-white bg-red-700 rounded-2xl p-1 hover:bg-red-500 cursor-pointer"
                        >
                          <XIcon className="w-5 h-5" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-center mt-4 mb-8">
          <PaginatedTable totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
};

export default Question;