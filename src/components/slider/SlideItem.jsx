import PropTypes from 'prop-types'; 
import './SliderStyle.css';

const SlideItem = ({ imgUrl, alt, content }) => {
    return (
        <div className="flex flex-col justify-center items-center h-96 w-auto slide-container mt-16"> 
            <div className="h-2/3 w-full">
                <img src={imgUrl} alt={alt} className="slide-image" />
            </div>
            <div className="h-1/3 text-center w-full mt-16">
                <p>{content}</p>
            </div>
        </div>
    );
};

SlideItem.propTypes = {
    imgUrl: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,   
    content: PropTypes.string.isRequired 
};

export default SlideItem;
