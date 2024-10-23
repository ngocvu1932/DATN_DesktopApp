import React, {useEffect, useState} from 'react';
import TextInput from '../text-input';
import './index.css';
import {ETypeAdd} from './enum';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import TextArea from '../text-aria';
import {IServiceRequest} from '../../api/services/enum';
import {createService} from '../../api/services';
import LoadingSpinner from '../loading-spinner';
import {toast} from 'react-toastify';
import {IBrancheRequest} from '../../api/branch/interface';
import {createBranch} from '../../api/branch';
import {EFilterType} from '../filter/enum';
import {IBranchChoose} from '../../pages/all-services';

interface IDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: ETypeAdd;
  dataChoose?: IBranchChoose[];
}

const Drawer: React.FC<IDrawerProps> = ({isOpen, onClose, type, dataChoose}) => {
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [isFillAdd, setIsFillAdd] = useState({
    service: false,
    branch: false,
  });
  const [isFillReset, setIsFillReset] = useState({
    service: false,
    branch: false,
  });

  const [dataServiceAdd, setDataServiceAdd] = useState<IServiceRequest>({
    name: '',
    description: '',
    price: 0,
    status: 0,
    branch_id: 0,
    total_sessions: 0,
    service_package_id: 0,
  });

  const [dataBranchAdd, setDataBranchAdd] = useState<IBrancheRequest>({
    name: '',
    status: -1,
    address: '',
    phone: '',
    email: '',
  });

  // dịch vụ
  useEffect(() => {
    if (
      dataServiceAdd.name != '' &&
      dataServiceAdd.description != '' &&
      dataServiceAdd.price != 0 &&
      dataServiceAdd.status != 0 &&
      dataServiceAdd.branch_id != 0 &&
      dataServiceAdd.total_sessions != 0 &&
      dataServiceAdd.service_package_id != 0
    ) {
      setIsFillAdd((prevState) => ({...prevState, service: true}));
    } else {
      setIsFillAdd((prevState) => ({...prevState, service: false}));
    }
  }, [dataServiceAdd]);

  useEffect(() => {
    if (
      dataServiceAdd.name != '' ||
      dataServiceAdd.description != '' ||
      dataServiceAdd.price != 0 ||
      dataServiceAdd.status != 0 ||
      dataServiceAdd.branch_id != 0 ||
      dataServiceAdd.total_sessions != 0 ||
      dataServiceAdd.service_package_id != 0
    ) {
      setIsFillReset((prevState) => ({...prevState, service: true}));
    } else {
      setIsFillReset((prevState) => ({...prevState, service: false}));
    }
  }, [dataServiceAdd]);

  //chi nhánh
  useEffect(() => {
    if (
      dataBranchAdd.name != '' &&
      dataBranchAdd.status != -1 &&
      dataBranchAdd.address != '' &&
      dataBranchAdd.phone != '' &&
      dataBranchAdd.email != ''
    ) {
      setIsFillAdd((prevState) => ({...prevState, branch: true}));
    } else {
      setIsFillAdd((prevState) => ({...prevState, branch: false}));
    }
  }, [dataBranchAdd]);

  useEffect(() => {
    if (
      dataBranchAdd.name != '' ||
      dataBranchAdd.status != -1 ||
      dataBranchAdd.address != '' ||
      dataBranchAdd.phone != '' ||
      dataBranchAdd.email != ''
    ) {
      setIsFillReset((prevState) => ({...prevState, branch: true}));
    } else {
      setIsFillReset((prevState) => ({...prevState, branch: false}));
    }
  }, [dataBranchAdd]);

  const handleAddService = async () => {
    setIsLoadingAdd(true);
    const res = await createService(dataServiceAdd);
    if (res?.statusCode === 200) {
      console.log('res', res.data);
      toast.success('Thêm dịch vụ thành công!', {autoClose: 1000});
      handleReset(ETypeAdd.SERVICE);
      setIsLoadingAdd(false);
      onClose();
    } else {
      toast.success('Thêm dịch vụ lỗi!', {autoClose: 1000});

      setIsLoadingAdd(false);
      console.log('res', res);
    }
  };

  const handleAddBranch = async () => {
    console.log('dataBranchAdd', dataBranchAdd);

    setIsLoadingAdd(true);
    const res = await createBranch(dataBranchAdd);
    if (res?.statusCode === 200) {
      console.log('res', res.data);
      toast.success('Thêm nrahc thành công!', {autoClose: 1000});
      handleReset(ETypeAdd.BRANCH);
      setIsLoadingAdd(false);
      onClose();
    } else {
      toast.success('Thêm dịch vụ lỗi!', {autoClose: 1000});

      setIsLoadingAdd(false);
      console.log('res', res);
    }
  };

  const handleReset = (type: ETypeAdd) => {
    type === ETypeAdd.SERVICE
      ? setDataServiceAdd({
          name: '',
          description: '',
          price: 0,
          status: 0,
          branch_id: 0,
          total_sessions: 0,
          service_package_id: 0,
        })
      : type === ETypeAdd.BRANCH
      ? setDataBranchAdd({name: '', status: -1, address: '', phone: '', email: ''})
      : '';
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 overflow-hidden z-20">
          <div className="fixed inset-0" onClick={onClose}></div>
          <div className={`drawer ${isOpen ? 'open' : ''} z-20 shadow-2xl`}>
            <div className="flex relative justify-center py-2 items-center">
              <p className="font-bold text-xl">
                {type === ETypeAdd.SERVICE
                  ? 'Thêm dịch vụ'
                  : type === ETypeAdd.CUSTOMER
                  ? 'Thêm khách hàng'
                  : type === ETypeAdd.BRANCH
                  ? 'Thêm chi nhánh'
                  : 'Thêm lịch hẹn'}
              </p>
              <button className="absolute left-0 px-3" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} size="xl" />
              </button>
            </div>
            <div className="drawer-content">
              <div className="bg-slate-100 flex w-full h-full flex-col rounded-md border border-black px-3">
                {type === ETypeAdd.SERVICE && (
                  <>
                    <div className="flex w-full mt-8">
                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Tên dịch vụ</label>
                        <TextInput
                          disabled={isLoadingAdd}
                          value={dataServiceAdd.name ?? ''}
                          changeText={(e) => {
                            setDataServiceAdd((prevState) => ({
                              ...prevState,
                              name: e,
                            }));
                          }}
                          className="w-[90%] h-8"
                          placeholder="Nhập tên dịch vụ"
                        />
                      </div>
                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Chi nhánh</label>
                        {/* <TextInput className="w-[90%] h-8" placeholder="Chọn chi nhánh" /> */}
                        <select
                          className="w-[90%] h-8 focus:outline-none rounded-xl m-1 pl-3"
                          disabled={isLoadingAdd}
                          value={dataServiceAdd.branch_id ?? ''}
                          onChange={(e) => {
                            setDataServiceAdd((prevState) => ({
                              ...prevState,
                              branch_id: Number(e.target.value),
                            }));
                          }}
                        >
                          <option value="">---Chọn chi nhánh--- </option>
                          {dataChoose?.map((item, index) => {
                            return (
                              <option key={index} value={item.id}>
                                {item.value}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    <div className="flex w-full mt-5">
                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Trạng thái</label>
                        <select
                          className="w-[90%] h-8 focus:outline-none rounded-xl m-1 pl-3"
                          disabled={isLoadingAdd}
                          value={dataServiceAdd.status ?? ''}
                          onChange={(e) => {
                            setDataServiceAdd((prevState) => ({
                              ...prevState,
                              status: Number(e.target.value),
                            }));
                          }}
                        >
                          <option value="">---Chọn trạng thái--- </option>
                          <option value="1">Trạng thái 1</option>
                          <option value="2">Trạng thái 2</option>
                        </select>
                      </div>
                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Tổng liệu trình</label>
                        <TextInput
                          disabled={isLoadingAdd}
                          value={dataServiceAdd.total_sessions == 0 ? '' : dataServiceAdd.total_sessions.toString()}
                          className="w-[90%] h-8"
                          placeholder="Nhập tổng liệu trình"
                          changeText={(e) => {
                            setDataServiceAdd((prevState) => ({
                              ...prevState,
                              total_sessions: Number(e),
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex w-full mt-5">
                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Giá tiền</label>
                        <TextInput
                          disabled={isLoadingAdd}
                          value={dataServiceAdd.price == 0 ? '' : dataServiceAdd.price.toString()}
                          className="w-[90%] h-8"
                          placeholder="Nhập giá tiền"
                          changeText={(e) => {
                            setDataServiceAdd((prevState) => ({
                              ...prevState,
                              price: Number(e),
                            }));
                          }}
                        />
                      </div>
                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Gói dịch vụ</label>
                        <select
                          disabled={isLoadingAdd}
                          className="w-[90%] h-8 focus:outline-none rounded-xl m-1 pl-3"
                          value={dataServiceAdd.service_package_id ?? ''}
                          onChange={(e) => {
                            setDataServiceAdd((prevState) => ({
                              ...prevState,
                              service_package_id: Number(e.target.value),
                            }));
                          }}
                        >
                          <option value="">---Chọn dịch vụ--- </option>
                          <option value="1">Gói khuôn mặt</option>
                          <option value="2">Gói vóc dáng</option>
                          <option value="3">Gói khác</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex w-full mt-5">
                      <div className="w-[70%] ">
                        <label className="font-semibold ml-1">Mô tả chi tiết dịch vụ</label>
                        <TextArea
                          value={dataServiceAdd.description ?? ''}
                          className="flex w-[90%] h-28 resize-none focus:outline-none rounded-xl p-2 m-1"
                          placeholder="Nhập mô tả chi tiết dịch vụ..."
                          changeText={(text) => {
                            setDataServiceAdd((prevState) => ({
                              ...prevState,
                              description: text,
                            }));
                          }}
                        />
                      </div>
                      <div className="w-[30%] ">
                        <label className="font-semibold ml-1">Chọn hình ảnh dịch vụ</label>
                        {/* <TextInput className="w-[82%] h-8" placeholder="Chọn chi nhánh" /> */}
                        <button className="bg-slate-500 text-white px-3 py-1 mt-1 rounded-md">Thêm ảnh</button>
                        <p className="text-sm italic">*JPG, PNG</p>
                      </div>
                    </div>
                  </>
                )}

                {type === ETypeAdd.APPOINTMENT && (
                  <>
                    <div className="flex w-full mt-8">
                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Tên dịch vụ</label>
                        <TextInput
                          disabled={isLoadingAdd}
                          value={dataServiceAdd.name ?? ''}
                          changeText={(e) => {
                            setDataServiceAdd((prevState) => ({
                              ...prevState,
                              name: e,
                            }));
                          }}
                          className="w-[90%] h-8"
                          placeholder="Nhập tên dịch vụ"
                        />
                      </div>
                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Chi nhánh</label>
                        {/* <TextInput className="w-[90%] h-8" placeholder="Chọn chi nhánh" /> */}
                        <select
                          className="w-[90%] h-8 focus:outline-none rounded-xl m-1 pl-3"
                          disabled={isLoadingAdd}
                          value={dataServiceAdd.branch_id ?? ''}
                          onChange={(e) => {
                            setDataServiceAdd((prevState) => ({
                              ...prevState,
                              branch_id: Number(e.target.value),
                            }));
                          }}
                        >
                          <option value="">---Chọn chi nhánh--- </option>
                          <option value="1">Chi nhánh 1</option>
                          <option value="2">Chi nhánh 2</option>
                          <option value="3">Chi nhánh 3</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {type === ETypeAdd.BRANCH && (
                  <>
                    <div className="flex w-full mt-8">
                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Tên chi nhánh</label>
                        <TextInput
                          title="Tên chi nhánh"
                          disabled={isLoadingAdd}
                          value={dataBranchAdd.name ?? ''}
                          changeText={(text) => {
                            setDataBranchAdd((prevState) => ({
                              ...prevState,
                              name: text,
                            }));
                          }}
                          className="w-[90%] h-8"
                          placeholder="Nhập tên chi nhánh"
                        />
                      </div>

                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Trạng thái</label>
                        <select
                          className="w-[90%] h-8 focus:outline-none rounded-xl m-1 pl-3"
                          disabled={isLoadingAdd}
                          value={dataBranchAdd.status ?? ''}
                          onChange={(e) => {
                            setDataBranchAdd((prevState) => ({
                              ...prevState,
                              status: Number(e.target.value),
                            }));
                          }}
                        >
                          <option value="">---Chọn trạng thái--- </option>
                          <option value="0">Đang hoạt động</option>
                          <option value="1">OFF</option>
                        </select>
                      </div>
                    </div>

                    {/* dòng 2 */}
                    <div className="flex w-full mt-8">
                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Số điện thoại</label>
                        <TextInput
                          title="Nhập số điện thoại"
                          disabled={isLoadingAdd}
                          value={dataBranchAdd.phone ?? ''}
                          changeText={(text) => {
                            setDataBranchAdd((prevState) => ({
                              ...prevState,
                              phone: text,
                            }));
                          }}
                          className="w-[90%] h-8"
                          placeholder="Nhập số điện thoại"
                        />
                      </div>

                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Email</label>
                        <TextInput
                          title="Nhập email"
                          disabled={isLoadingAdd}
                          value={dataBranchAdd.email ?? ''}
                          changeText={(text) => {
                            setDataBranchAdd((prevState) => ({
                              ...prevState,
                              email: text,
                            }));
                          }}
                          className="w-[90%] h-8"
                          placeholder="Nhập email"
                        />
                      </div>
                    </div>

                    {/* dòng 3 */}
                    <div className="flex w-full mt-8">
                      <div className="w-[100%]">
                        <label className="font-semibold ml-1">Địa chỉ</label>
                        <TextArea
                          title="Nhập địa chỉ"
                          disabled={isLoadingAdd}
                          value={dataBranchAdd.address ?? ''}
                          changeText={(text) => {
                            setDataBranchAdd((prevState) => ({
                              ...prevState,
                              address: text,
                            }));
                          }}
                          className="w-[95%] h-20 resize-none"
                          placeholder="Nhập địa chỉ"
                        />
                      </div>
                      {/* 
                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Email</label>
                        <TextInput
                          title="Nhập email"
                          disabled={isLoadingAdd}
                          value={dataBranchAdd.email ?? ''}
                          changeText={(text) => {
                            setDataBranchAdd((prevState) => ({
                              ...prevState,
                              email: text,
                            }));
                          }}
                          className="w-[90%] h-8"
                          placeholder="Nhập email"
                        />
                      </div> */}
                    </div>
                  </>
                )}

                <div className="flex w-full mt-14 mb-8 justify-center">
                  <button
                    disabled={
                      type == ETypeAdd.BRANCH
                        ? !isFillReset.branch || isLoadingAdd
                        : type == ETypeAdd.SERVICE
                        ? !isFillReset.service || isLoadingAdd
                        : false
                    }
                    className={`px-3 py-1 ${
                      (
                        type == ETypeAdd.BRANCH
                          ? !isFillReset.branch || isLoadingAdd
                          : type == ETypeAdd.SERVICE
                          ? !isFillReset.service || isLoadingAdd
                          : false
                      )
                        ? 'bg-slate-400'
                        : 'bg-red-500 '
                    } text-white shadow-2xl rounded-md mr-3`}
                    onClick={() =>
                      handleReset(
                        type == ETypeAdd.BRANCH
                          ? ETypeAdd.BRANCH
                          : type == ETypeAdd.SERVICE
                          ? ETypeAdd.SERVICE
                          : ETypeAdd.APPOINTMENT
                      )
                    }
                  >
                    Reset
                  </button>

                  <button
                    disabled={
                      type == ETypeAdd.BRANCH
                        ? !isFillAdd.branch || isLoadingAdd
                        : type == ETypeAdd.SERVICE
                        ? !isFillAdd.service || isLoadingAdd
                        : false
                    }
                    className={`px-3 py-1 ${
                      (
                        type == ETypeAdd.BRANCH
                          ? !isFillAdd.branch || isLoadingAdd
                          : type == ETypeAdd.SERVICE
                          ? !isFillAdd.service || isLoadingAdd
                          : false
                      )
                        ? 'bg-slate-400'
                        : 'bg-blue-500 '
                    } text-white shadow-2xl rounded-md`}
                    onClick={() => {
                      type == ETypeAdd.BRANCH ? handleAddBranch() : type == ETypeAdd.SERVICE ? handleAddService() : '';
                    }}
                  >
                    {isLoadingAdd ? <LoadingSpinner size={25} /> : 'Thêm'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Drawer;
