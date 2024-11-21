import React, {useEffect, useState} from 'react';
import BarChart from '../../components/chart';
import SwitchSideBar from '../../components/switch-sidebar';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRotate} from '@fortawesome/free-solid-svg-icons';
import {ETypeChart} from '../../components/chart/enum';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {IAppointment} from '../../models/appointment';
import {IFilterForYear} from '../home/interface';
import {fetchAppointments, fetchServices} from '../../utils/redux-until';
import LoadingSpinner from '../../components/loading-spinner';
import {IService} from '../../models/service';
import {ETypeChooseForChart, IMonthChoose, ITypeChart, IYearChoose} from './interface';
import {getDaysArrayInMonth} from '../../utils/dateTime';
import SelectOption from '../../components/select-options';
import {data} from '@remix-run/router/dist/utils';

const RevenueManagement: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const appointments: IAppointment[] = useSelector((state: any) => state.appointments.appointments);
  const services: IService[] = useSelector((state: any) => state.services.services);
  const {t} = useTranslation();
  const [haveChooseMonth, setHaveChooseMonth] = useState({
    appointment: false,
    service: false,
  });

  const [isOpen, setIsOpen] = useState({
    appointment: {year: false, typeChart: false, month: false},
    service: {year: false, typeChart: false, month: false},
  });

  // filter for chart
  const [year, setYear] = useState<IYearChoose>({
    appointment: new Date().getFullYear().toString(),
    service: new Date().getFullYear().toString(),
  });

  const [month, setMonth] = useState<IMonthChoose>({
    appointment: 0,
    service: 0,
  });

  const monthsForChoose = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const [typeChart, setTypeChart] = useState<ITypeChart>({
    appointment: ETypeChart.LINE,
    service: ETypeChart.LINE,
  });

  const years = ['2023', '2024', '2025', '2026', '2027']; // list year
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const [days, setDays] = useState({
    appointment: getDaysArrayInMonth(new Date().getFullYear(), new Date().getMonth()),
    service: getDaysArrayInMonth(new Date().getFullYear(), new Date().getMonth()),
  });

  const [filterForYear, setFilterForYear] = useState<IFilterForYear>({
    dataAppointmentsForMonth: months.map((month) => ({month, count: 0})),
    dataAppointmentsForDay: days.appointment.map((day) => ({day: day.toString(), count: 0})),
    dataServicesForMonth: services.map((service) => ({id: service.id, month: service.name, count: 0})),
  });

  const typeCharts = [ETypeChart.LINE, ETypeChart.BAR];

  useEffect(() => {
    setDays({...days, appointment: getDaysArrayInMonth(Number(year.appointment), month.appointment)});
  }, [month.appointment, year.appointment]);

  useEffect(() => {
    setFilterForYear((pre) => ({
      ...pre,
      dataAppointmentsForDay: days.appointment.map((day) => ({day: day.toString(), count: 0})),
    }));
  }, [days.appointment]);

  useEffect(() => {
    const updatedFilterForYear: IFilterForYear = {
      dataAppointmentsForMonth: filterForYear.dataAppointmentsForMonth.map((month) => ({...month, count: 0})),
      dataAppointmentsForDay: days.appointment.map((day) => ({day: day.toString(), count: 0})),
      dataServicesForMonth: filterForYear.dataServicesForMonth.map((month) => ({...month, count: 0})),
    };

    // Lọc lịch hẹn theo tháng và năm
    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.time);
      const appointmentYear = appointmentDate.getFullYear();

      if (appointmentYear.toString() === year.appointment) {
        const monthIndex = appointmentDate.getMonth();
        updatedFilterForYear.dataAppointmentsForMonth[monthIndex].count += 1;
      }
    });

    // Cập nhật số lượng lịch hẹn theo ngày trong tháng đã chọn
    appointments.forEach((appointment, index) => {
      const appointmentDate = new Date(appointment.time);
      const appointmentYear = appointmentDate.getFullYear();
      const appointmentMonth = appointmentDate.getMonth() + 1; // hàm này lấy tháng từ 0-11 -> +1 để lấy tháng từ 1-12
      const appointmentDay = appointmentDate.getDate();
      if (appointmentYear == parseInt(year.appointment) && appointmentMonth == month.appointment) {
        const dayIndex = updatedFilterForYear.dataAppointmentsForDay.findIndex((day) => day.day === appointmentDay.toString());
        if (dayIndex !== -1) {
          updatedFilterForYear.dataAppointmentsForDay[dayIndex].count += 1;
        } else {
          updatedFilterForYear.dataAppointmentsForDay.push({
            day: appointmentDay.toString(),
            count: 1,
          });
        }
      }
    });

    // Cập nhật số lượng dịch vụ sử dụng theo năm
    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.time);
      const appointmentYear = appointmentDate.getFullYear();

      if (appointmentYear.toString() === year.service) {
        const service = services.find((service) => service.id === appointment.serviceId);

        if (service) {
          const serviceIndex = updatedFilterForYear.dataServicesForMonth.findIndex(
            (service) => service.id === appointment.serviceId
          );
          updatedFilterForYear.dataServicesForMonth[serviceIndex].count += 1;
        }
      }
    });

    setFilterForYear(updatedFilterForYear);
  }, [services, year, appointments, month, days.appointment]);

  const handleSelectYear = (yearChoose: string, typeChoose: ETypeChooseForChart) => {
    if (typeChoose == ETypeChooseForChart.APPOINMENT) {
      setYear({...year, appointment: yearChoose});
      setIsOpen({...isOpen, appointment: {year: false, typeChart: false, month: false}});
    } else if (typeChoose == ETypeChooseForChart.SERVICE) {
      setYear({...year, service: yearChoose});
      setIsOpen({...isOpen, service: {year: false, typeChart: false, month: false}});
    }
  };

  const handleSelectTypeChart = (type: ETypeChart, typeChoose: ETypeChooseForChart) => {
    if (typeChoose == ETypeChooseForChart.APPOINMENT) {
      setTypeChart({...typeChart, appointment: type});
      setIsOpen({...isOpen, appointment: {year: false, typeChart: false, month: false}});
    } else if (typeChoose == ETypeChooseForChart.SERVICE) {
      setTypeChart({...typeChart, service: type});
      setIsOpen({...isOpen, service: {year: false, typeChart: false, month: false}});
    }
  };

  const handleSelectMonth = (item: number, typeChoose: ETypeChooseForChart) => {
    if (typeChoose == ETypeChooseForChart.APPOINMENT) {
      if (item != 0) {
        setHaveChooseMonth((pre) => ({...pre, appointment: true}));
      } else {
        setHaveChooseMonth((pre) => ({...pre, appointment: false}));
      }
      setMonth({...month, appointment: item});
      setIsOpen({...isOpen, appointment: {year: false, typeChart: false, month: false}});
    }
    // else if (typeChoose == ETypeChooseForChart.SERVICE) {
    //   setTypeChart({...typeChart, service: type});
    //   setIsOpen({...isOpen, service: {year: false, typeChart: false, month: false}});
    // }
  };

  const handleClickRefresh = async () => {
    setIsLoadingPage(true);
    try {
      const res = await fetchAppointments(dispatch);
      const resS = await fetchServices(dispatch);
      if (res == 200 && resS == 200) {
        setIsLoadingPage(false);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div className={`w-full h-full`}>
      <div className="h-[6%] flex border-b border-slate-400">
        <SwitchSideBar title={`Thống kê`} className="font-bold text-lg" />
        {/* <Breadcrumb /> */}
      </div>

      {/* Content */}
      <div className="relative flex flex-grow h-[94%] scrollbar-thin flex-col overflow-y-auto">
        <div className="sticky top-2 z-10 flex justify-end pr-2">
          <button
            className="border border-white bg-slate-400 px-3.5 py-1 rounded-lg"
            title="Làm mới"
            onClick={() => handleClickRefresh()}
          >
            <FontAwesomeIcon icon={faRotate} />
          </button>
        </div>

        {isLoadingPage ? (
          <div className="flex w-full h-full">
            <LoadingSpinner size={60} />
          </div>
        ) : (
          <>
            <div className="flex w-full min-h-[400px] mt-5 p-2">
              <div className="flex w-full p-3 rounded-xl shadow-md">
                <div className="flex w-4/5 justify-start h-full">
                  <BarChart
                    data={
                      haveChooseMonth.appointment ? filterForYear.dataAppointmentsForDay : filterForYear.dataAppointmentsForMonth
                    }
                    title={`Số lượng lịch hẹn trong tháng${month.appointment == 0 ? '' : ` ${month.appointment}`} theo năm ${
                      year.appointment
                    }`}
                    type={typeChart.appointment == ETypeChart.LINE ? ETypeChart.LINE : ETypeChart.BAR}
                  />
                </div>

                <div className="flex relative w-1/5 border rounded-lg border-slate-300 flex-col">
                  <div className="flex absolute bottom-2 left-0 right-0 w-full justify-center">
                    Tổng:&nbsp;
                    <span className="font-bold">
                      {haveChooseMonth.appointment
                        ? filterForYear.dataAppointmentsForDay.reduce((total, day) => total + day.count, 0)
                        : filterForYear.dataAppointmentsForMonth.reduce((total, month) => total + month.count, 0)}
                    </span>
                  </div>
                  <SelectOption
                    titleText={`Năm: ${year.appointment}`}
                    onClose={() =>
                      setIsOpen({
                        ...isOpen,
                        appointment: {year: !isOpen.appointment.year, typeChart: false, month: false},
                        service: {year: false, typeChart: false, month: false},
                      })
                    }
                    isOpen={isOpen.appointment.year}
                    data={years}
                    type={ETypeChooseForChart.APPOINMENT}
                    onSelect={(item, type) => handleSelectYear(item, type)}
                  />

                  <SelectOption
                    titleText={`Tháng: ${month.appointment == 0 ? 'Tất cả' : month.appointment}`}
                    onClose={() =>
                      setIsOpen({
                        ...isOpen,
                        appointment: {month: !isOpen.appointment.month, typeChart: false, year: false},
                        service: {year: false, typeChart: false, month: false},
                      })
                    }
                    isOpen={isOpen.appointment.month}
                    data={monthsForChoose}
                    type={ETypeChooseForChart.APPOINMENT}
                    onSelect={(item, type) => handleSelectMonth(item, type)}
                    // disabled
                  />

                  <SelectOption
                    titleText={`Dạng: ${typeChart.appointment == ETypeChart.LINE ? 'Line' : 'Bar'}`}
                    onClose={() =>
                      setIsOpen({
                        ...isOpen,
                        appointment: {month: false, typeChart: !isOpen.appointment.typeChart, year: false},
                        service: {year: false, typeChart: false, month: false},
                      })
                    }
                    isOpen={isOpen.appointment.typeChart}
                    data={typeCharts}
                    type={ETypeChooseForChart.APPOINMENT}
                    onSelect={(item, type) => handleSelectTypeChart(item, type)}
                  />
                </div>
              </div>
            </div>

            {/* dòng 2 */}
            <div className="flex w-full min-h-[400px] mt-10 p-2">
              <div className="flex w-full bg-white p-3 rounded-xl shadow-md">
                <div className="flex w-4/5 justify-start h-full">
                  <BarChart
                    data={filterForYear.dataServicesForMonth}
                    title={`Dịch vụ được sử dụng trong tháng theo năm ${year.service}`}
                    type={typeChart.service == ETypeChart.LINE ? ETypeChart.LINE : ETypeChart.BAR}
                  />
                </div>

                <div className="flex w-1/5  border rounded-lg border-slate-300 flex-col">
                  <SelectOption
                    titleText={`Năm: ${year.service}`}
                    onClose={() =>
                      setIsOpen({
                        ...isOpen,
                        service: {year: !isOpen.service.year, typeChart: false, month: false},
                        appointment: {year: false, typeChart: false, month: false},
                      })
                    }
                    isOpen={isOpen.service.year}
                    data={years}
                    type={ETypeChooseForChart.SERVICE}
                    onSelect={(item, type) => handleSelectYear(item, type)}
                  />

                  <SelectOption
                    titleText={`Dạng: ${typeChart.service == ETypeChart.LINE ? 'Line' : 'Bar'}`}
                    onClose={() =>
                      setIsOpen({
                        ...isOpen,
                        service: {year: false, typeChart: !isOpen.service.typeChart, month: false},
                        appointment: {year: false, typeChart: false, month: false},
                      })
                    }
                    isOpen={isOpen.service.typeChart}
                    data={typeCharts}
                    type={ETypeChooseForChart.SERVICE}
                    onSelect={(item, type) => handleSelectTypeChart(item, type)}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RevenueManagement;
