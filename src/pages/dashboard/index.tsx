import React, {useState, useRef, useEffect} from 'react';
import {faGripLinesVertical} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import Header from './header';
import './index.css';
import {useLocation} from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import Sidebar from './sidebar';
import {useSelector} from 'react-redux';
import {ELayout} from '../../constants/layout';
import Account from '../account';
import Appointment from '../appointment';

const Dashboard: React.FunctionComponent = () => {
  const {t} = useTranslation();
  const [width, setWidth] = useState(240);
  const resizerRef = useRef<HTMLDivElement>(null);
  const maxWidth = 300;
  const minWidth = 220;
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
      setWidth(newWidth);
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
        return <div>Nội dung của Trang Home</div>;
      case ELayout.Account:
        return <Account />;
      case ELayout.Appointment:
        return <Appointment />;
      default:
        return <div>Chọn một trang để xem nội dung</div>;
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      <Header />

      <div className="flex w-full h-[90%]">
        <Sidebar width={width} />

        <div className="resizer" ref={resizerRef} onMouseDown={onMouseDown}>
          <FontAwesomeIcon icon={faGripLinesVertical} size={'sm'} opacity={0.5} />
        </div>

        <div className="flex-1 bg-gray-100 p-6 m-1 rounded-lg overflow-y-auto">{renderContent()}</div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
