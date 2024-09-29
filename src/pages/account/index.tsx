import React from 'react';
import {useSelector} from 'react-redux';
import Cookies from 'js-cookie';
import {useNavigate} from 'react-router-dom';

const Account: React.FC = () => {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const navigate = useNavigate();
  const accessToken = Cookies.get('accessToken');
  const accessTokenLocalStorage = localStorage.getItem('accessToken');

  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    navigate('/', {state: {message: 'Đăng xuất thành công!', autoClose: 3000}});
  };

  return (
    <div className="flex bg-blue-300 flex-col">
      <p className="font-bold text-2xl">Tài khoản</p>
      <div>name: {userInfo?.name}</div>
      <div>userName: {userInfo?.username}</div>
      <div>accessToken: {accessToken}</div>
      <div>accessTokenLocalStorage: {accessTokenLocalStorage}</div>
      <button className="flex px-3 py-4 bg-red-600" onClick={() => handleLogout()}>
        Đăng xuất
      </button>
    </div>
  );
};

export default Account;
