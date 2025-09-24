import { useState } from "react";
import { toast } from "react-toastify";

const Table = ({ id, name, complete, onComplete, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);

  const handleEditSave = () => {
    if (editValue.trim() !== "") {
      onEdit(id, editValue);
      setIsEditing(false);
    }else{
      toast.error("Task name cannot be empty!");
    }
  };

  return (
    <li className="flex justify-between items-center bg-gray-100 rounded p-2">
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="flex-grow mr-2 px-2 py-1 rounded border border-gray-300"
        />
      ) : (
        <span className={complete ? "line-through text-gray-500" : ""}>
          {name}
        </span>
      )}

      <div className="flex space-x-2">
        {!complete && !isEditing && (
          <button
            onClick={() => onComplete(id)}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            ✅
          </button>
        )}

        {isEditing ? (
          <button
            onClick={handleEditSave}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            💾
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 text-white px-2 py-1 rounded"
          >
            ✏️
          </button>
        )}

        <button
          onClick={() => onDelete(id)}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          🗑️
        </button>
      </div>
    </li>
  );
};

export default Table;
