import { PlusIcon, XIcon, SearchIcon } from '@heroicons/react/outline';
import { useState, useEffect, useMemo } from 'react';
import { Checkbox } from '@mui/material';
import { getUsersByRole } from '../user/UserService';
import { getAllSubjectResponse } from '../subject/SubjectService';
import { assignmentsResponse, assignResponse,deleteAssignment } from './AssignmentService';
import CustomModal from '../../components/modal/CustomModal';
import CustomButton from '../../components/button/CustomButton';
import PaginatedTable from '../../components/pagination/PaginatedTable';

const Assignment = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalName, setModalName] = useState('them-phan-cong');
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTeacherIdToAssign, setSelectedIdTeacherToAssign] = useState(0);
  const [subjectsToAssign, setSubjectsToAssign] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [subjectsCurrentPage, setSubjectsCurrentPage] = useState(1);
  const subjectsItemsPerPage = 5;
  const subjectsTotalPages = Math.ceil(subjects.length / subjectsItemsPerPage);

  const totalPages = Math.ceil(assignments.length / itemsPerPage);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
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
    handleClearData();
  };

  const handleClearData = () => {
    setSelectedIdTeacherToAssign(0);
    setSubjectsToAssign([]);
  };

  const handleDeleteAssignment = async(assignmentId)=>{
    const result = await deleteAssignment(assignmentId);
    if(result.status === 200)
    {
      fetchAssignments();
      alert("Đã xóa phân công!");
    }else{
      alert("Xóa phân công thất bại!");
    }
  }

  const handleChangeTeacherId = (event) => {
    const teacherId = parseInt(event.target.value);
    setSelectedIdTeacherToAssign(teacherId);

    // Tự động điền subjectsToAssign với các môn học đã được phân công cho giảng viên
    if (teacherId !== 0) {
      const teacherAssignments = assignments.filter(
        (assignment) => assignment.teacher.id === teacherId
      );
      const assignedSubjects = teacherAssignments.map((assignment) => ({
        subject_id: assignment.subject.id,
        isAssign: true,
      }));
      setSubjectsToAssign(assignedSubjects);
    } else {
      setSubjectsToAssign([]);
    }
  };

  const fetchAssignments = async () => {
    try {
      const result = await assignmentsResponse();
      if (result) {
        setAssignments(result);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    const fetchTeacher = async () => {
      const result = await getUsersByRole('teacher');
      if (result) {
        setTeachers(result);
      }
    };
    const fetchSubject = async () => {
      const result = await getAllSubjectResponse();
      if (result) {
        setSubjects(result);
      }
    };
    fetchTeacher();
    fetchSubject();
  }, []);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return assignments.slice(startIndex, startIndex + itemsPerPage);
  }, [assignments, currentPage]);

  const modalContent = () => {
    return (
      <div
        className="flex flex-col items-center justify-center"
        style={{ fontFamily: 'Playfair display' }}
      >
        <div className="w-full">{renderContent()}</div>
      </div>
    );
  };

  const renderContent = () => {
    const subjectsCurrentData = subjects.slice(
      (subjectsCurrentPage - 1) * subjectsItemsPerPage,
      subjectsCurrentPage * subjectsItemsPerPage
    );

    const handleSubjectsPageChange = (page) => {
      setSubjectsCurrentPage(page);
    };

    const handleSubjectSelect = (subjectId) => {
      setSubjectsToAssign((prev) => {
        const isSubjectExist = prev.some((obj) => obj.subject_id === subjectId);
        if (isSubjectExist) {
          return prev.filter((obj) => obj.subject_id !== subjectId);
        } else {
          return [...prev, { subject_id: subjectId, isAssign: true }];
        }
      });
    };

    const handleAssign = async () => {
      if (selectedTeacherIdToAssign === 0) {
        alert('Chưa chọn giảng viên để phân công!');
        return;
      }
      if (subjectsToAssign.length === 0) {
        alert('Chưa chọn môn học để phân công!');
        return;
      }
      const assignObj = {
        teacher_id: selectedTeacherIdToAssign,
        listAssignment: subjectsToAssign,
      };
      const result = await assignResponse(assignObj);
      if (result.status === 201) {
        alert('Đã lưu phân công!');
        fetchAssignments();
        closeModal();
      }
    };

    const isAssigned = (subject_id) => {
      // Kiểm tra xem môn học có trong danh sách subjectsToAssign
      return subjectsToAssign.some((obj) => obj.subject_id === subject_id);
    };

    return (
      <div className="w-full min-h-140 mt-4 flex flex-col space-y-4">
        <div className="flex items-center">
          <p className="text-cyan-700">Giảng viên</p>
          <select
            className="ml-4 w-64 border p-1 rounded-sm"
            onChange={handleChangeTeacherId}
            value={selectedTeacherIdToAssign}
          >
            <option value={0} key={0}>
              Tất cả giảng viên
            </option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.fullname}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full flex items-center">
          <input
            className="w-9/10 bg-gray-200 p-1 rounded-l-md"
            type="search"
            placeholder="Tìm môn học theo tên..."
          />
          <div className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-r-md">
            <SearchIcon className="w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <table className="w-full mt-2">
            <thead>
              <tr className="w-full bg-gray-100 h-10">
                <th className="text-center min-w-16">Chọn</th>
                <th className="text-center min-w-16">Mã môn học</th>
                <th className="text-center min-w-64">Tên môn học</th>
                <th className="text-center min-w-16">Số tính chỉ</th>
                <th className="text-center min-w-16">Số tiết LT</th>
                <th className="text-center min-w-16">Số tiết TH</th>
              </tr>
            </thead>
            <tbody>
              {subjectsCurrentData.map((item) => (
                <tr key={item.id} className="hover:bg-blue-100">
                  <td className="text-center py-4 text-blue-600 font-bold">
                    <Checkbox
                      checked={isAssigned(item.id)}
                      onChange={() => handleSubjectSelect(item.id)}
                    />
                  </td>
                  <td className="text-center min-w-16">{item.public_id}</td>
                  <td>
                    <div
                      className={`flex-1 max-w-90 text-center ${
                        expandedIndex === subjects.indexOf(item)
                          ? 'whitespace-normal'
                          : 'overflow-hidden text-ellipsis whitespace-nowrap'
                      } break-words`}
                      onClick={() => toggleExpand(subjects.indexOf(item))}
                    >
                      {item.name}
                    </div>
                  </td>
                  <td className="text-center">{item.credits}</td>
                  <td className="text-center">{item.theory_hours}</td>
                  <td className="text-center">{item.practical_hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <PaginatedTable
              totalPages={subjectsTotalPages}
              currentPage={subjectsCurrentPage}
              onPageChange={handleSubjectsPageChange}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <CustomButton
            classname="p-2 w-2/5 text-xl"
            title="Lưu phân công"
            onClick={handleAssign}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      className="w-full min-h-screen bg-gray-100 flex justify-center"
      style={{ fontFamily: 'PlayFair Display' }}
    >
      {modalName === 'them-phan-cong' && (
        <CustomModal
          isOpen={isOpenModal}
          onClose={closeModal}
          className="bg-white rounded-xl p-6 min-w-300 max-h-180 mx-auto z-40 border-2 border-black"
          title="Thêm môn học"
        >
          {modalContent()}
        </CustomModal>
      )}

      <div className="w-9/10 h-full bg-white mt-8 rounded-2xl">
        <div className="w-full flex bg-gray-200 items-center pt-4 pl-8 pr-8 pb-4 rounded-t-xl">
          <p className="text-xl font-bold">Tất cả phân công</p>
          <div
            onClick={() => openModal('them-phan-cong')}
            className="flex space-x-2 ml-auto h-3/4 items-center bg-red-700 text-white p-2 rounded-xl hover:bg-blue-900"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            THÊM PHÂN CÔNG
          </div>
        </div>
        <div className="flex items-center space-x-8 mt-8 ml-8 mb-8">
          <div className="min-w-96 flex items-center space-x-2">
            <input
              type="search"
              placeholder="Tìm kiếm giảng viên, môn học..."
              className="min-w-96 bg-gray-100 rounded-xl p-2 text-black border focus:outline-none focus:border-3 focus:ring-blue-300 focus:border-blue-300 focus:shadow-md focus:shadow-blue-300 focus:bg-white"
            />
            <div className="bg-blue-800 text-white rounded-xl w-10 h-10 flex items-center justify-center hover:bg-black">
              <SearchIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-8 mt-4 ml-8 mr-8 max-h-140">
          <table className="w-full mt-2">
            <thead>
              <tr className="w-full bg-gray-100 h-10">
                <th className="text-center min-w-16">ID</th>
                <th className="text-center min-w-64">Tên giảng viên</th>
                <th className="text-center min-w-16">Mã môn học</th>
                <th className="text-center min-w-64">Tên môn học</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-blue-100">
                    <td className="text-center py-4 text-blue-600 font-bold">{item.id}</td>
                    <td>
                      <div
                        className={`flex-1 max-w-90 text-center ${
                          expandedIndex === index
                            ? 'whitespace-normal'
                            : 'overflow-hidden text-ellipsis whitespace-nowrap'
                        } break-words`}
                        onClick={() => toggleExpand(index)}
                      >
                        {item.teacher.fullname}
                      </div>
                    </td>
                    <td className="text-center min-w-32">{item.subject.public_id}</td>
                    <td className="text-center">{item.subject.name}</td>
                    <td className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="text-white bg-red-700 rounded-2xl p-1">
                          <XIcon className="w-5 h-5" onClick={()=>handleDeleteAssignment(item.id)} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Không có dữ liệu phân công
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {assignments.length > 0 && (
          <div className="flex justify-center mt-8 mb-8">
            <PaginatedTable
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignment;