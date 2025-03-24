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
import { Checkbox } from '@mui/material';
import { array } from 'prop-types';

const subjects = [
  'Cấu trúc dữ liệu và giải thuật',
  'Lập trình hướng đối tượng',
  'Nhập môn lập trình',
];
const chapters = ['Chương 1', 'Chương 2', 'Chương 3'];

const Question = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalName, setModalName] = useState('them-cau-hoi');

  const [isRequestAddAnswer, setIsRequestedAddAnswer] = useState(false);
  const [isExistedAnswer, setIsExistedAnswer] = useState(false);
  const [answerContent, setAnswerContent] = useState(null);
  const [listAnswer, setListAnswer] = useState([]);

  const [questionContent, setQuestionContent] = useState('');
  const [questionChapter, setSelectedChapter] = useState(chapters[0]);
  const [questionSubject, setSelectedSubject] = useState(subjects[0]);
  const [questionCorrectAnswerIndex, setQuestionCorrectAnswerIndex] =
    useState(-1);
  const [listQuestion, setListQuestion] = useState([]);
  const [isRequestChangeQuestions, setIsRequestedChangeQuestions] =
    useState(false);

  const [selectedLevel, setSelectedLevel] = useState('Dễ');

  const [expandedIndex, setExpandedIndex] = useState(null); //Hoa hòe lá hẹ thu gọn câu hỏi

  const [deleteQuestionIndex, setDeleteQuestionIndex] = useState(-1);
  const [updateQuestionIndex, setUpdateQuestionIndex] = useState(-1);

  const toggleExpand = (index) => {
    setExpandedIndex(index);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openModal = (modalName) => {
    setIsOpenModal(true);
    setModalName(modalName);
    setQuestionContent('');
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
  const addNewQuestion = (question, chapter, subject, level) => {
    if (!questionContent || !questionChapter || !questionSubject) {
      alert('Vui lòng chọn đủ thông tin');
      return;
    }
    const newQuestion = { question, chapter, subject, level };

    setListQuestion((prevList) => {
      const updatedList = [...prevList, newQuestion];

      return updatedList;
    });

    setQuestionContent('');
    setListAnswer([]);
    setIsRequestedChangeQuestions(true);
    alert('Đã thêm câu hỏi');
  };
  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };
  const handleChapterChange = (event) => {
    setSelectedChapter(event.target.value);
  };
  const handleLevleChange = (event) => {
    setSelectedLevel(event.target.value);
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
    setSelectedSubject(questionToEdit.subject);
    setSelectedChapter(questionToEdit.chapter);
    setSelectedLevel(questionToEdit.level);

    setUpdateQuestionIndex(index);
    openModal('sua-cau-hoi');
  };
  const handleUpdateQuestion = (questions, index) => {
    setUpdateQuestionIndex(index);
    const updatedList = [...questions];

    const updatedQuestion = {
      question: questionContent,
      subject: questionSubject,
      chapter: questionChapter,
      level: selectedLevel,
    };
    updatedList.splice(index, 1, updatedQuestion);
    setListQuestion(updatedList);
    alert('Đã cập nhật câu hỏi');
    setIsRequestedChangeQuestions(true);
  };

  const checkCorrectQuestionAnwserIndex = (index) => {
    return questionCorrectAnswerIndex === index;
  };
  const updateCorrectQuestionAnswerIndex = (index)=>{
    setQuestionCorrectAnswerIndex(index);
  }

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(listQuestion.length / itemsPerPage);

  const [currentData, setCurrentData] = useState([]);

  // Cập nhật currentData mỗi khi listQuestion hoặc currentPage thay đổi
  useEffect(() => {
    const data = listQuestion.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    setCurrentData(data);
  }, [listQuestion, currentPage]); // Call back xảy ra khi [listQuestion, currentPage] thay đổi

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
                    value={questionSubject}
                    onChange={handleSubjectChange}
                    className="w-60 border-1 p-1 mt-1 rounded-md"
                    id="subjects"
                  >
                    {subjects.map((subject, index) => (
                      <option key={index}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col ">
                  <p className="text-blue-800">Chương</p>
                  <select
                    value={questionChapter}
                    onChange={handleChapterChange}
                    className="w-60 border-1 p-1 mt-1 rounded-md"
                    id="chapters"
                  >
                    {chapters.map((chapter, index) => (
                      <option key={index}>{chapter}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <p className="text-blue-800">Độ khó</p>
                  <select
                    value={selectedLevel}
                    onChange={handleLevleChange}
                    className="w-60 border-1 p-1 mt-1 rounded-md"
                  >
                    <option>Dễ</option>
                    <option>Trung bình</option>
                    <option>Khó</option>
                  </select>
                </div>
              </div>
            </div>
            <textarea
              value={questionContent || ''}
              onChange={(e) => {
                creatNewQuesion(e.target.value);
              }}
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
                            className={`flex-1 max-w-96  ${expandedIndex === index ? 'whitespace-normal' : 'overflow-hidden text-ellipsis whitespace-nowrap'} break-words`}
                            onClick={() => {
                              toggleExpand(index);
                            }}
                          >
                            {answer}
                          </div>
                          <div className="w-20 ml-8 flex items-center">
                            <Checkbox
                              title="Đáp án đúng"
                              className=""
                              checked={()=>{checkCorrectQuestionAnwserIndex(index)}}
                              onClick={()=>{updateCorrectQuestionAnswerIndex(index)}}
                            ></Checkbox>
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
            {/* Hien thi danh sach cac cau tra loi */}
            {isRequestAddAnswer && (
              <div className="flex flex-col w-full min-h-64 space-y-4 mt-4">
                <p className="text-lg font-bold">Nội dung câu trả lời</p>
                <textarea
                  value={answerContent || ''}
                  onChange={(e) => {
                    createNewAnswer(e.target.value);
                  }}
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
              onClick={() => {
                addNewQuestion(
                  questionContent,
                  questionChapter,
                  questionSubject,
                  selectedLevel
                );
              }}
            />
          </div>
        );
      case 'them-tu-file':
        return (
          <div className="w-full bg-white mt-4 flex flex-col justify-center items-center text-xl">
            <div className="w-full flex justify-evenly items-center mt-8 space-x-4">
              <div className="w-1/2 flex flex-col space-y-2">
                <p>Môn học</p>
                <select className="w-full border">
                  {subjects.map((subject, index) => (
                    <option key={index}>{subject}</option>
                  ))}
                </select>
              </div>
              <div className="w-1/2 flex flex-col space-y-2">
                <p>Chương</p>
                <select className="w-full border">
                  {chapters.map((chapter, index) => (
                    <option key={index}>{chapter}</option>
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
              {/* <button className="border pl-16 pr-16 pt-2 pb-2 rounded-sm bg-blue-900 text-white hover:bg-red-700">
                Thêm file excel
              </button> */}
              <CustomButton
                title="Thêm file excel"
                classname=" pl-16 pr-16 pt-2 pb-2 rounded-sm"
              />
              <CustomButton
                title="Thêm vào hệ thống"
                classname=" pl-16 pr-16 pt-2 pb-2 rounded-sm"
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
                onClick={() => {
                  handleActiceTab('them-thu-cong');
                }}
              >
                Thêm thủ công
              </div>
              <div
                className={`p-2 bg-black text-white ${activeTab === 'them-tu-file' ? 'bg-blue-800 rounded-tl-xl' : 'bg-black'}`}
                onClick={() => {
                  handleActiceTab('them-tu-file');
                }}
              >
                Thêm từ file
              </div>
            </div>
            <div className="w-full">{renderContent()}</div>
          </div>
        );
      case 'sua-cau-hoi':
        return (
          //Modal sửa câu hỏi
          <div className="w-full bg-white mt-4">
            <div className="flex items-center justify-center">
              <div className="w-full flex justify-evenly">
                <div className="flex flex-col">
                  <p className="text-blue-800">Môn học</p>
                  <select
                    value={questionSubject}
                    onChange={handleSubjectChange}
                    className="w-60 border-1 p-1 mt-1 rounded-md"
                    id="subjects"
                  >
                    {subjects.map((subject, index) => (
                      <option key={index}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col ">
                  <p className="text-blue-800">Chương</p>
                  <select
                    value={questionChapter}
                    onChange={handleChapterChange}
                    className="w-60 border-1 p-1 mt-1 rounded-md"
                    id="chapters"
                  >
                    {chapters.map((chapter, index) => (
                      <option key={index}>{chapter}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <p className="text-blue-800">Độ khó</p>
                  <select
                    value={selectedLevel}
                    onChange={handleLevleChange}
                    className="w-60 border-1 p-1 mt-1 rounded-md"
                  >
                    <option>Dễ</option>
                    <option>Trung bình</option>
                    <option>Khó</option>
                  </select>
                </div>
              </div>
            </div>
            <textarea
              value={questionContent}
              onChange={(e) => {
                creatNewQuesion(e.target.value);
              }}
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
                            className={`flex-1 max-w-96  ${expandedIndex === index ? 'whitespace-normal' : 'overflow-hidden text-ellipsis whitespace-nowrap'} break-words`}
                            onClick={() => {
                              toggleExpand(index);
                            }}
                          >
                            {answer}
                          </div>
                          <div className="w-20 ml-8 flex items-center">
                            <Checkbox
                              title="Đáp án đúng"
                              className=""
                            ></Checkbox>
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
            {/* Hien thi danh sach cac cau tra loi */}
            {isRequestAddAnswer && (
              <div className="flex flex-col w-full min-h-64 space-y-4 mt-4">
                <p className="text-lg font-bold">Nội dung câu trả lời</p>
                <textarea
                  value={answerContent || ''}
                  onChange={(e) => {
                    createNewAnswer(e.target.value);
                  }}
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
              onClick={() => {
                handleUpdateQuestion(listQuestion, updateQuestionIndex);
              }}
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
            onClick={() => {
              openModal('them-cau-hoi');
            }}
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
          >
            <option>Cấu trúc dữ liệu và giải thuật</option>
            <option>Phân tích thiết kế hệ thống thông tin</option>
            <option>Toán tin học</option>
          </select>
          <select
            className="w-64 border-2 p-2 rounded-xl bg-blue-50 text-blue-800"
            name="sl-chuong"
          >
            <option>Chương 1</option>
            <option>Chương 2</option>
            <option>Chương 3</option>
          </select>
          <div className="flex space-x-2 items-center ml-auto mr-8">
            Độ khó:
            <select
              className=" ml-4 w-32 border-2 p-2 rounded-xl bg-blue-50 text-blue-800"
              name="sl-dokho"
            >
              <option>Tất cả</option>
              <option>Dễ</option>
              <option>Trung bình</option>
              <option>Khó</option>
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
        <div className="flex items-center space-x-8 mt-4 ml-8 mr-8  max-h-140 flex-grow">
          <table className="w-full mt-2">
            <thead>
              <tr className="w-full">
                <th className="text-center">STT</th>
                <th className="text-center">Nội dung câu hỏi</th>
                <th className="text-center">Môn học</th>
                <th className="text-center pr-8">Độ khó</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isRequestChangeQuestions &&
                currentData.map((item, index) => (
                  <tr key={index} className={`hover:bg-black hover:text-white`}>
                    <td className="text-center py-4 text-blue-600 font-bold">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td>
                      <div
                        className={`flex-1 max-w-130 text-center  ${expandedIndex === index ? 'whitespace-normal' : 'overflow-hidden text-ellipsis whitespace-nowrap'} break-words`}
                        onClick={() => {
                          toggleExpand(index);
                        }}
                      >
                        {item.question}
                      </div>
                    </td>
                    {/* {`flex-1 max-w-96  ${expandedIndex === index ? 'whitespace-normal' : 'overflow-hidden text-ellipsis whitespace-nowrap'} break-words`} */}
                    <td className="text-center overflow-hidden w-full">
                      <div
                        className={`flex-1 max-w-full text-center  ${expandedIndex === index ? 'whitespace-normal' : 'overflow-hidden text-ellipsis whitespace-nowrap'} break-words`}
                        onClick={() => {
                          toggleExpand(index);
                        }}
                      >
                        {item.subject}
                      </div>
                    </td>
                    <td className="text-center pr-8">{item.level}</td>
                    <td className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div
                          onClick={() => {
                            handleEditQuestion(index);
                          }}
                          className=" text-white bg-blue-900 rounded-2xl p-1"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </div>
                        <div
                          className=" text-white bg-red-700 rounded-2xl p-1"
                          onClick={() => {
                            handelDeleteQuesion(listQuestion, index);
                          }}
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
