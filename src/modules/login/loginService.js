import axiosInstance from "../../axiosConfig";

export const login = async (student_code, password) =>{
  try{
    const response = await axiosInstance.post('/auth/login', {student_code, password});
    return response.data;
  } catch (error){
    alert('Login failed: '+ error.message);
  }
};

