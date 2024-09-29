import React, {useEffect, useState} from 'react';
import {appointment, updateStatusAppointment} from '../../api/appointment';
import {IAppointment} from '../../models/appointment';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRotate} from '@fortawesome/free-solid-svg-icons';
import {toast, ToastContainer} from 'react-toastify';

const Appointment: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRes, setCurrentPageRes] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [editStatuses, setEditStatuses] = useState<{[key: number]: boolean}>({}); // Lưu trạng thái chỉnh sửa cho từng hàng

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
        <td className="border border-gray-300 p-1">{new Date(appointment.time).toLocaleDateString()}</td>
        <td className="border border-gray-300 p-1">{new Date(appointment.time).toLocaleTimeString()}</td>
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
            className={`${editStatuses[index] ? 'bg-blue-200' : 'bg-blue-500'} px-1.5 py-0.5 rounded-lg`}
          >
            {editStatuses[index] ? 'Hủy' : 'Sửa'}
          </button>
          {editStatuses[index] && (
            <button
              className="bg-green-500 px-1.5 py-0.5 rounded-lg"
              onClick={() => handleSave(appointment.id, statuses.status, index)}
            >
              Lưu
            </button>
          )}
          <button className="bg-red-500 px-1.5 py-0.5 rounded-lg">Xóa</button>
        </td>
      </>
    );
  };

  return (
    <div className="">
      <div className="flex justify-between pb-2">
        <div>Danh sách lịch hẹn</div>
        <div className="flex">
          <button className="bg-blue-500 text-white p-2 rounded">Thêm lịch hẹn</button>
          <button className="bg-blue-500 text-white p-2 rounded">Xuất file</button>
          <button className="flex bg-gray-500 text-white py-1 px-2 rounded">
            <FontAwesomeIcon icon={faRotate} />
          </button>
        </div>
      </div>
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

      <div className="flex justify-between items-center mt-4">
        <span>{`Trang ${currentPageRes} của ${totalPages}`}</span>
        <div>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Trang trước
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Trang sau
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Appointment;
