import {
  PlusIcon,
  PencilIcon,
  XIcon,
  SearchIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';
import { useState, useEffect } from 'react';
import { subjectsResponse, subjectChaptersResponse, createNewChapter, createNewSubject, editSubject, deleteSubject } from './SubjectService';
import CustomModal from '../../components/modal/CustomModal';
import CustomButton from '../../components/button/CustomButton';
import PaginatedTable from '../../components/pagination/PaginatedTable';

// Hàm chuẩn hóa chuỗi để loại bỏ dấu tiếng Việt
const removeAccents = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

const Subject = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalName, setModalName] = useState('them-mon-hoc');
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState({});
  const [chapters, setChapters] = useState([]);
  const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
  const role = userInfo.role.name;

  const toggleExpand = (index) => {
    setExpandedIndex(index);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openModal = (modalName) => {
    setIsOpenModal(true);
    setModalName(modalName);
  };
  const closeModal = () => {
    setIsOpenModal(false);
    setModalName('');
  };

  const handleCreateChapter = async (subjectId, chapterName) => {
    if (chapterName === '') {
      alert('Tên chương không thể để trống!');
      return;
    }
    const result = await createNewChapter(subjectId, chapterName);
    if (!result) {
      console.error('Create new chapter is failed!');
    } else {
      if (result.status === 201)
        alert(`Đã thêm chương '${chapterName}' cho môn học có mã '${subjectId}'`);
      else
        alert(`Thêm chương '${chapterName}' thất bại`);
    }
  };

  const handleCreateSubject = async (id, name, credits, theory_hours, practice_hours) => {
    if (id === '' || name === '' || credits === '' || theory_hours === '' || practice_hours === '') {
      alert('Xin hãy nhập đầy đủ thông tin!');
      return;
    }
    const result = await createNewSubject(id, name, credits, theory_hours, practice_hours);
    if (!result) {
      console.error('Create new subject is failed!');
    } else {
      if (result.status === 201) {
        const newSubject = { id, name, credits, theory_hours, practice_hours, public_id: id };
        setSubjects([...subjects, newSubject]);
        setFilteredSubjects([...filteredSubjects, newSubject]);
        alert(`Đã thêm môn học có tên '${name}'`);
      } else {
        alert(`Thêm môn học '${name}' thất bại`);
      }
    }
  };

  const handleEditSubject = async (id, public_id, name, credits, theory_hours, practice_hours, subjectIndex) => {
    if (id === '' || public_id === '' || name === '' || credits === '' || theory_hours === '' || practice_hours === '') {
      alert('Xin hãy nhập đầy đủ thông tin!');
      return;
    }
    const result = await editSubject(id, public_id, name, credits, theory_hours, practice_hours);
    if (!result) {
      console.error('Edit subject is failed!');
    } else {
      if (result.status === 200) {
        const updatedSubject = { id, public_id, name, credits, theory_hours, practice_hours };
        const updatedSubjects = [...subjects];
        updatedSubjects[subjectIndex] = updatedSubject;
        setSubjects(updatedSubjects);
        setFilteredSubjects(updatedSubjects);
        alert(`Đã chỉnh sửa môn học`);
      } else {
        alert(`Chỉnh sửa môn học thất bại`);
      }
    }
  };

  const handleDeleteSubject = async (subjectIndex) => {
    const result = await deleteSubject(selectedSubjectId);
    if (!result) {
      console.error('Delete subject is failed!');
    } else {
      if (result.status === 200) {
        const updatedSubjects = subjects.filter((_, idx) => idx !== subjectIndex);
        setSubjects(updatedSubjects);
        setFilteredSubjects(updatedSubjects);
        alert(`Đã xóa môn học`);
      } else {
        alert(`Xóa môn học thất bại`);
      }
    }
  };

  const fetchSubjectsResponse = async (currentPage) => {
    const result = await subjectsResponse(currentPage);
    if (!result) {
      console.error('Fetch subjects response failed!');
    } else {
      setSubjects(result.items);
      setFilteredSubjects(result.items);
      setTotalPages(result.totalPages);
      setItemsPerPage(result.limit);
    }
  };

  const fetchChapters = async (subjectId) => {
    const result = await subjectChaptersResponse(subjectId);
    if (!result) {
      console.error('Fetch chapter failed!');
    } else {
      setChapters(result);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredSubjects(subjects); // Hiển thị tất cả môn học khi thanh tìm kiếm rỗng
    } else {
      // Chuẩn hóa chuỗi tìm kiếm và tên môn học
      const normalizedQuery = removeAccents(query.toLowerCase());
      const filtered = subjects.filter((subject) =>
        removeAccents(subject.name.toLowerCase()).includes(normalizedQuery)
      );
      setFilteredSubjects(filtered); // Cập nhật danh sách lọc
    }
  };

  useEffect(() => {
    fetchSubjectsResponse(currentPage);
  }, [currentPage]);

  const modalContent = () => {
    return (
      <div className="flex flex-col items-center justify-center" style={{ fontFamily: 'Playfair display' }}>
        <div className="w-full">{createSubject()}</div>
      </div>
    );
  };

  const updateSubjectContent = () => {
    return (
      <div className="w-full mt-4 flex flex-col space-y-4" style={{ fontFamily: 'playfair display' }}>
        <div className="w-full">
          <p className="text-xl font-bold">Mã môn học</p>
          <input
            id="e-subject-public-id"
            type="text"
            className="border p-1 rounded-md w-full mt-4"
            placeholder="Nhập mã môn học..."
            defaultValue={selectedSubject.public_id}
          />
        </div>
        <div>
          <p className="text-xl font-bold">Tên môn học</p>
          <input
            id="e-subject-name"
            type="text"
            className="border p-1 rounded-md w-full mt-4"
            placeholder="Nhập tên môn học..."
            defaultValue={selectedSubject.name}
          />
        </div>
        <div className="flex w-full items-center space-x-6">
          <div className="w-1/2">
            <p className="text-xl font-bold">Tổng số tín chỉ</p>
            <input
              id="e-subject-credits"
              type="number"
              className="border p-1 rounded-md w-full mt-4"
              placeholder="Nhập số tín chỉ..."
              defaultValue={selectedSubject.credits}
            />
          </div>
          <div>
            <p>Số tiết lý thuyết</p>
            <input
              id="e-subject-theory-hours"
              type="number"
              className="border p-1 rounded-md w-full mt-4"
              placeholder="Nhập số tiết lý thuyết"
              min="1"
              defaultValue={selectedSubject.theory_hours}
            />
          </div>
          <div>
            <p>Số tiết thực hành</p>
            <input
              id="e-subject-practical-hours"
              type="number"
              className="border p-1 rounded-md w-full mt-4"
              placeholder="Nhập số tiết thực hành"
              min="1"
              defaultValue={selectedSubject.practical_hours}
            />
          </div>
        </div>
        <div className="w-full flex items-center justify-center mt-8">
          <CustomButton
            title="LƯU THAY ĐỔI"
            classname="pl-16 pr-16 pt-2 pb-2"
            onClick={() => {
              let public_id = document.getElementById('e-subject-public-id').value;
              let name = document.getElementById('e-subject-name').value;
              let credits = document.getElementById('e-subject-credits').value;
              let theory_hours = document.getElementById('e-subject-theory-hours').value;
              let practical_hours = document.getElementById('e-subject-practical-hours').value;
              handleEditSubject(selectedSubject.id, public_id, name, credits, theory_hours, practical_hours, selectedSubject.index);
            }}
          />
        </div>
      </div>
    );
  };

  const chapterModalContent = () => {
    return (
      <div className="w-full mt-4" style={{ fontFamily: 'playfair display' }}>
        <div className="flex items-center space-x-8 mt-4 ml-8 mr-8 max-h-140 overflow-auto">
          <table className="w-full mt-2">
            <thead>
              <tr className="w-full">
                <th className="text-center min-w-16">#</th>
                <th className="text-center min-w-64">Tên chương</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((item, index) => (
                <tr key={index} className="hover:bg-blue-100">
                  <td className="text-center py-4 text-blue-600 font-bold">{item.id}</td>
                  <td>
                    <div
                      className={`flex-1 max-w-90 ${expandedIndex === index ? 'whitespace-normal' : 'overflow-hidden text-ellipsis whitespace-nowrap'} break-words`}
                      onClick={() => toggleExpand(index)}
                    >
                      {item.name}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex space-x-8 mt-4 w-full justify-center">
          <div
            onClick={() => {
              let newChapterName = document.getElementById('new-chapter-name').value.trim();
              handleCreateChapter(selectedSubjectId, newChapterName);
            }}
            className="flex items-center space-x-2 bg-blue-900 text-white p-2 rounded-2xl hover:bg-blue-500"
          >
            <PlusIcon className="w-4 h-4" />
            <p>THÊM CHƯƠNG</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xl text-cyan-700">Tên chương</p>
          <input
            id="new-chapter-name"
            type="text"
            className="w-full p-1 border bg-gray-100 rounded text-xl mt-4"
            placeholder="Nhập tên chương cần thêm..."
          />
        </div>
      </div>
    );
  };

  const createSubject = () => {
    return (
      <div className="w-full mt-4 flex flex-col space-y-4">
        <div className="w-full">
          <p className="text-xl font-bold">Mã môn học</p>
          <input
            id="n-subject-id"
            type="text"
            className="border p-1 rounded-md w-full mt-4"
            placeholder="Nhập mã môn học..."
          />
        </div>
        <div>
          <p className="text-xl font-bold">Tên môn học</p>
          <input
            id="n-subject-name"
            type="text"
            className="border p-1 rounded-md w-full mt-4"
            placeholder="Nhập tên môn học..."
          />
        </div>
        <div className="flex w-full items-center space-x-6">
          <div className="w-1/2">
            <p className="text-xl font-bold">Tổng số tín chỉ</p>
            <input
              id="n-subject-credits"
              type="number"
              className="border p-1 rounded-md w-full mt-4"
              placeholder="Nhập số tín chỉ..."
            />
          </div>
          <div>
            <p>Số tiết lý thuyết</p>
            <input
              id="n-subject-theory-hours"
              type="number"
              className="border p-1 rounded-md w-full mt-4"
              placeholder="Nhập số tiết lý thuyết"
              min="1"
            />
          </div>
          <div>
            <p>Số tiết thực hành</p>
            <input
              id="n-subject-practice-hours"
              type="number"
              className="border p-1 rounded-md w-full mt-4"
              placeholder="Nhập số tiết thực hành"
              min="1"
            />
          </div>
        </div>
        <div className="w-full flex items-center justify-center mt-8">
          <CustomButton
            title="LƯU MÔN HỌC"
            classname="pl-16 pr-16 pt-2 pb-2"
            onClick={() => {
              let id = document.getElementById('n-subject-id').value;
              let name = document.getElementById('n-subject-name').value;
              let credits = document.getElementById('n-subject-credits').value;
              let theory_hours = document.getElementById('n-subject-theory-hours').value;
              let practical_hours = document.getElementById('n-subject-practice-hours').value;
              handleCreateSubject(id, name, credits, theory_hours, practical_hours);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center" style={{ fontFamily: 'PlayFair Display' }}>
      {modalName === 'them-mon-hoc' && (
        <CustomModal
          isOpen={isOpenModal}
          onClose={closeModal}
          className="bg-white rounded-xl p-6 min-w-200 min-h-120 overflow-auto max-h-140 mx-auto z-40 mt-20 border-2 border-black"
          title="Thêm môn học"
        >
          {modalContent()}
        </CustomModal>
      )}
      {modalName === 'chi-tiet-mon-hoc' && (
        <CustomModal
          isOpen={isOpenModal}
          onClose={closeModal}
          className="bg-white rounded-xl p-6 min-w-200 min-h-120 overflow-auto max-h-140 mx-auto z-40 mt-20 border-2 border-black"
          title="Chi tiết môn học"
        >
          {chapterModalContent()}
        </CustomModal>
      )}
      {modalName === 'sua-mon-hoc' && (
        <CustomModal
          isOpen={isOpenModal}
          onClose={closeModal}
          className="bg-white rounded-xl p-6 min-w-200 min-h-120 overflow-auto max-h-140 mx-auto z-40 mt-20 border-2 border-black"
          title="Sửa môn học"
        >
          {updateSubjectContent()}
        </CustomModal>
      )}
      <div className="w-9/10 h-full bg-white mt-8 rounded-2xl">
        <div className="w-full flex bg-gray-200 items-center pt-4 pl-8 pr-8 pb-4 rounded-t-xl">
          <p className="text-xl font-bold">Tất cả môn học</p>
          {role === 'admin' && (
            <div
              onClick={() => openModal('them-mon-hoc')}
              className="flex space-x-2 ml-auto h-3/4 items-center bg-red-700 text-white p-2 rounded-xl hover:bg-blue-900"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              THÊM MÔN HỌC
            </div>
          )}
        </div>
        <div className="flex items-center space-x-8 mt-8 ml-8 mb-8">
          <div className="min-w-96 flex items-center space-x-2">
            <input
              type="search"
              placeholder="Nhập tên môn học..."
              className="w-full bg-gray-100 rounded-xl p-2 text-black border focus:outline-none focus:border-3 focus:ring-blue-300 focus:border-blue-300 focus:shadow-md focus:shadow-blue-300 focus:bg-white"
              value={searchQuery}
              onChange={handleSearch}
            />
            {/* <div className="bg-blue-800 text-white rounded-xl w-10 h-10 flex items-center justify-center hover:bg-black">
              <SearchIcon className="w-6 h-6" />
            </div> */}
          </div>
        </div>
        <div className="flex items-center space-x-8 ml-8 mr-8 max-h-140">
          <table className="w-full mt-2">
            <thead>
              <tr className="w-full bg-gray-100 h-10">
                <th className="text-center min-w-16">Mã môn</th>
                <th className="text-center min-w-64">Tên môn</th>
                <th className="text-center min-w-16">Số tín chỉ</th>
                <th className="text-center min-w-32">Số tiết lý thuyết</th>
                <th className="text-center min-w-16">Số tiết thực hành</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((item, index) => (
                <tr key={item.id} className="hover:bg-blue-100">
                  <td className="text-center py-4 text-blue-600 font-bold">{item.public_id}</td>
                  <td>
                    <div
                      className={`flex-1 max-w-64 text-center ${expandedIndex === index ? 'whitespace-normal' : 'overflow-hidden text-ellipsis whitespace-nowrap'} break-words`}
                      onClick={() => toggleExpand(index)}
                    >
                      {item.name}
                    </div>
                  </td>
                  <td className="text-center overflow-hidden">{item.credits}</td>
                  <td className="text-center min-w-32">{item.theory_hours}</td>
                  <td className="text-center">{item.practical_hours}</td>
                  <td className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div
                        onClick={() => {
                          setSelectedSubjectId(item.id);
                          fetchChapters(item.id);
                          openModal('chi-tiet-mon-hoc');
                        }}
                        className="text-white bg-green-800 hover:bg-green-600 rounded-2xl p-1"
                      >
                        <InformationCircleIcon className="w-5 h-5" />
                      </div>
                      <div
                        onClick={() => {
                          setSelectedSubjectId(item.id);
                          setSelectedSubject({
                            id: item.id,
                            public_id: item.public_id,
                            name: item.name,
                            credits: item.credits,
                            theory_hours: item.theory_hours,
                            practical_hours: item.practical_hours,
                            index: index,
                          });
                          openModal('sua-mon-hoc');
                        }}
                        className="text-white bg-blue-900 hover:bg-blue-600 rounded-2xl p-1"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </div>
                      <div
                        onClick={() => {
                          setSelectedSubjectId(item.id);
                          handleDeleteSubject(index);
                        }}
                        className="text-white bg-red-700 hover:bg-red-600 rounded-2xl p-1"
                      >
                        <XIcon className="w-5 h-5" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-8 mb-8">
          <PaginatedTable
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Subject;