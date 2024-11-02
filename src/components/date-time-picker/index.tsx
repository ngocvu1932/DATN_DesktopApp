import React, {useEffect, useState} from 'react';
import {dataTime} from '../../constants/dataTime';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {Time} from './enum';
import {IFilteredTimes} from './interface';
import {parse, format, isBefore} from 'date-fns';
import {useTranslation} from 'react-i18next';
interface IChooseDateTimeProps {
  nowDate: Date;
  onChooseTime: (time: string) => void;
  onClose: () => void;
}
const ChooseDateTime: React.FC<IChooseDateTimeProps> = ({nowDate, onChooseTime, onClose}) => {
  const {t} = useTranslation();
  const [dateTimeChoose, setDateTimeChoose] = React.useState<Date>(nowDate);
  const [timeFilter, setTimeFilter] = React.useState<Time>(Time.MORNING);
  const [listTime, setListTime] = useState<IFilteredTimes[]>([]);
  const [timeChoose, setTimeChoose] = useState<number>();
  const [dayFinal, setDayFinal] = useState<string>('');

  useEffect(() => {
    handleFilterTime(timeFilter);
  }, [dateTimeChoose]);

  const handleChooseTime = (index: number) => {
    setTimeChoose(index);
    if (listTime[index]) {
      const date = format(dateTimeChoose, 'yyyy-MM-dd');
      const time = listTime[index].time;
      const dateTime = `${date} ${time}`;
      setDayFinal(dateTime);
    }
  };

  const handleConfirm = () => {
    if (dayFinal) {
      onChooseTime(dayFinal);
      onClose();
    }
  };

  const handleFilterTime = (time: Time, event?: React.MouseEvent) => {
    event?.preventDefault();
    setDayFinal('');
    setTimeChoose(-1);
    onChooseTime('2000-01-01 00:00');
    if (time == Time.MORNING) {
      setTimeFilter(Time.MORNING);
      setFilterTime('9:00', '11:45');
    } else if (time == Time.AFTERNOON) {
      setTimeFilter(Time.AFTERNOON);
      setFilterTime('12:00', '16:45');
    } else {
      setTimeFilter(Time.EVENING);
      setFilterTime('17:00', '20:00');
    }
  };

  const setFilterTime = (startTime: string, endTime: string) => {
    if (dateTimeChoose > nowDate) {
      setTime(startTime, endTime);
    } else {
      if (isBefore(parseTime(formattedTime(nowDate)), parseTime(endTime))) {
        if (isBefore(parseTime(formattedTime(nowDate)), parseTime(startTime))) {
          setTime(startTime, endTime);
        } else {
          setTime(formattedTime(nowDate), endTime);
        }
      } else {
        setTime('', '');
      }
    }
  };

  const formattedTime = (time: Date): string => {
    return format(time, 'HH:mm');
  };

  const setTime = (startTime: string, endTime: string) => {
    setListTime(
      dataTime.filter(({time}) => {
        return toMinutes(time) >= toMinutes(startTime) && toMinutes(time) <= toMinutes(endTime);
      })
    );
  };

  const parseTime = (time: string) => parse(`2024-01-01 ${time}`, 'yyyy-MM-dd HH:mm', new Date());

  const toMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  return (
    <div className="flex absolute top-14 left-0 right-0 flex-col w-full bg-white z-20 rounded-xl shadow-xl border border-[#432269]">
      <div className="flex flex-col py-2 ">
        <label className="text-left mb-1 ml-3 font-bold">Chọn ngày</label>
        <DatePicker
          className="w-[93%] ml-3 h-9 rounded-xl pl-2 border border-slate-500"
          selected={dateTimeChoose}
          minDate={nowDate}
          onChange={(date) => setDateTimeChoose(date!)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className="flex ml-3 flex-col justify-center py-2">
        <label className="text-left mb-1 font-bold">Chọn giờ</label>
        <div className="flex self-start">
          <button
            className={`px-3 py-1 mr-2 border ${
              timeFilter == Time.MORNING ? 'bg-[#432269] text-white' : 'text-black'
            } border-[#432269] rounded-xl`}
            onClick={(e) => handleFilterTime(Time.MORNING, e)}
          >
            {t('Sáng')}
          </button>
          <button
            className={`px-3 py-1 mr-2 border ${
              timeFilter == Time.AFTERNOON ? 'bg-[#432269] text-white' : 'text-black'
            } border-[#432269] rounded-xl`}
            onClick={(e) => handleFilterTime(Time.AFTERNOON, e)}
          >
            {t('Chiều')}
          </button>
          <button
            className={`px-3 py-1 mr-2 border ${
              timeFilter == Time.EVENING ? 'bg-[#432269] text-white' : 'text-black'
            } border-[#432269] rounded-xl`}
            onClick={(e) => handleFilterTime(Time.EVENING, e)}
          >
            {t('Tối')}
          </button>
        </div>
      </div>

      {/* chỗ này hiện time cho chọn */}
      {listTime.length !== 0 ? (
        <div className="flex flex-wrap mx-3 border border-slate-400 rounded-lg">
          {listTime.map((item, index) => (
            <button
              key={index}
              onClick={() => handleChooseTime(index)}
              className={`px-1 py-0.5 m-1 ${timeChoose == index ? 'bg-[#582D8A] text-white' : ''} rounded-lg`}
            >
              {item.time}
            </button>
          ))}
        </div>
      ) : (
        <></>
      )}

      <div className="py-2 flex justify-center">
        <button
          disabled={dayFinal == '' ? true : false}
          className={`bg-[#432269] ${dayFinal == '' ? 'opacity-50' : ''} text-white rounded-lg px-3 py-1`}
          onClick={() => handleConfirm()}
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
};

export default ChooseDateTime;
