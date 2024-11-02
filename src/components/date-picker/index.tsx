import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {format} from 'date-fns';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faXmark} from '@fortawesome/free-solid-svg-icons';

interface IDatePickerCustomProps {
  placeholder?: string;
  onChooseDate: (date: string) => void;
  className?: React.HTMLAttributes<HTMLInputElement>['className'];
}

const DatePickerCustom: React.FC<IDatePickerCustomProps> = ({placeholder, onChooseDate, className}) => {
  const [isChoose, setIsChoose] = useState<boolean>(false);
  const [date, setDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    onChooseDate(format(date, 'yyyy-MM-dd'));
    setDate(date);
    setIsChoose(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={() => setIsChoose(!isChoose)}
        className="w-[130px] h-8 flex items-center pl-2 rounded-xl border border-slate-300 bg-white hover:border-blue-500 z-10 cursor-pointer relative"
      >
        {!date ? <span className="text-gray-400">{placeholder}</span> : format(date!, 'dd/MM/yyyy')}
        <div
          className="absolute right-0 px-2"
          onClick={(e) => {
            e.stopPropagation();
            setDate(null);
            onChooseDate('');
            setIsChoose(false);
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>

      {isChoose && (
        <div className="absolute top-[1px] left-[1px] z-40">
          <DatePicker
            open={isChoose}
            selected={date}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            className="pl-2 rounded-xl w-[100px] z-50 h-[30px]"
            onClickOutside={() => setIsChoose(false)}
          />
        </div>
      )}
    </div>
  );
};

export default DatePickerCustom;
