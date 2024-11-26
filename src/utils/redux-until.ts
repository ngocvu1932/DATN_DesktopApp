import {useDispatch} from 'react-redux';
import {allAppointment} from '../api/appointment';
import {setAppointments} from '../redux/slices/appointmentsSlice';
import {Dispatch} from '@reduxjs/toolkit';
import {allServices} from '../api/services';
import {setServices} from '../redux/slices/servicesSlice';

export const fetchAppointments = async (dispatch: Dispatch) => {
  const res = await allAppointment();
  if (res?.statusCode === 200) {
    dispatch(setAppointments(res.data));
    return 200;
  } else {
    return 400;
  }
};

export const fetchServices = async (dispatch: Dispatch) => {
  const res = await allServices();
  if (res?.statusCode === 200) {
    dispatch(setServices(res.data));
    return 200;
  } else {
    return 400;
  }
};
