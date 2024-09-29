import {faBell, faLanguage, faMessage} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import Avatar from '../../../components/avatar';
import avatarImg from '../../../assets/images/anh-avatar-cute-58.jpg';
import Cookies from 'js-cookie';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {setLayout} from '../../../redux/slices/layoutSlice';
import {ELayout} from '../../../constants/layout';

interface HeaderProps {}

const Header: React.FC = () => {
  const dispatch = useDispatch();
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
          className="px-3"
          onClick={() => {
            dispatch(setLayout(ELayout.Account));
          }}
        >
          <Avatar src={avatarImg} height={40} width={40} />
        </button>
      </div>
    </div>
  );
};

export default Header;
