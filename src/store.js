import { configureStore } from "@reduxjs/toolkit";
import newOrdersSlice from './screens/MainMenu/Entries/newOrderSlice';
import newOrdersDetailSlice from "./screens/MainMenu/Entries/EntriesDetails/newOrdersDetailSlice";
import removalsSlice from "./screens/MainMenu/Removals/removalsSlice";
import removalsDetailSlice from "./screens/MainMenu/Removals/RemovalsDetails/removalsDetailSlice";
import transfersSlice from "./screens/MainMenu/Transfers/transfersSlice";
import collectionSlice from "./screens/MainMenu/Removals/RemovalsDetails/collectionSlice";

export default configureStore({
    reducer: {
        newOrders: newOrdersSlice,
        newOrdersDetails: newOrdersDetailSlice,
        removals: removalsSlice,
        removalDetails: removalsDetailSlice,
        transfers: transfersSlice,
        collection: collectionSlice
    }
});