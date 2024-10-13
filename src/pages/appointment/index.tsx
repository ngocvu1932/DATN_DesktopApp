import React, {useEffect, useState} from 'react';
import {allAppointment, updateStatusAppointment} from '../../api/appointment';
import {IAppointment} from '../../models/appointment';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../components/loading-spinner';
import SwitchSideBar from '../../components/switch-sidebar';
import Drawer from '../../components/drawer';
import {getFormattedDate, getFormattedTime} from '../../utils/dateTime';
import {ETypeAdd} from '../../components/drawer/enum';
import {EFilterType} from '../../components/filter/enum';
import Filter from '../../components/filter';
import Pagination from '../../components/pagination';

const Appointment: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [appointmentsTemp, setAppointmentsTemp] = useState<IAppointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRes, setCurrentPageRes] = useState(1);
  const [limit] = useState(30);
  const [totalPages, setTotalPages] = useState(0);
  const [editStatuses, setEditStatuses] = useState<{[key: number]: boolean}>({});
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const toggleDrawer = () => {
    setIsOpenDrawer(!isOpenDrawer);
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentPage]);

  const fetchAppointments = async () => {
    try {
      const response = await allAppointment(currentPage, limit);
      if (response?.statusCode === 200) {
        setAppointments(response?.data);
        setAppointmentsTemp(response?.data);
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
    setCurrentPage(pageNumber);
  };

  if (isLoadingPage) {
    return <LoadingSpinner size={60} />;
  }

  return (
    <div className="w-full h-full">
      <div className="h-[19%] flex flex-col">
        <SwitchSideBar title="Danh sách lịch hẹn" className="font-bold text-lg" />

        <Filter
          setDataFilter={setAppointmentsTemp}
          dataFilter={appointments}
          toggleDrawer={toggleDrawer}
          type={EFilterType.APPOINTMENT}
        />
      </div>

      <div className="overflow-y-auto h-[75%] border-b border-x border-slate-400">
        <table className="min-w-full">
          <thead className="bg-gray-200 sticky top-0 z-10">
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
            {appointmentsTemp.map((appointment, index) => (
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

      <div className="flex justify-between items-center h-[6%]">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={(page) => handleGoToPage(page)}
          nextPage={handleNextPage}
          previousPage={handlePreviousPage}
        />
      </div>

      <Drawer isOpen={isOpenDrawer} onClose={toggleDrawer} type={ETypeAdd.APPOINTMENT} />

      <ToastContainer />
    </div>
  );
};

export default Appointment;
