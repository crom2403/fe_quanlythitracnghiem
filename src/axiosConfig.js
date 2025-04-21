import axios from 'axios';

import useUserStore from './modules/user/useUserStore';
import examStore from './modules/store/examStore';
const axiosInstance = axios.create({
    baseURL:'https://inevitable-justinn-tsondev-41d66d2f.koyeb.app/api/v1',
    timeout:100000,
    headers:{
        'Content-Type':'application/json',
    },
});

// Them access token vao request truoc khi gui toi server
axiosInstance.interceptors.request.use(
    (config) => { //config la doi tuong cau hinh (url, method, headers,...)
      const userData = sessionStorage.getItem('user-info');
      let accessToken=null;
      if(userData!=null)
        accessToken = JSON.parse(userData).accessToken;
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
// Xu ly loi chung
axiosInstance.interceptors.response.use(
    (response)=> response,
    (error)=>{
        console.error('API error: ',error.response || error.message)
        return Promise.reject(error);
    }
)

export default axiosInstance;