import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
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

export const deleteTask = createAsyncThunk("/todos/deleteTask", async (id) => {
    try {
        await deleteDoc(doc(db, "tasks", id))
        return id
    } catch (error) {
        toast.error("Something Want Wrong")
    }
})

export const editTask = createAsyncThunk(
    "/todos/editTask",
    async ({ id, updatedData }) => {
        try {
            const taskRef = doc(db, "tasks", id);
            await updateDoc(taskRef, updatedData);
            return { id, updatedData };
        } catch (error) {
            toast.error("Something went wrong");
        }
    }
);

export const deleteAll = createAsyncThunk("/todos/deleteAll", async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "tasks"));

        const deletePromises = querySnapshot.docs.map((document) =>
            deleteDoc(doc(db, "tasks", document.id))
        );

        await Promise.all(deletePromises);

        toast.success("All tasks deleted!");
        return [];
    } catch (error) {
        toast.error("Something went wrong");
    }
});

export const completeTask = createAsyncThunk("/todos/completeTask", async (id) => {
    try {
        const taskRef = doc(db, "tasks", id)
        await updateDoc(taskRef, {
            isComplete: true,
        })
        return id
    } catch (error) {
        toast.error("Something went wrong");
    }
})



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
        builder.addCase(fetchTask.fulfilled, (state, action) => {
            state.isLoading = false
            state.Data = action.payload
        })
        builder.addCase(deleteTask.fulfilled, (state, action) => {
            state.Data = state.Data.filter((task) => {
                return task.id !== action.payload
            })
        })
        builder.addCase(editTask.fulfilled, (state, action) => {
            const { id, updatedData } = action.payload;
            const index = state.Data.findIndex((task) => task.id === id);
            if (index !== -1) {
                state.Data[index] = { ...state.Data[index], ...updatedData };
            }
        });
        builder.addCase(deleteAll.fulfilled, (state, action) => {
            state.Data = action.payload
        })
        builder.addCase(completeTask.fulfilled, (state, action) => {
            const task = state.Data.find((t) => t.id === action.payload);
            if (task) {
                task.isComplete = true;
            }
        });


    },
});

export default todoSlice.reducer;
