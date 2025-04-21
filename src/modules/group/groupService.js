import axiosInstance from "../../axiosConfig";

// Lấy danh sách nhóm học từ API
const group = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(`/study-group?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhóm: ", error.message);
    throw error;
  }
};

// Tạo key để nhóm dữ liệu
const getKey = (subjectName, startYear, semesterName) => {
  return `${subjectName || 'Unknown'}_${startYear || 'Unknown'}_${semesterName || 'Unknown'}`;
};

// Nhóm dữ liệu theo subject, academic_year, semester
const getGroupedCourses = (groups) => {
  if (!Array.isArray(groups)) {
    console.error("Dữ liệu không phải array");
    return new Map();
  }

  const groupedCourses = new Map();

  groups.forEach(group => {
    const key = getKey(
      group.subject?.name,
      group.academic_year?.start_year,
      group.semester?.name
    );

    if (!groupedCourses.has(key)) {
      groupedCourses.set(key, {
        subjectName: group.subject?.name || 'Không rõ',
        academicYear: group.academic_year?.start_year || 'Không rõ',
        semesterName: group.semester?.name || 'Không rõ',
        groups: []
      });
    }

    groupedCourses.get(key).groups.push({
      id: group.id,
      name: group.name,
      teacher: group.teacher?.fullname || 'Không rõ',
      studentCount: group.detail?.amount || 0,
      note: group.detail?.note || 'Chưa có'
    });
  });

  return groupedCourses;
};

// Lấy và nhóm dữ liệu
export const getGroupedCoursesData = async (page = 1, limit = 10) => {
  try {
    const response = await group(page, limit);
    if (response && Array.isArray(response.items)) {
      const groupedCourses = getGroupedCourses(response.items);
      return {
        groupedCourses,
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages
      };
    } else {
      console.error("Dữ liệu không đúng định dạng: ", response);
      return { groupedCourses: new Map(), total: 0, page: 1, limit, totalPages: 0 };
    }
  } catch (error) {
    console.error("Lỗi khi gọi API /study-group: ", error);
    return { groupedCourses: new Map(), total: 0, page: 1, limit, totalPages: 0 };
  }
};

export const createGroup = async ({ 
  name,
  note,
  teacher_id,
  subject_id,
  semester_id,
  academic_year_id }) => {
    try {
      const response = await axiosInstance.post('/study-group', {name, note,teacher_id, subject_id, semester_id, academic_year_id});
      return response;
    } catch (error) {
      console.error('Lỗi gọi api POST /study-group', error.message);
      return error.message;
    }
}
