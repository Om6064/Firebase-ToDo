import { useEffect, useRef, useState } from "react";
import Table from "./Table";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { addTask, fetchTask } from "../features/todos/todoSlice";

const Todo = () => {
  const inputRef = useRef(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [textValue, setTextValue] = useState("");
  const dispatch = useDispatch()

  const { Data, isLoading } = useSelector(store => {
    return store.task
  })
  console.log(Data, isLoading);



  const handleInputChange = (e) => {
    setTextValue(e.target.value);
  };


  useEffect(() => {
    let updatedTasks = [];
    if (filter === "all") updatedTasks = tasks;
    else if (filter === "pending") updatedTasks = tasks.filter((t) => !t.isComplete);
    else if (filter === "completed") updatedTasks = tasks.filter((t) => t.isComplete);

    setFilteredTasks(updatedTasks);
  }, [tasks, filter]);
  useEffect(() => {
    dispatch(fetchTask());
  }, [dispatch]);

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

              dispatch(addTask({
                taskName: inputValue,
                isComplete: false,
                createdAt: Date.now(),
              }));

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
              className={`px-4 py-1 rounded-full text-sm font-medium`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </motion.button>
          ))}
        </div>

        <div className="h-[270px] overflow-scroll">
          {Data.length === 0 ? (
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
                {Data.map((task) => (
                  <Table
                    key={task.id}
                    id={task.id}
                    name={task.taskName}
                    complete={task.isComplete}
                  // onComplete={markAsComplete}
                  // onDelete={deleteTask}
                  // onEdit={editTask}
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {Data.length > 0 && (
          <div className="text-center py-2">
            <motion.button
              whileHover={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 0.3 }}
              className="bg-red-600 hover:bg-red-700 rounded p-2 text-white"
            // onClick={clearAll}
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
