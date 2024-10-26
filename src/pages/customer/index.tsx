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

const Customer: React.FC = () => {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [customersTemp, setCustomersTemp] = useState<ICustomer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRes, setCurrentPageRes] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [editStatuses, setEditStatuses] = useState<{[key: number]: boolean}>({});
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const dispatch = useDispatch();
  const layoutInfo = useSelector((state: any) => state.layoutInfo.layoutCustomer);
  const [selectedCustomers, setSelectedCustomers] = useState<ICustomer[]>([]);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await allCustomer(currentPage, limit);
      if (response?.statusCode === 200) {
        setCustomers(response?.data);
        setCustomersTemp(response?.data);
        setTotalPages(response?.pagination?.totalPage ?? 0);
        setCurrentPageRes(response?.pagination?.page ?? 0);
        setIsLoadingPage(false);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleCheckboxChange = (customer: ICustomer) => {
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
            <div className="h-[13%] flex w-full">
              <Filter
                setDataFilter={setCustomersTemp}
                dataFilter={customers}
                toggleDrawer={toggleDrawer}
                type={EFilterType.CUSTOMER}
                dataAction={selectedCustomers}
                showToast={showToast}
                reloadData={() => fetchCustomers()}
                setDataAction={setSelectedCustomers}
                setLoader={setIsLoading}
              />
            </div>

            <div className="h-[75%] overflow-y-auto overflow-x-auto scrollbar-thin border box-border border-slate-400">
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
                      <th className="border border-gray-300 p-1">Tên khách hàng</th>
                      <th className="border border-gray-300 p-1">Số điện thoại</th>
                      <th className="border border-gray-300 p-1">Email</th>
                      <th className="border border-gray-300 p-1">Giới tính</th>
                      <th className="border border-gray-300 p-1">Điểm</th>
                      <th className="border border-gray-300 p-1">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto">
                    {customersTemp.map((customer, index) => (
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
                        {renderCustomer(customer, index)}
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

  const renderCustomer = (customer: ICustomer, index: number) => {
    return (
      <>
        <td className="border border-gray-300" onClick={(e) => e.stopPropagation()}>
          <div className="p-3">
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={selectedCustomers.some((b) => b.id === customer.id)}
              onChange={() => handleCheckboxChange(customer)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </td>
        <td className="border border-gray-300 p-1 font-semibold" title={`ID: ${customer.id}`}>
          {customer.id}
        </td>
        <td className="border border-gray-300 p-1" title={`Tên chi nhánh: ${customer.name}`}>
          {customer.name}
        </td>
        <td className="border border-gray-300 p-1" title={`Số điện thoại: ${customer.phone}`}>
          {customer.phone}
        </td>
        <td className="border border-gray-300 p-1" title={`Email: ${customer.email}`}>
          {customer.email}
        </td>
        <td className="border border-gray-300 p-1" title={`Giới tính: ${customer.gender}`}>
          {customer.gender}
        </td>
        <td className="border border-gray-300 p-1" title={`Điểm: ${customer.loyalty_points}`}>
          {customer.loyalty_points}
        </td>
        <td
          className="h-full justify-center items-center p-0"
          title={`Trạng thái: ${customer.status == 1 ? 'Tạm dừng' : 'Đang hoạt động'}`}
        >
          {/*     // 1 là OFF, 0 là đang hoạt động*/}
          {customer.status == 1 ? (
            <span className="bg-yellow-200 rounded-lg py-1 px-1.5 flex m-1  items-center">OFF</span>
          ) : customer.status == 0 ? (
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
        <SwitchSideBar title="Danh sách khách hàng" className="font-bold text-lg" />
        <Breadcrumb />
      </div>

      {renderContent()}

      <Drawer isOpen={isOpenDrawer} onClose={toggleDrawer} type={ETypeAdd.CUSTOMER} />
    </div>
  );
};

export default Customer;
