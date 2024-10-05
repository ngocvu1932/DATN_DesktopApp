import React, {useEffect, useState} from 'react';
import TextInput from '../../components/text-input';
import BG from '../../assets/images/background.png';
import Divider from '../../components/divider';
import {getInfo, login} from '../../api/auth';
import LoadingSpinner from '../../components/loading-spinner';
import {useDispatch} from 'react-redux';
import {setUserInfo} from '../../redux/slices/userInfoSlice';
import {useLocation, useNavigate} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye, faEyeSlash, faUnlock, faUser} from '@fortawesome/free-solid-svg-icons';
const API_URL = import.meta.env.VITE_API_URL;
const VERSION = import.meta.env.VITE_VERSION;

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isFilled, setIsFilled] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isShowPassword, setIsShowPassword] = useState(false);

  useEffect(() => {
    if (phone && password) {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, [phone, password]);

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message, {autoClose: location.state.autoClose});
    }
  }, [location.state]);

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsLoadingLogin(true);
    const res = await login({username: phone, password: password});
    if (res?.statusCode === 200) {
      dispatch(setUserInfo(res.data.user));
      // Cookies.set('accessToken', res.data.accessToken, {expires: 1 / 24, secure: true});
      localStorage.setItem('accessToken', res.data.accessToken);
      // Cookies.set('refreshToken', res.data.refreshToken, {expires: 7, secure: true});
      setIsLoadingLogin(false);
      navigate('/dashboard', {state: {message: 'Đăng nhập thành công!', autoClose: 3000}});
    } else {
      setIsLoadingLogin(false);
      toast.error('Đăng nhập thất bại!', {autoClose: 3000});
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
        <p className="text-black font-bold text-2xl">Đăng nhập</p>
        <Divider size={20} />
        <TextInput
          disabled={isLoadingLogin}
          prefix={
            <>
              <FontAwesomeIcon icon={faUser} />
            </>
          }
          value={phone}
          className="w-[250px]"
          changeText={setPhone}
          placeholder="Tên đăng nhập"
          type="text"
        />
        <Divider size={20} />
        <TextInput
          disabled={isLoadingLogin}
          prefix={
            <>
              <FontAwesomeIcon icon={faUnlock} />
            </>
          }
          suffix={
            <span onClick={() => setIsShowPassword(!isShowPassword)}>
              {isShowPassword ? (
                <FontAwesomeIcon className="cursor-pointer" icon={faEye} />
              ) : (
                <FontAwesomeIcon className="cursor-pointer" icon={faEyeSlash} />
              )}
            </span>
          }
          value={password}
          className="w-[250px]"
          changeText={setPassword}
          placeholder="Mật khẩu"
          type={isShowPassword ? 'text' : 'password'}
        />

        <Divider size={20} />
        <button
          className={` ${
            isFilled ? 'bg-blue-500' : 'bg-blue-200'
          } text-white w-[250px] cursor-pointer h-[40px] rounded-xl`}
          disabled={!isFilled}
          onClick={(e) => handleLogin(e)}
        >
          {isLoadingLogin ? <LoadingSpinner /> : 'Đăng nhập'}
        </button>

        <p className="text-right cursor-pointer mt-2">Bạn quên mật khẩu?</p>
      </div>
      <ToastContainer />

      <div className="absolute bottom-2 text-white">Version: {VERSION ?? ''}</div>
    </div>
  );
};

export default Login;
