import {
  PlusIcon,
  CogIcon,
  UserGroupIcon,
  TrashIcon,
  ClockIcon,
  UsersIcon
} from '@heroicons/react/outline';
import {
  getGroupedCoursesData,
  createIncompletedCourseName,
  getCourseInfo,
} from './groupService';

import { useEffect, useState } from 'react';
import { FaWrench, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

import path from '../../utils/path';

const Group = () => {
  const navigate = useNavigate();
  const [groupedCourses, setGroupedCourses] = useState(new Map());
  const [coursesNameMap, setCoursesNameMap] = useState(new Map());
  const [courseInfoById, setCourseInfoById] = useState(new Map());

  const [visibleMenu, setVisibleMenu] = useState({
    groupIndex: null,
    subGroupIndex: null,
  });

  useEffect(() => {
    const fetchGroupedCourses = async () => {
      const result = await getGroupedCoursesData();
      setGroupedCourses(result);
      console.log("Grouped courses", result);
      const newCoursesNameMap = new Map();
      const newCourseInfoMap = new Map();

      for (const [key, courses] of result.entries()) {
        const firstCourse = courses[0];
        if (firstCourse) {
          const courseKey = createIncompletedCourseName(
            firstCourse.subject.name,
            firstCourse.academic_year?.start_year,
            firstCourse.semester?.name
          );
          const tId = firstCourse.teacher?.id;
          if (courseKey && tId) {
            try {
              const info = await getCourseInfo(courseKey, tId);
              newCoursesNameMap.set(key, info?.name || 'Không tìm thấy tên học phần');

              // Ánh xạ thông tin cho từng course
              if (info?.studyGroups?.length) {
                info.studyGroups.forEach((group, index) => {
                  const course = courses[index];
                  if (course) {
                    newCourseInfoMap.set(group.id, {
                      note: group.note,
                      student_count: group.student_count,
                    });
                  }
                });
              }
            } catch (error) {
              newCoursesNameMap.set(key, 'Lỗi tải tên học phần');
            }
          }
        }
      }

      setCoursesNameMap(newCoursesNameMap);
      setCourseInfoById(newCourseInfoMap);
    };

    fetchGroupedCourses();
  }, []);

  const toggleMenu = (groupIndex, subGroupIndex) => {
    if (
      visibleMenu.groupIndex === groupIndex &&
      visibleMenu.subGroupIndex === subGroupIndex
    ) {
      setVisibleMenu({ groupIndex: null, subGroupIndex: null });
    } else {
      setVisibleMenu({ groupIndex, subGroupIndex });
    }
  };


  return (
    <div
      className="w-full min-h-screen flex flex-col bg-gray-100"
      style={{ fontFamily: 'PlayFair Display' }}
    >
      <div className="flex h-10 mt-8 items-center ml-16">
        <select className="p-2 bg-blue-900 text-white rounded-md">
          <option className="bg-blue-100 text-black">Đang giảng dạy</option>
          <option className="bg-blue-100 text-black">Đã xong</option>
          <option className="bg-blue-100 text-black">...</option>
        </select>
        <div className="h-10">
          <input
            type="search"
            className="w-96 h-10 pl-4 border-1 ml-2 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:text-xl"
            placeholder="Nhập thông tin tìm kiếm..."
          />
        </div>
        <div className="flex ml-auto items-center h-10 mr-16 rounded-2xl pl-4 pr-4 border-2 border-white text-white bg-blue-900 hover:bg-blue-600 cursor-pointer">
          <PlusIcon className="w-4 h-4 text-white mr-2" />
          Thêm nhóm
        </div>
      </div>

      <div className="mt-4">
        {Array.from(groupedCourses.entries()).map(([key, courses], index) => (
          <div key={key} className="min-h-46 w-full text-black text-xl mt-4 ml-16">
            <p>{coursesNameMap.get(key) || 'Đang tải tên học phần...'}</p>
            <div className="flex flex-wrap">
              {courses.map((course, subIndex) => {
                const info = courseInfoById.get(course.id);
                return (
                  <div
                    key={subIndex}
                    className="bg-white min-h-56 min-w-64 ml-4 mt-2 rounded-3xl shadow-md"
                  >
                    <div className="flex bg-blue-100 h-16 text-blue-700 rounded-t-3xl items-center">
                      <p className="pl-4">{course.name}</p>
                      <div
                        className="ml-auto mr-4 flex relative"
                        onClick={() => toggleMenu(index, subIndex)}
                      >
                        <CogIcon className="w-5 h-5 text-black cursor-pointer" />
                        {visibleMenu.groupIndex === index &&
                          visibleMenu.subGroupIndex === subIndex && (
                            <ul className="ml-4 absolute bg-white shadow-lg rounded-lg mt-8 p-2 w-64 border-2 border-gray-200 text-black z-10 text-sm">
                              <li className="p-2 hover:bg-gray-200">
                                <Link
                                  to={path.GROUPDETAIL}
                                  state={{
                                    selectedGroupDetail: {
                                      studentCount: info?.student_count ?? 0,
                                      groupName: coursesNameMap.get(key) ?? 'Không rõ',
                                      groupId: course?.id ?? 0,
                                    }
                                  }}
                                  className="flex items-center"
                                >
                                  <UserGroupIcon className="w-5 h-5 text-blue-900 mr-2" />
                                  Danh sách sinh viên
                                </Link>
                              </li>
                              <li className="p-2 hover:bg-gray-200">
                                <div className="flex items-center">
                                  <FaWrench className="w-5 h-5 text-blue-900 mr-2" />
                                  Sửa thông tin
                                </div>
                              </li>
                              <li className="p-2 hover:bg-gray-200">
                                <div className="flex items-center">
                                  <FaEyeSlash className="w-5 h-5 text-blue-900 mr-2" />
                                  Ẩn nhóm
                                </div>
                              </li>
                              <li className="p-2 hover:bg-gray-200 text-red-600">
                                <div className="flex items-center">
                                  <TrashIcon className="w-5 h-5 text-blue-900 mr-2" />
                                  Xóa nhóm
                                </div>
                              </li>
                            </ul>
                          )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 text-base text-xl space-y-4">
                      <p className='flex items-center space-x-2'>
                        <ClockIcon className='w-5 h-5 text-violet-700' />
                        Thời gian:{' '}
                        <span className="font-medium text-blue-700">
                          {info?.note || 'Chưa có'}
                        </span>
                      </p>
                      <p className='flex items-center space-x-2'>
                        <UsersIcon className='w-5 h-5 text-violet-700' />
                        Sĩ số:{' '}
                        <span className="font-medium text-blue-700">
                          {info?.student_count ?? 0} 
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Group;
