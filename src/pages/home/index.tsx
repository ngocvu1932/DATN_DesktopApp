import React from 'react';
import {useSelector} from 'react-redux';
import SwitchSideBar from '../../components/switch-sidebar';
import {useTranslation} from 'react-i18next';

const Home: React.FC = () => {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const {t} = useTranslation();

  return (
    <div className="flex">
      <SwitchSideBar title={`${t('home_title')}, ${userInfo?.name}!`} className="font-bold text-lg" />
    </div>
  );
};

export default Home;
