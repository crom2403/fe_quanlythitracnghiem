import axiosInstance from "../../axiosConfig";

const group = async () => {
    try {
        const response = await axiosInstance.get('/study-group');
        return response.data;
    } catch (error) {
        alert("Get groups failed: " + error.message);
    }
}

export const getKey = (subjectName, academicYear, semester) => {
    return subjectName + '-' + academicYear + '-' + semester;
}

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
        groupedCourses.set(key, []);
      }
  
      // Mỗi group là một học phần, ta gắn groupId chính là id của group
      const courseWithGroupId = {
        ...group,
        groupId: group.id,
        name: group.name
      };
  
      groupedCourses.get(key).push(courseWithGroupId);
    });
  
    return groupedCourses;
  };
  
  
const handleGetGroupCourses = async () => {
    try {
        const response = await group();
        if (response && Array.isArray(response.items)) {
            return response.items;
        } else {
            console.error("Dữ liệu không đúng định dạng: ", response);
            return [];
        }
    } catch (error) {
        console.log("Loi call api /study-group: " + error);
        return [];
    }
};

// Trả về 1 obj mà mỗi thuộc tính của nó là 1 [] có key khác nhau, trong mảng chứa các obj thuộc cùng nhóm(cùng key)
export const getGroupedCoursesData = async () => {
    const groupCourses = await handleGetGroupCourses();
    const groupedCourses = getGroupedCourses(groupCourses);
    return groupedCourses;
}

//Xu ly thong tin course
const groupData = async (teacherId) => {
    try {
        const response = await axiosInstance.get(`/study-group/teacher/${teacherId}`);
        return response.data;
    } catch (error) {
        console.error("Call API /study-group/teacher/:id failed: " + error.message);
    }
}

export const createIncompletedCourseName = (subjectName, academicYear, semester) => {
    return subjectName + ' - NH' + academicYear + ' - ' + semester;
}

export const getCourseInfo = async (courseName, teacherId) => { //Lập trình hướng đối tượng - NH2019 - Học kỳ 1
    const coursesInfo = await groupData(teacherId);
    // Khong dung foreach: no la ham callback, khong tra ve gia tri ra ben ngoai, no khong phai vong lap thong thuong
    for (const course of coursesInfo) {
        const compareString = course.name.replace(/^[^-]+ - /, ""); // Bỏ mã môn học
        if (courseName === compareString) {
          return course;
        }
      }
    return {};
}