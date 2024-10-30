import {createSlice} from '@reduxjs/toolkit';
import {IUserInfo} from '../../models/userInfo';

const initialState = {
  userInfo: {} as IUserInfo,
};

const userInfoSlice = createSlice({
  name: 'userInfoSlice',
  initialState: initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const {setUserInfo} = userInfoSlice.actions;
export default userInfoSlice;
