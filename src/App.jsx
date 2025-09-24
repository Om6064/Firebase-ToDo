import { ToastContainer } from "react-toastify"
import Todo from "./components/Todo"

const App = () => {
    return (
        <div>
            <Todo/>
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    )
}

export default App