import { configureStore } from "@reduxjs/toolkit";
import newOrdersSlice from './screens/MainMenu/Entries/newOrderSlice';
import newOrdersDetailSlice from "./screens/MainMenu/Entries/EntriesDetails/newOrdersDetailSlice";
import removalsSlice from "./screens/MainMenu/Removals/removalsSlice";

export default configureStore({
    reducer: {
        newOrders: newOrdersSlice,
        newOrdersDetails: newOrdersDetailSlice,
        removals: removalsSlice
    }
});