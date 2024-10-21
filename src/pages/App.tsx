import {useEffect, useState} from 'react';
import Dashboard from './dashboard';
import Login from './login';
import {HashRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import {getInfo} from '../api/auth';
import {setUserInfo} from '../redux/slices/userInfoSlice';
import {useDispatch, useSelector} from 'react-redux';
import {setIsLogin} from '../redux/slices/authSlice';
import {useTranslation} from 'react-i18next';

const App = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth.isLogin);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {t} = useTranslation();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('accessToken relogin:', accessToken);
    const getInfoUser = async () => {
      const res = await getInfo();
      if (res?.statusCode === 200) {
        dispatch(setUserInfo(res.data));
        dispatch(setIsLogin(true));
        // vào dashboard
      } else {
        dispatch(setUserInfo(null));
        // vào login
      }
    };

    if (accessToken) {
      getInfoUser();
    }
  }, [auth]);

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
                  message: t('auth_login_successx'),
                  type: 'success',
                }}
              />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
