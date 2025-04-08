import PropTypes from 'prop-types';

const CustomButton = ({ classname, title, onClick }) => {
  return (
    <div className={`bg-black rounded-xl text-center text-white hover:bg-blue-800 ${classname}`} onClick={onClick}>
      {title}
    </div>
  );
};

CustomButton.propTypes = {
  classname: PropTypes.string,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default CustomButton;
