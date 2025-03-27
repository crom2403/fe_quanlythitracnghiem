import { PlusIcon, XIcon, SearchIcon } from '@heroicons/react/outline';
import PaginatedTable from '../../components/pagination/PaginatedTable';
import { useState, useEffect } from 'react';
import CustomModal from '../../components/modal/CustomModal';
import CustomButton from '../../components/button/CustomButton';
import { Checkbox } from '@mui/material';

const defaultAssignments = [
  {
    id:1,
    tengv: 'Nguyễn Thành An',
    mamh: 3,
    tenmh: 'Cấu trúc dữ liệu và giải thuật',
  },
  {
    id:3,
    tengv: 'Nguyễn Thành Công',
    mamh: 3,
    tenmh: 'Nhập môn lập trình',
  },
  {
    id:5,
    tengv: 'Trần Văn Hưng',
    mamh: 3,
    tenmh: 'Lập trình hướng đối tượng',
  },
];
const defaultTeachers = [
    {
        tengv:'Trần Bình An'
    },
    {
        tengv:'Lương Minh Ân'
    },
    {
        tengv:'Nguyễn Thành Trọng'
    },
]
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
const Assignment = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalName, setModalName] = useState('them-phan-cong');
  const [assignments, setAssignments] = useState(defaultAssignments);
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
  const totalPages = Math.ceil(assignments.length / itemsPerPage);
  const [currentData, setCurrentData] = useState(assignments);

  useEffect(() => {
    const data = assignments.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    setCurrentData(data);
  }, [assignments, currentPage]);

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

  const renderContent = () => {
    return (
      <div className="w-full mt-4 flex flex-col space-y-4">
        <div className='flex items-center'>
            <p className='text-cyan-700'>Giảng viên</p>
            <select className='ml-4 w-64 border p-1 rounded-sm'>
                {defaultTeachers.map((teacher, index)=>(
                    <option key={index}>{teacher.tengv}</option>
                ))}
            </select>
        </div>
        <div className='w-full flex items-center'>
            <input className=' w-9/10 bg-gray-200 p-1 rounded-l-md' type='search' placeholder='Tìm môn học theo tên...'/>
            <div className='bg-gray-100 w-8 h-8 flex items-center justify-center rounded-r-md'><SearchIcon className='w-5 h-5' /></div>
        </div>
        <div className="flex items-center space-x-8 mt-4 max-h-140 overflow-auto">
          <table className="w-full mt-2">
            <thead>
              <tr className="w-full bg-gray-100 h-10">
                <th className="text-center min-w-16">Chọn</th>
                <th className="text-center min-w-16">Mã môn học</th>
                <th className="text-center min-w-64">Tên môn học</th>
                <th className="text-center min-w-16">Số tín chỉ</th>
                <th className="text-center min-w-64">Số tiết lý thuyết</th>
                <th className="text-center ">Số tiết thực hành</th>
              </tr>
            </thead>
            <tbody>
              {defaultSubjects.map((item, index) => (
                <tr key={index} className="">
                  <td className="text-center py-4 text-blue-600 font-bold">
                    <Checkbox />
                  </td>
                  <td className="text-center min-w-16">{item.mamh}</td>
                  <td>
                    <div
                      className={`flex-1 max-w-90 text-center ${expandedIndex === index ? 'whitespace-normal' : 'overflow-hidden text-ellipsis whitespace-nowrap'} break-words`}
                      onClick={() => toggleExpand(index)}
                    >
                      {item.tenmh}
                    </div>
                  </td>
                 
                  <td className="text-center ">{item.sotinchi}</td>
                  <td className="text-center ">{item.sotietLT}</td>
                  <td className="text-center">{item.sotietTH}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='flex justify-center'>
            <CustomButton classname="w-2/5 p-2 text-xl" title="Lưu phân công" />
        </div>
      </div>
      
    );
  };
  return (
    <div
      className="w-full min-h-screen bg-gray-100 flex justify-center"
      style={{ fontFamily: 'PlayFair Display' }}
    >
      {modalName === 'them-phan-cong' && (
        <CustomModal
          isOpen={isOpenModal}
          onClose={closeModal}
          className="bg-white rounded-xl p-6 min-w-300 min-h-120 overflow-auto max-h-140 mx-auto z-40 mt-20 border-2 border-black"
          title="Them mon hoc"
        >
          {modalContent()}
        </CustomModal>
      )}

      <div className="w-9/10 h-full bg-white mt-8 rounded-2xl">
        <div className="w-full flex bg-gray-200 items-center pt-4 pl-8 pr-8 pb-4 rounded-t-xl">
          <p>Tất cả phân công</p>
          <div
            onClick={() => {
              openModal('them-phan-cong');
            }}
            className="flex space-x-2 ml-auto h-3/4 items-center bg-red-700 text-white p-2 rounded-xl hover:bg-blue-900"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            THÊM PHÂN CÔNG
          </div>
        </div>
        <div className="flex items-center space-x-8 mt-8 ml-8">
          <div className="min-w-96 flex items-center space-x-2">
            <input
              type="search"
              placeholder="Tìm kiếm giảng viên, môn học..."
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
                <th className="text-center min-w-16">ID</th>
                <th className="text-center min-w-64">Tên giảng viên</th>
                <th className="text-center min-w-16">Mã môn học</th>
                <th className="text-center min-w-64">Tên môn học</th>
                <th className="text-center ">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index} className="hover:bg-black hover:text-white">
                  <td className="text-center py-4 text-blue-600 font-bold">
                    {item.id}
                  </td>
                  <td>
                    <div
                      className={`flex-1 max-w-90 text-center ${expandedIndex === index ? 'whitespace-normal' : 'overflow-hidden text-ellipsis whitespace-nowrap'} break-words`}
                      onClick={() => toggleExpand(index)}
                    >
                      {item.tengv}
                    </div>
                  </td>
                  <td className="text-center min-w-32">{item.mamh}</td>
                  <td className="text-center ">{item.tenmh}</td>
                  <td className="text-center">
                    <div className="flex items-center justify-center space-x-2">
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

export default Assignment;
