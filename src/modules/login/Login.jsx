import '../../styles/loginStyle.css'; // Import file CSS
import useUserStore from '../user/useUserStore';
import { login } from './loginService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [mssv, setMssv] = useState('');
  const [pwd, setPwd] = useState('');
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);



  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(mssv, pwd);

      if (result!=null) {
        setIsLoggedIn(true);
        sessionStorage.setItem('role', 'student');
        sessionStorage.setItem('access-token', result.accessToken);
        sessionStorage.setItem('loggedIn', true);
        alert("Login successfull! Access token: "+ result.accessToken);
      if (result != null) {
        // setUser(result);
        sessionStorage.setItem('user-info', JSON.stringify(result))
        const userData = sessionStorage.getItem('user-info')
        alert("Login successfull! accesstoken: "+ JSON.parse(userData).acce
        navigate('/dashboard');
      } else { alert("Login failed!") }
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="flex items-center justify-center w-full h-screen bg-blue-300">
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg w-[30rem] h-[35rem]"
        style={{ fontFamily: 'Plaayfair Display' }
        }
      >
        <h2 className="text-4xl font-bold mb-6 text-center text-blue-900">
          LOGIN
        </h2>
        <label className="block text-blue-700 text-left w-full mb-2 ml-10 text-xl">
          Mã người dùng
        </label>
        <input
          type="text"
          value={mssv}
          onChange={(e) => setMssv(e.target.value)}
          className="border w-9/10 p-2 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xl"
          required
        ></input>

        <label className="block text-blue-700 text-left w-full mb-2 mt-2 ml-10 text-xl">
          Password
        </label>
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          className="border w-9/10 p-2 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xl"
          required
        ></input>

        <input
          type="submit"
          className="mt-6 w-2/3 p-2 text-teal-900 border-2 border-blue-700 rounded-2xl hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xl"
          value={'Login'}
        ></input>
        <input
          type="submit"
          className="mt-6 text-xl w-2/3 border-2 pt-2 pb-2 rounded-2xl hover:bg-black hover:text-white"
          value={'Đăng nhập với Google'}
        />
        <p className="mt-8 text-xl">
          Forgot your password? Click{' '}
          <a href="#" className="text-red-600 hover:underline">
            here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
