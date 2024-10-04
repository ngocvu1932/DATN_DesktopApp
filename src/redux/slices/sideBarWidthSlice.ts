import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  width: 260,
};

const widthSlice = createSlice({
  name: 'widthSlice',
  initialState: initialState,
  reducers: {
    setWidth: (state, action) => {
      state.width = action.payload;
    },
  },
});

export const {setWidth} = widthSlice.actions;
export default widthSlice;
