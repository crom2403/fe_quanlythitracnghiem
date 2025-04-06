import PropTypes from 'prop-types';

const PaginatedTable = ({ totalPages, currentPage, onPageChange }) => {
  const getPageNumbers = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage === 1) {
      return [1, 2, 3];
    } else if (currentPage === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages];
    } else {
      return [currentPage - 1, currentPage, currentPage + 1];
    }
  };
  const pageNumber = getPageNumbers();

  return (
    <div className="">
    <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
      >
        &lt;&lt;
      </button>
      <button
        onClick={() => {
          onPageChange(currentPage - 1);
        }}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
      >
        &lt;
      </button>

      {pageNumber.map((page) => (
        <button
          key={page}
          onClick={() => {
            onPageChange(page);
          }}
          className={`px-3 py-1 rounded-lg ${
            currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-300'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
      >
        &gt;
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
      >
        &gt;&gt;
      </button>
    </div>
  );
};

PaginatedTable.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default PaginatedTable;
