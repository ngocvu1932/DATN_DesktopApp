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
import {on} from 'events';

interface IDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: ETypeAdd;
}

const Drawer: React.FC<IDrawerProps> = ({isOpen, onClose, type}) => {
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [isFillAdd, setIsFillAdd] = useState({
    service: false,
    customer: false,
  });
  const [isFillReset, setIsFillReset] = useState({
    service: false,
    customer: false,
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

  const handleAddService = async () => {
    setIsLoadingAdd(true);
    const res = await createService(dataServiceAdd);
    if (res?.statusCode === 200) {
      console.log('res', res.data);
      toast.success('Thêm dịch vụ thành công!', {autoClose: 1000});
      handleResetService();
      setIsLoadingAdd(false);
      onClose();
    } else {
      toast.success('Thêm dịch vụ lỗi!', {autoClose: 1000});

      setIsLoadingAdd(false);
      console.log('res', res);
    }
  };

  const handleResetService = () => {
    setDataServiceAdd({
      name: '',
      description: '',
      price: 0,
      status: 0,
      branch_id: 0,
      total_sessions: 0,
      service_package_id: 0,
    });
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 overflow-hidden">
          <div className="fixed inset-0" onClick={onClose}></div>
          <div className={`drawer ${isOpen ? 'open' : ''} z-30`}>
            <div className="flex relative justify-center py-2 items-center">
              <p className="font-bold text-xl">Thêm dịch vụ</p>
              <button className="absolute left-0 px-3" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} size="xl" />
              </button>
            </div>
            <div className="drawer-content">
              <div className="bg-slate-300 flex w-full h-full flex-col rounded-md border border-black px-3">
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
                      onChange={(e) => {
                        setDataServiceAdd((prevState) => ({
                          ...prevState,
                          description: e.target.value,
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

                <div className="flex w-full mt-14 mb-8 justify-center">
                  <button
                    disabled={!isFillReset.service || isLoadingAdd}
                    className={`px-3 py-1 ${
                      !isFillReset.service || isLoadingAdd ? 'bg-slate-400' : 'bg-red-500 '
                    } text-white shadow-2xl rounded-md mr-3`}
                    onClick={() => handleResetService()}
                  >
                    Reset
                  </button>
                  <button
                    disabled={!isFillAdd.service || isLoadingAdd}
                    className={`px-3 py-1 ${
                      !isFillAdd.service || isLoadingAdd ? 'bg-slate-400' : 'bg-blue-500 '
                    } text-white shadow-2xl rounded-md`}
                    onClick={() => handleAddService()}
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
