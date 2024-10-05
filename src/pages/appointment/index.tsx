import React, {useEffect, useState} from 'react';
import {appointment, updateStatusAppointment} from '../../api/appointment';
import {IAppointment} from '../../models/appointment';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faAngleRight,
  faArrowLeft,
  faBars,
  faCalendarPlus,
  faMagnifyingGlass,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import {toast, ToastContainer} from 'react-toastify';
import LoadingSpinner from '../../components/loading-spinner';
import {useDispatch, useSelector} from 'react-redux';
import {setWidth} from '../../redux/slices/sideBarWidthSlice';
import SwitchSideBar from '../../components/switch-sidebar';
import TextInput from '../../components/text-input';
import Drawer from '../../components/drawer';
import {getFormattedDate, getFormattedTime} from '../../utils/dateTime';
import {ETypeAdd} from '../../components/drawer/enum';

const Appointment: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRes, setCurrentPageRes] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [editStatuses, setEditStatuses] = useState<{[key: number]: boolean}>({}); // Lưu trạng thái chỉnh sửa cho từng hàng
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const dispatch = useDispatch();
  const width = useSelector((state: any) => state.width.width);

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  console.log('appointment', appointments);

  const toggleDrawer = () => {
    setIsOpenDrawer(!isOpenDrawer);
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentPage]);

  const fetchAppointments = async () => {
    try {
      const response = await appointment(currentPage, limit);
      if (response?.statusCode === 200) {
        setAppointments(response?.data);
        setTotalPages(response?.pagination?.totalPage ?? 0);
        setCurrentPageRes(response?.pagination?.page ?? 0);
        setIsLoadingPage(false);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleToggleEdit = (index: number) => {
    setEditStatuses((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSave = async (appointmentId: number, status: number, index: number) => {
    const res = await updateStatusAppointment(appointmentId, {status});
    if (res?.statusCode === 200) {
      fetchAppointments();
      toast.success('Cập nhật thành công!', {autoClose: 1000});
      handleToggleEdit(index);
    } else {
      toast.error('Cập nhật thất bại!', {autoClose: 1000});
    }
  };

  const renderAppointment = (appointment: IAppointment, index: number) => {
    const statuses = {
      appointmentId: appointment.id,
      status: appointment.status === 1 ? 1 : 2,
    };

    const handleChangeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
      statuses.status = Number(event.target.value);
    };

    return (
      <>
        <td className="border border-gray-300 p-1">{appointment.id}</td>
        <td className="border border-gray-300 p-1">{appointment.customer_id}</td>
        <td className="border border-gray-300 p-1">{appointment.service_id}</td>
        <td className="border border-gray-300 p-1">{getFormattedDate(appointment.time)}</td>
        <td className="border border-gray-300 p-1">{getFormattedTime(appointment.time)}</td>
        <td className="border border-gray-300 p-1">{appointment.employee_id ? appointment.employee_id : ''}</td>
        <td className="flex justify-center">
          <select
            className={`${statuses.status === 1 ? 'bg-yellow-200' : 'bg-green-400'} rounded-lg p-1 flex`}
            defaultValue={statuses.status}
            onChange={handleChangeStatus}
            disabled={!editStatuses[index]}
          >
            <option value="1">Mới</option>
            <option value="2">Đã xác nhận</option>
          </select>
        </td>
        <td className="border border-gray-300 p-1">{appointment.reminder_sent}</td>
        <td className="border border-gray-300 p-1">{appointment.note}</td>
        <td className="border border-gray-300 p-1">
          <button
            onClick={() => handleToggleEdit(index)}
            className={`${
              editStatuses[index] ? 'bg-[#CCCCCC] text-black' : 'bg-[#4D90FE] text-white'
            } px-1.5 py-0.5  rounded-lg`}
          >
            {editStatuses[index] ? 'Hủy' : 'Sửa'}
          </button>
          {editStatuses[index] && (
            <button
              className="bg-[#28A745] px-1.5 py-0.5 rounded-lg text-white"
              onClick={() => handleSave(appointment.id, statuses.status, index)}
            >
              Lưu
            </button>
          )}
          <button className="bg-[#FF4B4B] px-1.5 py-0.5 rounded-lg text-[#FFFFFF]">Xóa</button>
        </td>
      </>
    );
  };
  const handleGoToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber); // Thay đổi trang hiện tại
  };

  if (isLoadingPage) {
    return <LoadingSpinner size={60} />;
  }

  return (
    <div className="w-full h-full">
      <div className="flex justify-between pb-2">
        <SwitchSideBar title="Danh sách lịch hẹn" className="font-bold text-lg" />

        <div className="flex-1 flex items-center justify-end">
          <TextInput
            placeholder="Tìm kiếm"
            className="h-8 mr-2"
            suffix={<FontAwesomeIcon icon={faMagnifyingGlass} />}
          />

          <button
            className="border border-white bg-slate-400 px-3.5 py-1 rounded-md mr-2"
            onClick={toggleDrawer}
            title="Thêm lịch hẹn"
          >
            <FontAwesomeIcon icon={faCalendarPlus} />
          </button>

          <button className="border border-white bg-slate-400 px-3.5 py-1 rounded-md" title="Làm mới">
            <FontAwesomeIcon icon={faRotate} />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto h-[80%]">
        <table className="min-w-full border border-gray-300 ">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-1">ID</th>
              <th className="border border-gray-300 p-1">Khách hàng</th>
              <th className="border border-gray-300 p-1">Dịch vụ</th>
              <th className="border border-gray-300 p-1">Ngày</th>
              <th className="border border-gray-300 p-1">Giờ</th>
              <th className="border border-gray-300 p-1">Nhân viên</th>
              <th className="border border-gray-300 p-1">Trạng thái</th>
              <th className="border border-gray-300 p-1">Nhắc hẹn</th>
              <th className="border border-gray-300 p-1">Ghi chú</th>
              <th className="border border-gray-300 p-1">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr
                key={appointment.id}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} border-b border-gray-300`}
              >
                {renderAppointment(appointment, index)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          Tổng {currentPage} / {totalPages}
        </div>
        <div className="flex items-center">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="h-8 w-8 rounded-full border border-white bg-slate-400 flex items-center justify-center"
            title="Trang trước"
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>

          <div className="flex space-x-2 px-3">
            {currentPage > 3 && (
              <span onClick={() => handleGoToPage(1)} className="cursor-pointer">
                1
              </span>
            )}
            {currentPage > 3 && <span>...</span>}
            {currentPage > 2 && (
              <span onClick={() => handleGoToPage(currentPage - 2)} className="cursor-pointer">
                {currentPage - 2}
              </span>
            )}
            {currentPage > 1 && (
              <span onClick={() => handleGoToPage(currentPage - 1)} className="cursor-pointer">
                {currentPage - 1}
              </span>
            )}
            <span className="font-bold text-blue-600">{currentPage}</span>
            {currentPage < totalPages && (
              <span onClick={() => handleGoToPage(currentPage + 1)} className="cursor-pointer">
                {currentPage + 1}
              </span>
            )}
            {currentPage + 1 < totalPages && (
              <span onClick={() => handleGoToPage(currentPage + 2)} className="cursor-pointer">
                {currentPage + 2}
              </span>
            )}
            {currentPage + 2 < totalPages && <span>...</span>}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="h-8 w-8 rounded-full border border-white bg-slate-400 flex items-center justify-center"
            title="Trang sau"
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
      </div>

      <Drawer isOpen={isOpenDrawer} onClose={toggleDrawer} type={ETypeAdd.APPOINTMENT} />

      <ToastContainer />
    </div>
  );
};

export default Appointment;
