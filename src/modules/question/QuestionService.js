import axiosInstance from "../../axiosConfig";

const questionsObj = async (page = 1, limit = 10) => {
    try {
        const result = await axiosInstance.get('/question', {
            params: {
                page,
                limit,
            },
        });
        return result.data; // Trả về toàn bộ object: { items, total, page, limit, totalPages }
    } catch (error) {
        console.error(`Gọi API /question thất bại: ${error.message}`);
        throw error; // Ném lỗi để hàm gọi xử lý
    }
};

export const questions = async (page = 1, limit = 10) => {
    try {
        const questionsData = await questionsObj(page, limit);
        if (!questionsData) {
            throw new Error("Không nhận được dữ liệu từ API");
        }
        return questionsData; // Trả về toàn bộ object JSON
    } catch (error) {
        console.error(`Lấy dữ liệu câu hỏi thất bại: ${error.message}`);
        return null; // Trả về null nếu thất bại để component xử lý
    }
};
