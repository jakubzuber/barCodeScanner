import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { takeFromInventory } from "../callsToDatabase";

export const fetchCollection = createAsyncThunk('routes/fetchCollection', async (id) => {
    const response = await fetch('http://10.0.0.153:4999/fetchCollectionData', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            idOrder: id
        })
        
    })
    const data = response.json()
    return data
});

const collectionSlice = createSlice({
    name: 'collection',
    initialState: {
        collection: [],
        loading: false | true,
        error: ''
    },
    reducers: {
        removeFromWh: ({collection}, {payload: place}) => {
            const index = collection.findIndex(({ whId }) => whId === place)
            collection[index].ILOSC = collection[index].ILOSC - 1
            takeFromInventory(place)
       },
    },
    extraReducers: builder => {
        builder.addCase(fetchCollection.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchCollection.fulfilled, (state, action) => {
            state.collection = action.payload
            state.loading = false
            state.error = ''
        })
        builder.addCase(fetchCollection.rejected, (state, action) => {
            state.collection = []
            state.loading = false
            state.error = action.error.message
        })
    }
})

export const { 
    removeFromWh
} = collectionSlice.actions;

export const selectCollection = state => state.collection

export default collectionSlice.reducer;