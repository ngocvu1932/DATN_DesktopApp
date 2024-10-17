import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ELayoutInfo} from '../../constants/layout';

interface ILayoutState {
  layoutBranch: {
    layout: ELayoutInfo;
    data?: any;
  };
}

const initialState: ILayoutState = {
  layoutBranch: {
    layout: ELayoutInfo.Home,
    data: null,
  },
};

const layoutInfoSlice = createSlice({
  name: 'layoutSlice',
  initialState: initialState,
  reducers: {
    setInfoLayout: (state, action: PayloadAction<ILayoutState>) => {
      state.layoutBranch.layout = action.payload.layoutBranch.layout;
      state.layoutBranch.data = action.payload.layoutBranch.data;
    },
  },
});

export const {setInfoLayout} = layoutInfoSlice.actions;
export default layoutInfoSlice;
