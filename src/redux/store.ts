import {configureStore} from '@reduxjs/toolkit';
import userInfoSlice from './slices/userInfoSlice';
import layoutSlice from './slices/layoutSlice';
import widthSlice from './slices/sideBarWidthSlice';
import loadingSlice from './slices/loadingSlice';
import authSlice from './slices/authSlice';
import layoutInfoSlice from './slices/layoutInfoSlice';
import reLoginSlice from './slices/reLoginSlice';
import {app} from 'electron';
import appointmentsSlice from './slices/appointmentsSlice';
import servicesSlice from './slices/servicesSlice';

const store = configureStore({
  reducer: {
    loading: loadingSlice.reducer,
    user: userInfoSlice.reducer,
    layout: layoutSlice.reducer,
    width: widthSlice.reducer,
    auth: authSlice.reducer,
    layoutInfo: layoutInfoSlice.reducer,
    reLogin: reLoginSlice.reducer,
    appointments: appointmentsSlice.reducer,
    services: servicesSlice.reducer,
  },
});

export default store;
