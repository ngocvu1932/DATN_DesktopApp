import React, {useRef, useEffect} from 'react';
import {faGripLinesVertical} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useTranslation} from 'react-i18next';
import Header from './header';
import './index.css';
import {useLocation} from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './sidebar';
import {useDispatch, useSelector} from 'react-redux';
import {ELayout} from '../../constants/layout';
import Account from '../account';
import Appointment from '../appointment';
import RevenueManagement from '../revenue-management';
import BranchManagement from '../branch-management';
import {setWidth} from '../../redux/slices/sideBarWidthSlice';
import Home from '../home';
import Bills from '../bills';
import AllServices from '../all-services';
import SessionsTracking from '../sessions-tracking';
import LoadingOverlay from '../../components/loading-overlay';
import Customer from '../customer';
import {getInfo} from '../../api/auth';

const Dashboard: React.FunctionComponent = () => {
  const loading = useSelector((state: any) => state.loading.loading);
  const {t} = useTranslation();
  const width = useSelector((state: any) => state.width.width);
  const dispatch = useDispatch();
  const resizerRef = useRef<HTMLDivElement>(null);
  const maxWidth = 300;
  const minWidth = 250;
  const location = useLocation();
  const layout = useSelector((state: any) => state.layout.layout);
  const {message, type} = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getInfo();
        // console.log('Dữ liệu API:', response.data);
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    // fetchData();
    const intervalId = setInterval(fetchData, 180000); // 300000 ms = 5 phút, 10000 ms = 10 giây, 180000 ms = 3 phút

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (message && type) {
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

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    const startX = e.clientX;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = width + e.clientX - startX;
      if (newWidth > maxWidth || newWidth < minWidth) {
        return;
      }
      dispatch(setWidth(newWidth));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const renderContent = () => {
    switch (layout) {
      case ELayout.Home:
        return <Home />;
      case ELayout.Account:
        return <Account />;
      case ELayout.ScheduleAppointment:
        return <Appointment />;
      case ELayout.RevenueManagement:
        return <RevenueManagement />;
      case ELayout.BranchManagement:
        return <BranchManagement />;
      case ELayout.Bills:
        return <Bills />;
      case ELayout.AllServices:
        return <AllServices />;
      case ELayout.SessionsTracking:
        return <SessionsTracking />;
      case ELayout.AllCustomer:
        return <Customer />;
      default:
        return <div>Chọn một trang để xem nội dung</div>;
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      <ToastContainer />
      <Header />

      <div className="flex w-full h-[90vh]">
        <Sidebar width={width} />

        {width != 0 ? (
          <div className="resizer" ref={resizerRef} onMouseDown={onMouseDown}>
            <FontAwesomeIcon icon={faGripLinesVertical} size={'sm'} opacity={0.5} />
          </div>
        ) : (
          <></>
        )}

        <div className="flex-1 bg-gray-50 w-full h-[89vh] border border-slate-400 p-2 m-1 rounded-lg overflow-hidden box-border">
          {renderContent()}
        </div>
      </div>
      <LoadingOverlay isLoading={loading} />
    </div>
  );
};

export default Dashboard;
