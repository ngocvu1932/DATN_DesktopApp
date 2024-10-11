import React, {useEffect, useState} from 'react';
import {updateStatusAppointment} from '../../api/appointment';
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
import {ETypeAdd} from '../../components/drawer/enum';
import Filter from '../../components/filter';
import {EFilterType} from '../../components/filter/enum';
import Pagination from '../../components/pagination';

const AllServices: React.FC = () => {
  const [services, setAllservices] = useState<IService[]>([]);
  const [servicesTemp, setAllServicesTemp] = useState<IService[]>([]);
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

  useEffect(() => {
    fetchAllServices();
  }, [isOpenDrawer]);

  useEffect(() => {
    fetchAllServices();
  }, [currentPage]);

  const fetchAllServices = async () => {
    try {
      const response = await allServices(currentPage, limit);
      if (response?.statusCode === 200) {
        setAllservices(response?.data);
        setAllServicesTemp(response?.data);
        setTotalPages(response?.pagination?.totalPage ?? 0);
        setCurrentPageRes(response?.pagination?.page ?? 0);
        setIsLoadingPage(false);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const toggleDrawer = () => {
    setIsOpenDrawer(!isOpenDrawer);
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
        <td className="border border-gray-300 p-1">{new Date(service.updated_at).toLocaleDateString()}</td>
        <td className="border border-gray-300 p-1">{service.price}</td>
        <td className="border border-gray-300 p-1">{service.description}</td>
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
              onClick={() => handleSave(service.id, statuses.status, index)}
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
      <div className="h-[19%] flex flex-col">
        <SwitchSideBar title="Danh sách dịch vụ" className="font-bold text-lg" />

        <Filter
          setDataFilter={setAllServicesTemp}
          dataFilter={services}
          toggleDrawer={toggleDrawer}
          type={EFilterType.SERVICE}
        />
      </div>

      <div className="overflow-y-auto h-[75%] border-b border-x border-slate-400">
        <table className="min-w-full">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th className="border border-gray-300 p-1">ID</th>
              <th className="border border-gray-300 p-1">Tên dịch vụ</th>
              <th className="border border-gray-300 p-1">Ngày tạo</th>
              <th className="border border-gray-300 p-1">Giá tiền</th>
              <th className="border border-gray-300 p-1">Mô tả</th>
              <th className="border border-gray-300 p-1">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {servicesTemp.map((service, index) => (
              <tr key={service.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} `}>
                {renderServices(service, index)}
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

      <Drawer isOpen={isOpenDrawer} onClose={toggleDrawer} type={ETypeAdd.SERVICE} />

      <ToastContainer />
    </div>
  );
};

export default AllServices;
