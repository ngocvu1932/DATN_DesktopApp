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

const Account: React.FC = () => {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState({isEditUserInfo: false, isEditPassword: false});
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(setIsLogin(false));
    navigate('/', {state: {message: 'Đăng xuất thành công!', autoClose: 3000}});
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
      <SwitchSideBar title="Tài khoản" className="font-bold text-lg" />
      <div className="flex flex-col rounded-lg border border-black">
        <div className="flex ">
          <div className="w-[25%] flex py-2 px-4 mt-2 flex-col">
            <p className="font-semibold text-base">Thông tin cá nhân</p>{' '}
            <p className="text-sm italic">Chỉnh sửa thông tin cá nhân</p>
          </div>

          <div className="flex flex-1 flex-col">
            <div className="flex pl-5 mt-2 items-center">
              <Avatar src={avata} height={100} width={100} />
              <div className="ml-8">
                <button className="hover:bg-slate-700 bg-slate-500 px-2 py-1 rounded-md text-white text-base flex">
                  Đổi ảnh đại điện
                </button>
                <p className="text-xs mt-1 italic">*JPG, PNG</p>
              </div>
            </div>

            <div className="flex flex-1">
              <div className="flex flex-col w-[50%] p-1">
                <label className="font-semibold pl-1 text-base">Tên đăng nhập</label>
                <TextInput
                  disabled
                  value={userInfo?.username ?? ''}
                  type="text"
                  placeholder="Tên đăng nhập"
                  className="h-8"
                />
              </div>

              <div className="flex flex-col w-[50%] p-1">
                <label className="font-semibold text-base pl-1">Họ và tên</label>
                <TextInput
                  disabled={!isEdit.isEditUserInfo}
                  value={userInfo?.name ?? ''}
                  type="text"
                  placeholder="Họ và tên"
                  className="h-8"
                />
              </div>
            </div>

            <div className="flex  flex-col p-1">
              <label className="font-semibold text-base pl-1">Email</label>
              <TextInput
                disabled={!isEdit.isEditUserInfo}
                value={userInfo?.email ?? ''}
                type="text"
                placeholder="Email"
                className="h-8"
              />
            </div>

            <div className="flex flex-1 ">
              <div className="flex flex-col w-[50%] p-1">
                <label className="font-semibold pl-1 text-base">Số điện thoại</label>
                <TextInput
                  disabled={!isEdit.isEditUserInfo}
                  value={userInfo?.phone ?? ''}
                  type="text"
                  placeholder="Số điện thoại"
                  className="h-8"
                />
              </div>

              <div className="flex flex-col w-[50%] p-1">
                <label className="font-semibold text-base pl-1">Chức vụ</label>
                <TextInput
                  // disabled={!isEdit.isEditUserInfo}
                  disabled
                  value={userInfo?.role ?? ''}
                  type="text"
                  placeholder="chức vụ"
                  className="h-8"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                className="hover:bg-slate-700 bg-slate-500 px-3 py-1 rounded-md text-white text-base flex mr-4"
                onClick={() => handleClickEdit('userInfo')}
              >
                {isEdit.isEditUserInfo ? 'Hủy' : 'Sửa'}
              </button>
              <button className="hover:bg-slate-700 bg-slate-500 px-3 py-1 rounded-md text-white text-base flex">
                Lưu
              </button>
            </div>
          </div>
        </div>

        <div className="flex pb-2 mt-2">
          <div className="w-[25%] flex py-2 px-4 mt-2 flex-col">
            <p className="font-semibold text-base">Mật khẩu</p> <p className="text-sm italic">Chỉnh sửa mật khẩu</p>
          </div>
          <div className="flex flex-1 flex-col mt-2">
            <div className="flex flex-col p-1 w-[50%]">
              <label className="font-semibold text-base pl-1">Mật khẩu hiện tại</label>
              <TextInput
                disabled={!isEdit.isEditPassword}
                type="text"
                placeholder="Mật khẩu hiện tại"
                className="h-8"
              />
            </div>
            <div className="flex flex-1">
              <div className="flex flex-col w-[50%] p-1">
                <label className="font-semibold pl-1 text-base">Mật khẩu mới</label>
                <TextInput
                  disabled={!isEdit.isEditPassword}
                  type="text"
                  placeholder="Nhập mật khẩu mới"
                  className="h-8"
                />
              </div>

              <div className="flex flex-col w-[50%] p-1">
                <label className="font-semibold text-base pl-1">Nhập lại mật khẩu mới</label>
                <TextInput
                  disabled={!isEdit.isEditPassword}
                  type="text"
                  placeholder="Nhập lại mật khẩu mới"
                  className="h-8"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="hover:bg-slate-700 bg-slate-500 px-3 py-1 rounded-md text-white text-base flex mr-4"
                onClick={() => handleClickEdit('password')}
              >
                {isEdit.isEditPassword ? 'Hủy' : 'Sửa'}
              </button>
              <button className="hover:bg-slate-700 bg-slate-500 px-3 py-1 rounded-md text-white text-base flex">
                Lưu
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
              <FontAwesomeIcon icon={faArrowRightFromBracket} /> &nbsp; Đăng xuất
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
