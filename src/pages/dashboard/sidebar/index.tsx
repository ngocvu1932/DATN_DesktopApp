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

interface ISidebarProps {
  width: number;
}

const Sidebar: React.FC<ISidebarProps> = ({width}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const layout = useSelector((state: any) => state.layout.layout);

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(setIsLogin(false));
    navigate('/', {state: {message: 'Đăng xuất thành công!', autoClose: 3000}});
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
      <h2 className="text-2xl mb-4 text-center mt-3">Menu</h2>
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
            <p>Trang chủ</p>
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

              <p>Quản lý lịch hẹn</p>
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
                  <p>Lịch hẹn</p>
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
              <p>Quản lý liệu trình</p>
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
                  <p>Liệu trình</p>
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
              layout == ELayout.AddCustomer && openMenu != 'menu3' ? 'bg-gray-400 border border-white' : ''
            }`}
            onClick={() => {
              toggleMenu('menu3');
              dispatch(setLayout(ELayout.AddCustomer));
            }}
          >
            <div className="flex items-center">
              <div className="flex w-[30px]">
                <FontAwesomeIcon icon={faUsersGear} />
              </div>
              <p>Quản lý khách hàng</p>
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
                  layout == ELayout.AddCustomer ? 'bg-gray-400 border border-white' : ''
                }`}
                onClick={() => dispatch(setLayout(ELayout.AddCustomer))}
              >
                Thêm khách hàng
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
              <p>Quản lý dịch vụ</p>
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
                  <p>Tất cả dịch vụ</p>
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
            <p>Hóa đơn</p>
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
            <p>Báo cáo doanh thu</p>
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
              })
            );
          }}
        >
          <div className="flex items-center">
            <div className="flex w-[30px]">
              <FontAwesomeIcon icon={faLocationDot} />
            </div>
            <p>Chi nhánh</p>
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
            <FontAwesomeIcon icon={faArrowRightFromBracket} /> &nbsp; Đăng xuất
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
