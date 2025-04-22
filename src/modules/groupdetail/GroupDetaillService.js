import axiosInstance from "../../axiosConfig";

export const detail = async(studyGroupId) =>{
  try{
    const result = await axiosInstance.get(`/study-group/detail/${studyGroupId}`);
    return result.data;
  }catch(error){
    console.error("Call API /study-group/detail/:studyGroupId failed: "+error.message);
  }
}

export const createInviteCode = async () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return { data: { code } };
  };


export const changeInviteCode = async(studyGroupId) =>{
  try {
    const response = await axiosInstance.get(`/study-group/change-invite-code/${studyGroupId}`);
    return response.data;
  } catch (error) {
    console.error("Call API /study-group/change-invite-code/:studygroupid failed: "+error.message);
    return error.message;
  }
}
export const groupInviteCode = async(studyGroupId)=>{
  try {
    const response = await axiosInstance.get(`/study-group/get-invite-code/${studyGroupId}`);
    return response.data;
  } catch (error) {
    console.error("Call API /study-group/get-invite-code/:studyGroupId failed: "+error.message);
    return error.message;
  }
}

export const addNewStudent = async({student_code, fullname, password, studyGroupId})=>{
  try {
    const response = await axiosInstance.post('/study-group/manual', {student_code, fullname, password, studyGroupId});
    return response;
  } catch (error) {
    console.error("Call API /study-group/manual failed: "+error.message);
    if (error.response) {
      return error.response;
    }
    // Nếu lỗi không có response (như mất mạng), nem loi ra
    throw error;
  }
}

export const removeStudent = async(studyGroupId, student_code)=>{
  try {
    const response = await axiosInstance.delete(`/study-group/student/${studyGroupId}?student_code=${student_code}`);
    return response.data;
  } catch (error) {
    console.error("Call API /study-group//student/${studyGroupId}?student_code=${student_code} failed: "+error.message);
    return error.message;
  }
}

export const groupExams = async(studyGroupId)=>{
  try {
    const response = await axiosInstance.get(`/exam/get-all-exams-of-study-group/${studyGroupId}`);
    return response.data;
  } catch (error) {
    console.error("Call API /exam/get-all-exams-of-study-group/${studyGroupId} failed: "+error.message);
    return error.message;
  }
}