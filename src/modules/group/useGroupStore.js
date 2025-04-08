import { create } from 'zustand';

export const useCourseStore = create((set) => ({
    course: null,
    setCourse: (courseData) => set({ course: courseData }),
    clearCourse: () => set({ course: null })
}));

export const useGroupIdStore = create((set) => ({
    groupId: -1,
    setGroupId: (groupId) => set({ groupId: groupId }),
    clearGroup: () => set({ groupId: -1 })
}))

export const useSelectedGroupDetailStore = create((set)=>({
    selectedGroupDetail:{studentCount:0, groupName: "", groupId:-1},
    setSelectedGroupDetail: ({studentCount,groupName,groupId })=>set({selectedGroupDetail: {studentCount, groupName, groupId}}),
    clearSelectedGroupDetail: ()=>set({selectedGroupDetail: {studentCount:0, groupName: "", groupId:-1}})
}))