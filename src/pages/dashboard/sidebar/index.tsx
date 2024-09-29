import React, {useState} from 'react';
import Cookies from 'js-cookie';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setLayout} from '../../../redux/slices/layoutSlice';
import {ELayout} from '../../../constants/layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleDown, faSortDown} from '@fortawesome/free-solid-svg-icons';

interface ISidebarProps {
  width: number;
}

interface IOpenMenus {
  menu1: boolean;
  menu2: boolean;
  menu3: boolean;
}

const Sidebar: React.FC<ISidebarProps> = ({width}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const layout = useSelector((state: any) => state.layout.layout);

  const [openMenus, setOpenMenus] = useState<IOpenMenus>({
    menu1: false,
    menu2: false,
    menu3: false,
  });

  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    navigate('/', {state: {message: 'Đăng xuất thành công!', autoClose: 3000}});
  };

  const toggleMenu = (menuName: keyof IOpenMenus) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [menuName]: !prevState[menuName],
    }));
  };
  return (
    <div className="bg-gray-700 m-1 text-white rounded-lg relative flex flex-col" style={{width}}>
      <h2 className="text-2xl mb-4 text-center mt-3">Menu</h2>
      <ul className="p-4 overflow-y-auto overflow-x-hidden">
        <button
          className="w-full text-left flex items-center focus:outline-none px-2 py-1 rounded-xl mb-2"
          onClick={() => {
            dispatch(setLayout(ELayout.Home));
          }}
        >
          <p>Trang chủ</p>
        </button>

        <li className="mb-2">
          <button
            className="w-full text-left flex items-center focus:outline-none px-2 py-1 rounded-xl"
            onClick={() => toggleMenu('menu1')}
          >
            <p>Quản lý khách hàng</p>
            <FontAwesomeIcon className="ml-2" flip={openMenus.menu1 ? 'vertical' : 'horizontal'} icon={faAngleDown} />
          </button>
          {/* Mục con cho Trang 1 */}
          {openMenus.menu1 && (
            <ul className="ml-4 mt-2">
              <li className="mb-1">Mục con 1.1</li>
              <li className="mb-1">Mục con 1.2</li>
              <li className="mb-1">Mục con 1.3</li>
            </ul>
          )}
        </li>

        {/* Mục chính 2 */}
        <li className="mb-2">
          <button
            className="w-full text-left flex items-center focus:outline-none px-2 py-1 rounded-xl"
            onClick={() => toggleMenu('menu2')}
          >
            <p>Quản lý lịch hẹn</p>
            <FontAwesomeIcon className="ml-2" flip={openMenus.menu2 ? 'vertical' : 'horizontal'} icon={faAngleDown} />
          </button>
          {openMenus.menu2 && (
            <ul className="ml-4">
              <li
                className={`py-1.5 pl-2 cursor-pointer rounded-lg ${
                  layout == ELayout.Appointment ? 'bg-blue-300' : ''
                }`}
                onClick={() => dispatch(setLayout(ELayout.Appointment))}
              >
                Lịch hẹn
              </li>
              <li className="mb-1">Mục con 2.2</li>
              <li className="mb-1">Mục con 2.3</li>
            </ul>
          )}
        </li>

        <li className="mb-2">
          <button
            className="w-full text-left flex items-center focus:outline-none px-2 py-1 rounded-xl"
            onClick={() => toggleMenu('menu3')}
          >
            <p>Quản lý dịch vụ</p>
            <FontAwesomeIcon className="ml-2" flip={openMenus.menu1 ? 'vertical' : 'horizontal'} icon={faAngleDown} />
          </button>
          {openMenus.menu3 && (
            <ul className="ml-4 mt-2">
              <li className="mb-1">Mục con 3.1</li>
              <li className="mb-1">Mục con 3.2</li>
              <li className="mb-1">Mục con 3.3</li>
            </ul>
          )}
        </li>
      </ul>

      <div className="flex absolute bottom-4 justify-center w-full">
        <div
          className="flex bg-red-500 text-white rounded-xl cursor-pointer shadow-xl px-10 py-2"
          onClick={() => handleLogout()}
        >
          Đăng xuất
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
