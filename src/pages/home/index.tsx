import React from 'react';
import {useSelector} from 'react-redux';
import SwitchSideBar from '../../components/switch-sidebar';
import {useTranslation} from 'react-i18next';
import BarChart from '../../components/chart';
import {ETypeChart} from '../../components/chart/enum';
import Breadcrumb from '../../components/breadcrumb';
import '../../global.css';

const Home: React.FC = () => {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const {t} = useTranslation();

  return (
    <div className="w-full h-full">
      <div className="h-[6%] flex border-b border-slate-400">
        <SwitchSideBar title={`${t('home_title')}, ${userInfo?.name}!`} className="font-bold text-lg" />
        <Breadcrumb />
      </div>

      {/* <div className="flex flex-grow h-[94%] scrollbar-thin flex-col overflow-y-auto">
        <div className="flex w-full min-h-[300px] mt-5">
          <div className="flex w-1/2 p-2">
            <div className="flex w-full justify-center h-full bg-white p-3 rounded-xl shadow-md">
              <BarChart type={ETypeChart.LINE} />
            </div>
          </div>

          <div className="flex w-1/2 p-2">
            <div className="flex w-full justify-center h-full bg-white p-3 rounded-xl shadow-md">
              <BarChart type={ETypeChart.BAR} />
            </div>
          </div>
        </div>

        <div className="flex w-full">
          <div className="flex w-1/2 p-2">
            <div className="flex w-full justify-center h-full bg-white p-3 rounded-xl shadow-md">
              <BarChart type={ETypeChart.COMBO} />
            </div>
          </div>

          <div className="flex w-1/2 p-2">
            <div className="flex w-full justify-center h-full bg-white p-3 rounded-xl shadow-md">
              <BarChart type={ETypeChart.RADAR} />
            </div>
          </div>
        </div>

        <div className="flex w-full">
          <div className="flex w-1/2 p-2">
            <div className="flex w-full justify-center h-full bg-white p-3 rounded-xl shadow-md">
              <BarChart type={ETypeChart.PIE} />
            </div>
          </div>

          <div className="flex w-1/2 p-2">
            <div className="flex w-full justify-center h-full bg-white p-3 rounded-xl shadow-md">
              <BarChart type={ETypeChart.DOUGHNUT} />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Home;
