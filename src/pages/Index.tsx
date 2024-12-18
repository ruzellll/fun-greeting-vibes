import { useState } from "react";
import { AddTask } from "@/components/AddTask";
import { TaskList } from "@/components/TaskList";
import { TaskHeader } from "@/components/TaskHeader";
import { TaskFilter } from "@/components/TaskFilter";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  pinned: boolean;
}

type FilterType = "all" | "completed" | "uncompleted";

const Index = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [filter, setFilter] = useState<FilterType>("all");
  const { toast } = useToast();

  const handleAddTask = (title: string, description: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      pinned: false,
    };

    setTasks([...tasks, newTask]);
    toast({
      title: "Success",
      description: "Task added successfully",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    toast({
      title: "Success",
      description: "Task deleted successfully",
    });
  };

  const handleEditTask = (
    taskId: string,
    newTitle: string,
    newDescription: string
  ) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, title: newTitle, description: newDescription }
          : task
      )
    );
    toast({
      title: "Success",
      description: "Task updated successfully",
    });
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handlePinTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, pinned: !task.pinned } : task
      )
    );
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "uncompleted") return !task.completed;
      return true;
    })
    .sort((a, b) => {
      if (a.pinned === b.pinned) return 0;
      return a.pinned ? -1 : 1;
    });

  return (
    <div className="min-h-screen bg-[#F6F8FA] py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <TaskHeader />
          <AddTask onAdd={handleAddTask} />
          <TaskFilter filter={filter} setFilter={setFilter} />
          <TaskList
            tasks={filteredTasks}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
            onToggle={handleToggleTask}
            onPin={handlePinTask}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;