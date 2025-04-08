import {
  PlusIcon,
  PencilIcon,
  XIcon,
  SearchIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';
import PaginatedTable from '../../components/pagination/PaginatedTable';
import { useState, useEffect } from 'react';
import CustomModal from '../../components/modal/CustomModal';
import CustomButton from '../../components/button/CustomButton';

const defaultSubjects = [
  {
    mamh: '800000',
    tenmh: 'Cấu trúc dữ liệu và giải thuật',
    sotinchi: 3,
    sotietLT: 30,
    sotietTH: 30,
  },
  {
    mamh: '800001',
    tenmh: 'Lập trình hướng đối tượng',
    sotinchi: 3,
    sotietLT: 30,
    sotietTH: 30,
  },
  {
    mamh: '800002',
    tenmh: 'Nhập môn lập trình',
    sotinchi: 3,
    sotietLT: 30,
    sotietTH: 30,
  },
];
const Subject = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalName, setModalName] = useState('them-mon-hoc');
  const [subjects, setSubjects] = useState(defaultSubjects);
  const [expandedIndex, setExpandedIndex] = useState(null);

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(subjects.length / itemsPerPage);
  const [currentData, setCurrentData] = useState(subjects);

  useEffect(() => {
    const data = subjects.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    setCurrentData(data);
  }, [subjects, currentPage]);

  const modalContent = () => {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{ fontFamily: 'Playfair display' }}
      >
        <div className="w-full">{renderContent()}</div>
      </div>
    );
  };
  const updateSubjectContent = () => {
    return (
      <div className="w-full mt-4 flex flex-col space-y-4">
        <div className="w-full">
          <p className="text-xl font-bold">Mã môn học</p>
          <input
            type="text"
            className="border p-1 rounded-md w-full mt-4"
            placeholder="Nhập mã môn học..."
          />
        </div>
        <div>
          <p className="text-xl font-bold">Tên môn học</p>
          <input
            type="text"
            className="border p-1 rounded-md w-full mt-4"
            placeholder="Nhập tên môn học..."
          />
        </div>
        <div className="flex w-full items-center  space-x-6">
          <div className="w-1/2">
            <p className="text-xl font-bold">Tổng số tín chỉ</p>
            <input
              type="number"
              className="border p-1 rounded-md w-full mt-4"
              placeholder="Nhập số tín chỉ..."
            />
          </div>
          <div className="">
            <p>Số tiết lý thuyết</p>
            <input
              type="number"
              className="border p-1 rounded-md w-full mt-4"
              placeholder="Nhập số tiết lý thuyết"
              min="1"
            />
          </div>
          <div className="">
            <p>Số tiết thực hành</p>
            <input
              type="number"
              className="border p-1 rounded-md w-full mt-4"
              placeholder="Nhập số tiết thực hành"
              min="1"
            />
          </div>
        </div>
        <div className="w-full flex items-center justify-center mt-8">
          <CustomButton
            title="LƯU THAY ĐỔI"
            classname="pl-16 pr-16 pt-2 pb-2"
          />
        </div>
      </div>
    );
  };
  const chapterModalContent = () => {
    return (
      <div className="w-full mt-4">
        <div className="flex items-center space-x-8 mt-4 ml-8 mr-8 max-h-140 overflow-auto">
          <table className="w-full mt-2">
            <thead>
              <tr className="w-full">
                <th className="text-center min-w-16">#</th>
                <th className="text-center min-w-64">Tên chương</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index} className="hover:bg-black hover:text-white">
                  <td className="text-center py-4 text-blue-600 font-bold">
                    #
                  </td>
                  <td>
                    <div
                      className={`flex-1 max-w-90 ${expandedIndex === index ? 'whitespace-normal' : 'overflow-hidden text-ellipsis whitespace-nowrap'} break-words`}
                      onClick={() => toggleExpand(index)}
                    >
                      Tên chương
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex space-x-8 mt-4 w-full justify-center">
          <div className="flex items-center space-x-2 bg-cyan-800 text-white p-2 rounded-2xl hover:bg-red-800">
            <PlusIcon className="w-5 h-5" />
            THÊM CHƯƠNG
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xl text-cyan-700">Tên chương</p>
          <input type="text" className="w-full p-1 border text-xl mt-4" placeholder='Nhập tên chương cần thêm...'/>
        </div>
      </div>
    );
  };
  const renderContent = () => {
    return (
      <div className="w-full mt-4 flex flex-col space-y-4">
        <div className="w-full">
          <p className="text-xl font-bold">Mã môn học</p>
          <input
            type="text"
            className="border p-1 rounded-md w-full mt-4"
            placeholder="Nhập mã môn học..."
          />
        </div>
        <div>
          <p className="text-xl font-bold">Tên môn học</p>
          <input
            type="text"
            className="border p-1 rounded-md w-full mt-4"
            placeholder="Nhập tên môn học..."
          />
        </div>
        <div className="flex w-full items-center  space-x-6">
          <div className="w-1/2">
            <p className="text-xl font-bold">Tổng số tín chỉ</p>
            <input
              type="number"
              className="border p-1 rounded-md w-full mt-4"
              placeholder="Nhập số tín chỉ..."
            />
          </div>
          <div className="">
            <p>Số tiết lý thuyết</p>
            <input
              type="number"
              className="border p-1 rounded-md w-full mt-4"
              placeholder="Nhập số tiết lý thuyết"
              min="1"
            />
          </div>
          <div className="">
            <p>Số tiết thực hành</p>
            <input
              type="number"
              className="border p-1 rounded-md w-full mt-4"
              placeholder="Nhập số tiết thực hành"
              min="1"
            />
          </div>
        </div>
        <div className="w-full flex items-center justify-center mt-8">
          <CustomButton
            title="LƯU THAY ĐỔI"
            classname="pl-16 pr-16 pt-2 pb-2"
          />
        </div>
      </div>
    );
  };
  return (
    <div
      className="w-full min-h-screen bg-gray-100 flex justify-center"
      style={{ fontFamily: 'PlayFair Display' }}
    >
      {modalName === 'them-mon-hoc' && (
        <CustomModal
          isOpen={isOpenModal}
          onClose={closeModal}
          className="bg-white rounded-xl p-6 min-w-200 min-h-120 overflow-auto max-h-140 mx-auto z-40 mt-20 border-2 border-black"
          title="Them mon hoc"
        >
          {modalContent()}
        </CustomModal>
      )}
      {modalName === 'chi-tiet-mon-hoc' && (
        <CustomModal
          isOpen={isOpenModal}
          onClose={closeModal}
          className="bg-white rounded-xl p-6 min-w-200 min-h-120 overflow-auto max-h-140 mx-auto z-40 mt-20 border-2 border-black"
          title="Chi tiet mon hoc"
        >
          {chapterModalContent()}
        </CustomModal>
      )}
      {modalName === 'sua-mon-hoc' && (
        <CustomModal
          isOpen={isOpenModal}
          onClose={closeModal}
          className="bg-white rounded-xl p-6 min-w-200 min-h-120 overflow-auto max-h-140 mx-auto z-40 mt-20 border-2 border-black"
          title="Sua mon hoc"
        >
          {updateSubjectContent()}
        </CustomModal>
      )}
      <div className="w-9/10 h-full bg-white mt-8 rounded-2xl">
        <div className="w-full flex bg-gray-200 items-center pt-4 pl-8 pr-8 pb-4 rounded-t-xl">
          <p>Tất cả môn học</p>
          <div
            onClick={() => {
              openModal('them-mon-hoc');
            }}
            className="flex space-x-2 ml-auto h-3/4 items-center bg-red-700 text-white p-2 rounded-xl hover:bg-blue-900"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            THÊM MÔN HỌC
          </div>
        </div>
        <div className="flex items-center space-x-8 mt-8 ml-8">
          <div className="min-w-96 flex items-center space-x-2">
            <input
              type="search"
              placeholder="Tìm kiếm môn học..."
              className="w-full bg-gray-100 rounded-xl p-2 text-black border focus:outline-none focus:border-3 focus:ring-blue-300 focus:border-blue-300 focus:shadow-md focus:shadow-blue-300 focus:bg-white"
            />
            <div className="bg-blue-800 text-white rounded-xl w-10 h-10 flex items-center justify-center hover:bg-black">
              <SearchIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-8 mt-4 ml-8 mr-8 max-h-140">
          <table className="w-full mt-2">
            <thead>
              <tr className="w-full bg-gray-100 h-10">
                <th className="text-center min-w-16">Mã môn</th>
                <th className="text-center min-w-64">Tên môn</th>
                <th className="text-center min-w-16">Số tín chỉ</th>
                <th className="text-center min-w-32">Số tiết lý thuyết</th>
                <th className="text-center min-w-16">Số tiết thực hành</th>
                <th className="text-center ">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index} className="hover:bg-black hover:text-white">
                  <td className="text-center py-4 text-blue-600 font-bold">
                    {item.mamh}
                  </td>
                  <td>
                    <div
                      className={`flex-1 max-w-90 text-center ${expandedIndex === index ? 'whitespace-normal' : 'overflow-hidden text-ellipsis whitespace-nowrap'} break-words`}
                      onClick={() => toggleExpand(index)}
                    >
                      {item.tenmh}
                    </div>
                  </td>
                  <td className="text-center overflow-hidden ">
                    {item.sotinchi}
                  </td>
                  <td className="text-center min-w-32">{item.sotietLT}</td>
                  <td className="text-center ">{item.sotietTH}</td>
                  <td className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div
                        onClick={() => {
                          openModal('chi-tiet-mon-hoc');
                        }}
                        className="text-white bg-green-800 rounded-2xl p-1"
                      >
                        <InformationCircleIcon className="w-5 h-5" />
                      </div>
                      <div
                        onClick={() => {
                          openModal('sua-mon-hoc');
                        }}
                        className="text-white bg-blue-900 rounded-2xl p-1"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </div>
                      <div className="text-white bg-red-700 rounded-2xl p-1">
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

export default Subject;
