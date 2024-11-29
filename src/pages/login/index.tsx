import React, {useEffect, useState} from 'react';
import TextInput from '../../components/text-input';
import BG from '../../assets/images/background.png';
import Divider from '../../components/divider';
import {getInfo, login} from '../../api/auth';
import LoadingSpinner from '../../components/loading-spinner';
import {useDispatch, useSelector} from 'react-redux';
import {setUserInfo} from '../../redux/slices/userInfoSlice';
import {useLocation, useNavigate} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye, faEyeSlash, faUnlock, faUser, faXmark} from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from 'react-i18next';
import {setIsReLogin} from '../../redux/slices/reLoginSlice';
const VERSION = import.meta.env.VITE_VERSION;

const Login: React.FC = () => {
  const {t} = useTranslation();
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isFilled, setIsFilled] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const reLogin = useSelector((state: any) => state.reLogin.reLogin);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const location = useLocation();

  const {message, type} = location.state || {};

  useEffect(() => {
    if (message && type) {
      // Gọi showToast dựa vào message và type từ state
      switch (type) {
        case 'error':
          toast.error(message, {autoClose: 2000});
          break;
        case 'success':
          toast.success(message, {autoClose: 2000});
          break;
        case 'warning':
          toast.warning(message, {autoClose: 2000});
          break;
        default:
          break;
      }
    }
  }, [message, type]);

  useEffect(() => {
    if (phone && password) {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, [phone, password]);

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && isFilled && !isLoadingLogin) {
      handleLogin(e);
    }
  };

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsLoadingLogin(true);
    const res = await login({username: phone, password: password});
    // console.log('res:', res);

    if (res?.statusCode === 200) {
      dispatch(setUserInfo(res?.data?.user));
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      setIsLoadingLogin(false);
      navigate('/dashboard', {
        state: {
          message: t('auth_login_success'),
          type: 'success',
        },
      });
    } else {
      setIsLoadingLogin(false);
      toast.error(t('auth_login_fail'), {autoClose: 3000});
    }
  };

  return (
    <div
      className="relative w-full h-screen flex justify-center items-center bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: `url(${BG})`,
      }}
    >
      <ToastContainer />

      {reLogin?.isReLogin && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-30">
          {/* Nội dung overlay */}
          <div className="flex justify-center items-center h-full">
            <div className=" flex bg-white px-3 py-1.5 rounded-md flex-col">
              <div className="relative flex">
                <p className="text-black text-base whitespace-nowrap">Lấy thông tin tài khoản</p>
              </div>

              <div className="flex py-4">
                {reLogin?.isSuscess ? <LoadingSpinner /> : 'Hết phiên đăng nhập, vui lòng đăng nhập lại!'}
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  className="py-0.5 px-2 rounded-md border border-slate-400"
                  onClick={() => {
                    dispatch(setIsReLogin({isReLogin: false, isSuscess: true, isCancel: true}));
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center bg-white flex-col px-6 py-8 rounded-xl shadow-xl">
        <p className="text-black font-bold text-2xl">{t('auth_login_title')}</p>
        <Divider size={20} dashColor="white" />
        <div onKeyDown={handleKeyDown} className="bg-white">
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
            placeholder={t('auth_login_placeholder_user')}
            type="text"
          />

          <div className="mt-5" />

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
            placeholder={t('auth_login_placeholder_password')}
            type={isShowPassword ? 'text' : 'password'}
          />

          <div className="mt-5" />

          <button
            className={` ${
              isFilled ? (!isLoadingLogin ? 'bg-blue-500' : 'bg-blue-200') : 'bg-blue-200'
            } text-white w-[250px] cursor-pointer h-[40px] rounded-xl`}
            disabled={!isFilled || isLoadingLogin}
            onClick={(e) => handleLogin(e)}
          >
            {isLoadingLogin ? <LoadingSpinner /> : t('auth_login_title')}
          </button>
        </div>

        <p className="text-right cursor-pointer mt-2">{t('auth_login_forget_password')}</p>
      </div>

      <div className="absolute bottom-2 text-white">
        {t('auth_login_version')}: {VERSION ?? ''}
      </div>
    </div>
  );
};

export default Login;
