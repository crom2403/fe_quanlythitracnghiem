import { AcademicCapIcon } from '@heroicons/react/outline';
import { FaTag, FaSyncAlt, FaBug } from 'react-icons/fa';
import Slider from '../../components/slider/Slider';
import Stulogo from '../../assets/images/stulogo.png';

const Community = () => {
  return (
    <div className="h-auto w-full" style={{ fontFamily: 'PlayFair Display' }}>
      <div className="flex">
        <div className="w-2/5 ml-32 mt-16">
          <img src={Stulogo} alt="stulogo" />
        </div>
        <div className="w-2/5 mt-50">
          <h1 className="text-3xl font-bold text-blue-600">
            THI TRẮC NGHIỆM TRỰC TUYẾN
          </h1>
          <h3 className="text-xl font-bold">Online Testing</h3>
          <p className="mt-4">
            Quản lí ngân hàng câu hỏi, đề thi trắc nghiệm, đề thi thử, bài tập,
            đề ôn luyện qua các năm. Tổ chức các kì thi online, nơi học tập,
            trau dồi kiến thức cho sinh viên
          </p>
          <button className="flex bg-red-700 text-white rounded-2xl px-4 py-2 mt-4 hover:bg-blue-950 hover:text-white">
            <a className="flex" href="#">
              <AcademicCapIcon className="w-5 h-5 mr-2" />
              Tham gia ngay
            </a>
          </button>
        </div>
      </div>

      <div className="flex justify-center item bg-blue-100 mt-16 mb-16">
        <div className="flex flex-col w-1/4 items-center justify-center text-center">
          <div className="mt-4">
            <FaTag className="w-10 h-10 mr-4 text-blue-800" />
          </div>
          <h1 className="text-2xl font-bold">Phân loại câu hỏi</h1>
          <p className='pb-8'>
            Các câu hỏi ôn luyện được phân theo chủ đề, môn học, chương. Thuận
            tiện cho quá trình ôn tập, rõ ràng và dễ theo dõi
          </p>
        </div>
        <div className="flex flex-col w-1/4 items-center justify-center text-center ml-4 mr-4">
          <div className="mt-4">
            <FaSyncAlt className="w-10 h-10 mr-4 text-blue-800" />
          </div>
          <h1 className="text-2xl font-bold">Theo dõi quá trình</h1>
          <p className='pb-8'>
            Lưu trữ thông tin các bài thi, kết quả thực hiện, qua đó giúp đánh
            giá tiến trình ôn luyện, thi cử của sinh viên qua từng giai đoạn
          </p>
        </div>
        <div className="flex flex-col w-1/4 items-center justify-center text-center">
          <div className="mt-4">
            <FaBug className="w-10 h-10 mr-4 text-blue-800" />
          </div>
          <h1 className="text-2xl font-bold">Khắc phục lỗi</h1>
          <p className='pb-8'>
            Lưu trạng thái sử dụng của người dùng, nếu có lỗi xảy ra không gây
            mất hoàn toàn dữ liệu. Hạn chế mất hoàn toàn thông tin khi có lỗi hệ
            thống
          </p>
        </div>
      </div>

      <div className="w-auto h-auto flex flex-col items-center mb-16">
        <Slider />
      </div>
    </div>
  );
};

export default Community;
