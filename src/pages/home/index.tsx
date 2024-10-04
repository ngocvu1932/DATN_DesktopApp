import React from 'react';
import {useSelector} from 'react-redux';
import SwitchSideBar from '../../components/switch-sidebar';

const Home: React.FC = () => {
  const userInfo = useSelector((state: any) => state.user.userInfo);

  return (
    <div className="flex">
      <SwitchSideBar title={`Xin chào, ${userInfo?.name}!`} className="font-bold text-lg" />
    </div>
  );
};

export default Home;
