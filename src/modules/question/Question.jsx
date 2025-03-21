import {
  PlusIcon,
  PencilIcon,
  XIcon,
  SearchIcon,
} from '@heroicons/react/outline';
import PaginatedTable from '../../components/pagination/PaginatedTable';
import { useState } from 'react';
import CustomModal from '../../components/modal/CustomModal';

const listQuestions = [
  ['OOP là viết tắt của ...?', 'Cấu trúc dữ liệu và giải thuật', 'Dễ'],
  [
    'Trình bày cách sử dụng các mô hình thác nước, Scrum, Prototype',
    'Phân tích thiết kế hệ thống thông tin',
    'Trung bình',
  ],
  [
    'Đặc điểm cơ bản của lập trình hướng đối tượng là gì?',
    'Cấu trúc dữ liệu và giải thuật',
    'Dễ',
  ],
  ['Lập trình hướng đối tượng là gì?', 'Cấu trúc dữ liệu và giải thuật', 'Dễ'],
  [
    'Chuẩn Boycott trong thiết kế database?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],
  ['Thế nào là hiện tượng nạp chồng?', 'Cấu trúc dữ liệu và giải thuật', 'Dễ'],
  [
    'Hãy cho biết điều kiện đạt chuẩn 3 của bảng dữ liệu?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],

  [
    'Điều kiện để xuất hiện thực thể mối kết hợp?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],
  ['UX/UI là gì', 'Phân tích thiết kế hệ thống thông tin', 'Dễ'],
  [
    'Hãy cho biết điều kiện đạt chuẩn 3 của bảng dữ liệu?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],
  [
    'Hãy cho biết điều kiện đạt chuẩn 3 của bảng dữ liệu?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],
  [
    'Hãy cho biết điều kiện đạt chuẩn 3 của bảng dữ liệu?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],
  [
    'Hãy cho biết điều kiện đạt chuẩn 3 của bảng dữ liệu?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],
  ['OOP là viết tắt của ...?', 'Cấu trúc dữ liệu và giải thuật', 'Dễ'],
  [
    'Trình bày cách sử dụng các mô hình thác nước, Scrum, Prototype',
    'Phân tích thiết kế hệ thống thông tin',
    'Trung bình',
  ],
  [
    'Đặc điểm cơ bản của lập trình hướng đối tượng là gì?',
    'Cấu trúc dữ liệu và giải thuật',
    'Dễ',
  ],
  ['Lập trình hướng đối tượng là gì?', 'Cấu trúc dữ liệu và giải thuật', 'Dễ'],
  [
    'Chuẩn Boycott trong thiết kế database?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],
  ['Thế nào là hiện tượng nạp chồng?', 'Cấu trúc dữ liệu và giải thuật', 'Dễ'],
  [
    'Hãy cho biết điều kiện đạt chuẩn 3 của bảng dữ liệu?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],

  [
    'Điều kiện để xuất hiện thực thể mối kết hợp?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],
  ['UX/UI là gì', 'Phân tích thiết kế hệ thống thông tin', 'Dễ'],
  [
    'Hãy cho biết điều kiện đạt chuẩn 3 của bảng dữ liệu?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],
  [
    'Hãy cho biết điều kiện đạt chuẩn 3 của bảng dữ liệu?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],
  [
    'Hãy cho biết điều kiện đạt chuẩn 3 của bảng dữ liệu?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],
  [
    'Hãy cho biết điều kiện đạt chuẩn 3 của bảng dữ liệu?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],
  ['OOP là viết tắt của ...?', 'Cấu trúc dữ liệu và giải thuật', 'Dễ'],
  [
    'Trình bày cách sử dụng các mô hình thác nước, Scrum, Prototype',
    'Phân tích thiết kế hệ thống thông tin',
    'Trung bình',
  ],
  [
    'Đặc điểm cơ bản của lập trình hướng đối tượng là gì?',
    'Cấu trúc dữ liệu và giải thuật',
    'Dễ',
  ],
  ['Lập trình hướng đối tượng là gì?', 'Cấu trúc dữ liệu và giải thuật', 'Dễ'],
  [
    'Chuẩn Boycott trong thiết kế database?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],
  ['Thế nào là hiện tượng nạp chồng?', 'Cấu trúc dữ liệu và giải thuật', 'Dễ'],
  [
    'Hãy cho biết điều kiện đạt chuẩn 3 của bảng dữ liệu?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],

  [
    'Điều kiện để xuất hiện thực thể mối kết hợp?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],
  ['UX/UI là gì', 'Phân tích thiết kế hệ thống thông tin', 'Dễ'],
  [
    'Hãy cho biết điều kiện đạt chuẩn 3 của bảng dữ liệu?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],
  [
    'Hãy cho biết điều kiện đạt chuẩn 3 của bảng dữ liệu?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],
  [
    'Hãy cho biết điều kiện đạt chuẩn 3 của bảng dữ liệu?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],
  [
    'Hãy cho biết điều kiện đạt chuẩn 3 của bảng dữ liệu?',
    'Phân tích thiết kế hệ thống thông tin',
    'Dễ',
  ],
];

const Question = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(listQuestions.length / itemsPerPage);

  const currentData = listQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [isOpenModal, setIsOpenModal] = useState(false);
  const openModal = () => {
    setIsOpenModal(true);
  };
  const closeModal = () => {
    setIsOpenModal(false);
  };
  const [activeTab, setActiveTab] = useState('them-thu-cong');
  const handleActiceTab = (tabName) => {
    setActiveTab(tabName);
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'them-thu-cong':
        return (
          <div className="w-full bg-white mt-4">
            <div className='flex items-center justify-center'>
              <div className="w-full flex justify-evenly">
                <div className="flex flex-col">
                  <p className='text-blue-800'>Môn học</p>
                  <select className="w-60 border-1 p-1 mt-1 rounded-md">
                    <option>Toán tin học</option>
                    <option>Lập trình hướng đối tượng</option>
                  </select>
                </div>
                <div className="flex flex-col ">
                  <p className='text-blue-800'>Chương</p>
                  <select className="w-60 border-1 p-1 mt-1 rounded-md">
                    <option>Chương 1</option>
                    <option>Chương 2</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <p className='text-blue-800'>Độ khó</p>
                  <select className="w-60 border-1 p-1 mt-1 rounded-md">
                    <option>Dễ</option>
                    <option>Trung bình</option>
                    <option>Khó</option>
                  </select>
                </div>
              </div>
            </div>
            <textarea type='text' className='w-full  mt-4 min-h-60 border focus:outline-none focus:border-3 focus:border-gray-500 focus:ring-gray-500 focus:shadow-lg focus:shadow-gray-400' />
            <div className='w-auto flex flex-col mt-8 mr-8 justify-center items-center'>
                <p className='font-bold mb-2 text-blue-800'>Danh sách đáp án</p>
                {/* <div>render câu trả lời</div>  */}
                <div className='max-w-45 p-2 bg-black  text-white text-center rounded-md hover:bg-red-700'>THÊM CÂU TRẢ LỜI</div>
                {/* <div>textarea nhập câu trả lời, button lưu câu trả lời(hiển thị lên div render câu trả lời)</div> */}
            </div>
          </div>
        );
      case 'them-tu-file':
        return(
            <div className="w-full bg-white mt-4 flex flex-col justify-center items-center text-xl">
              <div className='flex flex-col justify-center space-y-4 mt-8'>
                <div className='flex space-x-8 items-center'>
                    <p>Chọn file:</p>
                    <input type='file' className='w-64 border p-1 rounded-md'/>
                </div>
                <div className='flex space-x-8 items-center'>
                    <p className='italic text-blue-800'>Vui lòng tạo file theo mẫu! <a className='text-red-600 hover:underline' download="mauCauHoi.xlsx" href='/files/mauCauHoi.xlsx'>Tải mẫu</a></p>
                </div>
              </div>
              <div className='w-full flex mt-16 justify-center'>
                <button className='border pl-16 pr-16 pt-2 pb-2 rounded-sm bg-blue-900 text-white hover:bg-red-700'>Nhập file</button>
              </div>
            </div>
          );
    }
  };
  const modalContent = () => {
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
          className="bg-white rounded-xl p-6 min-w-200 min-h-100 mx-auto z-40 mt-20 border-2 border-black"
        >
          {modalContent()}
        </CustomModal>
        <div className="w-full flex bg-gray-200 items-center pt-4 pl-8 pr-8 pb-4 rounded-t-xl">
          <p className="font-bold text-xl">Tất cả câu hỏi</p>
          <div
            onClick={openModal}
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
                <th className="text-center">Độ khó</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="">
              {currentData.map((question, index) => (
                <tr key={index} className={`hover:bg-black hover:text-white `}>
                  <td className="text-center py-4 text-blue-600 font-bold">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td>{question[0]}</td>
                  <td className="text-center">{question[1]}</td>
                  <td className="text-center">{question[2]}</td>
                  <td className="text-center ">
                    <div className="flex items-center justify-center space-x-4">
                      <div className=" text-white bg-blue-900 rounded-2xl p-1">
                        <PencilIcon className="w-5 h-5" />
                      </div>
                      <div className=" text-white bg-red-700 rounded-2xl p-1">
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
