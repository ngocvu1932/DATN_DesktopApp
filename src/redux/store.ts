import {configureStore} from '@reduxjs/toolkit';
import userInfoSlice from './slices/userInfoSlice';
import layoutSlice from './slices/layoutSlice';

const store = configureStore({
    reducer: {
        user: userInfoSlice.reducer,
        layout: layoutSlice.reducer,
    },
});

export default store;
