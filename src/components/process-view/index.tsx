import React from 'react';
import CircularProgress from '../process-provider';
import IncrementValue from '../increment-value';
import {log} from 'node:console';

interface IProcessViewProps {
  sizeCircle?: number;
  strokeWidth?: number;
  duration?: number;
  value?: number;
  colorTitle?: string;
  // valuePercent?: number; // Giá trị hiện tại (0 - 100)
  backgroundColor?: string;
  backgroundCircel?: string;
  title?: string;
  className?: React.HTMLAttributes<HTMLInputElement>['className'];
}

const ProcessView: React.FC<IProcessViewProps> = ({
  sizeCircle = 40,
  strokeWidth = 6,
  duration = 0.5,
  value = 10,
  colorTitle = 'blue',
  // valuePercent = 20,
  backgroundColor = '#FFFFFF',
  backgroundCircel = '#CCCCCC',
  title = 'Process View',
  className,
}) => {
  const valuePercentTemp =
    value <= 10
      ? (value / 10) * 100
      : value <= 100
      ? (value / 100) * 100
      : value <= 1000
      ? (value / 1000) * 100
      : value <= 10000
      ? (value / 10000) * 100
      : 100;

  return (
    <div
      className={`flex max-w-[400px] min-w-[200px] w-full flex-col justify-center items-center rounded-xl shadow-md ${className}`}
      style={{backgroundColor: backgroundColor}}
    >
      <p className="font-semibold break-words my-2 px-2 text-center">{title}</p>

      <div className="flex flex-1 flex-col w-full justify-end items-center">
        <CircularProgress
          size={sizeCircle}
          strokeWidth={strokeWidth}
          duration={duration}
          valuePercent={valuePercentTemp}
          color={colorTitle}
          value={value}
          backgroundColor={backgroundCircel}
        />
        <div className="font-bold my-2 text-xl">
          <IncrementValue duration={500} targetValue={value} />
        </div>
      </div>
    </div>
  );
};

export default ProcessView;
