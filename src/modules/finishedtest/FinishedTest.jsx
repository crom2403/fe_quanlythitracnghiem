import { useState } from 'react';
import { EyeIcon, LockClosedIcon, XIcon } from '@heroicons/react/outline';
import {
  FaFile,
  FaUser,
  FaCalculator,
  FaFrown,
  FaCheck,
  FaMedal,
} from 'react-icons/fa';
import ColumnChart from '../../components/chart/ColumnChart';
import { useLocation } from 'react-router-dom';


const list = [
  [
    'DH52100000',
    'Trần Thanh Sơn',
    9.2,
    '12:12:12 12-1-2025',
    '13:13:10 12-1-2025',
    0,
  ],
  [
    'DH52100001',
    'Nguyễn Thị Nở',
    3.5,
    '12:12:12 12-1-2025',
    '13:13:10 12-1-2025',
    0,
  ],
  [
    'DH52100002',
    'Thái Chí Phèo',
    10.0,
    '12:12:12 12-1-2025',
    '13:13:10 12-1-2025',
    0,
  ],
  [
    'DH52100003',
    'Trịnh Trần Phương Tuấn',
    1.3,
    '12:12:12 12-1-2025',
    '13:13:10 12-1-2025',
    0,
  ],
  [
    'DH52100004',
    'Lê Tùng Sơn',
    7.9,
    '12:12:12 12-1-2025',
    '13:13:10 12-1-2025',
    0,
  ],
  [
    'DH52100005',
    'Lê Tùng Vân',
    0.1,
    '12:12:12 12-1-2025',
    '13:13:10 12-1-2025',
    0,
  ],
  [
    'DH52100006',
    'Nguyễn Ăn Hại',
    10.0,
    '12:12:12 12-1-2025',
    '13:13:10 12-1-2025',
    0,
  ],
  [
    'DH52100007',
    'Lã Là La',
    8.4,
    '12:12:12 12-1-2025',
    '13:13:10 12-1-2025',
    0,
  ],
  [
    'DH52100008',
    'Canh chua cá lóc',
    8.4,
    '12:12:12 12-1-2025',
    '13:13:10 12-1-2025',
    0,
  ],
  [
    'DH52100009',
    'Cá lóc nướng rơm',
    8.4,
    '12:12:12 12-1-2025',
    '13:13:10 12-1-2025',
    0,
  ],
  [
    'DH521000010',
    'Mực khô',
    8.4,
    '12:12:12 12-1-2025',
    '13:13:10 12-1-2025',
    0,
  ],
  [
    'DH521000011',
    'Tôm khô',
    8.4,
    '12:12:12 12-1-2025',
    '13:13:10 12-1-2025',
    0,
  ],
];

