import { AcademicCapIcon, UserIcon } from '@heroicons/react/outline';
import { FaTag, FaSyncAlt, FaBug } from 'react-icons/fa';
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

      <div className="flex justify-center item bg-blue-100 mt-16">
        <div className="flex flex-col w-1/4 items-center justify-center text-center">
          <div className="mt-4">
            <FaTag className="w-10 h-10 mr-4 text-blue-800" />
          </div>
          <h1 className="text-2xl font-bold">Phân loại câu hỏi</h1>
          <p className="pb-8">
            Các câu hỏi ôn luyện được phân theo chủ đề, môn học, chương. Thuận
            tiện cho quá trình ôn tập, rõ ràng và dễ theo dõi
          </p>
        </div>
        <div className="flex flex-col w-1/4 items-center justify-center text-center ml-4 mr-4">
          <div className="mt-4">
            <FaSyncAlt className="w-10 h-10 mr-4 text-blue-800" />
          </div>
          <h1 className="text-2xl font-bold">Theo dõi quá trình</h1>
          <p className="pb-8">
            Lưu trữ thông tin các bài thi, kết quả thực hiện, qua đó giúp đánh
            giá tiến trình ôn luyện, thi cử của sinh viên qua từng giai đoạn
          </p>
        </div>
        <div className="flex flex-col w-1/4 items-center justify-center text-center">
          <div className="mt-4">
            <FaBug className="w-10 h-10 mr-4 text-blue-800" />
          </div>
          <h1 className="text-2xl font-bold">Khắc phục lỗi</h1>
          <p className="pb-8">
            Lưu trạng thái sử dụng của người dùng, nếu có lỗi xảy ra không gây
            mất hoàn toàn dữ liệu. Hạn chế mất hoàn toàn thông tin khi có lỗi hệ
            thống
          </p>
        </div>
      </div>
      <div
        className="w-auto h-auto flex flex-col items-center"
        style={{
          backgroundImage:
            "url('https://invietnhat.vn/wp-content/uploads/2024/12/background-xanh-trang-dep.jpg')",
        }}
      >
        <div className="flex w-full h-auto justify-center items-center mt-8">
          <img
            src="https://svdca.org.vn/wp-content/uploads/2024/07/sp-cntt.jpg"
            className="h-96 mr-auto ml-16 rounded-full"
          />
          <p className="ml-16 text-2xl text-right mr-16 text-purple-800">
            Trường đại học công nghệ Sài Gòn chuyên đào tạo chuyên ngành Công
            nghệ thông tin. Trang thiết bị hiện đại, đáp ứng nhu cầu giảng dạy
            và học tập
          </p>
        </div>
        <div className="flex w-full h-auto justify-center items-center mt-8">
          <p className="text-2xl ml-16 mr-16 text-blue-700">
            Đây là đồ án web được thực hiện bởi nhóm sinh viên trường đại học
            công nghệ Sài Gòn nhằm mục đích học tập
          </p>
          <img
            src="https://cdn2.tuoitre.vn/thumb_w/480/471584752817336320/2024/5/24/photo-1716539901471-1716539901513662896148.jpg"
            className="h-96 ml-auto mr-16 rounded-full"
          />
        </div>
        <div className="flex w-full h-auto justify-center items-center mt-8 mb-8">
          <img
            src="https://kenh14cdn.com/2016/1-featured-image-kinh-nghiem-luyen-thi-n4-1474310121891.jpg"
            className="h-96 mr-auto ml-16 rounded-full"
          />
          <p className="ml-16 text-2xl text-right mr-16 text-blue-800">
            Thay thế hình thức thi cử truyền thống bằng cách sử dụng hình thức
            thi online. Ngoài ra bổ sung thêm các tính năng hỗ trợ sinh viên thi
            thử từ nguồn có sẵn
          </p>
        </div>
      </div>

      <div className="w-full h-auto text-4xl flex justify-center mt-8 font-bold">
        SINH VIÊN THỰC HIỆN
      </div>
      <div className="flex w-full h-auto items-center text-center justify-center mt-16 text-2xl text-violet-800">
        <div className="flex flex-col w-1/3 items-center  justify-center">
          <UserIcon className="w-20 h-20 text-blue-400" />
          Lê Yến Đan
        </div>
        <div className="flex flex-col w-1/3 items-center  justify-center">
          <UserIcon className="w-20 h-20 text-blue-400" />
          Trần Thanh Sơn
        </div>
        <div className="flex flex-col w-1/3 items-center  justify-center">
          <UserIcon className="w-20 h-20 text-blue-400" />
          Võ Minh Thiện
        </div>
      </div>
      <div className="flex w-full h-auto items-center justify-center mt-16 text-2xl text-violet-800 mb-16">
        <div className="flex flex-col w-1/3 items-center">
          <UserIcon className="w-20 h-20 text-blue-400" />
          Nguyễn Dư Ngọc Thiện
        </div>
        <div className="flex flex-col w-1/3 items-center  ">
          <UserIcon className="w-20 h-20 text-blue-400" />
          Phan Anh Tuấn
        </div>
      </div>
    </div>
  );
};

export default Community;
