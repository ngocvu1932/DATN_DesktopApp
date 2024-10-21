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

const AllServices: React.FC = () => {
  const [services, setAllservices] = useState<IService[]>([]);
  const [servicesTemp, setAllServicesTemp] = useState<IService[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRes, setCurrentPageRes] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [editStatuses, setEditStatuses] = useState<{[key: number]: boolean}>({});
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const dispatch = useDispatch();
  const layoutInfo = useSelector((state: any) => state.layoutInfo.layoutService);
  const [selectedServices, setSelectedServices] = useState<IService[]>([]);

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  useEffect(() => {
    fetchAllServices();
  }, [currentPage, isOpenDrawer, layoutInfo]);

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

  const handleToggleEdit = (index: number) => {
    setEditStatuses((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleViewDetail = (service: any) => {
    dispatch(
      setInfoLayout({
        layoutBranch: {layout: ELayoutInfo.Home, data: null},
        layoutAppointment: {layout: ELayoutInfo.Home, data: null},
        layoutService: {layout: ELayoutInfo.Details, data: service},
      })
    );
  };

  const renderContent = () => {
    switch (layoutInfo?.layout) {
      case ELayoutInfo.Home:
        return (
          <>
            <div className="h-[13%] flex w-full">
              <Filter
                showToast={showToast}
                setDataFilter={setAllServicesTemp}
                dataFilter={services}
                toggleDrawer={toggleDrawer}
                type={EFilterType.SERVICE}
                dataAction={selectedServices}
                setDataAction={setSelectedServices}
                reloadData={() => fetchAllServices()}
              />
            </div>
            <div className="overflow-y-auto scrollbar-thin h-[75%] border border-slate-400">
              {isLoadingPage ? (
                <div className="flex w-full h-full justify-center items-center">
                  <LoadingSpinner size={60} />
                </div>
              ) : (
                <table className="min-w-full">
                  <thead className="bg-gray-200 sticky top-[-1px] z-10">
                    <tr>
                      <th></th>
                      <th className="border border-gray-300 p-1">ID</th>
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
        <td className="border border-gray-300 p-1">{service.id}</td>
        <td className="border border-gray-300 p-1 max-w-[130px]">{service.name}</td>
        <td className="border border-gray-300 p-1">{new Date(service.updated_at).toLocaleDateString()}</td>
        <td className="border border-gray-300 p-1">{service.price}</td>
        <td className="h-full justify-center items-center p-0 max-w-[110px]">
          {service.status !== 1 ? (
            <span className="bg-yellow-200 rounded-lg py-1 px-1.5 flex m-1  items-center">Tạm dừng</span>
          ) : (
            <span className="bg-green-400 rounded-lg py-1 px-1.5 flex m-1 items-center justify-center ">
              Đang hoạt động
            </span>
          )}
        </td>
        <td className="border border-gray-300 py-1 px-2 max-w-[350px]">{service.description}</td>
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

      <Drawer isOpen={isOpenDrawer} onClose={toggleDrawer} type={ETypeAdd.SERVICE} />
    </div>
  );
};

export default AllServices;
