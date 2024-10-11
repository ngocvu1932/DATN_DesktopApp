import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {useEffect, useState} from 'react';
import Drawer from '../../components/drawer';
import {toast, ToastContainer} from 'react-toastify';
import {ETypeAdd} from '../../components/drawer/enum';
import TextInput from '../../components/text-input';
import SwitchSideBar from '../../components/switch-sidebar';
import LoadingSpinner from '../../components/loading-spinner';
import {getFormattedDate, getFormattedTime} from '../../utils/dateTime';
import {IAppointment} from '../../models/appointment';
import {allAppointment, updateStatusAppointment} from '../../api/appointment';
import {useDispatch, useSelector} from 'react-redux';
import {getAllBranch} from '../../api/branch';
import {IBranch} from '../../models/branch';
import Filter from '../../components/filter';
import Divider from '../../components/divider';
import {EFilterType} from '../../components/filter/enum';
import Pagination from '../../components/pagination';

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

  const toggleDrawer = () => {
    setIsOpenDrawer(!isOpenDrawer);
  };

  useEffect(() => {
    fetchBranchs();
  }, [currentPage]);

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
      fetchBranchs();
      toast.success('Cập nhật thành công!', {autoClose: 1000});
      handleToggleEdit(index);
    } else {
      toast.error('Cập nhật thất bại!', {autoClose: 1000});
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
        <td className="border border-gray-300 p-1">{branch.id}</td>
        <td className="border border-gray-300 p-1">{branch.name}</td>
        <td className="border border-gray-300 p-1">{branch.address}</td>
        <td className="border border-gray-300 p-1">{branch.phone}</td>
        <td className="border border-gray-300 p-1">{branch.email}</td>
        <td className="flex justify-center">
          <select
            className={`${statuses.status !== 1 ? 'bg-yellow-200' : 'bg-green-400'} rounded-lg p-1 flex`}
            defaultValue={statuses.status}
            onChange={handleChangeStatus}
            disabled={!editStatuses[index]}
          >
            <option value="1">Đang hoạt động</option>
            <option value="2">OFF</option>
          </select>
        </td>
        <td className="border border-gray-300 p-1">
          <button
            onClick={() => handleToggleEdit(index)}
            className={`${
              editStatuses[index] ? 'bg-[#CCCCCC] text-black' : 'bg-[#4D90FE] text-white'
            } px-1.5 py-0.5  rounded-lg`}
          >
            {editStatuses[index] ? 'Hủy' : 'Sửa'}
          </button>
          {editStatuses[index] && <button className="bg-[#28A745] px-1.5 py-0.5 rounded-lg text-white">Lưu</button>}
          <button className="bg-[#FF4B4B] px-1.5 py-0.5 rounded-lg text-[#FFFFFF]">Xóa</button>
        </td>
      </>
    );
  };

  const handleGoToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isLoadingPage) {
    return <LoadingSpinner size={60} />;
  }

  return (
    <div className="w-full h-full">
      <div className="h-[19%] flex flex-col">
        <SwitchSideBar title="Danh sách chi nhánh" className="font-bold text-lg" />

        <Filter
          setDataFilter={setBranchsTemp}
          dataFilter={branchs}
          toggleDrawer={toggleDrawer}
          type={EFilterType.BRANCH}
        />
      </div>

      <div className="overflow-y-auto h-[75%] border-b border-x border-slate-400">
        <table className="min-w-full">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th className="border border-gray-300 p-1">ID</th>
              <th className="border border-gray-300 p-1">Tên chi nhánh</th>
              <th className="border border-gray-300 p-1">Địa chỉ</th>
              <th className="border border-gray-300 p-1">Số điện thoại</th>
              <th className="border border-gray-300 p-1">Email</th>
              <th className="border border-gray-300 p-1">Trạng thái</th>
              <th className="border border-gray-300 p-1">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {branchsTemp.map((branch, index) => (
              <tr
                key={branch.id}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} border-b border-gray-300`}
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

      <Drawer isOpen={isOpenDrawer} onClose={toggleDrawer} type={ETypeAdd.BRANCH} />

      <ToastContainer />
    </div>
  );
};

export default BranchManagement;
