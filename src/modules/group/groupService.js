import axiosInstance from "../../axiosConfig";

export const group = async() =>{
    try{
        const response = await axiosInstance.get('/study-group');
        return response.data;
    }catch(error){
        alert("Get groups failed: "+error.message);
    }
}