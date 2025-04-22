import {
  PlusIcon,
  BookOpenIcon,
  ClockIcon,
  EyeIcon,
  XIcon,
  RefreshIcon,
  PencilIcon
} from '@heroicons/react/outline';
import { FaWrench } from 'react-icons/fa';
import { examPapersResponse } from './ExamPaperService';
import { useEffect, useState } from 'react';
import { Checkbox } from '@mui/material';
import CustomModal from '../../components/modal/CustomModal';
import CustomButton from '../../components/button/CustomButton';
import PaginatedTable from '../../components/pagination/PaginatedTable';
const statusColors = {
  'Đã đóng': 'bg-red-200 text-red-700',
  'Đang mở': 'bg-green-200 text-green-700',
  'Chưa bắt đầu': 'bg-yellow-200 text-yellow-700',
};

const ExamPaper = () => {
  const [openModalName, setOpenModalName] = useState('');
  const [examPapers, setExamPapers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const openModal = (modalName) => {
    setOpenModalName(modalName);
  };
  const closeModal = () => {
    setOpenModalName('');
  };
  const fetchgroupedCourses = async()=>{
    const result = await getGroupedgroupedCoursesData();
    if(result)
    {
      setgroupedCourses(result);
    }
  }

  const fetchExamPapers = async () => {
    const result = await examPapersResponse();
    if (result) {
      setExamPapers(result);
    }
  };

  useEffect(() => {
    fetchExamPapers();
    fetchgroupedCourses();
  }, []);

  // Calculate total pages and slice data for the current page
  const totalPages = Math.ceil(examPapers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExamPapers = examPapers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const deThiModalContent = () => {
    return (
      <div
        className="w-full bg-gray-100 rounded-lg min-h-100 mt-4 pl-4 pr-4 flex flex-col space-y-4"
        style={{ fontFamily: 'playfair display' }}
      >
        <div className=" flex flex-col space-y-2 mt-4">
          <p className="text-blue-600">Tên đề kiểm tra</p>
          <input
            type="text"
            className="w-full bg-white p-1 rounded-md"
            placeholder="Nhập tên đề kiểm tra..."
          />
        </div>

        <p className="text-blue-600">Thời gian thực hiện</p>
        <div className=" flex items-center">
          <input
            type="datetime-local"
            className="w-full bg-white p-1 rounded-md"
          />
          <p className="w-40 flex justify-center items-center">đến</p>
          <input
            type="datetime-local"
            className="w-full bg-white p-1 rounded-md"
          />
        </div>
        <div className=" flex items-center">
          <div className="p-1 bg-gray-600 text-white">Thời gian làm bài</div>
          <input
            type="number"
            className="flex-1 bg-white p-1 rounded-md text-center"
            placeholder="Nhập thời gian làm bài..."
            min="15"
            max="180"
          />
          <div className="bg-gray-600 text-white p-1 w-16 flex items-center justify-center">
            Phút
          </div>
        </div>
        <div className=" flex flex-col min-h-40 bg-white rounded-t-md">
          <div className="flex h-15 w-full bg-gray-600 text-white  items-center rounded-t-md">
            <p className="ml-8">Giao cho</p>
            <select className="ml-auto mr-8 bg-white text-black p-2 min-w-100 rounded-md">
              {Array.from(groupedCourses.entries()).map(([key, courses],index)=>(
                <option>{courses.key}</option>
              ))}
            </select>
          </div>
          <div className="">
            <div className="flex justify-center items-center">
              <Checkbox /> <p>Chọn tất cả</p>
            </div>
          </div>
          <div className="">
            <div className="flex  items-center justify-evenly">
              <div className="flex items-center">
                <Checkbox /> <p>Nhóm 1</p>
              </div>
              <div className="flex items-center">
                <Checkbox /> <p>Nhóm 2</p>
              </div>
              <div className="flex items-center">
                <Checkbox /> <p>Nhóm 3</p>
              </div>
            </div>
          </div>
          <div className="flex justify-evenly">
            <div className=" ">
              <p className="text-blue-600">Số câu dễ</p>
              <input
                type="number"
                className="bg-gray-100 p-1 rounded-md w-56"
                placeholder="Nhập..."
              />
            </div>
            <div className=" ">
              <p className="text-blue-600">Số câu trung bình</p>
              <input
                type="number"
                className="bg-gray-100 p-1 rounded-md w-56"
                placeholder="Nhập..."
              />
            </div>
            <div className=" ">
              <p className="text-blue-600">Số câu khó</p>
              <input
                type="number"
                className="bg-gray-100 p-1 rounded-md w-56"
                placeholder="Nhập..."
              />
            </div>
          </div>
          <div className="w-full mt-4 flex justify-center items-center text-xl">
            {openModalName === 'de-thi' && (
              <CustomButton classname="w-3/5 pt-2 pb-2" title="TẠO ĐỀ THI" />
            )}
            {openModalName === 'sua-de-thi' && (
              <div className="w-full flex justify-center space-x-8">
                <div className="w-2/6 pt-2 pb-2 bg-green-600 text-white flex items-center space-x-2 justify-center rounded-md hover:bg-cyan-900">
                    <RefreshIcon className='w-5 h-5' />
                    <p>CẬP NHẬT ĐỀ</p>
                </div>
                <div className="w-3/6 pt-2 pb-2 bg-gray-600 text-white flex items-center space-x-2 justify-center rounded-md hover:bg-cyan-900">
                    <PencilIcon className='w-5 h-5' />
                    <p>CHỈNH SỬA DANH SÁCH CÂU HỎI</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="w-full min-h-screen bg-gray-100 flex justify-center"
      style={{ fontFamily: 'PlayFair Display' }}
    >
      <CustomModal
        isOpen={openModalName === 'de-thi' || openModalName === 'sua-de-thi'}
        onClose={closeModal}
        className="bg-blue-50 rounded-xl p-6 w-200 mx-auto z-40 min-h-150 mt-20 border-2 border-black w-250"
        title="Thêm đề thi"
      >
        {deThiModalContent()}
      </CustomModal>
      <div className="w-9/10 h-full bg-white mt-8 rounded-2xl">
        <div className="flex mt-4 ml-8">
          <select className="w-26 bg-blue-100 p-1">
            <option>Tất cả</option>
          </select>
          <input
            className="w-100 bg-gray-100 p-1"
            placeholder="Tìm đề thi..."
          />
          <div
            onClick={() => {
              openModal('de-thi');
            }}
            className="ml-auto mr-8 flex space-x-2 items-center bg-blue-500 text-white p-2 rounded-md hover:bg-black"
          >
            <PlusIcon className="w-5 h-5" />
            <p>TẠO ĐỀ THI</p>
          </div>
        </div>
        <div className="w-full mt-8">
          {currentExamPapers.map((exampaper, index) => (
            <div
              key={index}
              className="flex items-center  space-y-4 bg-cyan-50 mt-4 text-black rounded-3xl border-l-4 border-t-2 border-cyan-600"
            >
              <div className="w-1/2 pl-8 ">
                <p className="text-2xl pt-4 text-blue-900">{exampaper.name}</p>
                <div className="flex items-center mt-4">
                  <BookOpenIcon className="w-4 h-4 mr-2" />
                  Giao cho học phần:{' '}
                  <p className="text-blue-700">{exampaper.group_student_name}</p>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  Diễn ra từ: {exampaper.start_time} đến {exampaper.end_time}
                </div>
              </div>
              <div className="w-1/2 flex items-center space-x-2">
                <div
                  className={`min-w-25 max-w-30 flex items-center justify-center p-1 rounded-2xl ${statusColors[exampaper.trangthai]}`}
                >
                  <p>{exampaper.trangthai}</p>
                </div>
                <div className="flex w-36 items-center justify-center space-x-2 bg-white text-black p-1 rounded-2xl hover:bg-blue-950 hover:text-white">
                  <EyeIcon className="w-4 h-4" />
                  <p>Xem chi tiết</p>
                </div>
                <div
                  onClick={() => {
                    openModal('sua-de-thi');
                  }}
                  className="flex w-36 items-center justify-center space-x-2 bg-cyan-400 text-white p-1 rounded-2xl hover:bg-blue-950"
                >
                  <FaWrench className="w-4 h-4" />
                  <p>Chỉnh sửa</p>
                </div>
                <div className="flex w-25 items-center justify-center space-x-2 bg-red-300 text-red-900 hover:bg-red-700 hover:text-white p-1 rounded-2xl ">
                  <XIcon className="w-4 h-4" />
                  <p>Xóa đề</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Add PaginatedTable */}
        <div className="flex justify-center mt-8 mb-4">
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

export default ExamPaper;