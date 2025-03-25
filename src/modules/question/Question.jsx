import {
  PlusIcon,
  PencilIcon,
  XIcon,
  SearchIcon,
  ArrowDownIcon,
} from '@heroicons/react/outline';
import PaginatedTable from '../../components/pagination/PaginatedTable';
import { useState, useEffect } from 'react';
import CustomModal from '../../components/modal/CustomModal';
import CustomButton from '../../components/button/CustomButton';
import { Radio } from '@mui/material';
import CustomObjArrayFilter from '../../components/filter/CustomArrayFilter';

const subjects = [
  'Tất cả',
  'Cấu trúc dữ liệu và giải thuật',
  'Lập trình hướng đối tượng',
  'Nhập môn lập trình',
];
const chapters = ['Tất cả', 'Chương 1', 'Chương 2', 'Chương 3'];
const defaultQuestions = [
  {
    question: 'Câu hỏi 1',
    subjectIndex: 1,
    chapterIndex: 1,
    levelIndex: 3,
  },
  {
    question: 'Câu hỏi 2',
    subjectIndex: 3,
    chapterIndex: 3,
    levelIndex: 1,
  },
];
const levels = ['Tất cả', 'Dễ', 'Trung bình', 'Khó'];
const defaultFilterQuestions = CustomObjArrayFilter(defaultQuestions);

