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
import {allServices} from '../../api/services';
import {IService} from '../../models/service';

const AllServices: React.FC = () => {
  const [services, setAllservices] = useState<IService[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRes, setCurrentPageRes] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [editStatuses, setEditStatuses] = useState<{[key: number]: boolean}>({}); // Lưu trạng thái chỉnh sửa cho từng hàng
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const dispatch = useDispatch();
  const width = useSelector((state: any) => state.width.width);

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  // console.log('currentPageRes', currentPageRes);

  const toggleDrawer = () => {
    setIsOpenDrawer(!isOpenDrawer);
  };

  useEffect(() => {
    fetchAllServices();
  }, [currentPage]);

  const fetchAllServices = async () => {
    try {
      const response = await allServices(currentPage, limit);
      if (response?.statusCode === 200) {
        setAllservices(response?.data);
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
      fetchAllServices();
      toast.success('Cập nhật thành công!', {autoClose: 1000});
      handleToggleEdit(index);
    } else {
      toast.error('Cập nhật thất bại!', {autoClose: 1000});
    }
  };

  const renderServices = (service: IService, index: number) => {
    const statuses = {
      appointmentId: service.id,
      status: service.status === 1 ? 1 : 2,
    };

    const handleChangeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
      statuses.status = Number(event.target.value);
    };

    return (
      <>
        <td className="border border-gray-300 p-1">{service.id}</td>
        <td className="border border-gray-300 p-1">{service.name}</td>
        {/* <td className="border border-gray-300 p-1">{service.updated_at}</td> */}
        <td className="border border-gray-300 p-1">{new Date(service.updated_at).toLocaleDateString()}</td>
        {/* <td className="border border-gray-300 p-1">{new Date(service.time).toLocaleTimeString()}</td> */}
        <td className="border border-gray-300 p-1">{service.price}</td>
        <td className="border border-gray-300 p-1">{service.description}</td>
        {/* <td className="flex justify-center">
          <select
            className={`${statuses.status === 1 ? 'bg-yellow-200' : 'bg-green-400'} rounded-lg p-1 flex`}
            defaultValue={statuses.status}
            onChange={handleChangeStatus}
            disabled={!editStatuses[index]}
          >
            <option value="1">Mới</option>
            <option value="2">Đã xác nhận</option>
          </select>
        </td> */}
        {/* <td className="border border-gray-300 p-1">{service.reminder_sent}</td>
        <td className="border border-gray-300 p-1">{service.note}</td> */}
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
              onClick={() => handleSave(service.id, statuses.status, index)}
            >
              Lưu
            </button>
          )}
          <button className="bg-red-500 px-1.5 py-0.5 rounded-lg">Xóa</button>
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
        <SwitchSideBar title="Danh sách dịch vụ" className="font-bold text-lg" />

        <div className="flex-1 flex items-center justify-end">
          <TextInput
            placeholder="Tìm kiếm"
            className="h-8 mr-2"
            suffix={<FontAwesomeIcon icon={faMagnifyingGlass} />}
          />

          <button
            className="border border-white bg-slate-400 px-3.5 py-1 rounded-lg mr-2"
            onClick={toggleDrawer}
            title="Thêm lịch hẹn"
          >
            <FontAwesomeIcon icon={faCalendarPlus} />
          </button>

          <button className="border border-white bg-slate-400 px-3.5 py-1 rounded-lg" title="Làm mới">
            <FontAwesomeIcon icon={faRotate} />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto h-[80%]">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-1">ID</th>
              <th className="border border-gray-300 p-1">Tên dịch vụ</th>
              <th className="border border-gray-300 p-1">Ngày tạo</th>
              <th className="border border-gray-300 p-1">Giá tiền</th>
              <th className="border border-gray-300 p-1">Mô tả</th>
              {/* <th className="border border-gray-300 p-1">Nhân viên</th>
            <th className="border border-gray-300 p-1">Trạng thái</th>
            <th className="border border-gray-300 p-1">Nhắc hẹn</th>
            <th className="border border-gray-300 p-1">Ghi chú</th> */}
              <th className="border border-gray-300 p-1">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr
                key={service.id}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} border-b border-gray-300`}
              >
                {renderServices(service, index)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 pb-3">
        <div>
          Tổng {currentPage} / {totalPages}
        </div>
        <div className="flex">
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

      <Drawer isOpen={isOpenDrawer} onClose={toggleDrawer} />

      <ToastContainer />
    </div>
  );
};

export default AllServices;
