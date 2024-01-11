import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./userInfoSlice";

const store = configureStore({
    reducer: {
        user: userInfoSlice,
    }
});

export default store;