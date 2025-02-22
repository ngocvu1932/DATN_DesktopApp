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
import {IBranchRequest} from '../../api/branch/interface';
import {createBranch} from '../../api/branch';
import {EFilterType} from '../filter/enum';
import {IDataChoose} from '../../pages/all-services';
import {IAppointmentRequest} from '../../api/appointment/interface';
import ChooseDateTime from '../date-time-picker';
import {addHours, format, isEqual} from 'date-fns';
import {app} from 'electron';
import {createAppointment} from '../../api/appointment';

interface IDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: ETypeAdd;
  dataBranchsChoose?: IDataChoose[];
  dataServicesChoose?: IDataChoose[];
}

const Drawer: React.FC<IDrawerProps> = ({isOpen, onClose, type, dataBranchsChoose, dataServicesChoose}) => {
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [isShowModalChooseTime, setIsShowModalChooseTime] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('2000-01-01 00:00');

  const [isFillAdd, setIsFillAdd] = useState({
    service: false,
    branch: false,
    appointment: false,
  });
  const [isFillReset, setIsFillReset] = useState({
    service: false,
    branch: false,
    appointment: false,
  });

  const [dataServiceAdd, setDataServiceAdd] = useState<IServiceRequest>({
    name: '',
    description: '',
    price: 0,
    status: 0,
    branchId: 0,
    totalSessions: 0,
    categoryId: 0,
  });

  const [dataBranchAdd, setDataBranchAdd] = useState<IBranchRequest>({
    name: '',
    status: -1,
    address: '',
    phone: '',
    email: '',
  });

  const [dataAppointmentAdd, setDataAppointmentAdd] = useState<IAppointmentRequest>({
    time: '',
    status: -1,
    customerId: -1,
    employeeId: -1,
    serviceId: -1,
    note: '',
    reminderSent: -1,
    branchId: -1,
  });

  // dịch vụ
  useEffect(() => {
    if (
      dataServiceAdd.name != '' &&
      dataServiceAdd.description != '' &&
      dataServiceAdd.price != 0 &&
      dataServiceAdd.status != 0 &&
      dataServiceAdd.branchId != 0 &&
      dataServiceAdd.totalSessions != 0 &&
      dataServiceAdd.categoryId != 0
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
      dataServiceAdd.branchId != 0 ||
      dataServiceAdd.totalSessions != 0 ||
      dataServiceAdd.categoryId != 0
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

  //licjh hejn
  useEffect(() => {
    if (
      dataAppointmentAdd.time != '' &&
      dataAppointmentAdd.status != -1 &&
      dataAppointmentAdd.customerId != -1 &&
      dataAppointmentAdd.employeeId != -1 &&
      dataAppointmentAdd.serviceId != -1 &&
      dataAppointmentAdd.note != '' &&
      dataAppointmentAdd.reminderSent != -1 &&
      dataAppointmentAdd.branchId != -1
    ) {
      setIsFillAdd((prevState) => ({...prevState, appointment: true}));
    } else {
      setIsFillAdd((prevState) => ({...prevState, appointment: false}));
    }
  }, [dataAppointmentAdd]);

  useEffect(() => {
    if (
      dataAppointmentAdd.time != '' ||
      dataAppointmentAdd.status != -1 ||
      dataAppointmentAdd.customerId != -1 ||
      dataAppointmentAdd.employeeId != -1 ||
      dataAppointmentAdd.serviceId != -1 ||
      dataAppointmentAdd.note != '' ||
      dataAppointmentAdd.reminderSent != -1 ||
      dataAppointmentAdd.branchId != -1
    ) {
      setIsFillReset((prevState) => ({...prevState, appointment: true}));
    } else {
      setIsFillReset((prevState) => ({...prevState, appointment: false}));
    }
  }, [dataAppointmentAdd]);

  useEffect(() => {
    if (!isEqual(selectedTime, new Date('2000-01-01 00:00'))) {
      const dateWithTimezone = addHours(selectedTime ? selectedTime : new Date(), 0);
      const timeConvertUTC = format(dateWithTimezone, "yyyy-MM-dd'T'HH:mm:ss");
      setDataAppointmentAdd((prevState) => ({
        ...prevState,
        time: timeConvertUTC,
      }));
    }
  }, [selectedTime]);

  const handleAddService = async () => {
    setIsLoadingAdd(true);
    const res = await createService(dataServiceAdd);
    if (res?.statusCode === 200) {
      // console.log('res', res.data);
      toast.success('Thêm dịch vụ thành công!', {autoClose: 1000});
      handleReset(ETypeAdd.SERVICE);
      setIsLoadingAdd(false);
      onClose();
    } else {
      toast.error('Thêm dịch vụ lỗi!', {autoClose: 1000});

      setIsLoadingAdd(false);
      // console.log('res', res);
    }
  };

  const handleAddBranch = async () => {
    setIsLoadingAdd(true);
    const res = await createBranch(dataBranchAdd);
    if (res?.statusCode === 200) {
      // console.log('res', res.data);
      toast.success('Thêm nrahc thành công!', {autoClose: 1000});
      handleReset(ETypeAdd.BRANCH);
      setIsLoadingAdd(false);
      onClose();
    } else {
      toast.error('Thêm dịch vụ lỗi!', {autoClose: 1000});

      setIsLoadingAdd(false);
      // console.log('res', res);
    }
  };

  const handleAddAppointment = async () => {
    setIsLoadingAdd(true);
    const filteredData = {
      ...dataAppointmentAdd,
      reminderSent: dataAppointmentAdd.reminderSent == 0 ? true : false,
    };
    const res = await createAppointment(filteredData);
    if (res?.statusCode === 200) {
      toast.success('Thêm dịch vụ thành công!', {autoClose: 1000});
      handleReset(ETypeAdd.APPOINTMENT);
      setIsLoadingAdd(false);
      onClose();
    } else {
      toast.error('Thêm dịch vụ lỗi!', {autoClose: 1000});

      setIsLoadingAdd(false);
      // console.log('res', res);
    }
  };

  const handleReset = (type: ETypeAdd) => {
    setSelectedTime('2000-01-01 00:00');
    type === ETypeAdd.SERVICE
      ? setDataServiceAdd({
          name: '',
          description: '',
          price: 0,
          status: 0,
          branchId: 0,
          totalSessions: 0,
          categoryId: 0,
        })
      : type === ETypeAdd.BRANCH
      ? setDataBranchAdd({name: '', status: -1, address: '', phone: '', email: ''})
      : type === ETypeAdd.APPOINTMENT
      ? setDataAppointmentAdd({
          time: '',
          status: -1,
          customerId: -1,
          employeeId: -1,
          serviceId: -1,
          note: '',
          reminderSent: -1,
          branchId: -1,
        })
      : '';
  };

  const handleChooseDateTime = () => {
    setIsShowModalChooseTime((prev) => !prev);
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
              <div className="bg-gray-50 flex w-full h-full flex-col rounded-md border border-gray-400 px-3">
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
                          className="w-[90%] h-8 rounded-xl m-1 pl-2 border border-slate-300 hover:border-blue-500 focus:outline-none focus:ring-blue-500"
                          disabled={isLoadingAdd}
                          value={dataServiceAdd.branchId ?? ''}
                          onChange={(e) => {
                            setDataServiceAdd((prevState) => ({
                              ...prevState,
                              branchId: Number(e.target.value),
                            }));
                          }}
                        >
                          <option value="">
                            <p className="text-gray-300">---Chọn chi nhánh--- </p>
                          </option>
                          {dataBranchsChoose?.map((item, index) => {
                            if (item.status == false) {
                              return;
                            }
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
                          className="w-[90%] h-8 rounded-xl m-1 pl-2 border border-slate-300 hover:border-blue-500 focus:outline-none focus:ring-blue-500"
                          disabled={isLoadingAdd}
                          value={dataServiceAdd.status ?? ''}
                          onChange={(e) => {
                            setDataServiceAdd((prevState) => ({
                              ...prevState,
                              status: Number(e.target.value),
                            }));
                          }}
                        >
                          {/* //  false 0 tạm dừng, true  1 là Đang hoạt động  */}
                          <option value="">---Chọn trạng thái--- </option>
                          <option value="1">Đang hoạt động</option>
                          <option value="0">Tạm dừng</option>
                        </select>
                      </div>
                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Tổng liệu trình</label>
                        <TextInput
                          disabled={isLoadingAdd}
                          value={dataServiceAdd.totalSessions == 0 ? '' : dataServiceAdd.totalSessions.toString()}
                          className="w-[90%] h-8"
                          placeholder="Nhập tổng liệu trình"
                          changeText={(e) => {
                            setDataServiceAdd((prevState) => ({
                              ...prevState,
                              totalSessions: Number(e),
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
                          className="w-[90%] h-8  rounded-xl m-1 pl-2 border border-slate-300 hover:border-blue-500 focus:outline-none focus:ring-blue-500"
                          value={dataServiceAdd.categoryId ?? ''}
                          onChange={(e) => {
                            setDataServiceAdd((prevState) => ({
                              ...prevState,
                              categoryId: Number(e.target.value),
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
                    {/* hanfg 1 */}
                    <div className="flex w-full mt-8">
                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Khách hàng</label>
                        <select
                          title="Chọn khách hàng"
                          className="w-[90%] h-8 rounded-xl m-1 pl-2 border border-slate-300 hover:border-blue-500 focus:outline-none focus:ring-blue-500"
                          disabled={isLoadingAdd}
                          value={dataAppointmentAdd.customerId ?? ''}
                          onChange={(e) => {
                            setDataAppointmentAdd((prevState) => ({
                              ...prevState,
                              customerId: Number(e.target.value),
                            }));
                          }}
                        >
                          <option value="">---Chọn khách hàng--- </option>
                          <option value="1">Khách hàng 1</option>
                          <option value="2">Khách hàng 2</option>
                          {/* {dataServicesChoose?.map((item, index) => {
                            return (
                              <option key={index} value={item.id}>
                                {item.value}
                              </option>
                            );
                          })} */}
                        </select>
                      </div>

                      <div className="w-[50%] relative">
                        <label className="font-semibold ml-1">Ngày giờ</label>
                        <div
                          className="flex items-center h-8 rounded-xl bg-white m-1 w-[90%] relative pl-3 border border-slate-300 hover:border-blue-500 focus:outline-none focus:ring-blue-500"
                          onClick={() => handleChooseDateTime()}
                        >
                          <p className="">
                            {isEqual(selectedTime, '2000-01-01 00:00')
                              ? 'Chọn thời gian'
                              : format(selectedTime, 'dd/MM/yyyy HH:mm')}
                          </p>
                        </div>
                        {isShowModalChooseTime && (
                          <ChooseDateTime onClose={handleChooseDateTime} nowDate={new Date()} onChooseTime={setSelectedTime} />
                        )}
                      </div>
                    </div>

                    {/* hanfg 2 */}
                    <div className="flex w-full mt-8">
                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Dịch vụ</label>
                        <select
                          title="Chọn dịch vụ"
                          className="w-[90%] h-8 focus:outline-none rounded-xl m-1 pl-2 border border-slate-300 hover:border-blue-500 focus:ring-blue-500 "
                          disabled={isLoadingAdd}
                          value={dataAppointmentAdd.serviceId ?? ''}
                          onChange={(e) => {
                            setDataAppointmentAdd((prevState) => ({
                              ...prevState,
                              serviceId: Number(e.target.value),
                            }));
                          }}
                        >
                          <option value="">---Chọn dịch vụ--- </option>
                          {dataServicesChoose?.map((item, index) => {
                            if (item.status == false) {
                              return;
                            }
                            return (
                              <option key={index} value={item.id}>
                                {item.value}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Nhân viên</label>
                        <select
                          title="Chọn nhân viên"
                          className="w-[90%] h-8 focus:outline-none rounded-xl m-1 pl-2 border border-slate-300 hover:border-blue-500 focus:ring-blue-500"
                          disabled={isLoadingAdd}
                          value={dataAppointmentAdd.employeeId ?? ''}
                          onChange={(e) => {
                            setDataAppointmentAdd((prevState) => ({
                              ...prevState,
                              employeeId: Number(e.target.value),
                            }));
                          }}
                        >
                          <option value="">---Chọn nhân viên--- </option>
                          <option value="1">Nhân viên 1</option>
                          <option value="2">Nhân viên 2</option>
                          {/* {dataBranchsChoose?.map((item, index) => {
                            return (
                              <option key={index} value={item.id}>
                                {item.value}
                              </option>
                            );
                          })} */}
                        </select>
                      </div>
                    </div>

                    {/* hanfg 3 */}
                    <div className="flex w-full mt-8">
                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Chi nhánh</label>
                        <select
                          title="Chọn chi nhánh"
                          className="w-[90%] h-8 focus:outline-none rounded-xl m-1 pl-2 border border-slate-300 hover:border-blue-500 focus:ring-blue-500"
                          disabled={isLoadingAdd}
                          value={dataAppointmentAdd.branchId ?? ''}
                          onChange={(e) => {
                            setDataAppointmentAdd((prevState) => ({
                              ...prevState,
                              branchId: Number(e.target.value),
                            }));
                          }}
                        >
                          <option value="">---Chọn chi nhánh--- </option>
                          {dataBranchsChoose?.map((item, index) => {
                            if (item.status == false) {
                              return;
                            }
                            return (
                              <option key={index} value={item.id}>
                                {item.value}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Trạng thái</label>
                        <select
                          title="Chọn trạng thái"
                          className="w-[90%] h-8 focus:outline-none rounded-xl m-1 pl-2 border border-slate-300 hover:border-blue-500 focus:ring-blue-500"
                          disabled={isLoadingAdd}
                          value={dataAppointmentAdd.status ?? ''}
                          onChange={(e) => {
                            setDataAppointmentAdd((prevState) => ({
                              ...prevState,
                              status: Number(e.target.value),
                            }));
                          }}
                        >
                          {/* 0 MỚi, 1 Đã xác nhận, 2 Hủy*/}
                          <option value="">---Chọn trạng thái--- </option>
                          <option value="0">Mới</option>
                          <option value="1">Đã xác nhận</option>
                        </select>
                      </div>
                    </div>

                    {/* hanfg 4 */}
                    <div className="flex w-full mt-8">
                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Nhắc nhở</label>
                        <select
                          title="Nhắc nhở"
                          className="w-[90%] h-8 focus:outline-none rounded-xl m-1 pl-2 border border-slate-300 hover:border-blue-500 focus:ring-blue-500"
                          disabled={isLoadingAdd}
                          value={dataAppointmentAdd.reminderSent ?? ''}
                          onChange={(e) => {
                            setDataAppointmentAdd((prevState) => ({
                              ...prevState,
                              reminderSent: Number(e.target.value),
                            }));
                          }}
                        >
                          <option value="">---Nhắc nhở--- </option>
                          <option value="0">Có</option>
                          <option value="1">Không</option>
                          {/* <option value="3">3</option> */}
                          {/* {dataBranchsChoose?.map((item, index) => {
                            return (
                              <option key={index} value={item.id}>
                                {item.value}
                              </option>
                            );
                          })} */}
                        </select>
                      </div>

                      <div className="w-[50%] ">
                        <label className="font-semibold ml-1">Ghi chú</label>
                        <TextArea
                          title="Ghi chú"
                          value={dataAppointmentAdd.note ?? ''}
                          className="flex w-[90%] h-28 resize-none focus:outline-none rounded-xl p-2 m-1"
                          placeholder="Nhập mô ghi chú..."
                          changeText={(text) => {
                            setDataAppointmentAdd((prevState) => ({
                              ...prevState,
                              note: text,
                            }));
                          }}
                        />
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
                          className="w-[90%] h-8 rounded-xl m-1 pl-3 border border-slate-300 hover:border-blue-500 focus:outline-none focus:ring-blue-500"
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
                        : type == ETypeAdd.APPOINTMENT
                        ? !isFillReset.appointment || isLoadingAdd
                        : false
                    }
                    className={`px-3 py-1 ${
                      (
                        type == ETypeAdd.BRANCH
                          ? !isFillReset.branch || isLoadingAdd
                          : type == ETypeAdd.SERVICE
                          ? !isFillReset.service || isLoadingAdd
                          : type == ETypeAdd.APPOINTMENT
                          ? !isFillReset.appointment || isLoadingAdd
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
                        : type == ETypeAdd.APPOINTMENT
                        ? !isFillAdd.appointment || isLoadingAdd
                        : false
                    }
                    className={`px-3 py-1 ${
                      (
                        type == ETypeAdd.BRANCH
                          ? !isFillAdd.branch || isLoadingAdd
                          : type == ETypeAdd.SERVICE
                          ? !isFillAdd.service || isLoadingAdd
                          : type == ETypeAdd.APPOINTMENT
                          ? !isFillAdd.appointment || isLoadingAdd
                          : false
                      )
                        ? 'bg-slate-400'
                        : 'bg-blue-500 '
                    } text-white shadow-2xl rounded-md`}
                    onClick={() => {
                      type == ETypeAdd.BRANCH
                        ? handleAddBranch()
                        : type == ETypeAdd.SERVICE
                        ? handleAddService()
                        : type == ETypeAdd.APPOINTMENT
                        ? handleAddAppointment()
                        : '';
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
