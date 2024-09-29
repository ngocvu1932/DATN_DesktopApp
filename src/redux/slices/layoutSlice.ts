import {createSlice} from '@reduxjs/toolkit';
import {ELayout} from '../../constants/layout';

interface ILayoutState {
  layout: ELayout;
}

const initialState: ILayoutState = {
  layout: ELayout.Home,
};

const layoutSlice = createSlice({
  name: 'layoutSlice',
  initialState: initialState,
  reducers: {
    setLayout: (state, action) => {
      state.layout = action.payload;
    },
  },
});

export const {setLayout} = layoutSlice.actions;
export default layoutSlice;
