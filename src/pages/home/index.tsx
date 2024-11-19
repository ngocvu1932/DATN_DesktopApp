import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import SwitchSideBar from '../../components/switch-sidebar';
import {useTranslation} from 'react-i18next';
import BarChart from '../../components/chart';
import {ETypeChart} from '../../components/chart/enum';
import Breadcrumb from '../../components/breadcrumb';
import '../../global.css';
import {fetchAppointments, fetchServices} from '../../utils/redux-until';
import {IAppointment} from '../../models/appointment';
import {IFilterForYear} from './interface';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleDown, faAngleUp, faSortDown, faSortUp} from '@fortawesome/free-solid-svg-icons';
import CircularProgress from '../../components/process-provider';
import ProcessView from '../../components/process-view';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const appointments: IAppointment[] = useSelector((state: any) => state.appointments.appointments);
  const {t} = useTranslation();
  const [isOpen, setIsOpen] = useState({
    year: false,
    typeChart: false,
  });

  // filter for chart
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [typeChart, setTypeChart] = useState<string>(ETypeChart.LINE);
  const [filterForYear, setFilterForYear] = useState<IFilterForYear>({
    dataAppointmentsForMonth: [
      {month: 'January', count: 0},
      {month: 'February', count: 0},
      {month: 'March', count: 0},
      {month: 'April', count: 0},
      {month: 'May', count: 0},
      {month: 'June', count: 0},
      {month: 'July', count: 0},
      {month: 'August', count: 0},
      {month: 'September', count: 0},
      {month: 'October', count: 0},
      {month: 'November', count: 0},
      {month: 'December', count: 0},
    ],
    dataServicesForMonth: [],
    dataAppointmentsForDay: [],
  });

  const years = ['2022', '2023', '2024', '2025', '2026']; // list year
  const typeCharts = [ETypeChart.LINE, ETypeChart.BAR]; // list type chart

  useEffect(() => {
    fetchAppointments(dispatch);
    fetchServices(dispatch);
  }, []);

  useEffect(() => {
    const updatedFilterForYear: IFilterForYear = {
      ...filterForYear,
      dataAppointmentsForMonth: filterForYear.dataAppointmentsForMonth.map((month) => ({...month, count: 0})),
    };

    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.time);
      const appointmentYear = appointmentDate.getFullYear();

      if (appointmentYear.toString() === year) {
        const monthIndex = appointmentDate.getMonth();
        updatedFilterForYear.dataAppointmentsForMonth[monthIndex].count += 1;
      }
    });

    setFilterForYear(updatedFilterForYear);
  }, [appointments, year]);

  const handleSelectYear = (year: string) => {
    setYear(year);
    setIsOpen({...isOpen, year: false});
  };

  const handleSelectTypeChart = (type: ETypeChart) => {
    setTypeChart(type);
    setIsOpen({...isOpen, typeChart: false});
  };

  return (
    <div className="w-full h-full">
      <div className="h-[6%] flex border-b border-slate-400">
        <SwitchSideBar title={`${t('home_title')}, ${userInfo?.name}!`} className="font-bold text-lg" />
        <Breadcrumb />
      </div>

      <div className="flex flex-grow h-[94%] scrollbar-thin flex-col overflow-y-auto">
        <div className="flex mt-2 p-2">
          <ProcessView title="Số lịch hẹn mới" value={400} />
        </div>
        <div className="flex w-full min-h-[350px] mt-5 p-2">
          <div className="flex w-full bg-white p-3 rounded-xl shadow-md">
            <div className="flex w-4/5 justify-start h-full">
              <BarChart
                data={filterForYear.dataAppointmentsForMonth}
                title={`Số lượng lịch hẹn trong tháng theo năm ${year}`}
                type={typeChart == ETypeChart.LINE ? ETypeChart.LINE : ETypeChart.BAR}
              />
            </div>

            <div className="flex w-1/5  border rounded-lg border-slate-300 flex-col">
              <div className="relative mt-3 mx-4">
                <div
                  className="flex justify-between items-center px-2 py-1 bg-white cursor-pointer border border-gray-300 rounded-md shadow-md"
                  onClick={() => setIsOpen({...isOpen, year: !isOpen.year, typeChart: false})}
                >
                  <span>Năm: {year}</span>
                  <div className="flex items-center justify-center ml-3">
                    <FontAwesomeIcon className="text-center" icon={isOpen.year ? faAngleUp : faAngleDown} />
                  </div>
                </div>

                {isOpen.year && (
                  <div className="absolute bg-white border border-gray-300 w-full rounded-md shadow-lg z-10">
                    {years.map((years) => (
                      <div
                        key={years}
                        className={`p-2 cursor-pointer rounded-md hover:bg-gray-200`}
                        onClick={() => handleSelectYear(years)}
                      >
                        {years}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative mt-3 mx-4">
                <div
                  className="flex justify-between items-center px-2 py-1 bg-white cursor-pointer border border-gray-300 rounded-md shadow-md"
                  onClick={() => setIsOpen({...isOpen, typeChart: !isOpen.typeChart, year: false})}
                >
                  <span>Dạng: {typeChart == ETypeChart.LINE ? 'Line' : 'Bar'}</span>
                  <div className="flex items-center justify-center ml-3">
                    <FontAwesomeIcon className="text-center" icon={isOpen.year ? faAngleUp : faAngleDown} />
                  </div>
                </div>

                {isOpen.typeChart && (
                  <div className="absolute bg-white border border-gray-300 w-full rounded-md shadow-lg z-10">
                    {typeCharts.map((type, index) => (
                      <div
                        key={index}
                        className={`p-2 cursor-pointer rounded-md hover:bg-gray-200`}
                        onClick={() => handleSelectTypeChart(type)}
                      >
                        {type == ETypeChart.LINE ? 'Line' : 'Bar'}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full min-h-[350px] mt-5 p-2">
          <div className="flex w-full bg-white p-3 rounded-xl shadow-md">
            <div className="flex w-4/5 justify-start h-full">
              <BarChart
                data={filterForYear.dataAppointmentsForMonth}
                title={`Số lượng lịch hẹn trong tháng theo năm ${year}`}
                type={typeChart == ETypeChart.LINE ? ETypeChart.LINE : ETypeChart.BAR}
              />
            </div>

            <div className="flex w-1/5  border rounded-lg border-slate-300 flex-col">
              <div className="relative mt-3 mx-4">
                <div
                  className="flex justify-between items-center px-2 py-1 bg-white cursor-pointer border border-gray-300 rounded-md shadow-md"
                  onClick={() => setIsOpen({...isOpen, year: !isOpen.year, typeChart: false})}
                >
                  <span>Năm: {year}</span>
                  <div className="flex items-center justify-center ml-3">
                    <FontAwesomeIcon className="text-center" icon={isOpen.year ? faAngleUp : faAngleDown} />
                  </div>
                </div>

                {isOpen.year && (
                  <div className="absolute bg-white border border-gray-300 w-full rounded-md shadow-lg z-10">
                    {years.map((years) => (
                      <div
                        key={years}
                        className={`p-2 cursor-pointer rounded-md hover:bg-gray-200`}
                        onClick={() => handleSelectYear(years)}
                      >
                        {years}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative mt-3 mx-4">
                <div
                  className="flex justify-between items-center px-2 py-1 bg-white cursor-pointer border border-gray-300 rounded-md shadow-md"
                  onClick={() => setIsOpen({...isOpen, typeChart: !isOpen.typeChart, year: false})}
                >
                  <span>Dạng: {typeChart == ETypeChart.LINE ? 'Line' : 'Bar'}</span>
                  <div className="flex items-center justify-center ml-3">
                    <FontAwesomeIcon className="text-center" icon={isOpen.year ? faAngleUp : faAngleDown} />
                  </div>
                </div>

                {isOpen.typeChart && (
                  <div className="absolute bg-white border border-gray-300 w-full rounded-md shadow-lg z-10">
                    {typeCharts.map((type, index) => (
                      <div
                        key={index}
                        className={`p-2 cursor-pointer rounded-md hover:bg-gray-200`}
                        onClick={() => handleSelectTypeChart(type)}
                      >
                        {type == ETypeChart.LINE ? 'Line' : 'Bar'}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
      </div>
    </div>
  );
};

export default Home;
