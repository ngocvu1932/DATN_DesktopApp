import {createSlice} from '@reduxjs/toolkit';
import {IService} from '../../models/service';

const initialState = {
  services: [] as IService[],
};

const servicesSlice = createSlice({
  name: 'servicesSlice',
  initialState: initialState,
  reducers: {
    setServices: (state, action) => {
      state.services = action.payload;
    },
  },
});

export const {setServices} = servicesSlice.actions;
export default servicesSlice;
