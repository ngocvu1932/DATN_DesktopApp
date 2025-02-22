import React from 'react';

interface ITextInputProps {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute | 'text';
  className?: React.HTMLAttributes<HTMLInputElement>['className'];
  changeText?: (text: string) => void;
  value?: string;
  disabled?: boolean;
  title?: string;
}

const TextInput: React.FC<ITextInputProps> = ({
  prefix,
  suffix,
  placeholder,
  type,
  className,
  changeText,
  value,
  disabled,
  title,
}) => {
  return (
    <span title={title} className={`${className} flex items-center rounded-xl m-1 relative`}>
      {prefix && (
        <span className="absolute left-3 flex items-center h-full text-gray-500 pointer-events-none">{prefix}</span>
      )}
      <input
        spellCheck="false"
        disabled={disabled}
        value={value}
        onChange={(e) => changeText && changeText(e.target.value)}
        type={type}
        placeholder={placeholder}
        className={`${prefix ? 'pl-9' : ''} ${
          suffix ? 'pr-9' : ''
        } w-full h-full px-3 py-2 border border-slate-300 rounded-xl hover:border-blue-500 focus:outline-none focus:ring-blue-500`}
      />
      {suffix && <span className="absolute right-3 flex items-center h-full text-gray-500">{suffix}</span>}
    </span>
  );
};

export default TextInput;
