import { useState, useEffect } from "react";
import { AddTask } from "@/components/AddTask";
import { TaskList } from "@/components/TaskList";
import { Clock } from "@/components/Clock";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/components/ui/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  pinned: boolean;
}

type FilterType = "all" | "completed" | "uncompleted";

const API_URL = "http://localhost:5000/api";

// Generate or retrieve device ID
const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

// Headers with device ID
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Device-ID': getDeviceId(),
});

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const { toast } = useToast();

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (title: string, description: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      pinned: false,
    };

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        await fetchTasks();
        toast({
          title: "Success",
          description: "Task added successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (response.ok) {
        await fetchTasks();
        toast({
          title: "Success",
          description: "Task deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = async (
    taskId: string,
    newTitle: string,
    newDescription: string
  ) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (!taskToUpdate) return;

    const updatedTask = {
      ...taskToUpdate,
      title: newTitle,
      description: newDescription,
    };

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        await fetchTasks();
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/toggle`, {
        method: "PUT",
        headers: getHeaders(),
      });

      if (response.ok) {
        await fetchTasks();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle task",
        variant: "destructive",
      });
    }
  };

  const handlePinTask = async (taskId: string) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/pin`, {
        method: "PUT",
        headers: getHeaders(),
      });

      if (response.ok) {
        await fetchTasks();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to pin task",
        variant: "destructive",
      });
    }
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
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Taskr~</h1>
              <p className="text-gray-500">Organize. Prioritize.</p>
            </div>
            <Clock />
          </div>

          <AddTask onAdd={handleAddTask} />

          <div className="my-4">
            <ToggleGroup
              type="single"
              value={filter}
              onValueChange={(value: FilterType) => setFilter(value || "all")}
            >
              <ToggleGroupItem value="all" aria-label="Show all tasks">
                All
              </ToggleGroupItem>
              <ToggleGroupItem
                value="completed"
                aria-label="Show completed tasks"
              >
                Completed
              </ToggleGroupItem>
              <ToggleGroupItem
                value="uncompleted"
                aria-label="Show uncompleted tasks"
              >
                Uncompleted
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

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