import {faBell, faLanguage, faMessage, faSortUp} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import Avatar from '../../../components/avatar';
import avatarImg from '../../../assets/images/anh-avatar-cute-58.jpg';
import vi from '../../../assets/images/img_flag_viet_nam.png';
import eng from '../../../assets/images/img_flag_usa.png';
import {useDispatch, useSelector} from 'react-redux';
import {setLayout} from '../../../redux/slices/layoutSlice';
import {ELayout} from '../../../constants/layout';
import {useTranslation} from 'react-i18next';
import {setLoading} from '../../../redux/slices/loadingSlice';

interface HeaderProps {}

const Header: React.FC = () => {
  const {i18n} = useTranslation();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const [isShowChooseLanguage, setIsShowChooseLanguage] = React.useState<boolean>(false);

  const lang = JSON.parse(localStorage.getItem('appConfig') ?? '{}').defaultLanguage ?? 'vi';

  const changeLanguage = (lng: string) => {
    dispatch(setLoading(true));
    localStorage.setItem('appConfig', JSON.stringify({defaultLanguage: lng}));
    // setLanguage(lng);
    setIsShowChooseLanguage(false);
    setTimeout(() => {
      i18n.changeLanguage(lng);
      dispatch(setLoading(false));
    }, 500);
  };

  return (
    <div className="flex h-[10vh] bg-slate-500 justify-between items-center rounded-lg mt-1 mx-1 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center font-source-code mt-3 text-white">GLAMOUR BEAUTY SPA</h1>
      <div className="flex items-center">
        {/* <div className="px-3" onClick={() => alert('ATin nhắnT')}>
          <FontAwesomeIcon icon={faMessage} />
        </div>

        <div className="px-3" onClick={() => alert('Thong báo')}>
          <FontAwesomeIcon icon={faBell} />
        </div> */}

        <div className="relative">
          <div className="px-3 cursor-pointer" onClick={() => setIsShowChooseLanguage(!isShowChooseLanguage)}>
            {/* <FontAwesomeIcon icon={faLanguage} /> */}
            {lang == 'vi' ? (
              <img src={vi} alt="vi" className="w-7 h-5 flex-shrink-0" />
            ) : (
              <img src={eng} alt="eng" className="w-7 h-5 flex-shrink-0" />
            )}
          </div>
          {isShowChooseLanguage && (
            <div onClick={() => {}} className="absolute flex top-full min-w-[150px] mt-2 right-0 z-50">
              <div className="rounded-lg bg-white w-full p-2 relative flex items-center shadow-2xl ring-1 ring-black ring-opacity-5">
                <div className="absolute top-[-10px] right-3">
                  <FontAwesomeIcon icon={faSortUp} color="white" size="lg" />
                </div>
                <div className="flex flex-col w-full">
                  <div
                    className="flex w-full cursor-pointer items-center py-1 pl-3 rounded-md hover:bg-slate-200"
                    onClick={() => changeLanguage('vi')}
                  >
                    <img src={vi} alt="vi" className="w-7 h-5 flex-shrink-0" /> &nbsp;
                    <p className="text-black ">Tiếng Việt</p>
                  </div>

                  <div className="border-t border-slate-300 my-1"></div>

                  <div
                    className="flex w-full cursor-pointer py-1 pl-3 hover:bg-slate-200  rounded-md items-center"
                    onClick={() => changeLanguage('en')}
                  >
                    <img src={eng} alt="eng" className="w-7 h-5 flex-shrink-0" /> &nbsp;
                    <p className="text-black ">English</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          className="px-3 flex items-center"
          onClick={() => {
            dispatch(setLayout(ELayout.Account));
          }}
        >
          <Avatar src={avatarImg} height={45} width={45} />
          <div className="flex flex-col ml-2 text-left text-white">
            <p className="font-semibold text-lg">{userInfo?.name}</p>
            <p className="italic">{userInfo?.role == 1 ? 'Adminstrator' : 'Customer'}</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Header;
