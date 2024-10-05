import {configureStore} from '@reduxjs/toolkit';
import userInfoSlice from './slices/userInfoSlice';
import layoutSlice from './slices/layoutSlice';
import widthSlice from './slices/sideBarWidthSlice';

const store = configureStore({
  reducer: {
    user: userInfoSlice.reducer,
    layout: layoutSlice.reducer,
    width: widthSlice.reducer,
  },
});

export default store;
