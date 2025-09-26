import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";

export const addTask = createAsyncThunk("/todos/addTask", async (taskData) => {
    try {
        const docRef = await addDoc(collection(db, "tasks"), taskData);
        return { id: docRef.id, ...taskData };
    } catch (error) {
        toast.error("Something Want Wrong")
    }
});

export const fetchTask = createAsyncThunk("/todos/fetchTask", async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const taskList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return taskList;
    } catch (error) {
        toast.error("Something Want Wrong")
    }
});


const todoSlice = createSlice({
    name: "tasks",
    initialState: {
        Data: [],
        isLoading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addTask.pending, (state) => {
            state.isLoading = true;
        })

        builder.addCase(addTask.fulfilled, (state, action) => {
            state.isLoading = false;
            state.Data.push(action.payload);
        })
        builder.addCase(addTask.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(fetchTask.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(fetchTask.fulfilled , (state,action) => {
            state.isLoading = false
            state.Data = action.payload
        })
    },
});

export default todoSlice.reducer;
