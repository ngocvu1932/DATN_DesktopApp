import React, {useState, useEffect} from 'react';
import {format} from 'date-fns';

const Clock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="flex text-sm font-medium">
      <p>{format(currentTime, 'dd/MM/yyyy')}</p>
      <span>&nbsp;-&nbsp;</span>
      <p>
        {currentTime.toLocaleTimeString('vi-VN', {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true,
        })}
      </p>
    </div>
  );
};

export default Clock;
