import axiosInstance from "../../axiosConfig";

export const subjects = async()=>{
    try {
        const response = await axiosInstance.get('/subject');
        return response.data;
    } catch (error) {
        console.error("Call api /subject error!", error.message);
        return error.message;
    }
}