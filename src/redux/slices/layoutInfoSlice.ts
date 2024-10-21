import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ELayoutInfo} from '../../constants/layout';

interface ILayoutState {
  layoutBranch: {
    layout: ELayoutInfo;
    data?: any;
  };
  layoutAppointment: {
    layout: ELayoutInfo;
    data?: any;
  };
  layoutService: {
    layout: ELayoutInfo;
    data?: any;
  };
}

const initialState: ILayoutState = {
  layoutBranch: {
    layout: ELayoutInfo.Home,
    data: null,
  },
  layoutAppointment: {
    layout: ELayoutInfo.Home,
    data: null,
  },
  layoutService: {
    layout: ELayoutInfo.Home,
    data: null,
  },
};

const layoutInfoSlice = createSlice({
  name: 'layoutSlice',
  initialState: initialState,
  reducers: {
    setInfoLayout: (state, action: PayloadAction<ILayoutState>) => {
      // cập nhật cho branch
      state.layoutBranch.layout = action.payload.layoutBranch.layout;
      state.layoutBranch.data = action.payload.layoutBranch.data;

      // cập nhật cho appointment
      state.layoutAppointment.layout = action.payload.layoutAppointment.layout;
      state.layoutAppointment.data = action.payload.layoutAppointment.data;

      // cập nhật cho appointment
      state.layoutService.layout = action.payload.layoutService.layout;
      state.layoutService.data = action.payload.layoutService.data;
    },
  },
});

export const {setInfoLayout} = layoutInfoSlice.actions;
export default layoutInfoSlice;
