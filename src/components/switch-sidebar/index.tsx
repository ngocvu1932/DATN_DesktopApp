import React, {HTMLAttributes} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setWidth} from '../../redux/slices/sideBarWidthSlice';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';

interface ISwitchSideBarProps {
  title: string;
  className?: React.HTMLAttributes<HTMLInputElement>['className'];
}

const SwitchSideBar: React.FC<ISwitchSideBarProps> = ({title, className}) => {
  const dispatch = useDispatch();
  const width = useSelector((state: any) => state.width.width);

  return (
    <div
      className={`${className} flex items-center p-1 cursor-pointer`}
      onClick={() => {
        width == 0 ? dispatch(setWidth(260)) : dispatch(setWidth(0));
      }}
    >
      <FontAwesomeIcon icon={faBars} /> &nbsp;&nbsp; <p>{title}</p>
    </div>
  );
};

export default SwitchSideBar;
