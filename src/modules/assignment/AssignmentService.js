import axiosInstance from '../../axiosConfig';

export const assignmentsResponse = async () => {
    try {
        const response = await axiosInstance.get('/subject/admin/assign-teacher?limit=1000');
        return response.data.items;
    } catch (error) {
        console.error('Call API get all assignment failed!', error.message);
        return error.message;
    }
}

export const assignResponse = async(assignObj)=>{
    try {
        const response = await axiosInstance.post('/subject/assign-teacher', assignObj);
        return response;
    } catch (error) {
        console.error('Call API assign failed!', error.message);
        return error.message;
    }
}

export const deleteAssignment = async (assignmentId)=>{
    try {
        const response = await axiosInstance.delete(`/subject/admin/delete-assign-teacher/${assignmentId}`);
        return response;
    } catch (error) {
        console.error('Call API assign failed!', error.message);
        return error.message;
    }
}