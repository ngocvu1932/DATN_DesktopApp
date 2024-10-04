import React from 'react';
import {useSelector} from 'react-redux';
import Cookies from 'js-cookie';
import {useNavigate} from 'react-router-dom';
import SwitchSideBar from '../../components/switch-sidebar';
import avata from '../../assets/images/anh-avatar-cute-58.jpg';
import Avatar from '../../components/avatar';
import TextInput from '../../components/text-input';

const Account: React.FC = () => {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const navigate = useNavigate();
  const accessToken = Cookies.get('accessToken');
  const accessTokenLocalStorage = localStorage.getItem('accessToken');

  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/', {state: {message: 'Đăng xuất thành công!', autoClose: 3000}});
  };

  console.log('userInfo', userInfo);

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
                <button className="bg-slate-700 px-2 py-1 rounded-md text-white text-base flex">
                  Đổi ảnh đại điện
                </button>
                <p className="text-xs mt-1 italic">*JPG, PNG</p>
              </div>
            </div>

            <div className="flex flex-1">
              <div className="flex flex-col w-[50%] p-1">
                <label className="font-semibold pl-1 text-base">Tên đăng nhập</label>
                <TextInput value={userInfo?.username ?? ''} type="text" placeholder="Tên đăng nhập" className="h-8" />
              </div>

              <div className="flex flex-col w-[50%] p-1">
                <label className="font-semibold text-base pl-1">Họ và tên</label>
                <TextInput value={userInfo?.name ?? ''} type="text" placeholder="Họ và tên" className="h-8" />
              </div>
            </div>

            <div className="flex  flex-col p-1">
              <label className="font-semibold text-base pl-1">Email</label>
              <TextInput value={userInfo?.email ?? ''} type="text" placeholder="Email" className="h-8" />
            </div>

            <div className="flex flex-1 ">
              <div className="flex flex-col w-[50%] p-1">
                <label className="font-semibold pl-1 text-base">Số điện thoại</label>
                <TextInput value={userInfo?.phone ?? ''} type="text" placeholder="Số điện thoại" className="h-8" />
              </div>

              <div className="flex flex-col w-[50%] p-1">
                <label className="font-semibold text-base pl-1">Chức vụ</label>
                <TextInput value={userInfo?.role ?? ''} type="text" placeholder="chức vụ" className="h-8" />
              </div>
            </div>

            <div className="flex  justify-center">
              <button className="bg-slate-700 px-3 py-1 rounded-md text-white text-base flex">Sửa</button>
              <button className="bg-slate-700 px-3 py-1 rounded-md text-white text-base flex">Lưu</button>
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
              <TextInput type="text" placeholder="Mật khẩu hiện tại" className="h-8" />
            </div>
            <div className="flex flex-1">
              <div className="flex flex-col w-[50%] p-1">
                <label className="font-semibold pl-1 text-base">Mật khẩu mới</label>
                <TextInput type="text" placeholder="Nhập mật khẩu mới" className="h-8" />
              </div>

              <div className="flex flex-col w-[50%] p-1">
                <label className="font-semibold text-base pl-1">Nhập lại mật khẩu mới</label>
                <TextInput type="text" placeholder="Nhập lại mật khẩu mới" className="h-8" />
              </div>
            </div>
            <div className="flex justify-center">
              <button className="bg-slate-700 px-3 py-1 rounded-md text-white text-base flex">Sửa</button>
              <button className="bg-slate-700 px-3 py-1 rounded-md text-white text-base flex">Lưu</button>
            </div>
          </div>
        </div>
      </div>
      {/* <p className="font-bold text-2xl">Tài khoản</p>
      <div>name: {userInfo?.name}</div>
      <div>userName: {userInfo?.username}</div>
      <div>accessToken: {accessToken}</div>
      <div>accessTokenLocalStorage: {accessTokenLocalStorage}</div>
      <button className="flex px-3 py-4 bg-red-600" onClick={() => handleLogout()}>
        Đăng xuất
      </button> */}
    </div>
  );
};

export default Account;
