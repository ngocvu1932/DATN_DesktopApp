import React from 'react';
import CircularProgress from '../process-provider';
import IncrementValue from '../increment-value';

interface IProcessViewProps {
  sizeCircle?: number;
  strokeWidth?: number;
  duration?: number;
  value?: number;
  colorTitle?: string;
  valuePercent?: number; // Giá trị hiện tại (0 - 100)
  backgroundColor?: string;
  backgroundCircel?: string;
  title?: string;
}

const ProcessView: React.FC<IProcessViewProps> = ({
  sizeCircle = 40,
  strokeWidth = 5,
  duration = 0.5,
  value = 20000,
  colorTitle = 'blue',
  valuePercent = 20,
  backgroundColor = '#FFFFFF',
  backgroundCircel = '#CCCCCC',
  title = 'Process View',
}) => {
  return (
    <div
      className={`flex max-w-[300px] min-w-[200px] flex-col justify-center items-center rounded-xl shadow-lg`}
      style={{backgroundColor: backgroundColor}}
    >
      <p className="font-semibold break-words my-2 px-2 text-center">{title}</p>

      <CircularProgress
        size={sizeCircle}
        strokeWidth={strokeWidth}
        duration={duration}
        valuePercent={valuePercent}
        color={colorTitle}
        value={value}
        backgroundColor={backgroundCircel}
      />
      <div className="font-bold my-2">
        <IncrementValue duration={500} targetValue={value} />
      </div>
    </div>
  );
};

export default ProcessView;
