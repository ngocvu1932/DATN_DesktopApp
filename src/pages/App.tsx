import { useEffect, useState } from 'react';
import Dashboard from './dashboard';
import Login from './login';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { getInfo } from '../api/auth';
import { setUserInfo } from '../redux/slices/userInfoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLogin } from '../redux/slices/authSlice';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { setIsReLogin } from '../redux/slices/reLoginSlice';
import ServiceRequestDetails from '../components/service-request-detail';
import MainLayout from '../layouts/mainLayout';

const App = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth.isLogin);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  const cancelTokenSource = axios.CancelToken.source();
  const reLogin = useSelector((state: any) => state.reLogin.reLogin);

  useEffect(() => {
    if (reLogin?.isCancel) {
      cancelTokenSource.cancel('Cancel request!!!');
      console.log('Cancel request!!!');
    }
  }, [reLogin?.isCancel]);

  // console.log('reLogin:', reLogin);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    // console.log('accessToken relogin:', accessToken);

    const getInfoUser = async () => {
      if (reLogin?.isCancel) return;

      dispatch(setIsReLogin({ isReLogin: true, isSuscess: true }));

      try {
        const res = await getInfo(cancelTokenSource.token);
        if (res?.statusCode === 200) {
          dispatch(setUserInfo(res.data));
          dispatch(setIsLogin(true));
          dispatch(setIsReLogin({ isReLogin: false, isSuscess: true }));
        } else {
          dispatch(setUserInfo(null));
          dispatch(setIsReLogin({ isReLogin: true, isSuscess: false }));
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          // console.log('Request canceled', error.message);
        } else {
          console.error('Error fetching user info:', error);
        }
      }
    };

    if (accessToken) {
      getInfoUser();
    }
  }, [auth, reLogin?.isCancel]); // Thêm `reLogin?.isCancel` vào dependency array

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            auth ? (
              <Navigate
                to="/dashboard"
                state={{
                  message: t('auth_reLogin_success'),
                  type: 'success',
                }}
              />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/service-request-detail" element={<MainLayout><ServiceRequestDetails /></MainLayout>} />
      </Routes>
    </Router>
  );
};

export default App;
