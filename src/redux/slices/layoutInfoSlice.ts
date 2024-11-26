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
  layoutCustomer: {
    layout: ELayoutInfo;
    data?: any;
  };
  layoutOrder: {
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
  layoutCustomer: {
    layout: ELayoutInfo.Home,
    data: null,
  },
  layoutOrder: {
    layout: ELayoutInfo.Home,
    data: null,
  },
};

const layoutInfoSlice = createSlice({
  name: 'layoutSlice',
  initialState: initialState,
  reducers: {
    // setInfoLayout: (state, action: PayloadAction<ILayoutState>) => {
    //   // cập nhật cho branch
    //   state.layoutBranch.layout = action.payload.layoutBranch.layout;
    //   state.layoutBranch.data = action.payload.layoutBranch.data;

    //   // cập nhật cho appointment
    //   state.layoutAppointment.layout = action.payload.layoutAppointment.layout;
    //   state.layoutAppointment.data = action.payload.layoutAppointment.data;

    //   // cập nhật cho appointment
    //   state.layoutService.layout = action.payload.layoutService.layout;
    //   state.layoutService.data = action.payload.layoutService.data;

    //   // cập nhật cho customer
    //   state.layoutCustomer.layout = action.payload.layoutCustomer.layout;
    //   state.layoutCustomer.data = action.payload.layoutCustomer.data;

    //   // cập nhật cho order
    //   state.layoutOrder.layout = action.payload.layoutOrder.layout;
    //   state.layoutOrder.data = action.payload.layoutOrder.data;
    // },
    setInfoLayout: (state, action: PayloadAction<Partial<ILayoutState>>) => {
      Object.keys(action.payload).forEach((key) => {
        const layoutKey = key as keyof ILayoutState;
        if (action.payload[layoutKey]) {
          state[layoutKey] = {
            ...state[layoutKey],
            ...action.payload[layoutKey],
          };
        }
      });
    },

    resetAllLayouts: (state) => {
      Object.keys(state).forEach((key) => {
        const layoutKey = key as keyof ILayoutState;
        state[layoutKey] = {
          layout: ELayoutInfo.Home,
          data: null,
        };
      });
    },
  },
});

export const {setInfoLayout, resetAllLayouts} = layoutInfoSlice.actions;
export default layoutInfoSlice;
