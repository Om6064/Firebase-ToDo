import { useEffect, useRef, useState } from "react";
import Table from "./Table";
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot
} from "firebase/firestore";
import { toast } from "react-toastify";

const Todo = () => {
  const inputRef = useRef(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [textValue, setTextValue] = useState("");

  const taskCollection = collection(db, "tasks");

  const handleInputChange = (e) => {
    setTextValue(e.target.value);
  };

  const addTask = async () => {
    try {
      const inputValue = textValue.trim();
      if (!inputValue) {
        toast.error("Task is not defined!");
        return;
      }

      await addDoc(taskCollection, {
        taskName: inputValue,
        isComplete: false,
        createdAt: Date.now(),
      });

      toast.success("Task added successfully!");
      setTextValue("");
      inputRef.current.value = "";
    } catch (error) {
      toast.error(error.message);
    }
  };

  const clearAll = async () => {
    try {
      const promises = tasks.map((task) => deleteDoc(doc(db, "tasks", task.id)));
      await Promise.all(promises);
      toast.success("All tasks cleared!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const markAsComplete = async (id) => {
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { isComplete: true });
      toast.info("Task marked as completed!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const taskRef = doc(db, "tasks", id);
      await deleteDoc(taskRef);
      toast.success("Task deleted!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const editTask = async (id, newName) => {
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { taskName: newName });
      toast.success("Task updated!");
    } catch (error) {
      toast.error(error.message);
    }
  };


  useEffect(() => {
    const unsubscribe = onSnapshot(taskCollection, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    let updatedTasks = [];
    if (filter === "all") updatedTasks = tasks;
    else if (filter === "pending") updatedTasks = tasks.filter((t) => !t.isComplete);
    else if (filter === "completed") updatedTasks = tasks.filter((t) => t.isComplete);

    setFilteredTasks(updatedTasks);
  }, [tasks, filter]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-300 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h1 className="text-center text-2xl font-bold text-black mb-6">
          ToDo List 📝
        </h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            ref={inputRef}
            value={textValue}
            onChange={handleInputChange}
            className="flex-grow bg-gray-100 rounded-full px-4 py-2 text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter a new task"
          />
          <button
            type="button"
            onClick={addTask}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition duration-200 shadow-md"
          >
            ➕
          </button>
        </div>

        <div className="flex justify-center mb-6 space-x-2">
          {["all", "pending", "completed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-1 rounded-full text-sm font-medium ${filter === type
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-800"
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="h-[270px] overflow-scroll">
          {filteredTasks.length === 0 ? (
            <div className="ps-5 pt-5">
              <img src="/nodata(1).png" />
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredTasks.map((task) => (
                <Table
                  key={task.id}
                  id={task.id}
                  name={task.taskName}
                  complete={task.isComplete}
                  onComplete={markAsComplete}
                  onDelete={deleteTask}
                  onEdit={editTask}
                />
              ))}
            </ul>
          )}
        </div>

        {filteredTasks.length > 0 && (
          <div className="text-center py-2">
            <button
              className="bg-red-600 hover:bg-red-700 rounded p-2 text-white"
              onClick={clearAll}
            >
              Delete All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Todo;
