
import Modal from 'react-modal';
import { XIcon } from '@heroicons/react/outline';
import PropTypes from 'prop-types';

Modal.setAppElement('#root');

const CustomModal = ({ isOpen, onClose, title, children, className }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={title}
      className={`bg-white rounded-xl p-6 w-150 z-40 border-2 border-black ${className}`}
      shouldCloseOnOverlayClick={false}
    >
      <div className="flex items-center min-h-8">
        <div className="ml-auto mr-4 bg-black text-white rounded-2xl">
          <XIcon className="w-7 h-7" onClick={onClose} />
        </div>
      </div>
      <div className="mb-4">{children}</div>
    </Modal>
  );
};

CustomModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,        
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired, 
    children: PropTypes.node,
    className: PropTypes.string,
  };

export default CustomModal;
