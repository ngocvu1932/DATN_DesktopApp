import {faBell, faLanguage, faMessage} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import Avatar from '../../../components/avatar';
import avatarImg from '../../../assets/images/anh-avatar-cute-58.jpg';
import {useDispatch, useSelector} from 'react-redux';
import {setLayout} from '../../../redux/slices/layoutSlice';
import {ELayout} from '../../../constants/layout';

interface HeaderProps {}

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.user.userInfo);

  return (
    <div className="flex h-[10%] bg-slate-500 justify-between items-center rounded-lg mt-1 mx-1 px-4">
      <div className="font-bold text-2xl">LOGO</div>
      <div className="flex items-center">
        <div className="px-3" onClick={() => alert('ATin nhắnT')}>
          <FontAwesomeIcon icon={faMessage} />
        </div>
        <div className="px-3" onClick={() => alert('Thong báo')}>
          <FontAwesomeIcon icon={faBell} />
        </div>
        <div className="px-3" onClick={() => alert('AVT')}>
          <FontAwesomeIcon icon={faLanguage} />
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
