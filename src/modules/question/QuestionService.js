import axiosInstance from "../../axiosConfig";

const questionsObj = async () => {
    try {
        const result = await axiosInstance.get('/question');
        return result.data;
    } catch (error) {
        console.error("Call API /question failed: " + error.message);
    }
}

export const questions = async () => {
    try {
        const questionsData = await questionsObj();
        return questionsData?.items;
    } catch (error) {
        console.error("Get items from questionsObj failed: " + error.message);
    }
}