import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import SwitchSideBar from '../../components/switch-sidebar';
import avata from '../../assets/images/anh-avatar-cute-58.jpg';
import Avatar from '../../components/avatar';
import TextInput from '../../components/text-input';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import {setIsLogin} from '../../redux/slices/authSlice';
import {useTranslation} from 'react-i18next';

const Account: React.FC = () => {
  const {t} = useTranslation();
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState({isEditUserInfo: false, isEditPassword: false});
  const dispatch = useDispatch();

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

  const handleClickEdit = (type: string) => {
    if (type === 'userInfo') {
      setIsEdit({...isEdit, isEditUserInfo: !isEdit.isEditUserInfo});
    } else if (type === 'password') {
      setIsEdit({...isEdit, isEditPassword: !isEdit.isEditPassword});
    }
  };

  return (
    <div className="flex flex-col ">
      <SwitchSideBar title={t('account_title')} className="font-bold text-lg" />
      <div className="flex flex-col rounded-lg border border-black">
        <div className="flex ">
          <div className="w-[25%] flex py-2 px-4 mt-2 flex-col">
            <p className="font-semibold text-base">{t('account_info_title')}</p>{' '}
            <p className="text-sm italic">{t('account_info_edit')}</p>
          </div>

          <div className="flex flex-1 flex-col">
            <div className="flex pl-5 mt-2 items-center">
              <Avatar src={avata} height={100} width={100} />
              <div className="ml-8">
                <button className="hover:bg-slate-700 bg-slate-500 px-2 py-1 rounded-md text-white text-base flex">
                  {t('account_info_change_avt')}
                </button>
                <p className="text-xs mt-1 italic">*JPG, PNG</p>
              </div>
            </div>

            <div className="flex flex-1">
              <div className="flex flex-col w-[50%] p-1">
                <label className="font-semibold pl-1 text-base">{t('account_info_username')}</label>
                <TextInput
                  disabled
                  value={userInfo?.username ?? ''}
                  type="text"
                  placeholder={t('account_info_username')}
                  className="h-8"
                />
              </div>

              <div className="flex flex-col w-[50%] p-1">
                <label className="font-semibold text-base pl-1">{t('account_info_fullname')}</label>
                <TextInput
                  disabled={!isEdit.isEditUserInfo}
                  value={userInfo?.name ?? ''}
                  type="text"
                  placeholder={t('account_info_fullname')}
                  className="h-8"
                />
              </div>
            </div>

            <div className="flex  flex-col p-1">
              <label className="font-semibold text-base pl-1">{t('account_info_email')}</label>
              <TextInput
                disabled={!isEdit.isEditUserInfo}
                value={userInfo?.email ?? ''}
                type="text"
                placeholder={t('account_info_email')}
                className="h-8"
              />
            </div>

            <div className="flex flex-1 ">
              <div className="flex flex-col w-[50%] p-1">
                <label className="font-semibold pl-1 text-base">{t('account_info_phone_number')}</label>
                <TextInput
                  disabled={!isEdit.isEditUserInfo}
                  value={userInfo?.phone ?? ''}
                  type="text"
                  placeholder={t('account_info_phone_number')}
                  className="h-8"
                />
              </div>

              <div className="flex flex-col w-[50%] p-1">
                <label className="font-semibold text-base pl-1">{t('account_info_role')}</label>
                <TextInput
                  // disabled={!isEdit.isEditUserInfo}
                  disabled
                  value={userInfo?.role ?? ''}
                  type="text"
                  placeholder={t('account_info_role')}
                  className="h-8"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                className="hover:bg-slate-700 bg-slate-500 px-3 py-1 rounded-md text-white text-base flex mr-4"
                onClick={() => handleClickEdit('userInfo')}
              >
                {isEdit.isEditUserInfo ? t('account_info_button_cancel') : t('account_info_button_edit')}
              </button>
              <button className="hover:bg-slate-700 bg-slate-500 px-3 py-1 rounded-md text-white text-base flex">
                {t('account_info_button_save')}
              </button>
            </div>
          </div>
        </div>

        <div className="flex pb-2 mt-2">
          <div className="w-[25%] flex py-2 px-4 mt-2 flex-col">
            <p className="font-semibold text-base">{t('account_info_password_title')}</p>{' '}
            <p className="text-sm italic">{t('account_info_password_edit')}</p>
          </div>
          <div className="flex flex-1 flex-col mt-2">
            <div className="flex flex-col p-1 w-[50%]">
              <label className="font-semibold text-base pl-1">{t('account_info_password_current')}</label>
              <TextInput
                disabled={!isEdit.isEditPassword}
                type="text"
                placeholder={t('account_info_password_current')}
                className="h-8"
              />
            </div>
            <div className="flex flex-1">
              <div className="flex flex-col w-[50%] p-1">
                <label className="font-semibold pl-1 text-base">{t('account_info_password_new')}</label>
                <TextInput
                  disabled={!isEdit.isEditPassword}
                  type="text"
                  placeholder={t('account_info_password_new')}
                  className="h-8"
                />
              </div>

              <div className="flex flex-col w-[50%] p-1">
                <label className="font-semibold text-base pl-1">{t('account_info_password_renew')}</label>
                <TextInput
                  disabled={!isEdit.isEditPassword}
                  type="text"
                  placeholder={t('account_info_password_renew')}
                  className="h-8"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="hover:bg-slate-700 bg-slate-500 px-3 py-1 rounded-md text-white text-base flex mr-4"
                onClick={() => handleClickEdit('password')}
              >
                {isEdit.isEditPassword ? t('account_info_button_cancel') : t('account_info_button_edit')}
              </button>
              <button className="hover:bg-slate-700 bg-slate-500 px-3 py-1 rounded-md text-white text-base flex">
                {t('account_info_button_save')}
              </button>
            </div>
          </div>
        </div>

        <div className="flex pb-2 mt-4">
          <div className="flex justify-center w-full">
            <div
              className="flex hover:bg-red-600 bg-red-400 text-white rounded-xl cursor-pointer shadow-xl px-9 py-1.5 items-center"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} /> &nbsp; {t('account_info_button_logout')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
