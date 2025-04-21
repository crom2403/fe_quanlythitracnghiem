import {
  PlusIcon,
  SearchIcon,
  CogIcon,
  XCircleIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  ClipboardIcon,
  BellIcon,
  ClockIcon,
} from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { FaFile } from 'react-icons/fa';
import { detail, addNewStudent, groupInviteCode, changeInviteCode, removeStudent, groupExams } from './GroupDetaillService';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Modal from 'react-modal';
import CustomModal from '../../components/modal/CustomModal';
import path from '../../utils/path';

Modal.setAppElement('#root');

const GroupDetail = () => {
  const [students, setStudents] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [activeTab, setActiveTab] = useState('manual');
  const [inviteCode, setInviteCode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [setActiveLink] = useState(path.EXAMPAPER);
  const [exams, setExams] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedGroupDetail = location.state?.selectedGroupDetail || {
    groupId: -1,
    groupName: '',
    studentCount: 0
  };
  const handleAddNewStudent = async ({ student_code, fullname, password, studyGroupId }) => {
    const newStudent = { student_code, fullname, password, studyGroupId };
    console.log("New student", newStudent);
    const result = await addNewStudent(newStudent);
    if (!result)
      alert("Máy chủ không phản hồi!");
    if (result.status === 201)
      alert(`Đã thêm sinh viên ${fullname} vào nhóm học phần!`);
    else
      alert(`Thêm sinh viên vào học phần thất bại, mã lỗi:${result.status}`);
  }

  const handleSetInviteCode = async () => {
    const result = await groupInviteCode(selectedGroupDetail.groupId);
    if (!result)
      console.error(`Call api get invite code failed: ${result.message}`);
    else {
      if (result.success === true)
        setInviteCode(result.invite_code);
      else
        console.warn('Get invite code failed');
    }
  }

  // Thay đổi mã mời
  const handleChangeInviteCode = async () => {
    const result = await changeInviteCode(selectedGroupDetail.groupId);
    if (!result)
      console.error(`Call api change invite code failed: ${result.message}`);
    else {
      if (result.success === true) {
        alert("Đợi một chút...");
        handleSetInviteCode();
      } else
        console.warn('Change invite code failed');
    }
  }

  const handleRemoveStudent = async(student_code) => {
    const result = await removeStudent(selectedGroupDetail.groupId, student_code);
    if (!result)
      console.error(`Call api remove student failed: ${result.message}`);
    else {
      if (result.success === true) {
        alert(`Đã xóa sinh viên có mã '${student_code}'`);
        fetchStudents(); // Tải lại danh sách sau khi xóa
      } else
        console.warn('Remove student failed!', result.message);
        // alert('Xóa sinh viên khỏi nhóm thất bại!');
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      // Nếu ô tìm kiếm trống, tải lại toàn bộ danh sách
      fetchStudents();
    } else {
      const filtered = students.filter((student) =>
        student.fullname.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length === 0) {
        alert(`Không tìm thấy sinh viên tên '${searchQuery}'`);
      }
      setStudents(filtered);
    }
  };

  const setSelectedExam = (selectedExamId)=>{
    sessionStorage.getItem('selectedExamId', selectedExamId);
    console.log(`Selected exam id: '${selectedExamId}'`);
  }

  const fetchStudents = async () => {
    try {
      const groupId = selectedGroupDetail.groupId;
      const result = await detail(groupId);
      if (Array.isArray(result)) {
        setStudents(result);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error('Lỗi khi fetch sinh viên:', err);
      setStudents([]);
    }
  };
  useEffect(()=>{
    const loadExams = async()=>{
      const result = await groupExams(selectedGroupDetail.groupId);
      if(!result)
      {
        console.error('Get exams failed!');
      }else{
        setExams(result);
      }
    }
    loadExams();
  },[])

  useEffect(() => {
    if (selectedGroupDetail.groupId === -1) {
      navigate(path.GROUP);
    }
  
    fetchStudents();
  }, [selectedGroupDetail?.groupId]);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const openModal = (modalName) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'manual':
        return (
          <div className="" style={{ fontFamily: 'Playfair Display' }}>
            <div className="flex flex-col space-x-8">
              <p className="text-blue-900 text-xl">Mã số sinh viên</p>
              <input
                type="text"
                className="w-full h-auto border-1 bg-white text-xl pl-2 rounded-xl"
                id='n-student-code'
              />
            </div>
            <div className="flex flex-col space-x-7 mt-2">
              <p className="text-blue-900 text-xl">Họ tên sinh viên</p>
              <input
                type="text"
                className="w-full h-auto border-1 bg-white text-xl pl-2 rounded-xl"
                id='n-fullname'
              />
            </div>
            <div className="flex flex-col space-x-2 mt-2">
              <p className="text-blue-900 text-xl">Mật khẩu sinh viên</p>
              <input
                type="password"
                className="w-full h-auto border-1 bg-white text-xl pl-2 rounded-xl"
                id='n-password'
              />
            </div>
            <div className="mt-4 text-center">
              <button onClick={() => {
                let code = document.getElementById('n-student-code')?.value;
                let name = document.getElementById('n-fullname')?.value;
                let pass = document.getElementById('n-password')?.value;
                let groupId = selectedGroupDetail?.groupId + "";
                const n_student = { student_code: code, fullname: name, password: pass, studyGroupId: groupId };
                handleAddNewStudent(n_student);
              }} className="border-2 bg-white text-xl text-black border-black p-2 rounded-xl hover:bg-black hover:text-white">
                Thêm sinh viên
              </button>
            </div>
          </div>
        );
      case 'code':
        return (
          <div
            className="flex flex-col items-center"
            style={{ fontFamily: 'Playfair Display' }}
            onClick={() => { handleSetInviteCode() }}
          >
            <div className="min-h-32 min-w-96 bg-blue-900 text-white text-2xl flex items-center justify-center rounded-2xl">
              <span>{inviteCode ? inviteCode : 'Chưa tạo mã mời'}</span>
            </div>
            <div
              className="w-32 bg-white text-black border-1 text-center pt-2 pb-2 rounded-2xl mt-4 hover:bg-black hover:text-white"
              onClick={() => { handleChangeInviteCode() }}
            >
              Đổi mã mời
            </div>
          </div>
        );
      case 'file':
        return (
          <div style={{ fontFamily: 'Playfair Display' }}>
            <div className="flex space-x-2">
              <label className="text-black">Mật khẩu</label>
              <input
                type="password"
                className="w-64 bg-white pl-2 text-xl p-1 rounded-2xl"
              />
            </div>
            <div className="mt-4 flex space-x-2">
              <label className="text-black">Chọn file</label>
              <input
                type="file"
                className="border-1 bg-white p-1 rounded-2xl"
              />
            </div>
            <h2 className="mt-4 text-blue-900 italic">
              Vui lòng sử dụng file theo mẫu.{' '}
              <a
                href="/files/mauTest.xlsx"
                download="Mau.xlsx"
                className="text-red-400"
              >
                Tải xuống mẫu
              </a>
            </h2>
          </div>
        );
      default:
        return null;
    }
  };

  const [settingActiveTab, setSettingActiveTab] = useState('manual');
  const openSettingTab = (settingTab) => {
    setSettingActiveTab(settingTab);
  };

  const settingRenderContent = () => {
    switch (settingActiveTab) {
      case 'manual':
        return (
          <div className="max-h-[500px] overflow-y-auto">
            {exams.map((item) => {
              return (
                <div
                  key={item.id}
                  className="w-full text-black space-y-2 mt-4 bg-blue-50 pl-4 min-h-25 pt-4 border-l-3 border-blue-900 rounded-2xl"
                >
                  <div className="text-2xl text-blue-800">
                    {/* <Link to={path.FINISHEDTEST} state={{'selectedExamId':item.id}}>{item.name}</Link> */}
                    <p>{item.name}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="w-4 h-4" />{' '}
                    <div className='flex text-sm'>
                    Diễn ra từ <p className='text-blue-800 ml-2 mr-2'>{item.start_time}</p> đến <p className='text-red-600 ml-2 mr-2'>{item.end_time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      case 'notifications':
        return <div>NỘI DUNG THÔNG BÁO</div>;
    }
  };

  const setting = () => {
    return (
      <div className="" style={{ fontFamily: 'Playfair Display' }}>
        <div className="flex items-center min-h-16">
          <h2 className=" font-bold text-center">
            {selectedGroupDetail.groupName}
          </h2>
        </div>
        <div className="flex justify-center items-center w-full bg-red-700 text-white">
          <div
            className={`w-1/2 flex justify-center items-center min-h-16 ${settingActiveTab === 'manual' ? 'bg-red-700' : 'bg-black'}`}
            onClick={() => openSettingTab('manual')}
          >
            <ClipboardIcon className="w-5 h-5 mr-2" /> Đề kiểm tra
          </div>
          <div
            className={`w-1/2 flex justify-center items-center min-h-16 ${settingActiveTab === 'notifications' ? 'bg-red-700' : 'bg-black'}`}
            onClick={() => openSettingTab('notifications')}
          >
            <BellIcon className="w-5 h-5 mr-2" /> Thông báo
          </div>
        </div>
        <div className="">{settingRenderContent()}</div>
      </div>
    );
  };

  const themSinhVienModal = () => {
    return (
      <div>
        <h2
          className="text-xl font-semibold mb-4 text-blue-800"
          style={{ fontFamily: 'Playfair Display' }}
        >
          Thêm sinh viên
        </h2>
        <div className="flex mb-4" style={{ fontFamily: 'Playfair Display' }}>
          <span
            onClick={() => { setActiveTab('manual') }}
            className={`cursor-pointer py-2 text-center pl-2 pr-2 ${activeTab === 'manual' ? 'bg-blue-800 text-white rounded-tr-xl' : 'bg-gray-200 text-black'}`}
          >
            Thêm thủ công
          </span>
          <span
            onClick={() => setActiveTab('code')}
            className={`cursor-pointer py-2 text-center pl-2 pr-2 ${activeTab === 'code' ? 'bg-blue-800 text-white rounded-t-xl' : 'bg-gray-200 text-black'}`}
          >
            Thêm bằng mã
          </span>
          <span
            onClick={() => setActiveTab('file')}
            className={`cursor-pointer py-2 text-center pl-2 pr-2 ${activeTab === 'file' ? 'bg-blue-800 text-white rounded-tl-xl' : 'bg-gray-200 text-black'}`}
          >
            Thêm từ file
          </span>
        </div>
        <div className="mb-4">{renderContent()}</div>
        <div className="flex justify-end mb-0">
          <button
            onClick={closeModal}
            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-black"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col bg-gray-100"
      style={{ fontFamily: 'PlayFair Display' }}
    >
      {activeModal === 'themsinhvien-modal' && (
        <div className="inset-0 z-40"></div>
      )}
      <CustomModal
        isOpen={activeModal === 'themsinhvien-modal'}
        onClose={closeModal}
        title="Thêm sinh viên modal"
        className="bg-blue-50 rounded-xl p-6 w-150 mx-auto z-40 min-h-64 mt-40 border-2 border-black"
      >
        {themSinhVienModal()}
      </CustomModal>
      <CustomModal
        isOpen={activeModal === 'setting-modal'}
        onClose={closeModal}
        title="Setting modal"
        className="max-w-3/7 min-h-screen bg-white text-xl ml-auto"
      >
        {setting()}
      </CustomModal>
      <div className="flex h-10 mt-8 items-center ml-16">
        <div className="h-10">
          <input
            type="search"
            className="w-96 h-10 pl-4 border-1 mr-1 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:text-xl"
            placeholder="Nhập tên sinh viên cần tìm kiếm..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div
          className="flex h-10 border-1 border-black bg-white text-black pl-2 pr-2 rounded-2xl items-center hover:bg-black hover:text-white"
          onClick={handleSearch}
        >
          <SearchIcon className="w-5 h-5" />
        </div>
        <div className="flex ml-auto items-center h-10 rounded-2xl pl-4 pr-4 border-2 border-white text-white bg-black hover:bg-blue-900">
          <FaFile className="w-4 h-4 text-white mr-2" />
          Xuất danh sách SV
        </div>
        <div className="flex ml-4 items-center h-10 rounded-2xl pl-4 pr-4 border-2 border-white text-white bg-black hover:bg-blue-900 ">
          <FaFile className="w-4 h-4 text-white mr-2" />
          Xuất bảng điểm
        </div>
        <div
          onClick={() => {
            openModal('themsinhvien-modal');
          }}
          className="flex ml-4 items-center h-10 rounded-2xl pl-4 pr-4 border-2 border-white text-white bg-black hover:bg-blue-900"
        >
          <PlusIcon className="w-4 h-4 text-white mr-2" />
          Thêm sinh viên
        </div>
        <div
          onClick={() => {
            openModal('setting-modal');
          }}
          className="flex ml-4 items-center h-10 mr-16 rounded-2xl pl-4 pr-4 border-2 border-white text-white bg-black hover:bg-blue-900 hover:text-xl"
        >
          <CogIcon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="ml-16 mr-16 mt-8 bg-white rounded-t-xl">
        <div className="w-full h-16 bg-gray-200 text-xl flex items-center rounded-t-xl">
          <p className='ml-4'>{selectedGroupDetail.groupName ?? 'Không xác định'}</p>
          <p className="ml-auto mr-8 text-gray-500">Sĩ số: {selectedGroupDetail.studentCount ?? 1} </p>
        </div>
        <div className="overflow-auto max-h-140">
          <table className="w-full h-auto">
            <thead className='bg-blue-900 text-white'>
              <tr className="text-xl h-16">
                <th className="">STT</th>
                <th className="text-left ">
                  <div className='flex items-center'>
                    <p>Họ tên</p> <SortAscendingIcon className="w-5 h-5 ml-2 hover:text-yellow-300" />
                    <SortDescendingIcon className="w-5 h-5 ml-2" />
                  </div>
                </th>
                <th className="">Mã sinh viên</th>
                <th className="">Giới tính</th>
                <th className="">Ngày sinh</th>
                <th className="">Hành động</th>
              </tr>
            </thead>
            <tbody className="">
              {students.map((student, index) => (
                <tr key={index} className={`text-center text-xl h-10 hover:bg-blue-100`}>
                  <td className=''>{index + 1}</td>
                  <td>{student.fullname}</td>
                  <td>{student.student_code}</td>
                  <td>{student.gender}</td>
                  <td>{student.birthday}</td>
                  <td className="flex flex-col items-center">
                    <XCircleIcon 
                      onClick={() => { handleRemoveStudent(student.student_code) }}
                      className="w-8 h-8 m-2 bg-blue-800 text-white rounded-2xl hover:bg-red-800" 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default GroupDetail;