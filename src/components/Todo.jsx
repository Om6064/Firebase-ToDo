import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  completeTask,
  deleteAll,
  deleteTask,
  editTask,
  fetchTask,
} from "../features/todos/todoSlice";

const Todo = () => {
  const inputRef = useRef(null);
  const [filter, setFilter] = useState("all");
  const [textValue, setTextValue] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const dispatch = useDispatch();
  const { Data, isLoading } = useSelector((store) => store.task);
  console.log(Data, isLoading);

  const handleInputChange = (e) => {
    setTextValue(e.target.value);
  };

  useEffect(() => {
    dispatch(fetchTask());
  }, [dispatch]);

  const filteredTasks = Data.filter((task) => {
    if (filter === "pending") return !task.isComplete;
    if (filter === "completed") return task.isComplete;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-screen bg-blue-300 px-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
      >
        <h1 className="text-center text-2xl font-bold text-black mb-6">
          ToDo List 📝
        </h1>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex gap-2 mb-6"
        >
          <motion.input
            type="text"
            ref={inputRef}
            value={textValue}
            onChange={handleInputChange}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-grow bg-gray-100 rounded-full px-4 py-2 text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter a new task"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            type="button"
            onClick={() => {
              const inputValue = textValue.trim();
              if (!inputValue) {
                toast.error("Task is not defined!");
                return;
              }

              dispatch(
                addTask({
                  taskName: inputValue,
                  isComplete: false,
                  createdAt: Date.now(),
                })
              );

              setTextValue("");
              inputRef.current.value = "";
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-md"
          >
            ➕
          </motion.button>
        </motion.div>

        <div className="flex justify-center mb-6 space-x-2">
          {["all", "pending", "completed"].map((type) => (
            <motion.button
              key={type}
              onClick={() => setFilter(type)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                backgroundColor: filter === type ? "#9333ea" : "#f3f4f6",
                color: filter === type ? "#fff" : "#1f2937",
              }}
              transition={{ duration: 0.3 }}
              className="px-4 py-1 rounded-full text-sm font-medium"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </motion.button>
          ))}
        </div>

        <div className="h-[270px] overflow-y-scroll">
          {isLoading ? (
            <motion.div
              className="flex justify-center items-center h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </motion.div>
          ) : filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="ps-5 pt-5"
            >
              <img src="/nodata(1).png" alt="No Data" />
            </motion.div>
          ) : (
            <ul className="space-y-3">
              <AnimatePresence>
                {filteredTasks.map((task) => (
                  <motion.li
                    key={task.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    layout
                    className="flex justify-between items-center bg-gray-100 rounded p-2"
                  >
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-grow mr-2 px-2 py-1 rounded border border-gray-300"
                      />
                    ) : (
                      <span
                        className={
                          task.isComplete ? "line-through text-gray-500" : ""
                        }
                      >
                        {task.taskName}
                      </span>
                    )}

                    <div className="flex space-x-2">
                      {!task.isComplete && editingTaskId !== task.id && (
                        <button
                          onClick={() => {
                            dispatch(completeTask(task.id));
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          ✅
                        </button>
                      )}

                      {editingTaskId === task.id ? (
                        <button
                          onClick={() => {
                            if (editValue.trim() !== "") {
                              dispatch(
                                editTask({
                                  id: task.id,
                                  updatedData: { taskName: editValue },
                                })
                              );
                              setEditingTaskId(null);
                              setEditValue("");
                              toast.success("Task updated!");
                            } else {
                              toast.error("Task name cannot be empty!");
                            }
                          }}
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          💾
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingTaskId(task.id);
                            setEditValue(task.taskName);
                          }}
                          className="bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                          ✏️
                        </button>
                      )}

                      <button
                        onClick={() => {
                          dispatch(deleteTask(task.id));
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        🗑️
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {Data.length > 0 && !isLoading && (
          <div className="text-center py-2">
            <motion.button
              whileHover={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 0.3 }}
              className="bg-red-600 hover:bg-red-700 rounded p-2 text-white"
              onClick={() => {
                dispatch(deleteAll());
              }}
            >
              Delete All
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Todo;
