import React, {useEffect, useState} from 'react';
import {updateStatusAppointment} from '../../api/appointment';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import Breadcrumb from '../../components/breadcrumb';
import {ELayoutInfo} from '../../constants/layout';
import {setInfoLayout} from '../../redux/slices/layoutInfoSlice';
import InfoDetail from '../../components/info-detail';
import {ETypeInfoDetail} from '../../components/info-detail/enum';
import {getAllBranch, getAllBranchNoLimit} from '../../api/branch';
import {IBranch} from '../../models/branch';
import {formatPrice} from '../../utils/formatPrice';
import {getFormattedDate} from '../../utils/dateTime';

export interface IDataChoose {
  id: number;
  value: string;
  status: boolean | number;
}

const AllServices: React.FC = () => {
  const [services, setAllservices] = useState<IService[]>([]);
  const [servicesTemp, setAllServicesTemp] = useState<IService[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRes, setCurrentPageRes] = useState(1);
  const [limit, setLimit] = useState(30);
  const [totalPages, setTotalPages] = useState(0);
  const [editStatuses, setEditStatuses] = useState<{[key: number]: boolean}>({});
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const dispatch = useDispatch();
  const layoutInfo = useSelector((state: any) => state.layoutInfo.layoutService);
  const [selectedServices, setSelectedServices] = useState<IService[]>([]);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [branchs, setBranchs] = useState<IDataChoose[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllServices();
  }, [currentPage, layoutInfo, limit]);

  useEffect(() => {
    if (isOpenDrawer == false) {
      fetchAllServices();
    }
  }, [isOpenDrawer]);

  useEffect(() => {
    fetchBranchs();
  }, []);

  useEffect(() => {
    if (isLoading) {
      setIsLoadingPage(isLoading);
    }
  }, [isLoading]);

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
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchAllServices = async () => {
    try {
      setIsLoadingPage(true);
      const response = await allServices(currentPage, limit);
      if (response?.statusCode === 200) {
        setAllservices(response?.data);
        setAllServicesTemp(response?.data);
        setTotalPages(response?.pagination?.totalPages ?? 0);
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

  const handleViewDetail = (service: any) => {
    dispatch(
      setInfoLayout({
        layoutBranch: {layout: ELayoutInfo.Home, data: null},
        layoutAppointment: {layout: ELayoutInfo.Home, data: null},
        layoutService: {layout: ELayoutInfo.Details, data: service},
        layoutCustomer: {layout: ELayoutInfo.Home, data: null},
      })
    );
  };

  const renderContent = () => {
    switch (layoutInfo?.layout) {
      case ELayoutInfo.Home:
        return (
          <>
            <div className="h-[7%] flex w-full">
              <Filter
                showToast={showToast}
                setDataFilter={setAllServicesTemp}
                dataFilter={services}
                toggleDrawer={toggleDrawer}
                type={EFilterType.SERVICE}
                dataAction={selectedServices}
                setDataAction={setSelectedServices}
                reloadData={() => fetchAllServices()}
                setLoader={setIsLoading}
              />
            </div>
            <div className="overflow-y-auto scrollbar-thin h-[81%] border border-slate-400">
              {isLoadingPage ? (
                <div className="flex w-full h-full justify-center items-center">
                  <LoadingSpinner size={60} />
                </div>
              ) : (
                <table className="min-w-full">
                  <thead className="bg-gray-200 sticky top-[-1px] z-10">
                    <tr>
                      <th></th>
                      {/* <th className="border border-gray-300 p-1">ID</th> */}
                      <th className="border border-gray-300 p-1">Tên dịch vụ</th>
                      <th className="border border-gray-300 p-1">Ngày tạo</th>
                      <th className="border border-gray-300 p-1">Giá tiền</th>
                      <th className="border border-gray-300 p-1">Trạng thái</th>
                      <th className="border border-gray-300 p-1">Mô tả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicesTemp.map((service, index) => (
                      <tr
                        onClick={() => {
                          handleViewDetail(service);
                          setSelectedServices([]);
                        }}
                        key={service.id}
                        className={`${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                        } border-b cursor-pointer border-gray-300 hover:bg-slate-200`}
                      >
                        {renderServices(service, index)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex justify-between items-center h-[6%]">
              <Pagination
                limit={limit}
                // totalRecords={totalRecords}
                setLimit={setLimit}
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
        return <InfoDetail type={ETypeInfoDetail.SERVICE} />;
    }
  };

  const handleCheckboxChange = (service: IService) => {
    setSelectedServices((prevSelected) => {
      if (prevSelected.find((a) => a.id === service.id)) {
        return prevSelected.filter((a) => a.id !== service.id);
      } else {
        return [...prevSelected, service];
      }
    });
  };

  const renderServices = (service: IService, index: number) => {
    if (service.isRemoved == true) {
      return;
    }

    return (
      <>
        <td className="border border-gray-300" onClick={(e) => e.stopPropagation()}>
          <div className="p-2">
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={selectedServices.some((s) => s.id === service.id)}
              onChange={() => handleCheckboxChange(service)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </td>
        {/* <td className="border border-gray-300 p-1" title={`ID: ${service.id}`}>
          {service.id}
        </td> */}
        <td className="border border-gray-300 p-1 max-w-[130px]" title={`Tên dịch vụ: ${service.name}`}>
          {service.name}
        </td>
        <td className="border border-gray-300 p-1" title={`Ngày tạo: ${new Date(service.createdAt).toLocaleDateString()}`}>
          {getFormattedDate(service.createdAt)}
        </td>
        <td className="border border-gray-300 p-1" title={`Giá tiền: ${formatPrice(service.price)}`}>
          {formatPrice(service.price)}
        </td>
        <td
          className="h-full justify-center items-center p-0 max-w-[110px]"
          title={`Trạng thái: ${service.status == false ? 'Tạm dừng' : 'Đang hoạt động'}`}
        >
          {/* // false 0 tạm dừng, true  1 là Đang hoạt động */}
          {service.status == false ? (
            <span className="bg-yellow-200 rounded-lg py-1 px-1.5 flex m-1  items-center">Tạm dừng</span>
          ) : service.status == true ? (
            <span className="bg-green-400 rounded-lg py-1 px-1.5 flex m-1 items-center justify-center ">Đang hoạt động</span>
          ) : (
            'error'
          )}
        </td>
        <td className="border border-gray-300 py-1 px-2 max-w-[350px]" title="Description">
          {service.description}
        </td>
      </>
    );
  };
  const handleGoToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full h-full">
      <div className="h-[6%] flex border-b border-slate-400">
        <SwitchSideBar title="Danh sách dịch vụ" className="font-bold text-lg" />
        <Breadcrumb />
      </div>

      {renderContent()}

      <Drawer dataBranchsChoose={branchs} isOpen={isOpenDrawer} onClose={toggleDrawer} type={ETypeAdd.SERVICE} />
    </div>
  );
};

export default AllServices;
