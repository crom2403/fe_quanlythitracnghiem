import PropTypes from 'prop-types';

const CustomButton = ({ classname, title, onClick }) => {
  return (
    <div className={`bg-blue-900 rounded-xl text-center text-white hover:bg-blue-500 ${classname}`} onClick={onClick}>
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
