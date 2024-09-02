import { useState } from "react";
import "./Column.css";
import Task from "./Task";
import { useStore } from "../store";  // Corrected import
import classNames from "classnames";

// eslint-disable-next-line react/prop-types
export default function Column({ state }) {
    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    const [drop, setDrop] = useState(false);

    const tasks = useStore((store) =>
        store.task.filter((task) => task.state === state)
    );
    const addTask = useStore((store) => store.addTask);
    const setDraggedTask = useStore((store) => store.setDraggedTask);
    const draggedTask = useStore((store) => store.draggedTask);
    const moveTask = useStore((store) => store.moveTask);

    const handleDrop = (e) => {
        e.preventDefault();
        if (draggedTask) {
            moveTask(draggedTask, state); // Move the dragged task to the new column
            setDraggedTask(null); // Reset draggedTask after drop
            setDrop(false); // Reset drop state
        }
    };

    return (
        <div 
            className={classNames("column", { drop })}
            onDragOver={(e) => {
                e.preventDefault();
                setDrop(true); // Set drop state to true when dragging over
            }} 
            onDragLeave={(e) => {
                e.preventDefault();
                setDrop(false); // Set drop state to false when dragging leaves
            }}            
            onDrop={handleDrop}
        >
            <div className="tittleWrapper">
                <p>{state}</p>
                <button onClick={() => setOpen(true)}>Add</button>
            </div>
            {tasks.map((task) => (
                <Task title={task.title} key={task.title} />
            ))}
            {open && (
                <div className="Modal" onClick={() => setOpen(false)}>
                    <div className="modalContent" onClick={e => e.stopPropagation()}>
                        <input
                            onChange={e => setText(e.target.value)}
                            value={text}
                            placeholder="Enter task"
                        />
                        <button onClick={() => {
                            addTask(text, state);
                            setText("");
                            setOpen(false);
                        }}>Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
}
