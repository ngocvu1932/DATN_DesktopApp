import {faCalendarPlus, faFilter, faRotate, faXmark} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {useEffect, useState} from 'react';
import TextInput from '../text-input';
import {EFilterType} from './enum';
import useDebounce from '../../utils/useDebounce';

interface IFilterProps {
  clearFilter?: () => void;
  type?: EFilterType;
  toggleDrawer?: () => void;
  dataFilter?: any;
  setDataFilter?: (filteredData: any) => void;
}

const Filter: React.FC<IFilterProps> = ({clearFilter, toggleDrawer, dataFilter, setDataFilter, type}) => {
  const [isShowFilter, setIsShowFilter] = useState(false);
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

  const handleChange = (field: string, value: string) => {
    setTempFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value,
    }));
  };

  return (
    <div className="flex items-center border-y flex-grow border-slate-500 py-1">
      <div className="w-[70%] flex flex-col">
        <div className="flex">
          <TextInput changeText={(text) => handleChange('id', text)} className="h-8 w-36" placeholder="ID" title="ID" />
          {type == EFilterType.BRANCH && (
            <>
              <TextInput
                changeText={(text) => handleChange('name', text)}
                className="h-8 pr-6 w-44"
                placeholder="Tên chi nhánh"
                title="Tên chi nhánh"
              />
              <TextInput
                changeText={(text) => handleChange('address', text)}
                className="h-8 pr-6 w-52"
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
      <div className="w-[30%] flex justify-end self-start mt-[4px]">
        <div className="flex relative border border-white rounded-md">
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
        </div>

        <button
          className="border border-white bg-slate-300 hover:bg-slate-400 px-3.5 py-1 rounded-md mr-2 ml-2"
          onClick={toggleDrawer}
          title="Thêm chi nhánh"
        >
          <FontAwesomeIcon icon={faCalendarPlus} />
        </button>

        <button className="border border-white bg-slate-300 hover:bg-slate-400 px-3.5 py-1 rounded-md" title="Làm mới">
          <FontAwesomeIcon icon={faRotate} />
        </button>
      </div>
    </div>
  );
};

export default Filter;
