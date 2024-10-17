import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setInfoLayout} from '../../redux/slices/layoutInfoSlice';
import {ELayoutInfo} from '../../constants/layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons';
import TextInput from '../text-input';
import TextArea from '../text-aria';
import {IBranch} from '../../models/branch';
import {updateBranch} from '../../api/branch';

const InfoDetail: React.FC = () => {
  const dispatch = useDispatch();
  const layoutInfo = useSelector((state: any) => state.layoutInfo.layoutBranch);
  const [dataBranch, setDataBranch] = useState<IBranch>(layoutInfo?.data);
  const [isEdit, setIsEdit] = useState(false);

  const handleSaveBranch = async () => {
    console.log('dataBranch:', dataBranch);

    const res = await updateBranch(dataBranch.id, dataBranch);
    console.log('res:', res);
    if (res?.statusCode === 200) {
      setIsEdit(!isEdit);
      dispatch(setInfoLayout({layoutBranch: {layout: ELayoutInfo.Details, data: res?.data}}));
    }
  };

  return (
    <div className={`h-[94%] flex flex-col`}>
      <div
        onClick={() => {
          dispatch(setInfoLayout({layoutBranch: {layout: ELayoutInfo.Home, data: null}})), setIsEdit(false);
        }}
        className="flex cursor-pointer w-fit h-fit  items-center p-2"
      >
        <FontAwesomeIcon icon={faAngleLeft} /> &nbsp;
        <p className="text-base font-semibold">{layoutInfo?.data?.name}</p>
      </div>

      <div className="flex flex-grow pt-2 ">
        <div className="p-2 flex flex-1 flex-col rounded-xl border border-slate-400 overflow-y-auto justify-center">
          {/* hàng 1 */}
          <div className="flex w-full h-fit">
            <div className="flex flex-col w-1/2  pl-16 pr-4">
              <label className="font-semibold text-base pl-1">{'ID'}</label>
              <TextInput
                disabled
                value={dataBranch?.id.toString()}
                type="text"
                title="ID"
                placeholder={'ID'}
                className="h-8"
              />
            </div>
            <div className="flex flex-col w-1/2 pr-16 pl-4">
              <label className="font-semibold text-base pl-1">{'Trạng thái'}</label>
              {/* <TextInput disabled={isEdit} type="text" title="Trạng thái" placeholder={'Trạng thái'} className="h-8" /> */}
              <select
                className={`${dataBranch.status !== 1 ? 'bg-yellow-200' : 'bg-green-400'} rounded-lg p-1 mx-1 mt-1`}
                defaultValue={dataBranch.status}
                onChange={(event) => setDataBranch({...dataBranch, status: Number(event.target.value)})}
                disabled={!isEdit}
              >
                <option value="1">Đang hoạt động</option>
                <option value="2">OFF</option>
              </select>
            </div>
          </div>

          {/* hàng 2 */}
          <div className="flex w-full h-fit pt-8">
            <div className="flex flex-col w-1/2  pl-16 pr-4">
              <label className="font-semibold text-base pl-1">{'Tên chi nhánh'}</label>
              <TextInput
                changeText={(text) => setDataBranch({...dataBranch, name: text})}
                disabled={!isEdit}
                value={dataBranch?.name}
                type="text"
                title="Tên chi nhánh"
                placeholder={'Tên chi nhánh'}
                className="h-8"
              />
            </div>
            <div className="flex flex-col w-1/2 pr-16 pl-4">
              <label className="font-semibold text-base pl-1">{'Số điện thoại'}</label>
              <TextInput
                changeText={(text) => setDataBranch({...dataBranch, phone: text})}
                disabled={!isEdit}
                value={dataBranch?.phone}
                type="text"
                title="Số điện thoại"
                placeholder={'Số điện thoại'}
                className="h-8"
              />
            </div>
          </div>

          {/* hàng 3 */}
          <div className="flex w-full h-fit pt-8">
            <div className="flex flex-col w-1/2  pl-16 pr-4">
              <label className="font-semibold text-base pl-1">{'Email'}</label>
              <TextInput
                changeText={(text) => setDataBranch({...dataBranch, email: text})}
                disabled={!isEdit}
                value={dataBranch?.email}
                type="text"
                title="Email"
                placeholder={'Email'}
                className="h-8"
              />
            </div>
            <div className="flex flex-col w-1/2 pr-16 pl-4">
              <label className="font-semibold text-base pl-1">{'Địa chỉ'}</label>
              <TextArea
                disabled={!isEdit}
                placeholder="Địa chỉ"
                value={dataBranch?.address}
                className="focus:outline-none resize-none"
                changeText={(text) => setDataBranch({...dataBranch, address: text})}
              />
            </div>
          </div>

          {/* hàng 4 */}
          <div className="flex w-full h-fit pt-8">
            <div className="flex flex-col w-1/2 pl-16 pr-4">
              <label className="font-semibold text-base pl-1">{'Ngày cập nhật'}</label>
              <TextInput
                disabled
                value={dataBranch?.updated_at}
                type="text"
                title="Ngày cập nhật"
                placeholder={'Ngày cập nhật'}
                className="h-8"
              />
            </div>
            <div className="flex flex-col w-1/2  pr-16 pl-4">
              <label className="font-semibold text-base pl-1">{'Ngày tạo'}</label>
              <TextInput
                disabled
                value={dataBranch?.created_at}
                type="text"
                title="Ngày tạo"
                placeholder={'Ngày tạo'}
                className="h-8"
              />
            </div>
          </div>

          <div className="flex justify-center mt-20">
            <button
              className="hover:bg-slate-700 bg-slate-500 px-3 py-1 rounded-md text-white text-base flex mr-4"
              onClick={() => {
                setIsEdit(!isEdit);
                setDataBranch(layoutInfo?.data);
              }}
            >
              {!isEdit ? 'Sửa' : 'Hủy'}
            </button>
            <button
              className="hover:bg-slate-700 bg-slate-500 px-3 py-1 rounded-md text-white text-base flex"
              onClick={() => handleSaveBranch()}
            >
              {'Lưu'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoDetail;
