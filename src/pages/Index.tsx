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

  const handleAddTask = async (title: string, description: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      pinned: false,
    };

    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error('Backend API unavailable');
      }

      await response.json();
    } catch (error) {
      console.log('Using localStorage fallback:', error);
    }

    setTasks([...tasks, newTask]);
    toast({
      title: "Success",
      description: "Task added successfully",
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Backend API unavailable');
      }

      await response.json();
    } catch (error) {
      console.log('Using localStorage fallback:', error);
    }

    setTasks(tasks.filter((task) => task.id !== taskId));
    toast({
      title: "Success",
      description: "Task deleted successfully",
    });
  };

  const handleEditTask = async (
    taskId: string,
    newTitle: string,
    newDescription: string
  ) => {
    const updatedTask = tasks.find(task => task.id === taskId);
    if (!updatedTask) return;

    const modifiedTask = {
      ...updatedTask,
      title: newTitle,
      description: newDescription
    };

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modifiedTask),
      });

      if (!response.ok) {
        throw new Error('Backend API unavailable');
      }

      await response.json();
    } catch (error) {
      console.log('Using localStorage fallback:', error);
    }

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

  const handleToggleTask = async (taskId: string) => {
    const taskToToggle = tasks.find(task => task.id === taskId);
    if (!taskToToggle) return;

    const toggledTask = {
      ...taskToToggle,
      completed: !taskToToggle.completed
    };

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toggledTask),
      });

      if (!response.ok) {
        throw new Error('Backend API unavailable');
      }

      await response.json();
    } catch (error) {
      console.log('Using localStorage fallback:', error);
    }

    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handlePinTask = async (taskId: string) => {
    const taskToPin = tasks.find(task => task.id === taskId);
    if (!taskToPin) return;

    const pinnedTask = {
      ...taskToPin,
      pinned: !taskToPin.pinned
    };

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pinnedTask),
      });

      if (!response.ok) {
        throw new Error('Backend API unavailable');
      }

      await response.json();
    } catch (error) {
      console.log('Using localStorage fallback:', error);
    }

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