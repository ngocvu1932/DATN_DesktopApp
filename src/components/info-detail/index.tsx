import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {resetAllLayouts, setInfoLayout} from '../../redux/slices/layoutInfoSlice';
import {ELayoutInfo} from '../../constants/layout';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleLeft, faXmark} from '@fortawesome/free-solid-svg-icons';
import TextInput from '../text-input';
import TextArea from '../text-aria';
import {IBranch} from '../../models/branch';
import {updateBranch} from '../../api/branch';
import {ETypeInfoDetail} from './enum';
import {IAppointment} from '../../models/appointment';
import {getFormattedDate, getFormattedTime} from '../../utils/dateTime';
import '../../global.css';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../loading-spinner';
import {IService} from '../../models/service';
import {updateService} from '../../api/services';
import {IDataChoose} from '../../pages/all-services';
import {time} from 'console';
import {updateAppointment} from '../../api/appointment';
import ChooseDateTime from '../date-time-picker';
import {format, isEqual} from 'date-fns';
import {IOrder, IOrderDetail} from '../../models/order';
import {formatPrice} from '../../utils/formatPrice';
import Bills from '../../pages/bills';
import {faEye, faFilePdf, faFloppyDisk, faPenToSquare} from '@fortawesome/free-regular-svg-icons';

interface IInfoDetailProps {
  type?: ETypeInfoDetail;
  dataChooseBranchs?: IDataChoose[];
  dataChooseServices?: IDataChoose[];
}

