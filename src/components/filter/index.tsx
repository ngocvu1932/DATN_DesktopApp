import {faArrowsUpDown, faCalendarPlus, faFilter, faRotate, faXmark} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {useEffect, useState} from 'react';
import TextInput from '../text-input';
import {EFilterType} from './enum';
import useDebounce from '../../utils/useDebounce';
import {ETypeAdd} from '../drawer/enum';
import {updateStatusAppointment} from '../../api/appointment';
import {updateStatusBranch} from '../../api/branch';

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
    const selectedAppointments = dataAction
      .filter((item: any) => item.status == Number(`${type === 'Submit' ? 1 : 0}`))
      .map((item: any) => ({id: item.id, status: item.status}));

    if (selectedAppointments.length <= 0) {
      type === 'Submit'
        ? showToast && showToast('Lịch hẹn chọn đang trong trạng thái xác nhận!', 'warning')
        : showToast && showToast('Lịch hẹn chọn đang trong trạng thái hủy!', 'warning');
    } else {
      let flag = true;
      const promises = selectedAppointments.map((element: IUpdateAppointmentStatus) =>
        updateStatusAppointment(element.id, {status: Number(`${type === 'Submit' ? 0 : 1}`)})
      );

      const results = await Promise.all(promises);
      const allSuccess = results.every((res) => res?.statusCode === 200);

      if (!allSuccess) {
        flag = false;
      }

      if (flag) {
        setDataAction && setDataAction([]);
        reloadData && reloadData();
        type === 'Submit'
          ? showToast && showToast('Xác nhận thành công!', 'success')
          : showToast && showToast('Hủy thành công!', 'success');
      } else {
        showToast && showToast('Có lỗi xảy ra!', 'error');
      }
    }
  };

  const handleChangeBranch = async (type: string) => {
    // 1 là off, 0 là  đang hoạt động
    const selectedBranchs = dataAction
      .filter((item: any) => item.status == Number(`${type === 'Submit' ? 1 : 0}`))
      .map((item: any) => ({id: item.id, status: item.status}));

    console.log('selectedBranchs', selectedBranchs);

    if (selectedBranchs.length <= 0) {
      type === 'Submit'
        ? showToast && showToast('Chi nhánh chọn đang trong trạng thái xác nhận!', 'warning')
        : showToast && showToast('Chi nhánh chọn đang trong trạng thái hủy!', 'warning');
    } else {
      let flag = true;
      const promises = selectedBranchs.map((element: IUpdateAppointmentStatus) =>
        updateStatusBranch(element.id, {status: Number(`${type === 'Submit' ? 0 : 1}`)})
      );

      const results = await Promise.all(promises);
      const allSuccess = results.every((res) => res?.statusCode === 200);
      // const allSuccess = results.every((res) => console.log('res', res));

      if (!allSuccess) {
        flag = false;
      }

      if (flag) {
        setDataAction && setDataAction([]);
        reloadData && reloadData();
        type === 'Submit'
          ? showToast && showToast('Xác nhận thành công!', 'success')
          : showToast && showToast('Hủy thành công!', 'success');
      } else {
        showToast && showToast('Có lỗi xảy ra!', 'error');
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setTempFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value,
    }));
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
              } inline-flex justify-center items-center w-full text-white rounded-md border border-white shadow-sm px-3.5 py-1  hover:bg-slate-800   focus:outline-none`}
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
                  <div className="block px-4 mx-1 rounded-md  py-2 text-base cursor-pointer text-gray-700 hover:bg-gray-200 hover:text-red-500">
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
