import axiosInstance from "../../axiosConfig";

export const detail = async(studyGroupId) =>{
  try{
    const result = await axiosInstance.get(`/study-group/detail/${studyGroupId}`);
    return result.data;
  }catch(error){
    console.error("Call API /study-group/detail/:studyGroupId failed: "+error.message);
  }
}

export const createInviteCode = async () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return { data: { code } };
  };