const FinishedTest = () => {
  const [selectedTab, setSelectedTab] = useState('transcript');
  const location = useLocation();
  const {selectedExamId} = location.state || {};
  // console.log(`Selected exam id: ${selectedExamId}`);
  const handleSelectedTab = (tabName) => {
    setSelectedTab(tabName);
  };

  const data = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Điểm thi',
        data: [1, 3, 2, 5, 2, 9],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
        legend: {
          position: 'bottom',
        },
        title:{
          display: true,
          text: "Biểu đồ cột thể hiện điểm thi sinh viên",
          font: { size:24, weight: 'bold'},
          padding:{ top: 10, bottom: 30},
          align: 'center',
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`,
          },
        },
      },
  }

  const transcript = () => {
    return (
      <div className="w-full h-full">
        <div className="flex ml-8 mr-8">
          <select className="p-2 bg-gray-200 rounded-xl">
            <option>Tất cả</option>
            <option>Nhóm 1</option>
          </select>
          <select className="p-2 bg-gray-200 rounded-xl ml-4">
            <option>Đã nộp bài</option>
            <option>Vắng thi</option>
            <option>Chưa nộp bài</option>
            <option>Tất cả</option>
          </select>
          <div className="ml-4">
            <input
              type="search"
              className="bg-gray-100  p-2 rounded-xl w-64"
              placeholder="Tìm sinh viên..."
            />
          </div>
          <div className="flex items-center ml-auto bg-red-700 text-white p-2 rounded-2xl hover:bg-black">
            <FaFile className="w-5 h-5 mr-2" />
            <p>XUẤT BẢNG ĐIỂM</p>
          </div>
        </div>
        <div className="overflow-auto max-h-140 font-sans ml-8 mr-8 mt-4">
          <table className="mt-4 rounded-2xl">
            <thead className="">
              <tr className="text-xl bg-gray-100">
                <th className="px-4 py-2">MSSV</th>
                <th className="px-8 py-2">Họ tên</th>
                <th className="px-4 py-2">Điểm</th>
                <th className="px-4 py-2">Thời gian vào thi</th>
                <th className="px-4 py-2">Thời gian thi</th>
                <th className="px-4 py-2">Số lần thoát</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody className="">
              {list.map((student, index) => (
                <tr key={index} className="text-center space-y-4">
                  <td className="px-4 py-4">{student[0]}</td>
                  <td className="px-8 py-4">{student[1]}</td>
                  <td className="px-4 py-4">{student[2]}</td>
                  <td className="px-4 py-4">{student[3]}</td>
                  <td className="px-4 py-4">{student[4]}</td>
                  <td className="px-4 py-4">{student[5]}</td>
                  <td>
                    <div className="flex space-x-2 justify-center">
                      <EyeIcon className="w-5 h-5 bg-black text-white rounded-2xl" />
                      <LockClosedIcon className="w-5 h-5 bg-black text-white rounded-2xl" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  const statistics = () => {
    return (
      <div className=" w-full h-auto">
        <select className="ml-8 p-2 bg-white-200 rounded-xl border-2">
          <option>Tất cả</option>
          <option>Nhóm 1</option>
        </select>
        <div className="flex justify-evenly items-center mt-4 text-xl">
          <div className="flex justify-center items-center space-x-4 bg-white text-blue-800 p-8 rounded-2xl shadow-lg shadow-gray-900">
            <div className="w-32 h-25">
              <p className="text-4xl">1</p>
              <div>Thí sinh đã nộp</div>
            </div>
            <div className="p-2 bg-gray-100">
              <FaUser className="w-5 h-5" />
            </div>
          </div>
          <div className="flex justify-center items-center space-x-4 bg-white text-blue-800 p-8 rounded-2xl shadow-lg shadow-gray-900">
            <div className="w-32 h-25">
              <p className="text-4xl">1</p>
              <div>Thí sinh chưa nộp</div>
            </div>
            <div className="p-2 bg-gray-100">
              <FaUser className="w-5 h-5" />
            </div>
          </div>
          <div className="flex justify-center items-center space-x-4 bg-white text-blue-800 p-8 rounded-2xl shadow-lg shadow-gray-900">
            <div className="w-32 h-25">
              <p className="text-4xl">1</p>
              <div>Thí sinh không thi</div>
            </div>
            <div className="p-2 bg-gray-100">
              <FaUser className="w-5 h-5" />
            </div>
          </div>
          <div className="flex justify-center items-center space-x-4 bg-white text-blue-800 p-8 rounded-2xl shadow-lg shadow-gray-900">
            <div className="w-32 h-25">
              <p className="text-4xl">1</p>
              <div>Điểm trung bình</div>
            </div>
            <div className="p-2 bg-gray-100">
              <FaCalculator className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="flex justify-evenly items-center mt-4 text-xl">
          <div className="flex justify-center items-center space-x-4 bg-white text-blue-800 p-8 rounded-2xl shadow-lg shadow-gray-900">
            <div className="w-32 h-25">
              <p className="text-4xl">1</p>
              <div>Số thí sinh điểm {'<='} 1</div>
            </div>
            <div className="p-2 bg-gray-100">
              <XIcon className="w-5 h-5 text-red-700" />
            </div>
          </div>
          <div className="flex justify-center items-center space-x-4 bg-white text-blue-800 p-8 rounded-2xl shadow-lg shadow-gray-900">
            <div className="w-32 h-25">
              <p className="text-4xl">1</p>
              <div>Số thí sinh điểm {'<='} 5</div>
            </div>
            <div className="p-2 bg-gray-100">
              <FaFrown className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <div className="flex justify-center items-center space-x-4 bg-white text-blue-800 p-8 rounded-2xl shadow-lg shadow-gray-900">
            <div className="w-32 h-25">
              <p className="text-4xl">1</p>
              <div>Số thí sinh điểm {'>='} 5</div>
            </div>
            <div className="p-2 bg-gray-100">
              <FaCheck className="w-5 h-5 " />
            </div>
          </div>
          <div className="flex justify-center items-center space-x-4 bg-white text-blue-800 p-8 rounded-2xl shadow-lg shadow-gray-900">
            <div className="w-32 h-25">
              <p className="text-4xl">1</p>
              <div>Điểm cao nhất</div>
            </div>
            <div className="p-2 bg-gray-100">
              <FaMedal className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </div>
        <div className='w-4/5 h-auto ml-30 mt-16'>
            <ColumnChart data={data} options={options} />
        </div>
      </div>
    );
  };
  const renderContent = () => {
    switch (selectedTab) {
      case 'transcript':
        return transcript();
      case 'statistics':
        return statistics();
    }
  };
  return (
    <div
      className="w-full min-h-screen h-auto bg-gray-100 flex flex-col items-center"
      style={{ fontFamily: 'PLAYFAIR DISPLAY' }}
    >
      <div className="w-9/10 bg-white mt-8 flex-grow">
        <div className="flex">
          <div
            className={`w-36 flex justify-center bg-black text-white items-center p-2 text-xl ${selectedTab === 'transcript' ? 'bg-blue-900 rounded-tr-xl' : ''}`}
            onClick={() => handleSelectedTab('transcript')}
          >
            Bảng điểm
          </div>
          <div
            className={`w-36 flex justify-center bg-black text-white items-center p-2 text-xl ${selectedTab === 'statistics' ? 'bg-blue-900 rounded-tl-xl' : ''}`}
            onClick={() => handleSelectedTab('statistics')}
          >
            Thống kê
          </div>
        </div>
        <div className="mt-4 flex-grow">{renderContent()}</div>
      </div>
    </div>
  );
};
export default FinishedTest;
