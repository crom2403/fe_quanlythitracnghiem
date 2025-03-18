import {FaFacebook} from 'react-icons/fa';

const Footer = () => {
  return (
    <div
      className="flex w-full h-auto mt-auto bg-black text-white justify-center"
      style={{ fontFamily: 'PlayFair Display' }}
    >
      <div className="w-1/4 mt-4">
        <h1 className="text-xl font-bold mb-4">THÔNG TIN</h1>
        <a href="#" className="">
          <p className=''>Chính sách bảo mật</p>
        </a>
        <a href="#" className="">
          <p className='mt-2'>Điều khoản sử dụng</p>
        </a>
        <a href="#" className="">
          <p className='mt-2 mb-4'>Hướng dẫn</p>
        </a>
      </div>
      <div className="w-1/4 mt-4">
        <h1 className="text-xl font-bold mb-4">ĐỊA CHỈ</h1>
        <a href="http://daotao1.stu.edu.vn/" className="">
          <p className=''>Trường đại học công nghệ Sài Gòn</p>
        </a>
        <p className='mt-2'>180 Cao Lỗ, phường 4, quận 8, Hồ Chí Minh</p>
      </div>
      <div className="w-1/4 mt-4">
        <h1 className="text-xl font-bold mb-4">KẾT NỐI</h1>
        <FaFacebook className='w-5 h-5' />
      </div>
    </div>
  );
};

export default Footer;
