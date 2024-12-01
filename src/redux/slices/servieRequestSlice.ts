import {createSlice} from '@reduxjs/toolkit';
import {IAppointment} from '../../models/appointment';

const initialState = {
  appointments: [] as IAppointment[],
};

const appointmentsSlice = createSlice({
  name: 'appointmentsSlice',
  initialState: initialState,
  reducers: {
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
  },
});

export const {setAppointments} = appointmentsSlice.actions;
export default appointmentsSlice;
