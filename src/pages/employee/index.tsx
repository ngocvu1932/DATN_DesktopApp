import React, {useEffect, useState} from 'react';
import Drawer from '../../components/drawer';
import {toast} from 'react-toastify';
import {ETypeAdd} from '../../components/drawer/enum';
import SwitchSideBar from '../../components/switch-sidebar';
import LoadingSpinner from '../../components/loading-spinner';
import {allAppointment, updateStatusAppointment} from '../../api/appointment';
import {useDispatch, useSelector} from 'react-redux';
import {getAllBranch} from '../../api/branch';
import {IBranch} from '../../models/branch';
import Filter from '../../components/filter';
import {EFilterType} from '../../components/filter/enum';
import Pagination from '../../components/pagination';
import '../dashboard/index.css';
import {ELayout, ELayoutInfo} from '../../constants/layout';
import InfoDetail from '../../components/info-detail';
import {setInfoLayout} from '../../redux/slices/layoutInfoSlice';
import Breadcrumb from '../../components/breadcrumb';
import {ETypeInfoDetail} from '../../components/info-detail/enum';
import '../../global.css';
import {ICustomer} from '../../models/customer';
import {allCustomer} from '../../api/customer';
import {allEmployee} from '../../api/employee';
import {IEmployee} from '../../models/employee';
import { useLocation, useNavigate, useParams } from "react-router-dom";


