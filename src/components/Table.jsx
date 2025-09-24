const Table = (props) => {
  return (
    <li className="bg-gray-100 overflow-y-auto rounded-lg flex justify-between items-center px-4 py-3 shadow-sm">
      <span
        className={`text-base font-medium ${props.complete ? "line-through text-green-600" : "text-gray-800"}`}
      >
        {props.name}
      </span>

      {props.complete ? (
        ""
      ) : (
        <button
          onClick={() => props.onComplete(props.id)}
          className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 shadow-md transition"
        >
          ✔
        </button>
      )}
    </li>
  );
};

export default Table;