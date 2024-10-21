import React from 'react';

interface ITextAreaProps {
  placeholder?: string;
  className?: React.HTMLAttributes<HTMLInputElement>['className'];
  changeText?: (text: string) => void;
  value?: string;
  title?: string;
  disabled?: boolean;
}

const TextArea: React.FC<ITextAreaProps> = ({placeholder, className, changeText, value, title, disabled}) => {
  return (
    <>
      <textarea
        disabled={disabled}
        spellCheck="false"
        title={title}
        value={value}
        onChange={(e) => changeText && changeText(e.target.value)}
        placeholder={placeholder}
        className={`${className} flex mx-1 px-2 py-1 mt-1 border border-slate-300 rounded-xl hover:border-blue-500 focus:outline-none focus:ring-blue-500`}
      />
    </>
  );
};

export default TextArea;
