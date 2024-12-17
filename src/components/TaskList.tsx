import { TaskItem } from "./TaskItem";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  pinned?: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, newTitle: string, newDescription: string) => void;
  onToggle: (taskId: string) => void;
  onPin: (taskId: string) => void;
}

export const TaskList = ({ tasks, onDelete, onEdit, onToggle, onPin }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tasks yet. Add one above!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={() => onDelete(task.id)}
          onEdit={(newTitle, newDescription) => onEdit(task.id, newTitle, newDescription)}
          onToggle={() => onToggle(task.id)}
          onPin={() => onPin(task.id)}
        />
      ))}
    </div>
  );
};