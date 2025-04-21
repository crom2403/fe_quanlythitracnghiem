import axiosInstance from '../../axiosConfig';

export const examPapersResponse = async()=>{
    try {
        const response = await axiosInstance.get('/exam/get-all');
        return response.data;
    } catch (error) {
        console.error('Call API get all exam failed!', error.message);
        return error.message;
    }
}