const InfoDetail: React.FC<IInfoDetailProps> = ({type, dataChooseBranchs, dataChooseServices}) => {
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const layoutInfoBranch = useSelector((state: any) => state.layoutInfo.layoutBranch);
  const [dataBranch, setDataBranch] = useState<IBranch>(layoutInfoBranch?.data);
  const [titleBranchName, setTitleBranchName] = useState(layoutInfoBranch?.data?.name);

  const layoutInfoAppointment = useSelector((state: any) => state.layoutInfo.layoutAppointment);
  const [dataAppointment, setDataAppointment] = useState<IAppointment>(layoutInfoAppointment?.data);
  const [isShowModalChooseTime, setIsShowModalChooseTime] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>(dataAppointment?.time ?? '2000-01-01 00:00');

  const layoutInfoService = useSelector((state: any) => state.layoutInfo.layoutService);
  const [dataService, setDataService] = useState<IService>(layoutInfoService?.data);
  const [titleServiceName, setTitleServiceName] = useState(layoutInfoService?.data?.name);

  const layoutInfoOrder = useSelector((state: any) => state.layoutInfo.layoutOrder);
  const [dataOrder, setDataOrder] = useState<IOrder>(layoutInfoOrder?.data);
  const [titleOrderName, setTitleOrderName] = useState(layoutInfoOrder?.data?.name);
  const [isReviewOrder, setIsReviewOrder] = useState(false);
  const billsRef = useRef<any>(null);

  const handleExportInvoice = () => {
    if (billsRef.current) {
      billsRef.current.exportInvoice();
    }
  };

  useEffect(() => {
    setDataAppointment({...dataAppointment, time: selectedTime});
  }, [selectedTime]);

  const handleSaveAppointment = async () => {
    const filteredData = {
      status: dataAppointment.status,
      reminderSent: dataAppointment.reminderSent,
      serviceId: dataAppointment.serviceId,
      note: dataAppointment.note,
      branchId: dataAppointment.branchId,
      employeeId: dataAppointment.employeeId,
      time: dataAppointment.time,
    };

    setIsSave(true);
    const res = await updateAppointment(dataAppointment.id, filteredData);
    if (res?.statusCode === 200) {
      const resData = {
        ...dataAppointment,
        status: res?.data?.status,
        reminderSent: res?.data?.reminderSent,
        serviceId: res?.data?.serviceId,
        note: res?.data?.note,
        branchId: res?.data?.branchId,
        employeeId: res?.data?.employeeId,
        time: res?.data?.time,
      };
      setIsEdit(false);
      setIsSave(false);
      dispatch(
        setInfoLayout({
          layoutAppointment: {layout: ELayoutInfo.Details, data: resData},
        })
      );
      toast.success('Cập nhật thành công!', {autoClose: 2000});
    } else {
      toast.error('Có lỗi xảy ra!', {autoClose: 2000});
    }
  };

  const handleSaveBranch = async () => {
    const filledData = {
      name: dataBranch.name,
      status: dataBranch.status,
      address: dataBranch.address,
      phone: dataBranch.phone,
      email: dataBranch.email,
    };

    setIsSave(true);
    const res = await updateBranch(dataBranch.id, filledData);
    if (res?.statusCode === 200) {
      setIsEdit(!isEdit);
      setTitleBranchName(res?.data?.name);
      setIsSave(false);
      dispatch(
        setInfoLayout({
          layoutBranch: {layout: ELayoutInfo.Details, data: res?.data},
        })
      );
      toast.success('Cập nhật thành công!', {autoClose: 2000});
    } else {
      toast.error('Có lỗi xảy ra!', {autoClose: 2000});
    }
  };

  const handleSaveService = async () => {
    const filteredData = {
      name: dataService.name,
      price: dataService.price,
      total_sessions: dataService.totalSessions,
      description: dataService.description,
      status: 1,
    };

    setIsSave(true);
    const res = await updateService(dataService.id, filteredData);
    if (res?.statusCode === 200) {
      setIsEdit(!isEdit);
      setIsSave(false);
      setTitleServiceName(res?.data?.name);
      dispatch(
        setInfoLayout({
          layoutService: {layout: ELayoutInfo.Details, data: res?.data},
        })
      );
      toast.success('Cập nhật thành công!', {autoClose: 2000});
    } else {
      toast.error('Có lỗi xảy ra!', {autoClose: 2000});
    }
  };

  const handleChooseDateTime = () => {
    setIsShowModalChooseTime((prev) => !prev);
  };

  return (
    <div className={`h-[94%] flex flex-col overflow-hidden`}>
      <div className="flex justify-between cursor-pointer w-full h-fit items-center p-2">
        <div
          className="flex items-center "
          onClick={() => {
            dispatch(resetAllLayouts()), setIsEdit(false);
          }}
        >
          <FontAwesomeIcon icon={faAngleLeft} /> &nbsp;
          <p className="text-base font-semibold">
            {type == ETypeInfoDetail.BRANCH
              ? titleBranchName
              : type == ETypeInfoDetail.APPOINTMENT
              ? `Lịch hẹn ${dataAppointment?.code} `
              : type == ETypeInfoDetail.ORDER
              ? `Chi tiết đơn hàng ORD00${dataOrder?.id}`
              : `${titleServiceName} #${dataService?.id}`}
          </p>
        </div>

        <div className=" flex justify-center items-center">
          {type == ETypeInfoDetail.ORDER && (
            <button
              className="hover:bg-slate-700 bg-slate-500 px-3 py-1 rounded-md text-white text-base flex mr-4"
              onClick={() => {
                setIsReviewOrder(true);
              }}
            >
              <span className="flex justify-center items-center">
                <FontAwesomeIcon className="mr-3" icon={faEye} /> Xem hóa đơn
              </span>
            </button>
          )}
          <button
            className="hover:bg-slate-700 bg-slate-500 px-3 py-1 rounded-md text-white text-base flex mr-4"
            onClick={() => {
              setIsShowModalChooseTime(false);
              setIsEdit(!isEdit);
              if (type == ETypeInfoDetail.BRANCH) {
                setDataBranch(layoutInfoBranch?.data);
              } else if (type == ETypeInfoDetail.APPOINTMENT) {
                setDataAppointment(layoutInfoAppointment?.data);
                if (layoutInfoAppointment?.data?.time) {
                  setSelectedTime(layoutInfoAppointment?.data?.time);
                }
              } else if (type == ETypeInfoDetail.SERVICE) {
                setDataService(layoutInfoService?.data);
              }
            }}
          >
            {!isEdit ? (
              <span className="flex justify-center items-center">
                <FontAwesomeIcon className="mr-3" icon={faPenToSquare} /> Sửa
              </span>
            ) : (
              <span className="flex justify-center items-center">
                <FontAwesomeIcon className="mr-3" icon={faXmark} /> Hủy
              </span>
            )}
          </button>
          <button
            className="hover:bg-slate-700 bg-slate-500 px-3 py-1 rounded-md text-white text-base flex"
            disabled={isSave}
            onClick={() => {
              type == ETypeInfoDetail.BRANCH
                ? handleSaveBranch()
                : type == ETypeInfoDetail.APPOINTMENT
                ? handleSaveAppointment()
                : type == ETypeInfoDetail.SERVICE
                ? handleSaveService()
                : '';
            }}
          >
            {isSave ? (
              <LoadingSpinner size={24} color="white" />
            ) : (
              <span className="flex justify-center items-center">
                <FontAwesomeIcon className="mr-3" icon={faFloppyDisk} /> Lưu
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-grow pt-2 overflow-hidden">
        <div className="p-2 flex flex-1 flex-col rounded-xl border border-slate-400 overflow-y-auto scrollbar-thin">
          {type == ETypeInfoDetail.BRANCH ? (
            <>
              {/* hàng 1 */}
              <div className="flex w-full h-fit mt-5">
                <div className="flex flex-col w-1/2  pl-16 pr-4">
                  <label className="font-semibold text-base pl-1">{'ID'}</label>
                  <TextInput
                    disabled
                    value={dataBranch?.id.toString() ?? ''}
                    type="text"
                    title="ID"
                    placeholder={'ID'}
                    className="h-8"
                  />
                </div>
                <div className="flex flex-col w-1/2 pr-16 pl-4">
                  <label className="font-semibold text-base pl-1">{'Trạng thái'}</label>
                  {/*     true là đang hoạt động, false OFFF */}
                  <select
                    title="Trạng thái"
                    className={`${
                      dataBranch?.status == false ? 'bg-yellow-200' : dataBranch?.status == true ? 'bg-green-400' : 'bg-red-400'
                    } rounded-lg p-1 mx-1 mt-1`}
                    defaultValue={dataBranch?.status == true ? 0 : 1}
                    onChange={(event) => setDataBranch({...dataBranch, status: Number(event.target.value) == 0 ? true : false})}
                    disabled={!isEdit}
                  >
                    <option value="0">Đang hoạt động</option>
                    <option value="1">OFF</option>
                  </select>
                </div>
              </div>

              {/* hàng 2 */}
              <div className="flex w-full h-fit mt-8">
                <div className="flex flex-col w-1/2  pl-16 pr-4">
                  <label className="font-semibold text-base pl-1">{'Tên chi nhánh'}</label>
                  <TextInput
                    changeText={(text) => setDataBranch({...dataBranch, name: text})}
                    disabled={!isEdit}
                    value={dataBranch?.name ?? ''}
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
                    value={dataBranch?.phone ?? ''}
                    type="text"
                    title="Số điện thoại"
                    placeholder={'Số điện thoại'}
                    className="h-8"
                  />
                </div>
              </div>

              {/* hàng 3 */}
              <div className="flex w-full h-fit mt-8">
                <div className="flex flex-col w-1/2  pl-16 pr-4">
                  <label className="font-semibold text-base pl-1">{'Email'}</label>
                  <TextInput
                    changeText={(text) => setDataBranch({...dataBranch, email: text})}
                    disabled={!isEdit}
                    value={dataBranch?.email ?? ''}
                    type="text"
                    title="Email"
                    placeholder={'Email'}
                    className="h-8"
                  />
                </div>
                <div className="flex flex-col w-1/2 pr-16 pl-4">
                  <label className="font-semibold text-base pl-1">{'Địa chỉ'}</label>
                  <TextArea
                    title="Địa chỉ"
                    disabled={!isEdit}
                    placeholder="Địa chỉ"
                    value={dataBranch?.address ?? ''}
                    className="focus:outline-none resize-none"
                    changeText={(text) => setDataBranch({...dataBranch, address: text})}
                  />
                </div>
              </div>

              {/* hàng 4 */}
              <div className="flex w-full h-fit mt-8">
                <div className="flex flex-col w-1/2 pl-16 pr-4">
                  <label className="font-semibold text-base pl-1">{'Ngày cập nhật'}</label>
                  <TextInput
                    disabled
                    value={dataBranch?.updatedAt}
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
                    value={dataBranch?.createdAt}
                    type="text"
                    title="Ngày tạo"
                    placeholder={'Ngày tạo'}
                    className="h-8"
                  />
                </div>
              </div>
            </>
          ) : type == ETypeInfoDetail.APPOINTMENT ? (
            <>
              {/* hàng 1 */}
              <div className="flex w-full h-fit mt-5">
                <div className="flex flex-col w-1/2  pl-16 pr-4">
                  <label className="font-semibold text-base pl-1">{'ID'}</label>
                  <TextInput disabled value={dataAppointment?.code} type="text" title="ID" placeholder={'ID'} className="h-8 " />
                </div>
                <div className="flex flex-col w-1/2 pr-16 pl-4">
                  <label className="font-semibold text-base pl-1">{'Trạng thái'}</label>
                  {/* 0 MỚi, 1 Đã xác nhận, 2 Hủy */}
                  <select
                    title="Trạng thái"
                    className={`${
                      dataAppointment?.status == 0
                        ? 'bg-yellow-200'
                        : dataAppointment?.status == 1
                        ? 'bg-green-400'
                        : 'bg-red-400'
                    } rounded-xl p-1 mx-1 mt-1 focus:ring-blue-500 border border-slate-300 hover:border-blue-500`}
                    defaultValue={dataAppointment?.status ?? 0}
                    onChange={(event) => setDataAppointment({...dataAppointment, status: Number(event.target.value)})}
                    disabled={!isEdit}
                  >
                    <option value="0">Mới</option>
                    <option value="1">Đã xác nhận</option>
                    <option value="2">Hủy</option>
                  </select>
                </div>
              </div>

              {/* hàng 2 */}
              <div className="flex w-full h-fit mt-8">
                <div className="flex flex-col w-1/2  pl-16 pr-4">
                  <label className="font-semibold text-base pl-1">{'Khách hàng'}</label>
                  <TextInput
                    // changeText={(text) => setDataBranch({...dataBranch, name: text})}
                    // disabled={!isEdit}
                    disabled
                    value={dataAppointment?.customerName}
                    type="text"
                    title="Tên khách hàng"
                    placeholder={'Tên khách hàng'}
                    className="h-8"
                  />
                </div>
                <div className="flex flex-col w-1/2 pr-16 pl-4">
                  <label className="font-semibold text-base pl-1">{'Số điện thoại'}</label>
                  <TextInput
                    changeText={(text) => {}}
                    // disabled={!isEdit}
                    disabled
                    value={'đang trống'}
                    type="text"
                    title="Số điện thoại"
                    placeholder={'Số điện thoại'}
                    className="h-8"
                  />
                </div>
              </div>

              {/* hàng 3 */}
              <div className="flex w-full h-fit mt-8">
                <div className="flex flex-col w-1/2  pl-16 pr-4">
                  <label className="font-semibold ml-1">Dịch vụ</label>
                  <select
                    title="Chọn dịch vụ"
                    className="rounded-xl p-1 mx-1 mt-1 focus:ring-blue-500 border border-slate-300 hover:border-blue-500"
                    disabled={!isEdit}
                    value={dataAppointment.serviceId ?? 1}
                    onChange={(e) => {
                      setDataAppointment((prevState) => ({
                        ...prevState,
                        serviceId: Number(e.target.value),
                      }));
                    }}
                  >
                    <option value="">---Chọn dịch vụ--- </option>
                    {dataChooseServices?.map((item, index) => {
                      return (
                        <option key={index} value={item.id}>
                          {item.value}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="flex flex-col w-1/2 pr-16 pl-4">
                  <label className="font-semibold text-base pl-1">{'Nhân viên'}</label>
                  <TextInput
                    changeText={(text) => {}}
                    // disabled={!isEdit}
                    disabled
                    value={dataAppointment?.employeeName ?? ''}
                    type="text"
                    title="Tên nhân viên"
                    placeholder={'Tên nhân viên'}
                    className="h-8"
                  />
                </div>
              </div>

              {/* hàng 4 */}
              <div className="flex w-full h-fit mt-8">
                <div className="flex flex-col w-1/2 pl-16 pr-4">
                  <div className="flex flex-col relative">
                    <label className="font-semibold text-base pl-1">{'Ngày giờ hẹn'}</label>
                    <div
                      className={`flex ${
                        isEdit ? '' : 'bg-slate-300'
                      } items-center h-8 rounded-xl bg-white pl-3 m-1 relative border border-slate-300 hover:border-blue-500 focus:ring-blue-500`}
                      onClick={() => handleChooseDateTime()}
                    >
                      <p className="">
                        {isEqual(selectedTime, '2000-01-01 00:00') ? 'Chọn thời gian' : format(selectedTime, 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                    {isShowModalChooseTime && isEdit && (
                      <ChooseDateTime onClose={handleChooseDateTime} nowDate={new Date()} onChooseTime={setSelectedTime} />
                    )}
                  </div>
                </div>
                <div className="flex flex-col w-1/2  pr-16 pl-4">
                  <label className="font-semibold text-base pl-1">{'Nhắc nhở'}</label>
                  <select
                    title="Nhắc nhở"
                    className="rounded-xl p-1 mx-1 mt-1 focus:ring-blue-500 border border-slate-300 hover:border-blue-500"
                    disabled={!isEdit}
                    value={dataAppointment.reminderSent == true ? 0 : 1}
                    onChange={(e) => {
                      setDataAppointment((prevState) => ({
                        ...prevState,
                        reminderSent: Number(e.target.value) == 0 ? true : false,
                      }));
                    }}
                  >
                    <option value="">---Nhắc nhở--- </option>
                    <option value="0">Có</option>
                    <option value="1">Không</option>
                  </select>
                </div>
              </div>

              {/* hàng 5*/}
              <div className="flex w-full h-fit mt-8">
                <div className="flex flex-col w-1/2 pl-16 pr-4">
                  <label className="font-semibold text-base pl-1">{'Chi nhánh'}</label>
                  <select
                    title="Chọn chi nhánh"
                    className="rounded-xl p-1 mx-1 mt-1 focus:ring-blue-500 border border-slate-300 hover:border-blue-500"
                    disabled={!isEdit}
                    value={dataAppointment.branchId ?? ''}
                    onChange={(e) => {
                      setDataAppointment((prevState) => ({
                        ...prevState,
                        branchId: Number(e.target.value),
                      }));
                    }}
                  >
                    <option value="">---Chọn chi nhánh--- </option>
                    {dataChooseBranchs?.map((item, index) => {
                      return (
                        <option key={index} value={item.id}>
                          {item.value}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="flex flex-col w-1/2 pr-16 pl-4">
                  <label className="font-semibold text-base pl-1">{'Ghi chú'}</label>
                  <TextArea
                    title="Ghi chú"
                    disabled={!isEdit}
                    placeholder="Ghi chú"
                    value={dataAppointment?.note ?? ''}
                    className="focus:outline-none h-28 resize-none scrollbar-thin"
                    changeText={(text) => setDataAppointment({...dataAppointment, note: text})}
                  />
                </div>
              </div>

              {/* hàng 6*/}
              {/* <div className="flex w-full h-fit my-8">
                <div className="flex flex-col w-1/2 pl-16 pr-4">
                  <label className="font-semibold text-base pl-1">{'Ngày cập nhật'}</label>
                  <TextInput
                    disabled
                    value={dataAppointment?.updatedAt}
                    type="text"
                    title="Ngày đặt lịch"
                    placeholder={'Ngày đặt lịch'}
                    className="h-8"
                  />
                </div>
                <div className="flex flex-col w-1/2  pr-16 pl-4">
                  <label className="font-semibold text-base pl-1">{'Ngày đặt lịch'}</label>
                  <TextInput
                    disabled
                    value={dataAppointment?.createdAt}
                    type="text"
                    title="Ngày đặt lịch"
                    placeholder={'Ngày đặt lịch'}
                    className="h-8"
                  />
                </div>
              </div> */}
            </>
          ) : type == ETypeInfoDetail.SERVICE ? (
            <>
              {/* hàng 1 */}
              <div className="flex w-full h-fit mt-5">
                <div className="flex flex-col w-1/2  pl-16 pr-4">
                  <label className="font-semibold text-base pl-1">{'ID'}</label>
                  <TextInput
                    disabled
                    value={dataService?.id.toString()}
                    type="text"
                    title="ID"
                    placeholder={'ID'}
                    className="h-8 "
                  />
                </div>
                <div className="flex flex-col w-1/2 pr-16 pl-4">
                  <label className="font-semibold text-base pl-1">{'Trạng thái'}</label>
                  {/*     // 1 Tạm dừng, 0 là Đang hoạt động*/}
                  <select
                    title="Trạng thái"
                    className={`${
                      dataService?.status == true ? 'bg-green-400' : dataService?.status == false ? 'bg-yellow-200' : ''
                    } rounded-lg p-1 mx-1 mt-1`}
                    defaultValue={dataService?.status == true ? 1 : 0}
                    onChange={(event) => setDataService({...dataService, status: Number(event.target.value) == 1 ? true : false})}
                    disabled={!isEdit}
                  >
                    <option value="0">Tạm dừng</option>
                    <option value="1">Đang hoạt động</option>
                  </select>
                </div>
              </div>

              {/* hàng 2 */}
              <div className="flex w-full h-fit mt-5">
                <div className="flex flex-col w-1/2 pl-16 pr-4">
                  <label className="font-semibold text-base pl-1">{'Tên dịch vụ'}</label>
                  <TextInput
                    disabled={!isEdit}
                    value={dataService?.name}
                    type="text"
                    title="Tên dịch vụ"
                    placeholder={'Tên dịch vụ'}
                    className="h-8 "
                    changeText={(text) => setDataService({...dataService, name: text})}
                  />
                </div>
                <div className="flex flex-col w-1/2  pr-16 pl-4">
                  <label className="font-semibold text-base pl-1">{'Giá dịch vụ'}</label>
                  <TextInput
                    changeText={(text) => setDataService({...dataService, price: text})}
                    disabled={!isEdit}
                    value={dataService?.price.toString()}
                    type="number"
                    title="Giá dịch vụ"
                    placeholder={'Giá dịch vụ'}
                    className="h-8 "
                  />
                </div>
              </div>

              {/* hàng 3 */}
              <div className="flex w-full h-fit mt-5">
                <div className="flex flex-col w-1/2 pl-16 pr-4">
                  <label className="font-semibold text-base pl-1">{'Tổng liệu trình'}</label>
                  <TextInput
                    changeText={(text) => setDataService({...dataService, totalSessions: Number(text)})}
                    value={dataService?.totalSessions.toString()}
                    type="number"
                    title="Tổng liệu trình"
                    placeholder={'Tổng liệu trình'}
                    className="h-8"
                    disabled={!isEdit}
                  />
                </div>
                <div className="flex flex-col w-1/2  pr-16 pl-4">
                  <label className="font-semibold text-base pl-1">{'Chi nhánh'}</label>
                  <select
                    title="Chi nhánh"
                    className={`rounded-lg p-1 mx-1 mt-1`}
                    defaultValue={dataService?.branchId ?? 0}
                    // onChange={(event) => setDataBranch({...dataBranch, status: Number(event.target.value)})}
                    // disabled={!isEdit}
                    disabled
                  >
                    <option value="0">{dataService?.branchId ?? 0}</option>
                    <option value="1">{dataService?.branchId ?? 0}</option>
                  </select>
                </div>
              </div>

              {/* hàng 4 */}
              <div className="flex w-full h-fit mt-5">
                <div className="flex flex-col w-1/2 pl-16 pr-4">
                  <label className="font-semibold text-base pl-1">{'Gói dịch vụ'}</label>
                  {/* <select
                    title="Gói dịch vụ"
                    className={`rounded-lg p-1 mx-1 mt-1`}
                    defaultValue={dataService?.service_package_id ?? 0}
                    // onChange={(event) => setDataBranch({...dataBranch, status: Number(event.target.value)})}
                    // disabled={!isEdit}
                    disabled
                  >
                    <option value="0">{dataService?.service_package_id ?? 0}</option>
                    <option value="1">{dataService?.service_package_id ?? 0}</option>
                  </select> */}
                </div>
                <div className="flex flex-col w-1/2  pr-16 pl-4">
                  <label className="font-semibold text-base pl-1">{'Mô tả chi tiết'}</label>
                  <TextArea
                    title="Mô tả chi tiết"
                    disabled={!isEdit}
                    placeholder="Mô tả chi tiết"
                    value={dataService?.description}
                    className="focus:outline-none resize-none scrollbar-thin h-[140px]"
                    changeText={(text) => setDataService({...dataService, description: text})}
                  />
                </div>
              </div>

              {/* hàng 5 */}
              {/* <div className="flex w-full h-fit mt-5">
                <div className="flex flex-col w-full px-16">
                  <label className="font-semibold text-base pl-1">{'Mô tả chi tiết'}</label>
                  <TextArea
                    title="Mô tả chi tiết"
                    disabled={!isEdit}
                    placeholder="Mô tả chi tiết"
                    value={dataService?.description}
                    className="focus:outline-none resize-none scrollbar-thin"
                    changeText={(text) => setDataService({...dataService, description: text})}
                  />
                </div>
                <div className="flex flex-col w-1/2  pr-16 pl-4">
                  <label className="font-semibold text-base pl-1">{'Tổng liệu trình'}</label>
                  <TextInput
                    disabled
                    value={dataService?.total_sessions.toString()}
                    type="text"
                    title="Tổng liệu trình"
                    placeholder={'Tổng liệu trình'}
                    className="h-8"
                  />
                </div>
              </div> */}

              {/* hàng 6*/}
              <div className="flex w-full h-fit my-8">
                <div className="flex flex-col w-1/2 pl-16 pr-4">
                  <label className="font-semibold text-base pl-1">{'Ngày cập nhật'}</label>
                  <TextInput
                    disabled
                    value={dataService?.updatedAt}
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
                    value={dataService?.createdAt}
                    type="text"
                    title="Ngày tạo"
                    placeholder={'Ngày tạo'}
                    className="h-8"
                  />
                </div>
              </div>
            </>
          ) : type == ETypeInfoDetail.ORDER ? (
            <>
              <div className="flex w-full h-fit mt-5">
                <div className="flex flex-col w-1/2  pl-16 pr-4">
                  <label className="font-semibold text-base pl-1">{'ID'}</label>
                  <TextInput
                    disabled
                    value={`ORD00${dataOrder?.id.toString()}`}
                    type="text"
                    title="ID"
                    placeholder={'ID'}
                    className="h-8 "
                  />
                </div>
                <div className="flex flex-col w-1/2 pr-16 pl-4">
                  <label className="font-semibold text-base pl-1">{'Tổng tiền'}</label>
                  <TextInput
                    disabled
                    value={`${formatPrice(dataOrder?.totalAmount.toString())}`}
                    type="text"
                    title="ID"
                    placeholder={'ID'}
                    className="h-8 "
                  />
                </div>
              </div>

              <div className="flex w-full h-fit mt-5">
                <div className="flex flex-col w-1/2  pl-16 pr-4">
                  <label className="font-semibold text-base pl-1">{'Tên khách hàng'}</label>
                  <TextInput
                    disabled
                    value={`ORD00${dataOrder?.id.toString()}`}
                    type="text"
                    title="ID"
                    placeholder={'ID'}
                    className="h-8 "
                  />
                </div>
                <div className="flex w-1/2 flex-col pl-4 pr-16">
                  <label className="font-semibold text-base pl-1">{'Trạng thái'}</label>
                  {/*     // 1 Tạm dừng, 0 là Đang hoạt động*/}
                  <select
                    title="Trạng thái"
                    className={`${
                      dataOrder?.status == 0 ? 'bg-green-400' : dataOrder?.status == 1 ? 'bg-yellow-200' : ''
                    } rounded-lg p-1 mx-1 mt-1 focus:ring-blue-500 border border-slate-300 hover:border-blue-500`}
                    defaultValue={dataService?.status == true ? 1 : 0}
                    onChange={(event) => setDataService({...dataService, status: Number(event.target.value) == 1 ? true : false})}
                    disabled={!isEdit}
                  >
                    <option value="0">Chưa thanh toán</option>
                    <option value="1">Đã thanh toán</option>
                  </select>
                </div>
              </div>

              <div className="flex w-full h-fit mt-5">
                <div className="flex flex-col w-1/2  pl-16 pr-4">
                  <label className="font-semibold text-base pl-1">{'Tên nhân viên'}</label>
                  <TextInput
                    disabled={!isEdit}
                    value={`Nhân viên ${dataOrder?.customerId}`}
                    type="text"
                    title="Tên nhân viên"
                    placeholder={'Tên nhân viên'}
                    className="h-8 "
                  />

                  <div className="w-full mt-4">
                    <label className="font-semibold text-base pl-1">{'Ngày tạo đơn'}</label>
                    <TextInput
                      disabled
                      value={`${new Date(dataOrder?.createdAt).toLocaleDateString('vi-VN')} ${new Date(
                        dataOrder?.createdAt
                      ).toLocaleTimeString('vi-VN')}`}
                      type="text"
                      title="ID"
                      placeholder={'ID'}
                      className="h-8 "
                    />
                  </div>
                </div>

                <div className="flex flex-col w-1/2 pr-16 pl-4">
                  <label className="font-semibold text-base pl-1">{'Mô tả đơn hàng'}</label>
                  <TextArea
                    disabled={!isEdit}
                    value={`${dataOrder?.description ?? 'Không có'}`}
                    title="Mô tả đơn hàng"
                    placeholder={'Mô tả đơn hàng'}
                    className="focus:outline-none h-28 resize-none scrollbar-thin"
                  />
                </div>
              </div>

              {dataOrder.orderDetails.length > 0 && (
                <>
                  <div className="flex w-full h-fit mt-5">
                    <div className="flex flex-col w-1/2  pl-16 pr-4">
                      <label className="font-semibold text-base pl-1">{'Dịch vụ, sản phẩm: '}</label>
                    </div>
                  </div>
                  <div className="flex w-full h-fit mt-1">
                    <div className="flex flex-col w-full h-fit px-16">
                      <div className="w-full overflow-x-auto overflow-y-auto scrollbar-thin border box-border border-slate-400">
                        <table className="min-w-full table-fixed">
                          <thead className="bg-gray-200 sticky top-0 z-10">
                            <tr>
                              {/* <th></th> */}
                              <th className="border border-gray-300 p-1">ID</th>
                              <th className="border border-gray-300 p-1">Tên dịch vụ, sản phẩm</th>
                              <th className="border border-gray-300 p-1">Giá tiền</th>
                              <th className="border border-gray-300 p-1">Số lượng</th>
                              <th className="border border-gray-300 p-1">Tổng tiền</th>
                            </tr>
                          </thead>

                          <tbody>
                            {dataOrder.orderDetails.map((item: IOrderDetail, index) => {
                              return (
                                <tr
                                  key={index}
                                  className={`${
                                    4 % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                                  } border-b cursor-pointer hover:bg-slate-200 border-gray-300`}
                                >
                                  <td className="border border-gray-300 p-1">ODI0{item.id}</td>
                                  <td className="border border-gray-300 p-1">{item.serviceName}</td>
                                  <td className="border border-gray-300 p-1">
                                    <div className="flex justify-end">{formatPrice(item.price.toString())}</div>
                                  </td>
                                  <td className="border border-gray-300 p-1">
                                    <div className="flex justify-end">{item.quantity}</div>
                                  </td>
                                  <td className="border border-gray-300 p-1">
                                    <div className="flex justify-end">{formatPrice(item.totalAmount.toString())}</div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>

      {isReviewOrder && (
        <div className="fixed flex flex-col inset-0 w-screen h-screen justify-center items-center bg-black bg-opacity-60 z-40">
          <div className="flex w-[45%] p-3 h-[85%] bg-white rounded-md">
            <Bills onClosed={() => setIsReviewOrder(false)} ref={billsRef} data={dataOrder} />
          </div>
          <div className="flex w-[45%] mt-3 justify-end">
            <button className="flex px-4 py-1.5 rounded-lg bg-white mr-3 shadow-xl" onClick={() => setIsReviewOrder(false)}>
              <span className="flex justify-center items-center">
                <FontAwesomeIcon className="mr-3" icon={faXmark} /> Đóng
              </span>
            </button>

            <button className="flex px-4 py-1.5 rounded-lg bg-white shadow-xl" onClick={handleExportInvoice}>
              <span className="flex justify-center items-center">
                <FontAwesomeIcon className="mr-3" icon={faFilePdf} /> Xuất hóa đơn
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoDetail;
