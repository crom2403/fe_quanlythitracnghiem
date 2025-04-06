import {FaFacebook} from 'react-icons/fa';

const Footer = () => {
  return (
    <div
      className="flex w-full mt-4 min-h-50 h-auto bg-black text-white justify-evenly"
      style={{ fontFamily: 'PlayFair Display' }}
    >
      <div className="flex flex-col space-y-2 mt-8">
        <h1 className="text-xl font-bold mb-4">THÔNG TIN</h1>
        <a href="#" className="">
          <p className='hover:font-bold hover:text-yellow-300'>Chính sách bảo mật</p>
        </a>
        <a href="#" className="">
          <p className='hover:font-bold hover:text-yellow-300'>Điều khoản sử dụng</p>
        </a>
        <a href="#" className="">
          <p className='hover:font-bold hover:text-yellow-300'>Hướng dẫn</p>
        </a>
      </div>
      <div className="flex flex-col space-y-2 mt-8">
        <h1 className="text-xl font-bold mb-4">ĐỊA CHỈ</h1>
        <a href="http://daotao1.stu.edu.vn/" className="">
          <p className='hover:text-yellow-300 hover:italic hover:underline'>Trường đại học công nghệ Sài Gòn</p>
        </a>
        <p className='mt-2'>180 Cao Lỗ, phường 4, quận 8, Hồ Chí Minh</p>
      </div> 
      <div className="flex flex-col space-y-2 mt-8">
        <h1 className="text-xl font-bold mb-4">KẾT NỐI</h1>
        <FaFacebook className='w-5 h-5' />
      </div>
    </div>
  );
};


export default Footer;
