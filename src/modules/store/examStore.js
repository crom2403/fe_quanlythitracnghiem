import { create } from "zustand";

const useExamStore = create((set) => ({
  examDetail: null, // Lưu chi tiết đề thi
  setExamDetail: (examDetail) => set({ examDetail }),
  clearExamDetail: () => set({ examDetail: null }),
}));

export default useExamStore;