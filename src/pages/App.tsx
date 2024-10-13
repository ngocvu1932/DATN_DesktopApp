import {useEffect, useState} from 'react';
import Dashboard from './dashboard';
import Login from './login';
import {HashRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import {getInfo} from '../api/auth';
import {setUserInfo} from '../redux/slices/userInfoSlice';
import {useDispatch} from 'react-redux';

const App = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const getInfoUser = async () => {
      const res = await getInfo();
      if (res?.statusCode === 200) {
        dispatch(setUserInfo(res.data));
        setIsAuthenticated(true);
        // vào dashboard
      } else {
        dispatch(setUserInfo(null));
        setIsAuthenticated(false);
        // vào login
      }
    };

    console.log('accessToken', accessToken);

    if (accessToken) {
      getInfoUser();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" state={{message: 'Chào mừng quay trở lại!', autoClose: 3000}} />
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