const Employee: React.FC = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [employeesTemp, setEmployeesTemp] = useState<IEmployee[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRes, setCurrentPageRes] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [editStatuses, setEditStatuses] = useState<{[key: number]: boolean}>({});
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const dispatch = useDispatch();
  const layoutInfo = useSelector((state: any) => state.layoutInfo.layoutCustomer);
  const [selectedCustomers, setSelectedCustomers] = useState<IEmployee[]>([]);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  useEffect(() => {
    console.log("Current location:", location);

  }, [location]);

  useEffect(() => {
    if (isLoading) {
      setIsLoadingPage(isLoading);
    }
  }, [isLoading]);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, layoutInfo]);

  useEffect(() => {
    if (isOpenDrawer == false) {
      fetchCustomers();
    }
  }, [isOpenDrawer]);

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

  const fetchCustomers = async () => {
    try {
      setIsLoadingPage(true);
      const response = await allEmployee(currentPage, limit);
      if (response?.statusCode === 200) {
        setEmployees(response?.data);
        setEmployeesTemp(response?.data);
        setTotalPages(response?.pagination?.totalPages ?? 0);
        setCurrentPageRes(response?.pagination?.page ?? 0);
        setIsLoadingPage(false);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleCheckboxChange = (customer: IEmployee) => {
    setSelectedCustomers((prevSelected) => {
      if (prevSelected.find((b) => b.id === customer.id)) {
        return prevSelected.filter((b) => b.id !== customer.id);
      } else {
        return [...prevSelected, customer];
      }
    });
  };

  const renderContent = () => {
    switch (layoutInfo?.layout) {
      case ELayoutInfo.Home:
        return (
          <>
            <div className="h-[7%] flex w-full">
              <Filter
                setDataFilter={setEmployeesTemp}
                dataFilter={employees}
                toggleDrawer={toggleDrawer}
                type={EFilterType.CUSTOMER}
                dataAction={selectedCustomers}
                showToast={showToast}
                reloadData={() => fetchCustomers()}
                setDataAction={setSelectedCustomers}
                setLoader={setIsLoading}
              />
            </div>

            <div className="h-[81%] overflow-y-auto overflow-x-auto scrollbar-thin border box-border border-slate-400">
              {isLoadingPage ? (
                <div className="flex w-full h-full justify-center items-center">
                  <LoadingSpinner size={60} />
                </div>
              ) : (
                <table className="min-w-full table-fixed">
                  <thead className="bg-gray-200 sticky top-0 z-10">
                    <tr>
                      <th></th>
                      <th className="border border-gray-300 p-1">ID</th>
                      <th className="border border-gray-300 p-1">Ảnh</th>
                      <th className="border border-gray-300 p-1">Tên nhân viên</th>
                      <th className="border border-gray-300 p-1">Số điện thoại</th>
                      <th className="border border-gray-300 p-1">Email</th>
                      <th className="border border-gray-300 p-1">Giới tính</th>
                      {/* <th className="border border-gray-300 p-1">Điểm</th> */}
                      <th className="border border-gray-300 p-1">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto">
                    {employeesTemp.map((customer, index) => (
                      <tr
                        onClick={() => {
                          handleViewDetail(customer);
                          setSelectedCustomers([]);
                        }}
                        key={customer.id}
                        className={`${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                        } border-b cursor-pointer hover:bg-slate-200 border-gray-300`}
                      >
                        {renderEmployee(customer, index)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
          </>
        );
      case ELayoutInfo.Details:
        return <InfoDetail type={ETypeInfoDetail.CUSTOMER} />;
    }
  };

  const renderEmployee = (employee: IEmployee, index: number) => {
    return (
      <>
        <td className="border border-gray-300" onClick={(e) => e.stopPropagation()}>
          <div className="p-3">
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={selectedCustomers.some((b) => b.id === employee.id)}
              onChange={() => handleCheckboxChange(employee)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </td>

        <td className="border border-gray-300 p-1 font-semibold" title={`ID: ${employee.code}`}>
          {employee.code}
        </td>

        <td className="border border-gray-300 p-1" title={`ID: ${employee.id}`}>
          <img src={employee.avatar ?? ''} className="h-10 w-10 rounded-full" />
        </td>

        <td className="border border-gray-300 p-1" title={`Tên nhân viên: ${employee.name}`}>
          {employee.name}
        </td>
        <td className="border border-gray-300 p-1" title={`Số điện thoại: ${employee.phone}`}>
          {employee.phone}
        </td>
        <td className="border border-gray-300 p-1" title={`Email: ${employee.email}`}>
          {employee.email}
        </td>
        <td className="border border-gray-300 p-1" title={`Giới tính: ${employee.gender}`}>
          {/* giới tính 0 nam 1 nữ2 khác */}
          {employee.gender == 0 ? 'Nam' : employee.gender == 1 ? 'Nữ' : 'Khác'}
        </td>
        {/* <td className="border border-gray-300 p-1" title={`Điểm: ${customer.loyaltyPoints}`}>
          {customer.loyaltyPoints}
        </td> */}
        <td
          className="h-full justify-center items-center p-0"
          //   title={`Trạng thái: ${customer.status == 1 ? 'Tạm dừng' : 'Đang hoạt động'}`}
        >
          {/*     // 0 là OFF, 1 là đang hoạt động*/}
          {employee.status == 0 ? (
            <span className="bg-yellow-200 rounded-lg py-1 px-1.5 flex m-1  items-center">OFF</span>
          ) : employee.status == 1 ? (
            <span className="bg-green-400 rounded-lg py-1 px-1.5 flex m-1 items-center ">Đang hoạt động</span>
          ) : (
            <>Error</>
          )}
        </td>
      </>
    );
  };

  const handleViewDetail = (customer: any) => {
    dispatch(
      setInfoLayout({
        layoutBranch: {layout: ELayoutInfo.Home, data: null},
        layoutAppointment: {layout: ELayoutInfo.Home, data: null},
        layoutService: {layout: ELayoutInfo.Home, data: null},
        layoutCustomer: {layout: ELayoutInfo.Details, data: customer},
        layoutOrder: {layout: ELayoutInfo.Home, data: null},
      })
    );
  };

  const handleGoToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="h-[6%] flex border-b border-slate-400 overflow-hidden">
        <SwitchSideBar title="Danh sách nhân viên" className="font-bold text-lg" />
        <Breadcrumb />
      </div>

      {renderContent()}

      <Drawer isOpen={isOpenDrawer} onClose={toggleDrawer} type={ETypeAdd.CUSTOMER} />
    </div>
  );
};

export default Employee;
