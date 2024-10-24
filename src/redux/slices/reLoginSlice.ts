import {faGaugeSimpleMed} from '@fortawesome/free-solid-svg-icons';
import {createSlice} from '@reduxjs/toolkit';
import {isCancel} from 'axios';

const initialState = {
  reLogin: {
    isReLogin: false,
    isSuscess: true,
    isCancel: false,
  },
};

const reLoginSlice = createSlice({
  name: 'reLoginSlice',
  initialState: initialState,
  reducers: {
    setIsReLogin: (state, action) => {
      state.reLogin.isReLogin = action.payload.isReLogin;
      state.reLogin.isSuscess = action.payload.isSuscess;
      state.reLogin.isCancel = action.payload.isCancel;
    },
  },
});

export const {setIsReLogin} = reLoginSlice.actions;
export default reLoginSlice;
