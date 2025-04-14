import axiosInstance from '../../axiosConfig';

export const finishedTests = async(examId)=>{
    try {
        const response = axiosInstance.get(`/`)
    } catch (error) {
        console.error(`Call api failed: ${error.message}`);
        return error.message;
    }
}