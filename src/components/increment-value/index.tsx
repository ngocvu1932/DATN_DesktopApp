import React, {useState, useEffect} from 'react';

interface IIncrementValueProps {
  targetValue: number;
  duration: number;
}

const IncrementValue: React.FC<IIncrementValueProps> = ({targetValue, duration}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const steps = duration / 50;
    const increment = targetValue / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setDisplayValue(targetValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(start));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [targetValue, duration]);

  return <p className="font-bold">{displayValue}</p>;
};

export default IncrementValue;
