import classNames from 'classnames';
import './Task.css';
import { useStore } from '../store';  // Corrected import
import trash from '../assets/trash.svg'; // Ensure the image path is correct

// eslint-disable-next-line react/prop-types
export default function Task({ title }) {
    const task = useStore((store) =>
        store.task.find((task) => task.title === title)
    );
    const setDraggedTask = useStore((store) => store.setDraggedTask);
    const deleteTask = useStore((store) => store.deleteTask);

    if (!task) {
        return null; // Handle the case where the task is not found
    }

    return (
        <div className="task" draggable onDragStart={() => setDraggedTask(task.title)}>
            <div>{title}</div>
            <div className="bottomWrapper">
                <div><img src={trash} alt="Delete" onClick={() => deleteTask(task.title)} /></div>
                <div className={classNames("status", task.state)}>{task.state}</div>
            </div>
        </div>
    );
}
