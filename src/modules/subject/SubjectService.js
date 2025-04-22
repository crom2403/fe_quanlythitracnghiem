import axiosInstance from "../../axiosConfig";

export const subjectsResponse = async (page = 1) => {
    try {
        const response = await axiosInstance.get(`/subject?page=${page}`);
        return response.data;
    } catch (error) {
        console.error("Call api /subject error!", error.message);
        return error.message;
    }
}

export const getAllSubjectResponse = async()=>{
    try {
        const response = await axiosInstance.get(`/subject?limit=1000`);
        return response.data.items;
    } catch (error) {
        console.error("Call api /subject error!", error.message);
        return error.message;
    }
}

export const subjectChaptersResponse = async (subjectId) => {
    try {
        const response = await axiosInstance.get(`/chapter?subjectId=${subjectId}`);
        return response.data;
    } catch (error) {
        console.error("Call api /subject error!", error.message);
        return error.message;
    }
}
export const createNewChapter = async (subjectId, chapterName) => {
    try {
        const response = await axiosInstance.post('/chapter', { subjectId: subjectId, name: chapterName });
        return response;
    } catch (error) {
        console.error("Call api /chapter error!", error.message);
        return error.message;
    }
}

export const createNewSubject = async (id, name, credits, theory_hours, practice_hours) => {
    try {
        const response = await axiosInstance.post('/subject', { public_id: id, name: name, credits: credits, theory_hours: theory_hours, practical_hours: practice_hours });
        return response;
    } catch (error) {
        console.error("Call api /subject error!", error.message);
        return error.message;
    }
}
export const editSubject = async (id, public_id, name, credits, theory_hours, practice_hours) => {
    try {
        const response = await axiosInstance.put(`/subject/${id}`, { public_id: public_id, name: name, credits: credits, theory_hours: theory_hours, practical_hours: practice_hours });
        return response;
    } catch (error) {
        console.error("Call api (PUT) /subject/:id failed ", error.message);
        return error.message;
    }
}
export const deleteSubject = async(id)=>{
    try {
        const response = await axiosInstance.delete(`/subject/${id}`);
        return response;
    } catch (error) {
        console.error("Call api (DELETE) /subject/:id failed ", error.message);
        return error.message;
    }
}