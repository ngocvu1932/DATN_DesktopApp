import {faArrowsUpDown, faCalendarPlus, faFilter, faRotate, faXmark} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {useEffect, useState} from 'react';
import TextInput from '../text-input';
import {EFilterType} from './enum';
import useDebounce from '../../utils/useDebounce';
import {ETypeAdd} from '../drawer/enum';
import {deleteAppointment, updateStatusAppointment} from '../../api/appointment';
import {deleteBranch, updateStatusBranch} from '../../api/branch';
import {deleteService, updateStatusService} from '../../api/services';

interface IFilterProps {
  clearFilter?: () => void;
  type?: EFilterType;
  toggleDrawer?: () => void;
  dataFilter?: any;
  dataAction?: any;
  setDataFilter?: (filteredData: any) => void;
  setDataAction?: (dataAction: any) => void;
  reloadData?: () => void;
  showToast?: (message: string, type: string) => void;
  setLoader?: (isLoading: boolean) => void;
}

interface IUpdateAppointmentStatus {
  id: number;
  status: number;
}

const Filter: React.FC<IFilterProps> = ({
  clearFilter,
  toggleDrawer,
  dataFilter,
  setDataFilter,
  type,
  dataAction,
  setDataAction,
  reloadData,
  showToast,
  setLoader,
}) => {
  const [isShowActions, setIsShowActions] = useState(false);
  const [filter, setFilter] = useState({
    id: '',
    name: '',
    address: '',
    phone: '',
    email: '',
    status: '',

    service_name: '',
    employee_name: '',
    reminder: '',
    note: '',
    day: '',
    time: '',

    price: '',
    description: '',
  });

  const [tempFilter, setTempFilter] = useState(filter);
  const debouncedFilter = useDebounce(tempFilter, 600);

  useEffect(() => {
    setFilter(debouncedFilter);
  }, [debouncedFilter]);

  useEffect(() => {
    let filteredData = [];
    if (type == EFilterType.BRANCH) {
      filteredData = dataFilter.filter((item: any) => {
        let itemStatus = item.status === 1 ? 'Đang hoạt động' : 'OFF';
        return (
          (filter.id ? item.id === Number(filter.id) : true) &&
          (filter.name ? item.name.toLowerCase().includes(filter.name.toLowerCase()) : true) &&
          (filter.address ? item.address.toLowerCase().includes(filter.address.toLowerCase()) : true) &&
          (filter.phone ? item.phone.includes(filter.phone) : true) &&
          (filter.email ? item.email.toLowerCase().includes(filter.email.toLowerCase()) : true) &&
          (filter.status ? itemStatus.toLowerCase().includes(filter.status.toLowerCase()) : true)
        );
      });
    } else if (type == EFilterType.APPOINTMENT) {
      filteredData = dataFilter.filter((item: any) => {
        let itemStatus = item.status === 1 ? 'Mới' : 'Đã xác nhận';
        let note = !item.note ? '' : item.note;

        return (
          (filter.id ? item.id === Number(filter.id) : true) &&
          // (filter.name ? item.customer_id.toString().toLowerCase().includes(filter.name.toLowerCase()) : true) &&
          // (filter.service_name
          //   ? item.service_id.toString().toLowerCase().includes(filter.service_name.toLowerCase())
          //   : true) &&
          // (filter.employee_name ? item.employee_id.toString().includes(filter.employee_name) : true) &&
          (filter.day ? item.time.toLowerCase().includes(filter.day.toLowerCase()) : true) &&
          (filter.time ? item.time.toLowerCase().includes(filter.time.toLowerCase()) : true) &&
          (filter.reminder
            ? item.reminder_sent.toString().toLowerCase().includes(filter.reminder.toLowerCase())
            : true) &&
          (filter.note ? note.toLowerCase().includes(filter.note.toLowerCase()) : true) &&
          (filter.status ? itemStatus.toLowerCase().includes(filter.status.toLowerCase()) : true)
        );
      });
    } else if (type == EFilterType.SERVICE) {
      filteredData = dataFilter.filter((item: any) => {
        return (
          (filter.id ? item.id === Number(filter.id) : true) &&
          (filter.name ? item.name.toString().toLowerCase().includes(filter.name.toLowerCase()) : true) &&
          (filter.day ? item.updated_at.toLowerCase().includes(filter.day.toLowerCase()) : true) &&
          (filter.price ? item.price.toLowerCase().includes(filter.price.toLowerCase()) : true) &&
          (filter.description
            ? item.description.toString().toLowerCase().includes(filter.description.toLowerCase())
            : true)
        );
      });
    }

    if (setDataFilter) {
      setDataFilter(filteredData);
    }
  }, [filter]);

  useEffect(() => {
    if (dataAction?.length <= 0) {
      setIsShowActions(false);
    }
  }, [dataAction]);

  const handleChangeAppointments = async (type: string) => {
    // 1 là mới, 0 là đã xác nhận
    setLoader && setLoader(true);

    const newStatus = type === 'Submit' ? 0 : 1;
    const currentStatus = type === 'Submit' ? 1 : 0;

    const selectedAppointments = dataAction
      .filter((item: any) => item.status === currentStatus)
      .map((item: any) => ({id: item.id, status: item.status}));

    if (selectedAppointments.length <= 0) {
      showToast &&
        showToast(
          type === 'Submit'
            ? 'Lịch hẹn chọn đang trong trạng thái xác nhận!'
            : 'Lịch hẹn chọn đang trong trạng thái hủy!',
          'warning'
        );
      setLoader && setLoader(false);
      return;
    }

    try {
      const promises = selectedAppointments.map((element: IUpdateAppointmentStatus) =>
        updateStatusAppointment(element.id, {status: newStatus})
      );

      const results = await Promise.all(promises);
      const allSuccess = results.every((res) => res?.statusCode === 200);

      if (allSuccess) {
        setDataAction && setDataAction([]);
        reloadData && reloadData();
        showToast && showToast(type === 'Submit' ? 'Xác nhận thành công!' : 'Hủy thành công!', 'success');
      } else {
        showToast && showToast('Có lỗi xảy ra!', 'error');
      }
    } catch (error) {
      showToast && showToast('Có lỗi xảy ra trong quá trình xử lý!', 'error');
      console.error(error);
    } finally {
      setLoader && setLoader(false);
    }
  };

  const handleChangeBranch = async (type: string) => {
    // 1 là OFF, 0 là đang hoạt động
    setLoader && setLoader(true);

    const newStatus = type === 'Submit' ? 0 : 1;
    const currentStatus = type === 'Submit' ? 1 : 0;

    const selectedBranches = dataAction
      .filter((item: any) => item.status === currentStatus)
      .map((item: any) => ({id: item.id, status: item.status}));

    if (selectedBranches.length <= 0) {
      showToast &&
        showToast(
          type === 'Submit'
            ? 'Chi nhánh chọn đang trong trạng thái xác nhận!'
            : 'Chi nhánh chọn đang trong trạng thái hủy!',
          'warning'
        );
      setLoader && setLoader(false);
      return;
    }

    try {
      const promises = selectedBranches.map((element: IUpdateAppointmentStatus) =>
        updateStatusBranch(element.id, {status: newStatus})
      );

      const results = await Promise.all(promises);
      const allSuccess = results.every((res) => res?.statusCode === 200);

      if (allSuccess) {
        setDataAction && setDataAction([]);
        reloadData && reloadData();
        showToast && showToast(type === 'Submit' ? 'Xác nhận thành công!' : 'Hủy thành công!', 'success');
      } else {
        showToast && showToast('Có lỗi xảy ra!', 'error');
      }
    } catch (error) {
      showToast && showToast('Có lỗi xảy ra trong quá trình xử lý!', 'error');
      console.error(error);
    } finally {
      setLoader && setLoader(false);
    }
  };

  const handleChangeService = async (type: string) => {
    // 1 Tạm dừng, 0 là Đang hoạt động
    setLoader && setLoader(true);

    const newStatus = type === 'Submit' ? 0 : 1;
    const currentStatus = type === 'Submit' ? 1 : 0;

    const selectedServices = dataAction
      .filter((item: any) => item.status === currentStatus)
      .map((item: any) => ({id: item.id, status: item.status}));

    if (selectedServices.length <= 0) {
      showToast &&
        showToast(
          type === 'Submit'
            ? 'Dịch vụ chọn đang trong trạng thái hoạt động!'
            : 'Dịch vụ chọn đang trong trạng thái tạm dừng!',
          'warning'
        );
      setLoader && setLoader(false);
      return;
    }

    try {
      const promises = selectedServices.map((element: IUpdateAppointmentStatus) =>
        updateStatusService(element.id, {status: newStatus})
      );

      const results = await Promise.all(promises);
      const allSuccess = results.every((res) => res?.statusCode === 200);

      if (allSuccess) {
        setDataAction && setDataAction([]);
        reloadData && reloadData();
        showToast && showToast(type === 'Submit' ? 'Xác nhận thành công!' : 'Hủy thành công!', 'success');
      } else {
        showToast && showToast('Có lỗi xảy ra!', 'error');
      }
    } catch (error) {
      showToast && showToast('Có lỗi xảy ra trong quá trình xử lý!', 'error');
      console.error(error);
    } finally {
      setLoader && setLoader(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setTempFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value,
    }));
  };

  const handleDelete = async (type: EFilterType) => {
    const selectedData = dataAction.map((item: any) => ({id: item.id}));
    console.log('selectedData', selectedData);
    console.log('type', type);

    setLoader && setLoader(false);
    const promises = selectedData.map((element: IUpdateAppointmentStatus) => {
      if (type === EFilterType.SERVICE) {
        return deleteService(element.id);
      } else if (type === EFilterType.APPOINTMENT) {
        return deleteAppointment(element.id);
      } else if (type === EFilterType.BRANCH) {
        return deleteBranch(element.id);
      } else {
        return Promise.reject(new Error('Invalid filter type'));
      }
    });

    try {
      const results = await Promise.all(promises);
      const allSuccess = results.every((res) => res?.statusCode === 200);

      console.log('results', results);

      if (allSuccess) {
        setDataAction && setDataAction([]);
        reloadData && reloadData();

        showToast && showToast('Xóa thành công!', 'success');
      } else {
        showToast && showToast('Có lỗi xảy ra!', 'error');
        setDataAction && setDataAction([]);
      }
    } catch (error) {
      console.error('Error deleting:', error);
      showToast && showToast('Có lỗi xảy ra!', 'error');
      setDataAction && setDataAction([]);
    }
  };

  return (
    <div className="flex items-center flex-grow py-1">
      <div className="w-[70%] flex flex-col">
        <div className="flex">
          <TextInput changeText={(text) => handleChange('id', text)} className="h-8 w-36" placeholder="ID" title="ID" />
          {type == EFilterType.BRANCH && (
            <>
              <TextInput
                changeText={(text) => handleChange('name', text)}
                className="h-8 w-44"
                placeholder="Tên chi nhánh"
                title="Tên chi nhánh"
              />
              <TextInput
                changeText={(text) => handleChange('address', text)}
                className="h-8 w-52"
                placeholder="Địa chỉ"
                title="Địa chỉ"
              />
              <TextInput
                changeText={(text) => handleChange('phone', text)}
                className="h-8 w-40"
                placeholder="Số điện thoại"
                title="Số điện thoại"
              />
            </>
          )}

          {type == EFilterType.APPOINTMENT && (
            <>
              <TextInput
                changeText={(text) => handleChange('name', text)}
                className="h-8 w-44"
                placeholder="Tên khách hàng"
                title="Tên khách hàng"
              />
              <TextInput
                changeText={(text) => handleChange('service_name', text)}
                className="h-8 w-44"
                placeholder="Tên dịch vụ"
                title="Tên dịch vụ"
              />
              <TextInput
                changeText={(text) => handleChange('employee_name', text)}
                className="h-8 w-44"
                placeholder="Tên nhân viên"
                title="Tên nhân viên"
              />
              <TextInput
                changeText={(text) => handleChange('status', text)}
                className="h-8"
                placeholder="Trạng thái"
                title="Trạng thái"
              />
            </>
          )}

          {type == EFilterType.SERVICE && (
            <>
              <TextInput
                changeText={(text) => handleChange('name', text)}
                className="h-8 w-44"
                placeholder="Tên dịch vụ"
                title="Tên dịch vụ"
              />
              <TextInput
                title="Ngày tạo"
                changeText={(text) => handleChange('day', text)}
                className="h-8 w-44"
                placeholder="Ngày tạo"
              />
              <TextInput
                changeText={(text) => handleChange('price', text)}
                className="h-8 w-44"
                placeholder="Giá tiền"
                title="Giá tiền"
              />
            </>
          )}
        </div>
        <div className="flex">
          {type == EFilterType.BRANCH && (
            <>
              <TextInput
                changeText={(text) => handleChange('email', text)}
                className="h-8"
                placeholder="Email"
                title="Email"
              />
              <TextInput
                changeText={(text) => handleChange('status', text)}
                className="h-8"
                placeholder="Trạng thái"
                title="Trạng thái"
              />
            </>
          )}
          {type == EFilterType.APPOINTMENT && (
            <>
              <TextInput
                changeText={(text) => handleChange('day', text)}
                className="h-8 w-44"
                placeholder="Ngày"
                title="Ngày"
              />
              <TextInput
                changeText={(text) => handleChange('time', text)}
                className="h-8"
                placeholder="Giờ"
                title="Giờ"
              />
              <TextInput
                changeText={(text) => handleChange('reminder', text)}
                className="h-8"
                placeholder="Nhắc hẹn"
                title="Nhắc hẹn"
              />
              <TextInput
                changeText={(text) => handleChange('note', text)}
                className="h-8"
                placeholder="Ghi chú"
                title="Ghi chú"
              />
            </>
          )}

          {type == EFilterType.SERVICE && (
            <>
              <TextInput
                changeText={(text) => handleChange('description', text)}
                className="h-8"
                placeholder="Mô tả"
                title="Mô tả"
              />
            </>
          )}
        </div>
      </div>

      <div className="w-[30%] flex justify-end self-start mt-[4px] ">
        {/* <div className="flex relative border border-white rounded-md">
          <div
            className="flex items-center cursor-pointer px-3 rounded-l-md py-1 bg-slate-300 hover:bg-slate-400"
            onClick={() => setIsShowFilter(!isShowFilter)}
          >
            <FontAwesomeIcon icon={faFilter} />
            <p className="ml-3">Lọc</p>
          </div>

          <div
            onClick={clearFilter}
            className="flex items-center cursor-pointer justify-center rounded-r-md border-l border-slate-400 px-2 py-1 bg-slate-300 hover:bg-slate-400"
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>
          {isShowFilter && <div className="flex bg-red-500 absolute top-8 right-0">ádasdasd</div>}
        </div> */}

        <button
          className="border border-white  text-white bg-slate-500 hover:bg-slate-800 px-3.5 py-1 mr-2 rounded-md"
          title="Làm mới"
          onClick={() => reloadData && reloadData()}
        >
          <FontAwesomeIcon icon={faRotate} />
        </button>

        {dataAction?.length > 0 ? (
          <div className="relative inline-block text-left">
            <button
              title="Hành động"
              type="button"
              onClick={() => setIsShowActions(!isShowActions)}
              className={`${
                isShowActions ? 'bg-slate-800' : 'bg-slate-500'
              } inline-flex justify-center items-center w-full text-white rounded-md border border-white shadow-sm px-3.5 py-1 hover:bg-slate-800 focus:outline-none`}
            >
              Hành động &nbsp; <FontAwesomeIcon icon={faArrowsUpDown} />
            </button>

            {isShowActions && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                <div className="py-1">
                  {/* <div className="block px-4 mx-1 rounded-md cursor-pointer py-2 text-base text-gray-700 hover:bg-gray-200">
                    Sửa
                  </div> */}
                  {type == EFilterType.APPOINTMENT && (
                    <>
                      <div
                        className="block px-4 mx-1 rounded-md  cursor-pointer py-2 text-base text-gray-700 hover:bg-gray-200 "
                        onClick={() => {
                          handleChangeAppointments('Submit');
                        }}
                      >
                        Xác nhận lịch hẹn
                      </div>

                      <div
                        className="block px-4 mx-1 rounded-md  cursor-pointer py-2 text-base text-gray-700 hover:bg-gray-200"
                        onClick={() => {
                          handleChangeAppointments('Cancel');
                        }}
                      >
                        Hủy lịch hẹn
                      </div>
                    </>
                  )}

                  {type == EFilterType.BRANCH && (
                    <>
                      <div
                        className="block px-4 mx-1 rounded-md  cursor-pointer py-2 text-base text-gray-700 hover:bg-gray-200 "
                        onClick={() => {
                          handleChangeBranch('Submit');
                        }}
                      >
                        Xác nhận chi nhánh
                      </div>

                      <div
                        className="block px-4 mx-1 rounded-md  cursor-pointer py-2 text-base text-gray-700 hover:bg-gray-200"
                        onClick={() => {
                          handleChangeBranch('Cancel');
                        }}
                      >
                        Hủy chi nhánh
                      </div>
                    </>
                  )}

                  {type == EFilterType.SERVICE && (
                    <>
                      <div
                        className="block px-4 mx-1 rounded-md  cursor-pointer py-2 text-base text-gray-700 hover:bg-gray-200 "
                        onClick={() => {
                          handleChangeService('Submit');
                        }}
                      >
                        Xác nhận dịch vụ
                      </div>

                      <div
                        className="block px-4 mx-1 rounded-md  cursor-pointer py-2 text-base text-gray-700 hover:bg-gray-200"
                        onClick={() => {
                          handleChangeService('Cancel');
                        }}
                      >
                        Tạm dừng dịch vụ
                      </div>
                    </>
                  )}

                  <div
                    onClick={() => {
                      type == EFilterType.SERVICE
                        ? handleDelete(EFilterType.SERVICE)
                        : type == EFilterType.APPOINTMENT
                        ? handleDelete(EFilterType.APPOINTMENT)
                        : handleDelete(EFilterType.BRANCH);
                    }}
                    className="block px-4 mx-1 rounded-md  py-2 text-base cursor-pointer text-gray-700 hover:bg-gray-200 hover:text-red-500"
                  >
                    Xóa
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              className="border border-white text-white bg-slate-500 hover:bg-slate-800 px-3.5 py-1 rounded-md"
              onClick={toggleDrawer}
              title={`${
                type === EFilterType.SERVICE
                  ? 'Thêm dịch vụ'
                  : type === EFilterType.CUSTOMER
                  ? 'Thêm khách hàng'
                  : type === EFilterType.BRANCH
                  ? 'Thêm chi nhánh'
                  : 'Thêm lịch hẹn'
              }`}
            >
              {type === EFilterType.SERVICE
                ? 'Thêm dịch vụ'
                : type === EFilterType.CUSTOMER
                ? 'Thêm khách hàng'
                : type === EFilterType.BRANCH
                ? 'Thêm chi nhánh'
                : 'Thêm lịch hẹn'}{' '}
              &nbsp; <FontAwesomeIcon icon={faCalendarPlus} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Filter;
