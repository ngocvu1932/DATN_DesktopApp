import {faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';

interface ISelectOptionProps {
  onClose?: () => void;
  titleText?: string;
  isOpen?: boolean;
  data?: any[];
  onSelect?: (item: any, type: any) => void;
  type?: string;
  disabled?: boolean;
  className?: React.HTMLAttributes<HTMLInputElement>['className'];
}

const SelectOption: React.FC<ISelectOptionProps> = ({
  onClose,
  titleText = 'Text',
  isOpen,
  data,
  onSelect,
  type,
  disabled,
  className,
}) => {
  return (
    <div className="relative z-40">
      <div
        className={`flex justify-between items-center px-2 py-1 bg-white cursor-pointer border border-gray-300 rounded-md shadow-md ${className}`}
        onClick={() => {
          if (disabled) {
            return;
          }
          onClose && onClose();
        }}
      >
        <span>{titleText}</span>
        <div className="flex items-center justify-center ml-3">
          <FontAwesomeIcon className="text-center" icon={isOpen ? faAngleUp : faAngleDown} />
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute bg-white border scrollbar-thin overflow-y-auto p-1 border-gray-300 w-full max-h-80 rounded-md shadow-lg z-10">
          {data &&
            data.map((item) => (
              <div
                key={item}
                className={`cursor-pointer p-1 rounded-md hover:bg-gray-200`}
                onClick={() => onSelect && onSelect(item, type)}
              >
                {item == 0 ? 'Tất cả' : item}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SelectOption;
