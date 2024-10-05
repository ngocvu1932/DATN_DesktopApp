import React from 'react';
import BarChart from '../../components/chart';
import SwitchSideBar from '../../components/switch-sidebar';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRotate} from '@fortawesome/free-solid-svg-icons';

const RevenueManagement: React.FC = () => {
  return (
    <div className={`w-full h-full`}>
      <div className="flex justify-between pb-2">
        <SwitchSideBar title="Báo cáo doanh thu" className="font-bold text-lg" />

        <div className="flex-1 flex items-center justify-end">
          <button className="border border-white bg-slate-400 px-3.5 py-1 rounded-lg" title="Làm mới">
            <FontAwesomeIcon icon={faRotate} />
          </button>
        </div>
      </div>
      <BarChart />
    </div>
  );
};

export default RevenueManagement;
