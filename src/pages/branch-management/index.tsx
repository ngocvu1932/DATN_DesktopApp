import React, {useEffect, useState} from 'react';
import Drawer from '../../components/drawer';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

const BranchManagement: React.FC = () => {
  const [branchs, setBranchs] = useState<IBranch[]>([]);
  const [branchsTemp, setBranchsTemp] = useState<IBranch[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRes, setCurrentPageRes] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [editStatuses, setEditStatuses] = useState<{[key: number]: boolean}>({});
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const dispatch = useDispatch();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const layoutInfo = useSelector((state: any) => state.layoutInfo.layoutBranch);
  const [selectedBranches, setSelectedBranches] = useState<IBranch[]>([]);

  const toggleDrawer = () => {
    setIsOpenDrawer(!isOpenDrawer);
  };

  useEffect(() => {
    fetchBranchs();
  }, [currentPage, layoutInfo]);

  const fetchBranchs = async () => {
    try {
      const response = await getAllBranch(currentPage, limit);
      if (response?.statusCode === 200) {
        setBranchs(response?.data);
        setBranchsTemp(response?.data);
        setTotalPages(response?.pagination?.totalPage ?? 0);
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

  const handleToggleEdit = (index: number) => {
    setEditStatuses((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSave = async (appointmentId: number, status: number, index: number) => {
    const res = await updateStatusAppointment(appointmentId, {status});
    if (res?.statusCode === 200) {
      fetchBranchs();
      toast.success('Cập nhật thành công!', {autoClose: 1000});
      handleToggleEdit(index);
    } else {
      toast.error('Cập nhật thất bại!', {autoClose: 1000});
    }
  };

  const renderContent = () => {
    switch (layoutInfo?.layout) {
      case ELayoutInfo.Home:
        return (
          <>
            <div className="h-[13%] flex w-full">
              <Filter
                setDataFilter={setBranchsTemp}
                dataFilter={branchs}
                toggleDrawer={toggleDrawer}
                type={EFilterType.BRANCH}
                dataAction={selectedBranches}
              />
            </div>

            <div className="overflow-y-auto h-[75%] border border-slate-400">
              <table className="min-w-full">
                <thead className="bg-gray-200 sticky top-0 z-10">
                  <tr>
                    <th></th>
                    <th className="border border-gray-300 p-1">ID</th>
                    <th className="border border-gray-300 p-1">Tên chi nhánh</th>
                    <th className="border border-gray-300 p-1">Địa chỉ</th>
                    <th className="border border-gray-300 p-1">Số điện thoại</th>
                    <th className="border border-gray-300 p-1">Email</th>
                    <th className="border border-gray-300 p-1">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {branchsTemp.map((branch, index) => (
                    <tr
                      onClick={() => handleViewDetail(branch)}
                      key={branch.id}
                      className={`${
                        index % 2 === 0 ? 'bg-white' : 'bg-white'
                      } border-b cursor-pointer hover:bg-gray-100 border-gray-300`}
                    >
                      {renderBranch(branch, index)}
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
          </>
        );
      case ELayoutInfo.Details:
        return <InfoDetail />;
    }
  };

  const renderBranch = (branch: IBranch, index: number) => {
    const statuses = {
      appointmentId: branch.id,
      status: branch.status === 1 ? 1 : 2,
    };

    const handleChangeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
      statuses.status = Number(event.target.value);
    };

    return (
      <>
        <td>
          <div className="p-3">
            <input
              type="checkbox"
              className=""
              checked={selectedBranches.some((b) => b.id === branch.id)}
              onChange={() => handleCheckboxChange(branch)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </td>
        <td className="border border-gray-300 p-1">{branch.id}</td>
        <td className="border border-gray-300 p-1" title={`Tên chi nhánh: ${branch.name}`}>
          {branch.name}
        </td>
        <td className="border border-gray-300 p-1" title={`Address: ${branch.address}`}>
          {branch.address}
        </td>
        <td className="border border-gray-300 p-1">{branch.phone}</td>
        <td className="border border-gray-300 p-1">{branch.email}</td>
        <td className="h-full justify-center items-center p-0">
          <div className="flex justify-center">
            <select
              className={`${statuses.status !== 1 ? 'bg-yellow-200' : 'bg-green-400'} rounded-lg p-1`}
              defaultValue={statuses.status}
              onChange={handleChangeStatus}
              disabled={!editStatuses[index]}
            >
              <option value="1">Đang hoạt động</option>
              <option value="2">OFF</option>
            </select>
          </div>
        </td>
      </>
    );
  };

  const handleViewDetail = (branch: any) => {
    dispatch(setInfoLayout({layoutBranch: {layout: ELayoutInfo.Details, data: branch}}));
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

  if (isLoadingPage) {
    return <LoadingSpinner size={60} />;
  }

  return (
    <div className="w-full h-full">
      <div className="h-[6%] flex border-b border-slate-400">
        <SwitchSideBar title="Danh sách chi nhánh" className="font-bold text-lg" />
        <Breadcrumb />
      </div>

      {renderContent()}

      <Drawer isOpen={isOpenDrawer} onClose={toggleDrawer} type={ETypeAdd.BRANCH} />

      <ToastContainer />
    </div>
  );
};

export default BranchManagement;
