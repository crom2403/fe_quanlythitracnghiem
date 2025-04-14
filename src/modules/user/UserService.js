import axiosInstance from "../../axiosConfig";

export const usersResponse = async (page = 1) => {
    try {
        const response = await axiosInstance.get(`/users?page=${page}`);
        return response.data;
    } catch (error) {
        alert("Get users failed: " + error.message);
    }
};

export const createUser = async(student_code, email, fullname, gender,birthday, password, status, role)=>{
    try {
        const response = await axiosInstance.post('/users', {student_code:student_code,
            email:email,
            fullname:fullname,
            birthday:birthday,
            password:password,
            gender:gender,
            status:status,
            role:role
        });
        return response;
    } catch (error) {
        console.error("Call API (POST) /users failed", error.message);
        return error.message;
    }
}

export const deleteUser = async(userId)=>{
    try {
        const response = await axiosInstance.delete(`/users/${userId}`);
        return response;
    } catch (error) {
        console.error("Delete user failed: " + error.message);
    }
}