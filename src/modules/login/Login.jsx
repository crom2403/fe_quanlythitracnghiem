import '../../styles/loginStyle.css'; // Import file CSS

const Login = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen animate-gradient-bg">
      <form
        className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg w-[30rem] h-[35rem]"
        style={{ fontFamily: 'Plaayfair Display' }}
      >
        <h2 className="text-4xl font-bold mb-6 text-center text-blue-900">
          LOGIN
        </h2>
        <label className="block text-blue-700 text-left w-full mb-2 ml-10 text-xl">
          MSSV
        </label>
        <input
          type="text"
          className="border w-9/10 p-2 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xl"
        ></input>

        <label className="block text-blue-700 text-left w-full mb-2 mt-2 ml-10 text-xl">
          Password
        </label>
        <input
          type="password"
          className="border w-9/10 p-2 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xl"
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
