import React, {useEffect, useState} from 'react';
import {allAppointment, updateStatusAppointment} from '../../api/appointment';
import {IAppointment} from '../../models/appointment';
import {toast} from 'react-toastify';
import LoadingSpinner from '../../components/loading-spinner';
import SwitchSideBar from '../../components/switch-sidebar';
import Drawer from '../../components/drawer';
import {getFormattedDate, getFormattedTime} from '../../utils/dateTime';
import {ETypeAdd} from '../../components/drawer/enum';
import {EFilterType} from '../../components/filter/enum';
import Filter from '../../components/filter';
import Pagination from '../../components/pagination';
import {useDispatch, useSelector} from 'react-redux';
import {ELayoutInfo} from '../../constants/layout';
import Breadcrumb from '../../components/breadcrumb';
import {setInfoLayout} from '../../redux/slices/layoutInfoSlice';
import InfoDetail from '../../components/info-detail';
import {ETypeInfoDetail} from '../../components/info-detail/enum';
import '../../global.css';
import {IBranch} from '../../models/branch';
import {getAllBranchNoLimit} from '../../api/branch';
import {allServicesNoLimit} from '../../api/services';
import {IService} from '../../models/service';
import {IDataChoose} from '../all-services';

const Appointment: React.FC = () => {
  const layoutInfo = useSelector((state: any) => state.layoutInfo.layoutAppointment);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [appointmentsTemp, setAppointmentsTemp] = useState<IAppointment[]>(appointments);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRes, setCurrentPageRes] = useState(1);
  const [limit, setLimit] = useState(30);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const [selectedAppointments, setSelectedAppointments] = useState<IAppointment[]>([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [branchs, setBranchs] = useState<IDataChoose[]>([]);
  const [services, setServices] = useState<IDataChoose[]>([]);

  useEffect(() => {
    if (isLoading) {
      setIsLoadingPage(isLoading);
    }
  }, [isLoading]);

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, layoutInfo, limit]);

  useEffect(() => {
    if (isOpenDrawer == false) {
      fetchAppointments();
    }
  }, [isOpenDrawer]);

  useEffect(() => {
    fetchBranchs();
    fetchServices();
  }, []);

  const fetchBranchs = async () => {
    try {
      const response = await getAllBranchNoLimit();
      if (response?.statusCode === 200) {
        const filteredData = response?.data.map((branch: IBranch) => {
          return {id: branch.id, value: branch.name, status: branch.status};
        });
        setBranchs(filteredData);
      }
    } catch (error) {
      console.error('Error fetching branchs:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await allServicesNoLimit();
      if (response?.statusCode === 200) {
        const filteredData = response?.data.map((service: IService) => {
          return {id: service.id, value: service.name, status: service.status};
        });
        setServices(filteredData);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      setIsLoadingPage(true);
      const response = await allAppointment(currentPage, limit);
      if (response?.statusCode === 200) {
        const filteredData = response?.data.map((appointment: IAppointment) => {
          return {
            ...appointment,
            time: appointment.time.replace(/\.\d{3}Z$/, ''),
          };
        });

        setAppointments(filteredData);
        setAppointmentsTemp(filteredData);
        setTotalPages(response?.pagination?.totalPages ?? 0);
        setCurrentPageRes(response?.pagination?.page ?? 0);
        setIsLoadingPage(false);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const showToast = (message: string, type: string) => {
    switch (type) {
      case 'error':
        toast.error(message, {autoClose: 2000});
        break;
      case 'success':
        toast.success(message, {autoClose: 2000});
        break;
      case 'warning':
        toast.warning(message, {autoClose: 2000});
        break;
      default:
        break;
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

  const handleViewDetail = (appointment: IAppointment) => {
    dispatch(
      setInfoLayout({
        layoutBranch: {layout: ELayoutInfo.Home, data: null},
        layoutAppointment: {layout: ELayoutInfo.Details, data: appointment},
        layoutService: {layout: ELayoutInfo.Home, data: null},
        layoutCustomer: {layout: ELayoutInfo.Home, data: null},
      })
    );
  };

  const renderContent = () => {
    switch (layoutInfo?.layout) {
      case ELayoutInfo.Home:
        return (
          <div className="h-full w-full relative">
            <div className="h-[7%] flex w-full">
              <Filter
                showToast={showToast}
                setDataFilter={setAppointmentsTemp}
                dataFilter={appointments}
                toggleDrawer={toggleDrawer}
                type={EFilterType.APPOINTMENT}
                dataAction={selectedAppointments}
                setDataAction={setSelectedAppointments}
                reloadData={() => {
                  fetchAppointments();
                  fetchBranchs();
                  fetchServices();
                }}
                setLoader={setIsLoading}
              />
            </div>

            <div className="overflow-y-auto scrollbar-thin h-[81%] border border-slate-400 box-border">
              {isLoadingPage ? (
                <div className="flex w-full h-full justify-center items-center">
                  <LoadingSpinner size={60} />
                </div>
              ) : (
                <table className="min-w-full">
                  <thead className="bg-gray-200 sticky top-[-1px] z-10">
                    <tr>
                      <td></td>
                      <th className="border border-gray-300 p-1">ID</th>
                      <th className="border border-gray-300 p-1">Khách hàng</th>
                      <th className="border border-gray-300 p-1">Dịch vụ</th>
                      <th className="border border-gray-300 p-1">Ngày</th>
                      <th className="border border-gray-300 p-1">Giờ</th>
                      <th className="border border-gray-300 p-1">Nhân viên</th>
                      <th className="border border-gray-300 p-1">Trạng thái</th>
                      <th className="border border-gray-300 p-1">Chi nhánh</th>
                      <th className="border border-gray-300 p-1">Nhắc hẹn</th>
                      <th className="border border-gray-300 p-1">Ngày tạo</th>
                      <th className="border border-gray-300 p-1">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentsTemp.map((appointment, index) => (
                      <tr
                        onClick={() => {
                          handleViewDetail(appointment);
                          setSelectedAppointments([]);
                        }}
                        key={appointment.id}
                        className={`${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                        } border-b cursor-pointer border-gray-300 hover:bg-slate-200`}
                      >
                        {renderAppointment(appointment, index)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex justify-between items-center h-[6%]">
              <Pagination
                limit={limit}
                setLimit={setLimit}
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={(page) => handleGoToPage(page)}
                nextPage={handleNextPage}
                previousPage={handlePreviousPage}
              />
            </div>
          </div>
        );
      case ELayoutInfo.Details:
        return <InfoDetail type={ETypeInfoDetail.APPOINTMENT} dataChooseBranchs={branchs} dataChooseServices={services} />;
      default:
        return <></>;
    }
  };

  const handleCheckboxChange = (appointment: IAppointment) => {
    setSelectedAppointments((prevSelected) => {
      if (prevSelected.find((a) => a.id === appointment.id)) {
        return prevSelected.filter((a) => a.id !== appointment.id);
      } else {
        return [...prevSelected, appointment];
      }
    });
  };

  const renderAppointment = (appointment: IAppointment, index: number) => {
    // không hiện licjk với trạng thái đã xóa!
    if (appointment.isRemoved) {
      return;
    }
    return (
      <>
        <td className="border border-gray-300" onClick={(e) => e.stopPropagation()}>
          <div className="p-2">
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={selectedAppointments.some((a) => a.id === appointment.id)}
              onChange={() => handleCheckboxChange(appointment)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </td>
        <td className="border border-gray-300 p-1 font-semibold" title={`ID: ${appointment.code}`}>
          {appointment.code}
        </td>
        <td className="border border-gray-300 p-1" title={`Tên khách hàng: ${appointment.customerName}`}>
          {appointment.customerName}
        </td>
        <td className="border border-gray-300 p-1" title={`Tên dịch vụ: ${appointment.serviceName}`}>
          {appointment.serviceName}
        </td>
        <td className="border border-gray-300 p-1" title={`Ngày: ${getFormattedDate(appointment.time)}`}>
          {getFormattedDate(appointment.time)}
        </td>
        <td className="border border-gray-300 p-1" title={`Giờ: ${getFormattedTime(appointment.time)}`}>
          {getFormattedTime(appointment.time)}
        </td>
        <td className="border border-gray-300 p-1" title={`Tên nhân viên: ${appointment.employeeName}`}>
          {appointment.employeeName ? appointment.employeeName : ''}
        </td>
        <td
          className="h-full justify-center items-center p-0"
          title={`Trạng thái: ${appointment.status == 0 ? 'Mới' : appointment.status == 1 ? 'Đã xác nhận' : 'Hủy'}`}
        >
          {/* 0 MỚi, 1 Đã xác nhận, 2 Hủy */}

          {appointment.status == 0 ? (
            <span className="bg-yellow-200 rounded-lg py-1 px-1.5 flex m-1  items-center">Mới</span>
          ) : appointment.status == 1 ? (
            <span className="bg-green-400 rounded-lg py-1 px-1.5 flex m-1 items-center ">Đã xác nhận</span>
          ) : appointment.status == 2 ? (
            <span className="bg-red-400 rounded-lg py-1 px-1.5 flex m-1 items-center ">Hủy</span>
          ) : (
            ''
          )}
        </td>
        <td className="border border-gray-300 p-1" title="Tên chi nhánh">
          {appointment.branchName}
        </td>
        <td className="border border-gray-300 p-1">{appointment.reminderSent}</td>
        <td className="border border-gray-300 p-1">{getFormattedDate(appointment.createdAt)}</td>
        <td className="border border-gray-300 p-1 max-w-[200px]">{appointment.note}</td>
      </>
    );
  };
  const handleGoToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full h-full">
      <div className="h-[6%] flex border-b border-slate-400 box-border">
        <SwitchSideBar title="Danh sách lịch hẹn" className="font-bold text-lg" />
        <Breadcrumb />
      </div>

      {renderContent()}

      <Drawer
        dataBranchsChoose={branchs}
        dataServicesChoose={services}
        isOpen={isOpenDrawer}
        onClose={toggleDrawer}
        type={ETypeAdd.APPOINTMENT}
      />
    </div>
  );
};

export default Appointment;
