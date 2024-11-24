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
import {allOrders} from '../../api/orders';
import {IOrder} from '../../models/order';
import {set} from 'lodash';
import {formatPrice} from '../../utils/formatPrice';
import {log} from 'console';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [ordersTemp, setOrdersTemp] = useState<IOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRes, setCurrentPageRes] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [editStatuses, setEditStatuses] = useState<{[key: number]: boolean}>({});
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const dispatch = useDispatch();
  const layoutInfo = useSelector((state: any) => state.layoutInfo.layoutOrder);
  const [selectedOrders, setSelectedOrders] = useState<IOrder[]>([]);
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
      const response = await allOrders(currentPage, limit);
      if (response?.statusCode === 200) {
        setOrders(response?.data);
        setOrdersTemp(response?.data);
        setTotalPages(response?.pagination?.totalPages ?? 0);
        setCurrentPageRes(response?.pagination?.page ?? 0);
        setIsLoadingPage(false);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleCheckboxChange = (customer: IOrder) => {
    setSelectedOrders((prevSelected) => {
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
                setDataFilter={setOrdersTemp}
                dataFilter={orders}
                toggleDrawer={toggleDrawer}
                type={EFilterType.CUSTOMER}
                dataAction={selectedOrders}
                showToast={showToast}
                reloadData={() => fetchCustomers()}
                setDataAction={setSelectedOrders}
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
                      <th className="border border-gray-300 p-1">Tên khách hàng</th>
                      <th className="border border-gray-300 p-1">Name</th>
                      <th className="border border-gray-300 p-1">Mô tả</th>
                      <th className="border border-gray-300 p-1">Tổng tiền</th>
                      <th className="border border-gray-300 p-1">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto">
                    {ordersTemp.map((order, index) => (
                      <tr
                        onClick={() => {
                          handleViewDetail(order);
                          setSelectedOrders([]);
                        }}
                        key={order.id}
                        className={`${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                        } border-b cursor-pointer hover:bg-slate-200 border-gray-300`}
                      >
                        {renderEmployee(order, index)}
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
        return <InfoDetail type={ETypeInfoDetail.ORDER} />;
    }
  };

  const renderEmployee = (order: IOrder, index: number) => {
    return (
      <>
        <td className="border border-gray-300" onClick={(e) => e.stopPropagation()}>
          <div className="p-3">
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={selectedOrders.some((b) => b.id === order.id)}
              onChange={() => handleCheckboxChange(order)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </td>

        <td className="border border-gray-300 p-1 font-semibold" title={`ID: ${order.id}`}>
          ORD00{order.id}
        </td>

        <td className="border border-gray-300 p-1 font-semibold" title={`Tên khách hàng: ${order.id}`}>
          Khách hàng {order.id}
        </td>

        <td className="border border-gray-300 p-1" title={`Tên nhân viên: ${order.name}`}>
          {order.name}
        </td>
        <td className="border border-gray-300 p-1" title={`Số điện thoại: ${order.description}`}>
          Đơn hàng số {order.description} {index}
        </td>
        <td className="border border-gray-300 p-1" title={`Điểm: ${order.totalAmount}`}>
          <div className="w-full text-end pr-2"> {formatPrice(order.totalAmount.toString())}</div>
        </td>
        <td
          className="h-full justify-center items-center p-0"
          //   title={`Trạng thái: ${customer.status == 1 ? 'Tạm dừng' : 'Đang hoạt động'}`}
        >
          {/*     // 0 là OFF, 1 là đang hoạt động*/}
          {order.status == 0 ? (
            <span className="bg-green-400 rounded-lg py-1 px-1.5 flex m-1  items-center">Đã thanh toán</span>
          ) : order.status == 1 ? (
            <span className="bg-yellow-200 rounded-lg py-1 px-1.5 flex m-1 items-center ">Chưa thanh toán</span>
          ) : (
            <>Error</>
          )}
        </td>
      </>
    );
  };

  const handleViewDetail = (order: IOrder) => {
    dispatch(
      setInfoLayout({
        layoutOrder: {layout: ELayoutInfo.Details, data: order},
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
        <SwitchSideBar title="Đơn hàng" className="font-bold text-lg" />
        {/* <Breadcrumb /> */}
      </div>

      {renderContent()}

      <Drawer isOpen={isOpenDrawer} onClose={toggleDrawer} type={ETypeAdd.CUSTOMER} />
    </div>
  );
};

export default Orders;
