import React from 'react';

interface ITextAreaProps {
  placeholder?: string;
  className?: React.HTMLAttributes<HTMLInputElement>['className'];
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string;
}

const TextArea: React.FC<ITextAreaProps> = ({placeholder, className, onChange, value}) => {
  return (
    <>
      <textarea value={value} onChange={onChange} placeholder={placeholder} className={`${className} flex`} />
    </>
  );
};

export default TextArea;
