import axiosInstance from "../../axiosConfig";

const usersFromAPI = async () => {
    try {
        const response = await axiosInstance.get('/users');
        return response.data;
    } catch (error) {
        alert("Get users failed: " + error.message);
    }
};

export const users = async () => {
    try {
        const result = await usersFromAPI();
        const items = result?.items;
        return items;
    } catch (error) {
        console.error('Can not read items: ' + error.message);
    }
}