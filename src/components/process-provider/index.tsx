import React, {useEffect, useState} from 'react';

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  duration?: number;
  value?: number;
  color?: string;
  valuePercent?: number; // Giá trị hiện tại (0 - 100)
  backgroundColor?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 50,
  strokeWidth = 5,
  duration = 0.5,
  valuePercent = 0,
  color = 'red',
  backgroundColor = 'white',
  value = 0,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const progressOffset = ((100 - valuePercent) / 100) * circumference;
    setOffset(progressOffset);
  }, [valuePercent, circumference]);

  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={radius} stroke={backgroundColor} strokeWidth={strokeWidth} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transition: `stroke-dashoffset ${duration}s linear`,
          transform: 'rotate(-90deg)',
          transformOrigin: 'center',
        }}
      />
      {/* <text className="flex font-semibold text-[1.2rem]" x="50%" y="50%" dy=".3em" textAnchor="middle" fill={color}>
        {value}
      </text> */}
    </svg>
  );
};

export default CircularProgress;
