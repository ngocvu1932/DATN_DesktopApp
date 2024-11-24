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
import {allSkills} from '../../api/skills';
import {ISkill} from '../../models/skill';

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [skillsTemp, setSkillsTemp] = useState<ISkill[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRes, setCurrentPageRes] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [editStatuses, setEditStatuses] = useState<{[key: number]: boolean}>({});
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const dispatch = useDispatch();
  const layoutInfo = useSelector((state: any) => state.layoutInfo.layoutBranch);
  const [selectedSkills, setSelectedSkills] = useState<ISkill[]>([]);
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
      const response = await allSkills(currentPage, limit);
      if (response?.statusCode === 200) {
        setSkills(response?.data);
        setSkillsTemp(response?.data);
        setTotalPages(response?.pagination?.totalPages ?? 0);
        setCurrentPageRes(response?.pagination?.page ?? 0);
        setIsLoadingPage(false);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleCheckboxChange = (skill: ISkill) => {
    setSelectedSkills((prevSelected) => {
      if (prevSelected.find((b) => b.id === skill.id)) {
        return prevSelected.filter((b) => b.id !== skill.id);
      } else {
        return [...prevSelected, skill];
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
                setDataFilter={setSkillsTemp}
                dataFilter={skills}
                toggleDrawer={toggleDrawer}
                type={EFilterType.BRANCH}
                dataAction={selectedSkills}
                showToast={showToast}
                reloadData={() => fetchBranchs()}
                setDataAction={setSelectedSkills}
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
                      <th className="border border-gray-300 p-1">Kỹ năng</th>
                      <th className="border border-gray-300 p-1">Danh mục</th>
                      <th className="border border-gray-300 p-1">Mô tả</th>
                      <th className="border border-gray-300 p-1">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto">
                    {skillsTemp.map((skill, index) => (
                      <tr
                        onClick={() => {
                          handleViewDetail(skill);
                          setSelectedSkills([]);
                        }}
                        key={skill.id}
                        className={`${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                        } border-b cursor-pointer hover:bg-slate-200 border-gray-300`}
                      >
                        {renderSkill(skill, index)}
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

  const renderSkill = (skill: ISkill, index: number) => {
    if (skill.isRemoved == true) {
      return;
    }
    return (
      <>
        <td className="border border-gray-300" onClick={(e) => e.stopPropagation()}>
          <div className="p-3">
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={selectedSkills.some((b) => b.id === skill.id)}
              onChange={() => handleCheckboxChange(skill)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </td>
        <td className="border border-gray-300 p-1" title={`Tên chi nhánh: ${skill.name}`}>
          {skill.name}
        </td>
        <td className="border border-gray-300 p-1" title={`Tên chi nhánh: ${skill.category}`}>
          {skill.category}
        </td>
        <td className="border border-gray-300 p-1" title={`Tên chi nhánh: ${skill.description}`}>
          {skill.description}
        </td>
        <td
          className="h-full justify-center items-center p-0"
          title={`Trạng thái: ${skill.status == false ? 'OFF' : 'Đang hoạt động'}`}
        >
          {/*   true là đang hoạt động, false OFFF*/}
          {skill.status == false ? (
            <span className="bg-yellow-200 rounded-lg py-1 px-1.5 flex m-1  items-center">OFF</span>
          ) : skill.status == true ? (
            <span className="bg-green-400 rounded-lg py-1 px-1.5 flex m-1 items-center ">Đang hoạt động</span>
          ) : (
            <>Error</>
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
        <SwitchSideBar title="Danh sách kỹ năng" className="font-bold text-lg" />
        {/* <Breadcrumb /> */}
      </div>

      {renderContent()}

      <Drawer isOpen={isOpenDrawer} onClose={toggleDrawer} type={ETypeAdd.BRANCH} />
    </div>
  );
};

export default Skills;
