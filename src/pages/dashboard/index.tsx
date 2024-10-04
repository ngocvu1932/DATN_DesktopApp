import React, {useState, useRef, useEffect} from 'react';
import {faGripLinesVertical} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useTranslation} from 'react-i18next';
import Header from './header';
import './index.css';
import {useLocation} from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
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

const Dashboard: React.FunctionComponent = () => {
  const {t} = useTranslation();
  const width = useSelector((state: any) => state.width.width);
  const dispatch = useDispatch();
  const resizerRef = useRef<HTMLDivElement>(null);
  const maxWidth = 300;
  const minWidth = 250;
  const location = useLocation();
  const layout = useSelector((state: any) => state.layout.layout);

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message, {autoClose: location.state.autoClose});
    }
  }, [location.state]);

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
      default:
        return <div>Chọn một trang để xem nội dung</div>;
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      <Header />

      <div className="flex w-full h-[90%]">
        <Sidebar width={width} />

        {width != 0 ? (
          <div className="resizer" ref={resizerRef} onMouseDown={onMouseDown}>
            <FontAwesomeIcon icon={faGripLinesVertical} size={'sm'} opacity={0.5} />
          </div>
        ) : (
          <></>
        )}

        <div className="flex-1 bg-gray-100 w-full p-6 m-1 rounded-lg overflow-y-auto">{renderContent()}</div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
