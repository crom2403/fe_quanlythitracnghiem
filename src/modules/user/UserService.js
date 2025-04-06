import axiosInstance from "../../axiosConfig";

const usersFromAPI = async()=>{
    try{
        const response = await axiosInstance.get('/users');
        return response.data;
    }catch(error)
    {
        alert("Get users failed: "+error.message);
    }
};

export default usersFromAPI;