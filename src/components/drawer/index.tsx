import React from 'react';
import TextInput from '../text-input';
import './index.css';

interface IDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const Drawer: React.FC<IDrawerProps> = ({isOpen, onClose}) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 overflow-hidden">
          <div className="fixed inset-0" onClick={onClose}></div>
          <div className={`drawer ${isOpen ? 'open' : ''} z-30`}>
            <button className="close-btn" onClick={onClose}>
              X
            </button>
            <div className="drawer-content">
              <div className="bg-blue-300 flex w-full h-full flex-col">
                <TextInput placeholder="Tên khách hàng" />
                <TextInput placeholder="Số điện thoại" />
                <TextInput placeholder="Nhân viên" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Drawer;
