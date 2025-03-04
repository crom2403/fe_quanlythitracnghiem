import { useState } from 'react';
import SlideItem from './SlideItem';
import { ArrowCircleLeftIcon, ArrowCircleRightIcon } from '@heroicons/react/outline';

const Slider = () => {
  const slides = [
    {
      imgUrl: 'https://res.cloudinary.com/dkmql9swy/image/upload/v1740755418/c_E1_BA_ADn-c_E1_BA_A3nh-t_E1_BA_ADp-trung-v_C3_A0o-b_C3_A0n-tay-c_E1_BB_A7a-ng_C6_B0_E1_BB_9Di-g_C3_B5-tr_C3_AAn-b_C3_A0n-ph_C3_ADm-backlit-m_C3_A1y-t_C3_ADnh-_C4_91_E1_BB_83-b_C3_A0n-m_C3_A0n-h_C3_ACnh-hi_E1_BB_83n_pnxvkg.jpg',
      content: 'Trường đại học công nghệ Sài Gòn chuyên đào tạo kĩ sư Công nghệ thông tin',
      alt: 'IT Engineer',
    },
    {
      imgUrl: 'https://res.cloudinary.com/dkmql9swy/image/upload/v1740668262/freelance-designer_rzxwou.jpg',
      content: 'Đây là đồ án của nhóm sinh viên trường thực hiện',
      alt: 'Student Project',
    },
    {
      imgUrl: 'https://res.cloudinary.com/dkmql9swy/image/upload/v1740668342/c02-1_jpg_dwifvw.jpg',
      content: 'Website được lập ra nhằm mục đích hỗ trợ các bạn sinh viên dễ dàng tiếp cận kiến thức và học tập',
      alt: 'study',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="flex flex-col items-center justify-center relative bg-gray-200 w-2/3">
      <button
        className="z-10 absolute left-16 bg-black text-white top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-lg hover:bg-gray-800 transition"
        onClick={goToPrevious}
      >
        <ArrowCircleLeftIcon className='h-6 w-6' />
      </button>

      <div className="relative w-full overflow-hidden">
        <div className="flex transition-transform duration-300 ease-in-out">
          {slides.map((slide, index) => (
            <div
              key={index}
              // className={`w-full flex-shrink-0 ${index === currentIndex ? 'block' : 'hidden'}`}
              className={`w-full flex-shrink-0 slide ${index === currentIndex ? 'slide-enter-active' : 'slide-exit-active'}`}
              style={{
                transform: index === currentIndex ? 'translateX(0)' : index < currentIndex ? 'translateX(-100%)' : 'translateX(100%)',
              }}
            >
              <SlideItem
                imgUrl={slide.imgUrl}
                alt={slide.alt}
                content={slide.content}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        className="absolute right-16 bg-black text-white top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-lg hover:bg-gray-800 transition"
        onClick={goToNext}
      >
        <ArrowCircleRightIcon className='h-6 w-6' />
      </button>

      <div className="top-auto transform space-x-2 mb-8">
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => goToSlide(index)}
            className={`cursor-pointer w-3 h-3 rounded-full inline-block ${
              index === currentIndex ? 'bg-blue-500' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;