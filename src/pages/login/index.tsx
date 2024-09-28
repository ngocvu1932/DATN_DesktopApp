import React, {useEffect, useState} from 'react';
import TextInput from '../../components/text-input';
import BG from '../../assets/images/background.png';
import Divider from '../../components/divider';
import {getInfo, login} from '../../api/auth';
import LoadingSpinner from '../../components/loading-spinner';
import {useDispatch} from 'react-redux';
import {setUserInfo} from '../../redux/slices/userInfoSlice';
import Cookies from 'js-cookie';
import {useNavigate} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const API_URL = import.meta.env.VITE_API_URL;

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isFilled, setIsFilled] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const accessToken = Cookies.get('accessToken');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (phone && password) {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, [phone, password]);

  useEffect(() => {
    const getInfoUser = async () => {
      const res = await getInfo();
      if (res?.statusCode === 200) {
        dispatch(setUserInfo(res.data));
        navigate('/dashboard', {state: {message: 'Chào mừng quay trở lại!', autoClose: 3000}});
      } else {
        dispatch(setUserInfo(null));
      }
    };

    if (accessToken) {
      getInfoUser();
    }
  }, [accessToken]);

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsLoadingLogin(true);
    const res = await login({username: phone, password: password});
    if (res?.statusCode === 200) {
      dispatch(setUserInfo(res.data.user));
      Cookies.set('accessToken', res.data.accessToken, {expires: 1 / 24, secure: true});
      Cookies.set('refreshToken', res.data.refreshToken, {expires: 7, secure: true});
      setIsLoadingLogin(false);
      navigate('/dashboard', {state: {message: 'Đăng nhập thành công!', autoClose: 3000}});
    } else {
      setIsLoadingLogin(false);
      toast.error('Thông báo: Đăng nhập thất bại!', {autoClose: 3000});
    }
  };

  return (
    <div
      className="relative w-full h-screen flex justify-center items-center bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: `url(${BG})`,
      }}
    >
      <div className="flex items-center bg-white flex-col px-6 py-8 rounded-xl shadow-xl">
        <p className="text-black font-bold text-2xl">LOGIN</p>
        <Divider size={20} />
        <TextInput value={phone} className="w-[250px]" changeText={setPhone} placeholder="Tên đăng nhập" type="text" />
        <Divider size={20} />
        <TextInput
          value={password}
          className="w-[250px]"
          changeText={setPassword}
          placeholder="Mật khẩu"
          type="password"
        />

        <Divider size={20} />
        <button
          className={`bg-blue-500 text-white w-[250px] h-[40px] rounded-xl`}
          disabled={!isFilled}
          onClick={(e) => handleLogin(e)}
        >
          {isLoadingLogin ? <LoadingSpinner /> : 'Đăng nhập'}
        </button>
      </div>
      <ToastContainer />

      <div className="absolute bottom-2 text-white">Version: 1.0.1 {API_URL ?? ''}</div>
    </div>
  );
};

export default Login;