const Question = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalName, setModalName] = useState('them-cau-hoi');
  const [isRequestAddAnswer, setIsRequestedAddAnswer] = useState(false);
  const [isExistedAnswer, setIsExistedAnswer] = useState(false);
  const [answerContent, setAnswerContent] = useState(null);
  const [listAnswer, setListAnswer] = useState([]);
  const [questionContent, setQuestionContent] = useState('');
  const [questionChapterIndex, setQuestionChapterIndex] = useState(0);
  const [questionSubjectIndex, setQuestionSubjectIndex] = useState(0);
  const [questionCorrectAnswerIndex, setQuestionCorrectAnswerIndex] =
    useState(-1);
  const [listQuestion, setListQuestion] = useState(defaultFilterQuestions);
  const [isRequestChangeQuestions, setIsRequestedChangeQuestions] =
    useState(true);
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [deleteQuestionIndex, setDeleteQuestionIndex] = useState(-1);
  const [updateQuestionIndex, setUpdateQuestionIndex] = useState(-1);
  const [isRequestedClearTextarea, setIsRequestedClearTextarea] =
    useState(false);
  const [toggleQuestions, setToggleQuestions] = useState(
    defaultFilterQuestions
  );

  const toggleExpand = (index) => {
    setExpandedIndex(index);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openModal = (modalName) => {
    setIsOpenModal(true);
    setModalName(modalName);
  };
  const closeModal = () => {
    setIsOpenModal(false);
    setModalName('');
  };
  const [activeTab, setActiveTab] = useState('them-thu-cong');
  const handleActiceTab = (tabName) => {
    setActiveTab(tabName);
  };

  const showAnswerContentContainer = () => {
    setIsRequestedAddAnswer(true);
  };

  const showAnwserContainer = () => {
    setIsExistedAnswer(true);
  };

  const createNewAnswer = (content) => {
    setAnswerContent(content);
  };

  const addNewAnswer = (answer) => {
    if (answerContent) {
      setListAnswer((prevList) => [...prevList, answer]);
      setAnswerContent('');
    }
  };

  const creatNewQuesion = (question) => {
    setQuestionContent(question);
  };

  const addNewQuestion = (question, chapterIndex, subjectIndex, levelIndex) => {
    if (!questionContent || chapterIndex === 0 || subjectIndex === 0) {
      alert('Vui lòng chọn đủ thông tin');
      return;
    }
    const newQuestion = { question, chapterIndex, subjectIndex, levelIndex };

    setListQuestion((prevList) => [...prevList, newQuestion]);
    setIsRequestedClearTextarea(true);
    setListAnswer([]);
    setIsRequestedChangeQuestions(true);
    alert('Đã thêm câu hỏi');
  };

  const handleSubjectChange = (event) => {
    setQuestionSubjectIndex(parseInt(event.target.value));
  };

  const handleChapterChange = (event) => {
    setQuestionChapterIndex(parseInt(event.target.value));
  };

  const handleLevleChange = (event) => {
    setSelectedLevelIndex(parseInt(event.target.value));
  };

  const handelDeleteQuesion = (questions, index) => {
    setDeleteQuestionIndex(index);
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setListQuestion(updatedQuestions);
    setIsRequestedChangeQuestions(true);
  };

  const handleEditQuestion = (index) => {
    const questionToEdit = listQuestion[index];
    setQuestionContent(questionToEdit.question);
    setQuestionSubjectIndex(questionToEdit.subjectIndex);
    setQuestionChapterIndex(questionToEdit.chapterIndex);
    setSelectedLevelIndex(questionToEdit.levelIndex);
    setUpdateQuestionIndex(index);
    openModal('sua-cau-hoi');
  };

  const handleUpdateQuestion = (questions, index) => {
    setUpdateQuestionIndex(index);
    const updatedList = [...questions];
    const updatedQuestion = {
      question: questionContent,
      subjectIndex: questionSubjectIndex,
      chapterIndex: questionChapterIndex,
      levelIndex: selectedLevelIndex,
    };
    updatedList.splice(index, 1, updatedQuestion);
    setListQuestion(updatedList);
    alert('Đã cập nhật câu hỏi');
    setIsRequestedChangeQuestions(true);
  };

  const checkCorrectQuestionAnwserIndex = (index) => {
    return questionCorrectAnswerIndex === index;
  };

  const updateCorrectQuestionAnswerIndex = (index) => {
    setQuestionCorrectAnswerIndex(index);
  };

  const handleTextareaContent = (isRequestedClear) => {
    if (isRequestedClear) {
      return '';
    }
    return questionContent;
  };
  const handleToggleQuestions = (subjectIdx, chapterIdx, levelIdx) => {
    const filterSubjectIndex =
      subjectIdx !== undefined ? subjectIdx : questionSubjectIndex;
    const filterChapterIndex =
      chapterIdx !== undefined ? chapterIdx : questionChapterIndex;
    const filterLevelIndex =
      levelIdx !== undefined ? levelIdx : selectedLevelIndex;

    const filterToggleQuestionArray = CustomObjArrayFilter(
      listQuestion,
      ['subjectIndex', 'chapterIndex', 'levelIndex'],
      [filterSubjectIndex, filterChapterIndex, filterLevelIndex]
    );

    setToggleQuestions(filterToggleQuestionArray);
    setIsRequestedChangeQuestions(true);
    setCurrentPage(1);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(toggleQuestions.length / itemsPerPage);
  const [currentData, setCurrentData] = useState([]);

  useEffect(() => {
    const data = toggleQuestions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    setCurrentData(data);
  }, [toggleQuestions, currentPage]);

  const renderContent = () => {
    switch (activeTab) {
      case 'them-thu-cong':
        return (
          <div className="w-full bg-white mt-4">
            <div className="flex items-center justify-center">
              <div className="w-full flex justify-evenly">
                <div className="flex flex-col">
                  <p className="text-blue-800">Môn học</p>
                  <select
                    value={questionSubjectIndex}
                    onChange={handleSubjectChange}
                    className="w-60 border-1 p-1 mt-1 rounded-md"
                    id="subjects"
                  >
                    {subjects.slice(1).map((subject, index) => (
                      <option key={index + 1} value={index + 1}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col ">
                  <p className="text-blue-800">Chương</p>
                  <select
                    value={questionChapterIndex}
                    onChange={handleChapterChange}
                    className="w-60 border-1 p-1 mt-1 rounded-md"
                    id="chapters"
                  >
                    {chapters.slice(1).map((chapter, index) => (
                      <option key={index + 1} value={index + 1}>
                        {chapter}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <p className="text-blue-800">Độ khó</p>
                  <select
                    value={selectedLevelIndex}
                    onChange={handleLevleChange}
                    className="w-60 border-1 p-1 mt-1 rounded-md"
                  >
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
              onChange={(e) => creatNewQuesion(e.target.value)}
              type="text"
              className="w-full p-2 mt-4 min-h-60 border rounded-xl focus:border-3 focus:outline-none focus:border-blue-400 focus:shadow-blue-300 focus:shadow-lg"
            />
            <div className="w-full flex flex-col mt-8 mr-8 justify-center items-center">
              <p className="font-bold mb-2 text-blue-800">Danh sách đáp án</p>
              {isExistedAnswer && (
                <div className="w-full h-auto">
                  <ul className="">
                    {listAnswer.map((answer, index) => (
                      <li
                        key={index}
                        className="hover:bg-blue-800 hover:text-white"
                      >
                        <div className="w-full flex items-center justify-evenly">
                          <div className="min-w-8 text-xl ">{index + 1}</div>
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
                              checked={checkCorrectQuestionAnwserIndex(index)}
                              onClick={() =>
                                updateCorrectQuestionAnswerIndex(index)
                              }
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
                  value={answerContent || ''}
                  onChange={(e) => createNewAnswer(e.target.value)}
                  placeholder="Nhập câu trả lời..."
                  className="w-full min-h-32 bg-white border-2 border-gray-300 p-2 rounded-xl focus:outline-none focus:border-3 focus:border-blue-400 focus:shadow-blue-300 focus:shadow-lg"
                />
                <CustomButton
                  classname="w-1/5 p-2"
                  title="Lưu câu trả lời"
                  onClick={() => {
                    showAnwserContainer();
                    addNewAnswer(answerContent);
                  }}
                />
              </div>
            )}
            <CustomButton
              classname="p-2 text-xl w-4/5 ml-20 mt-8 bg-red-700"
              title="LƯU CÂU HỎI"
              onClick={() =>
                addNewQuestion(
                  questionContent,
                  questionChapterIndex,
                  questionSubjectIndex,
                  selectedLevelIndex
                )
              }
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
                  value={questionSubjectIndex}
                  onChange={handleSubjectChange}
                >
                  {subjects.map((subject, index) => (
                    <option key={index} value={index}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/2 flex flex-col space-y-2">
                <p>Chương</p>
                <select
                  className="w-full border"
                  value={questionChapterIndex}
                  onChange={handleChapterChange}
                >
                  {chapters.map((chapter, index) => (
                    <option key={index} value={index}>
                      {chapter}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full mt-8">
              <p>Chọn file</p>
              <input className="w-4/5 border mt-4" type="file" />
              <p className="mt-4 text-blue-700">
                Vui lòng soạn câu hỏi theo đúng định dạng.{' '}
                <a
                  className="text-red-700 italic hover:underline"
                  href="/files/mauCauHoi.xlsx"
                >
                  Tải mẫu
                </a>
              </p>
            </div>
            <div className="w-full flex mt-16 justify-evenly">
              <CustomButton
                title="Thêm file excel"
                classname="pl-16 pr-16 pt-2 pb-2 rounded-sm"
              />
              <CustomButton
                title="Thêm vào hệ thống"
                classname="pl-16 pr-16 pt-2 pb-2 rounded-sm"
              />
            </div>
          </div>
        );
    }
  };

  const modalContent = () => {
    switch (modalName) {
      case 'them-cau-hoi':
        return (
          <div
            className="flex flex-col items-center justify-center"
            style={{ fontFamily: 'Playfair display' }}
          >
            <div className="w-full flex items-center">
              <div
                className={`p-2 bg-black text-white ${activeTab === 'them-thu-cong' ? 'bg-blue-800 rounded-tr-xl' : 'bg-black'}`}
                onClick={() => handleActiceTab('them-thu-cong')}
              >
                Thêm thủ công
              </div>
              <div
                className={`p-2 bg-black text-white ${activeTab === 'them-tu-file' ? 'bg-blue-800 rounded-tl-xl' : 'bg-black'}`}
                onClick={() => handleActiceTab('them-tu-file')}
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
                    value={questionSubjectIndex}
                    onChange={handleSubjectChange}
                    className="w-60 border-1 p-1 mt-1 rounded-md"
                    id="subjects"
                  >
                    {subjects.slice(1).map((subject, index) => (
                      <option key={index + 1} value={index + 1}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col ">
                  <p className="text-blue-800">Chương</p>
                  <select
                    value={questionChapterIndex}
                    onChange={handleChapterChange}
                    className="w-60 border-1 p-1 mt-1 rounded-md"
                    id="chapters"
                  >
                    {chapters.slice(1).map((chapter, index) => (
                      <option key={index + 1} value={index + 1}>
                        {chapter}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <p className="text-blue-800">Độ khó</p>
                  <select
                    value={selectedLevelIndex}
                    onChange={handleLevleChange}
                    className="w-60 border-1 p-1 mt-1 rounded-md"
                  >
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
              onChange={(e) => creatNewQuesion(e.target.value)}
              type="text"
              className="w-full p-2 mt-4 min-h-60 border rounded-xl focus:border-3 focus:outline-none focus:border-blue-400 focus:shadow-blue-300 focus:shadow-lg"
            />
            <div className="w-full flex flex-col mt-8 mr-8 justify-center items-center">
              <p className="font-bold mb-2 text-blue-800">Danh sách đáp án</p>
              {isExistedAnswer && (
                <div className="w-full h-auto">
                  <ul className="">
                    {listAnswer.map((answer, index) => (
                      <li
                        key={index}
                        className="hover:bg-blue-800 hover:text-white"
                      >
                        <div className="w-full flex items-center justify-evenly">
                          <div className="min-w-8 text-xl ">{index + 1}</div>
                          <div
                            className={`flex-1 max-w-96 ${expandedIndex === index ? 'whitespace-normal' : 'overflow-hidden text-ellipsis whitespace-nowrap'} break-words`}
                            onClick={() => toggleExpand(index)}
                          >
                            {answer}
                          </div>
                          <div className="w-20 ml-8 flex items-center">
                            <Radio title="Đáp án đúng" />
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
                  value={answerContent || ''}
                  onChange={(e) => createNewAnswer(e.target.value)}
                  placeholder="Nhập câu trả lời..."
                  className="w-full min-h-32 bg-white border-2 border-gray-300 p-2 rounded-xl focus:outline-none focus:border-3 focus:border-blue-400 focus:shadow-blue-300 focus:shadow-lg"
                />
                <CustomButton
                  classname="w-1/5 p-2"
                  title="Lưu câu trả lời"
                  onClick={() => {
                    showAnwserContainer();
                    addNewAnswer(answerContent);
                  }}
                />
              </div>
            )}
            <CustomButton
              classname="p-2 text-xl w-4/5 ml-20 mt-8 bg-red-700"
              title="LƯU THAY ĐỔI"
              onClick={() =>
                handleUpdateQuestion(listQuestion, updateQuestionIndex)
              }
            />
          </div>
        );
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-gray-100 flex justify-center"
      style={{ fontFamily: 'PlayFair Display' }}
    >
      <div className="w-9/10 h-full bg-white mt-8 rounded-2xl">
        <CustomModal
          isOpen={isOpenModal}
          onClose={closeModal}
          title="Them cau hoi modal"
          className="bg-white rounded-xl p-6 min-w-200 min-h-100 overflow-auto max-h-140 mx-auto z-40 mt-20 border-2 border-black"
        >
          {modalContent()}
        </CustomModal>
        <div className="w-full flex bg-gray-200 items-center pt-4 pl-8 pr-8 pb-4 rounded-t-xl">
          <p className="font-bold text-xl">Tất cả câu hỏi</p>
          <div
            onClick={() => openModal('them-cau-hoi')}
            className="flex space-x-2 ml-auto h-3/4 items-center bg-red-700 text-white p-2 rounded-xl hover:bg-blue-900"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            THÊM CÂU HỎI MỚI
          </div>
        </div>
        <div className="flex items-center space-x-8 mt-8 ml-8">
          <select
            className="w-64 border-2 p-2 rounded-xl bg-blue-50 text-blue-800"
            name="sl-monhoc"
            value={questionSubjectIndex}
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setQuestionSubjectIndex(newValue);
              handleToggleQuestions(newValue, undefined, undefined);
            }}
          >
            {subjects.map((subject, index) => (
              <option key={index} value={index}>
                {subject}
              </option>
            ))}
          </select>
          <select
            className="w-64 border-2 p-2 rounded-xl bg-blue-50 text-blue-800"
            name="sl-chuong"
            value={questionChapterIndex}
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              setQuestionChapterIndex(newValue);
              handleToggleQuestions(undefined, newValue, undefined);
            }}
          >
            {chapters.map((chapter, index) => (
              <option key={index} value={index}>
                {chapter}
              </option>
            ))}
          </select>
          <div className="flex space-x-2 items-center ml-auto mr-8">
            Độ khó:
            <select
              className="ml-4 w-32 border-2 p-2 rounded-xl bg-blue-50 text-blue-800"
              name="sl-dokho"
              value={selectedLevelIndex}
              onChange={(e) => {
                const newValue = parseInt(e.target.value);
                setSelectedLevelIndex(newValue);
                handleToggleQuestions(undefined, undefined, newValue);
              }}
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
        <div className="flex items-center space-x-8 mt-4 ml-8 mr-8 max-h-140 flex-grow">
          <table className="w-full mt-2">
            <thead>
              <tr className="w-full">
                <th className="text-center min-w-16">STT</th>
                <th className="text-center min-w-64">Nội dung câu hỏi</th>
                <th className="text-center max-w-32">Môn học</th>
                <th className="text-center pr-8 min-w-32">Độ khó</th>
                <th className="text-center min-w-32">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isRequestChangeQuestions &&
                currentData.map((item, index) => (
                  <tr key={index} className="hover:bg-black hover:text-white">
                    <td className="text-center py-4 text-blue-600 font-bold">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td>
                      <div
                        className={`flex-1 max-w-130 text-center ${expandedIndex === index ? 'whitespace-normal' : 'overflow-hidden text-ellipsis whitespace-nowrap'} break-words`}
                        onClick={() => toggleExpand(index)}
                      >
                        {item.question}
                      </div>
                    </td>
                    <td className="text-center overflow-hidden w-full">
                      <div
                        className={`flex-1 max-w-full text-center ${expandedIndex === index ? 'whitespace-normal' : 'overflow-hidden text-ellipsis whitespace-nowrap'} break-words`}
                        onClick={() => toggleExpand(index)}
                      >
                        {subjects[item.subjectIndex]}
                      </div>
                    </td>
                    <td className="text-center pr-8">
                      {levels[item.levelIndex]}
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div
                          onClick={() => handleEditQuestion(index)}
                          className="text-white bg-blue-900 rounded-2xl p-1"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </div>
                        <div
                          className="text-white bg-red-700 rounded-2xl p-1"
                          onClick={() =>
                            handelDeleteQuesion(listQuestion, index)
                          }
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
        <div className="flex justify-center mt-8 mb-8">
          <PaginatedTable
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Question;
