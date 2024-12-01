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

const BranchManagement: React.FC = () => {
  const [branchs, setBranchs] = useState<IBranch[]>([]);
  const [branchsTemp, setBranchsTemp] = useState<IBranch[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRes, setCurrentPageRes] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [editStatuses, setEditStatuses] = useState<{[key: number]: boolean}>({});
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const dispatch = useDispatch();
  const layoutInfo = useSelector((state: any) => state.layoutInfo.layoutBranch);
  const [selectedBranches, setSelectedBranches] = useState<IBranch[]>([]);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsLoadingPage(isLoading);
    }
  }, [isLoading]);

  useEffect(() => {
    fetchBranchs();
  }, [currentPage, layoutInfo, limit]);

  useEffect(() => {
    if (isOpenDrawer == false) {
      fetchBranchs();
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

  const fetchBranchs = async () => {
    try {
      setIsLoadingPage(true);
      const response = await getAllBranch(currentPage, limit);
      if (response?.statusCode === 200) {
        setBranchs(response?.data);
        setBranchsTemp(response?.data);
        setTotalPages(response?.pagination?.totalPages ?? 0);
        setCurrentPageRes(response?.pagination?.page ?? 0);
        setIsLoadingPage(false);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleCheckboxChange = (branch: IBranch) => {
    setSelectedBranches((prevSelected) => {
      if (prevSelected.find((b) => b.id === branch.id)) {
        return prevSelected.filter((b) => b.id !== branch.id);
      } else {
        return [...prevSelected, branch];
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
                setDataFilter={setBranchsTemp}
                dataFilter={branchs}
                toggleDrawer={toggleDrawer}
                type={EFilterType.BRANCH}
                dataAction={selectedBranches}
                showToast={showToast}
                reloadData={() => fetchBranchs()}
                setDataAction={setSelectedBranches}
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
                      {/* <th className="border border-gray-300 p-1">ID</th> */}
                      <th className="border border-gray-300 p-1">Tên chi nhánh</th>
                      <th className="border border-gray-300 p-1">Địa chỉ</th>
                      <th className="border border-gray-300 p-1">Số điện thoại</th>
                      <th className="border border-gray-300 p-1">Email</th>
                      <th className="border border-gray-300 p-1">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto">
                    {branchsTemp.map((branch, index) => (
                      <tr
                        onClick={() => {
                          handleViewDetail(branch);
                          setSelectedBranches([]);
                        }}
                        key={branch.id}
                        className={`${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                        } border-b cursor-pointer hover:bg-slate-200 border-gray-300`}
                      >
                        {renderBranch(branch, index)}
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
        return <InfoDetail type={ETypeInfoDetail.BRANCH} />;
    }
  };

  const renderBranch = (branch: IBranch, index: number) => {
    if (branch.isRemoved == true) {
      return;
    }
    return (
      <>
        <td className="border border-gray-300" onClick={(e) => e.stopPropagation()}>
          <div className="p-3">
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={selectedBranches.some((b) => b.id === branch.id)}
              onChange={() => handleCheckboxChange(branch)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </td>
        {/* <td className="border border-gray-300 p-1 font-semibold">{branch.id}</td> */}
        <td className="border border-gray-300 p-1" title={`Tên chi nhánh: ${branch.name}`}>
          {branch.name}
        </td>
        <td className="border border-gray-300 p-1" title={`Địa chỉ: ${branch.address}`}>
          {branch.address}
        </td>
        <td className="border border-gray-300 p-1" title={`Số điện thoại: ${branch.phone}`}>
          {branch.phone}
        </td>
        <td className="border border-gray-300 p-1" title={`Email: ${branch.email}`}>
          {branch.email}
        </td>
        <td
          className="h-full justify-center px-1 items-center p-0"
          title={`Trạng thái: ${branch.status == false ? 'OFF' : 'Đang hoạt động'}`}
        >
          {/*   true là đang hoạt động, false OFFF*/}
          {branch.status == true ? (
            <span className="border-gray-300 rounded-lg border  text-green-500 p-1 flex items-center whitespace-nowrap">
              Đang hoạt động
            </span>
          ) : branch.status == false ? (
            <span className="border-gray-300 rounded-lg border p-1 text-yellow-500 flex items-center ">OFF</span>
          ) : (
            ''
          )}
        </td>
      </>
    );
  };

  const handleViewDetail = (branch: any) => {
    dispatch(
      setInfoLayout({
        layoutBranch: {layout: ELayoutInfo.Details, data: branch},
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
        <SwitchSideBar title="Danh sách chi nhánh" className="font-bold text-lg" />
        <Breadcrumb />
      </div>

      {renderContent()}

      <Drawer isOpen={isOpenDrawer} onClose={toggleDrawer} type={ETypeAdd.BRANCH} />
    </div>
  );
};

export default BranchManagement;
