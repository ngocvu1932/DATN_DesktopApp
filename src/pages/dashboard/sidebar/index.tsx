import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setLayout} from '../../../redux/slices/layoutSlice';
import {ELayout, ELayoutInfo} from '../../../constants/layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faAddressBook,
  faAngleDown,
  faArrowRightFromBracket,
  faCalendar,
  faCalendarDays,
  faChartSimple,
  faHouse,
  faLocationDot,
  faReceipt,
  faUsersGear,
} from '@fortawesome/free-solid-svg-icons';
import {setIsLogin} from '../../../redux/slices/authSlice';
import {setInfoLayout} from '../../../redux/slices/layoutInfoSlice';
import {useTranslation} from 'react-i18next';

interface ISidebarProps {
  width: number;
}

const Sidebar: React.FC<ISidebarProps> = ({width}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const layout = useSelector((state: any) => state.layout.layout);

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(setIsLogin(false));
    navigate('/', {
      state: {
        message: t('auth_logout_success'),
        type: 'success',
      },
    });
  };

  const toggleMenu = (menuName: string) => {
    // Nếu menu đã mở thì đóng nó, nếu chưa mở thì mở menu mới và đóng tất cả các menu khác
    setOpenMenu((prevMenu) => (prevMenu === menuName ? null : menuName));
  };

  if (width == 0) {
    return <></>;
  }

  return (
    <div
      className="text-white m-1 rounded-lg relative h-[89vh] flex flex-col box-border"
      style={{width, background: 'linear-gradient(to bottom, #374151, #4b5563)'}}
    >
      <h2 className="text-2xl mb-4 text-center mt-3">{t('sidebar_title')}</h2>
      <ul className="p-4 overflow-y-auto overflow-x-hidden">
        <button
          className={`w-full text-left flex items-center px-2 py-2 rounded-xl mb-2  ${
            layout == ELayout.Home ? 'bg-gray-400 border border-white' : ''
          }`}
          onClick={() => {
            toggleMenu('');
            dispatch(setLayout(ELayout.Home));
          }}
        >
          <div className="flex items-center">
            <div className="flex w-[30px]">
              <FontAwesomeIcon icon={faHouse} />
            </div>
            <p>{t('sidebar_home')}</p>
          </div>
        </button>

        {/*Quản lý lịch hẹn */}
        <li className="mb-2">
          <button
            className={`w-full text-left flex items-center  px-2 py-2 rounded-xl justify-between ${
              layout == ELayout.ScheduleAppointment && openMenu != 'menu1' ? 'bg-gray-400 border border-white' : ''
            }`}
            onClick={() => {
              toggleMenu('menu1');
              dispatch(setLayout(ELayout.ScheduleAppointment));
            }}
          >
            <div className="flex items-center">
              <div className="flex w-[30px]">
                <FontAwesomeIcon icon={faCalendarDays} />
              </div>

              <p>{t('sidebar_appointment_management')}</p>
            </div>
            <FontAwesomeIcon
              className="ml-2"
              flip={openMenu === 'menu1' ? 'vertical' : 'horizontal'}
              icon={faAngleDown}
            />
          </button>
          {/* Mục con cho Quản lý lịch hẹn */}
          {openMenu === 'menu1' && (
            <ul className="mt-1 ml-3">
              <li
                className={`py-1.5 pl-2 cursor-pointer rounded-lg ${
                  layout == ELayout.ScheduleAppointment ? 'bg-gray-400 border border-white' : ''
                }`}
                onClick={() => dispatch(setLayout(ELayout.ScheduleAppointment))}
              >
                <div className="flex items-center">
                  <div className="flex w-[30px]">
                    <FontAwesomeIcon icon={faCalendar} />
                  </div>
                  <p>{t('sidebar_appointment')}</p>
                </div>
              </li>
              <li className={`py-1.5 pl-2 cursor-pointer rounded-lg ${''}`} onClick={() => {}}>
                Mục con 2.2
              </li>
              <li className={`py-1.5 pl-2 cursor-pointer rounded-lg ${''}`} onClick={() => {}}>
                Mục con 2.3
              </li>
            </ul>
          )}
        </li>

        {/*Quản lý liệu trình */}
        <li className="mb-2">
          <button
            className={`w-full text-left flex items-center  px-2 py-2 rounded-xl justify-between ${
              layout == ELayout.SessionsTracking && openMenu != 'menu2' ? 'bg-gray-400 border border-white' : ''
            }`}
            onClick={() => {
              toggleMenu('menu2');
              dispatch(setLayout(ELayout.SessionsTracking));
            }}
          >
            <div className="flex items-center">
              <div className="flex w-[30px]">
                <FontAwesomeIcon icon={faCalendarDays} />
              </div>
              <p>{t('sidebar_treatment_management')}</p>
            </div>
            <FontAwesomeIcon
              className="ml-2"
              flip={openMenu === 'menu2' ? 'vertical' : 'horizontal'}
              icon={faAngleDown}
            />
          </button>
          {/* Mục con cho Quản lý liệu trình */}
          {openMenu === 'menu2' && (
            <ul className="mt-1 ml-3">
              <li
                className={`py-1.5 pl-2 cursor-pointer rounded-lg ${
                  layout == ELayout.SessionsTracking ? 'bg-gray-400 border border-white' : ''
                }`}
                onClick={() => dispatch(setLayout(ELayout.SessionsTracking))}
              >
                <div className="flex items-center">
                  <div className="flex w-[30px]">
                    <FontAwesomeIcon icon={faCalendar} />
                  </div>
                  <p>{t('sidebar_treatment_management')}</p>
                </div>
              </li>
              <li className={`py-1.5 pl-2 cursor-pointer rounded-lg ${''}`} onClick={() => {}}>
                Mục con 2.2
              </li>
              <li className={`py-1.5 pl-2 cursor-pointer rounded-lg ${''}`} onClick={() => {}}>
                Mục con 2.3
              </li>
            </ul>
          )}
        </li>

        {/* Quản lý khách hàng */}
        <li className="mb-2">
          <button
            className={`w-full text-left flex items-center px-2 py-2 rounded-xl justify-between ${
              layout == ELayout.AllCustomer && openMenu != 'menu3' ? 'bg-gray-400 border border-white' : ''
            }`}
            onClick={() => {
              toggleMenu('menu3');
              dispatch(setLayout(ELayout.AllCustomer));
            }}
          >
            <div className="flex items-center">
              <div className="flex w-[30px]">
                <FontAwesomeIcon icon={faUsersGear} />
              </div>
              <p>{t('sidebar_customer_management')}</p>
            </div>
            <FontAwesomeIcon
              className="ml-2"
              flip={openMenu === 'menu3' ? 'vertical' : 'horizontal'}
              icon={faAngleDown}
            />
          </button>
          {/* Mục con cho Quản lý khách hàng */}
          {openMenu === 'menu3' && (
            <ul className="mt-1 ml-3">
              <li
                className={`py-1.5 pl-2 cursor-pointer rounded-lg ${
                  layout == ELayout.AllCustomer ? 'bg-gray-400 border border-white' : ''
                }`}
                onClick={() => dispatch(setLayout(ELayout.AllCustomer))}
              >
                {t('sidebar_customer_management_all')}
              </li>
              <li className={`py-1.5 pl-2 cursor-pointer rounded-lg ${''}`} onClick={() => {}}>
                Mục con 1.2
              </li>
              <li className={`py-1.5 pl-2 cursor-pointer rounded-lg ${''}`} onClick={() => {}}>
                Mục con 1.3
              </li>
            </ul>
          )}
        </li>

        {/* Mục chính 3 */}
        <li className="mb-2">
          <button
            className={`w-full text-left flex items-center px-2 py-2 rounded-xl justify-between ${
              layout == ELayout.AllServices && openMenu != 'menu4' ? 'bg-gray-400 border border-white' : ''
            }`}
            onClick={() => {
              toggleMenu('menu4');
              dispatch(setLayout(ELayout.AllServices));
            }}
          >
            <div className="flex items-center">
              <div className="flex w-[30px]">
                <FontAwesomeIcon icon={faAddressBook} />
              </div>
              <p>{t('sidebar_service_management')}</p>
            </div>
            <FontAwesomeIcon
              className="ml-2"
              flip={openMenu === 'menu4' ? 'vertical' : 'horizontal'}
              icon={faAngleDown}
            />
          </button>
          {/* Mục con cho Quản lý dịch vụ */}
          {openMenu === 'menu4' && (
            <ul className="ml-3 mt-1">
              <li
                className={`py-1.5 pl-2 cursor-pointer rounded-lg ${
                  layout == ELayout.AllServices ? 'bg-gray-400 border border-white' : ''
                }`}
                onClick={() => dispatch(setLayout(ELayout.AllServices))}
              >
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faAddressBook} /> &nbsp;&nbsp;
                  <p>{t('sidebar_service_management_all')}</p>
                </div>
              </li>
              <li className={`py-1.5 pl-2 cursor-pointer rounded-lg ${''}`} onClick={() => {}}>
                Mục con 3.2
              </li>
              <li className={`py-1.5 pl-2 cursor-pointer rounded-lg ${''}`} onClick={() => {}}>
                Mục con 3.3
              </li>
            </ul>
          )}
        </li>

        <button
          className={`w-full text-left flex items-center px-2 py-2 rounded-xl mb-2  ${
            layout == ELayout.Bills ? 'bg-gray-400 border border-white' : ''
          }`}
          onClick={() => {
            toggleMenu('');
            dispatch(setLayout(ELayout.Bills));
          }}
        >
          <div className="flex items-center">
            <div className="flex w-[30px]">
              <FontAwesomeIcon icon={faReceipt} />
            </div>
            <p>{t('sidebar_bills')}</p>
          </div>
        </button>

        {/*Báo cáo doanh thu */}
        <button
          className={`w-full text-left flex items-center  px-2 py-2 rounded-xl mb-2 ${
            layout == ELayout.RevenueManagement ? 'bg-gray-400 border border-white' : ''
          }`}
          onClick={() => {
            toggleMenu('');
            dispatch(setLayout(ELayout.RevenueManagement));
          }}
        >
          <div className="flex items-center">
            <div className="flex w-[30px]">
              <FontAwesomeIcon icon={faChartSimple} />
            </div>
            <p>{t('sidebar_revenue_report')}</p>
          </div>
        </button>

        {/*Chi nhánh */}
        <button
          className={`w-full text-left flex items-center  px-2 py-2 rounded-xl mb-2 ${
            layout == ELayout.BranchManagement ? 'bg-gray-400 border border-white' : ''
          }`}
          onClick={() => {
            toggleMenu('');
            dispatch(setLayout(ELayout.BranchManagement));
            dispatch(
              setInfoLayout({
                layoutBranch: {layout: ELayoutInfo.Home, data: null},
                layoutAppointment: {layout: ELayoutInfo.Home, data: null},
                layoutService: {layout: ELayoutInfo.Home, data: null},
                layoutCustomer: {layout: ELayoutInfo.Home, data: null},
              })
            );
          }}
        >
          <div className="flex items-center">
            <div className="flex w-[30px]">
              <FontAwesomeIcon icon={faLocationDot} />
            </div>
            <p>{t('sidebar_branchs')}</p>
          </div>
        </button>
      </ul>

      {/* Đăng xuất */}
      {layout != ELayout.Account && (
        <div className="flex absolute bottom-4 justify-center w-full">
          <div
            className="flex hover:bg-red-600 bg-red-400 text-white rounded-xl cursor-pointer shadow-xl px-9 py-1.5 items-center"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} /> &nbsp; {t('sidebar_logout')}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
