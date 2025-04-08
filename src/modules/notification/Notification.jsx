import { PlusIcon } from '@heroicons/react/outline';
import CustomModal from '../../components/modal/CustomModal';
import { useState } from 'react';

const notifications = [
  {
    noidung:
      'A nộp bài giữa kì trước thứ 55555555555555555555555555555555555555555555555555555555555555555555555555555555dddddddddddddddddddddddđ',
    hocphan: '80000-Cấu trúc dữ liệu và giải thuật',
    nguoigui: 'Nguyễn Văn An',
  },
  {
    noidung: 'B nộp bài cuối kì trước thứ 7',
    hocphan: '80001-Cấu trúc dữ liệu và giải thuật',
    nguoigui: 'Nguyễn Văn B',
  },
  {
    noidung: 'C nộp bài đầu kì trước thứ 2',
    hocphan: '80002-Cấu trúc dữ liệu và giải thuật',
    nguoigui: 'Nguyễn Văn C',
  },
  {
    noidung: 'D nộp bài vào tuần sau',
    hocphan: '80003-Cấu trúc dữ liệu và giải thuật',
    nguoigui: 'Nguyễn Văn D',
  },
];

const Notification = () => {
  const [openModalName, setOpenModalName] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const openModal = (modalName) => {
    setOpenModalName(modalName);
  };

  const closeModal = () => {
    setOpenModalName('');
  };
  const toggleExpand = (index) => {
    setExpandedIndex(index);
  };
  const themThongBaoModalContent = () => {
    return (
      <div
        className="w-full bg-gray-100 rounded-lg min-h-100 mt-4 pl-4 pr-4 flex flex-col space-y-4"
        style={{ fontFamily: 'playfair display' }}
      >
        {/* Nội dung modal */}
      </div>
    );
  };

  return (
    <div
      className="w-full min-h-screen bg-gray-100 flex justify-center"
      style={{ fontFamily: 'PlayFair Display' }}
    >
      <CustomModal
        isOpen={openModalName === 'them-thong-bao'}
        onClose={closeModal}
        className="bg-blue-50 rounded-xl p-6 w-200 mx-auto z-40 min-h-150 mt-20 border-2 border-black"
        title="Thêm thông báo"
      >
        {themThongBaoModalContent()}
      </CustomModal>
      <div className="w-9/10 h-full bg-white mt-8 rounded-2xl">
        <div className="flex mt-4 ml-8">
          <input
            className="w-100 bg-gray-100 p-1 rounded-md"
            placeholder="Tìm thông báo..."
          />
          <div
            onClick={() => {
              openModal('them-thong-bao');
            }}
            className="ml-auto mr-8 flex space-x-2 items-center bg-blue-500 text-white p-2 rounded-md hover:bg-black"
          >
            <PlusIcon className="w-5 h-5" />
            <p>TẠO THÔNG BÁO</p>
          </div>
        </div>
        <div className="flex items-center space-x-8 mt-4 ml-8 mr-8 max-h-140 flex-grow">
          <table className="w-full mt-2">
            <thead>
              <tr className="w-full">
                <th className="text-center min-w-16">STT</th>
                <th className="text-center min-w-64">Nội dung câu hỏi</th>
                <th className="text-center max-w-32">Người hỏi</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((item, index) => (
                <tr key={item.id} className="hover:bg-black hover:text-white">
                  <td className="text-center py-4 text-blue-600 font-bold">
                    {index + 1}
                  </td>
                  <td>
                    <div
                      className={`flex-1 max-w-130  ${expandedIndex === index ? 'whitespace-normal' : 'overflow-hidden text-ellipsis whitespace-nowrap'} break-words`}
                      onClick={() => toggleExpand(index)}
                    >
                      {item.noidung}
                    </div>
                  </td>
                  <td>
                    <div
                      className={`flex-1 max-w-130  ${expandedIndex === index ? 'whitespace-normal' : 'overflow-hidden text-ellipsis whitespace-nowrap'} break-words`}
                      onClick={() => toggleExpand(index)}
                    >
                      {item.nguoigui}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Notification;
