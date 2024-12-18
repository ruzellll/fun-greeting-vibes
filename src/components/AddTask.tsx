import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AddTaskProps {
  onAdd: (title: string, description: string) => void;
}

export const AddTask = ({ onAdd }: AddTaskProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title, description);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div className="space-y-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 25))}
          placeholder="Add a new task..."
          className="flex-1"
          maxLength={25}
        />
        <div className="text-right text-sm text-gray-500">
          {title.length}/25
        </div>
      </div>
      <div className="space-y-2">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 200))}
          placeholder="Add a description (optional)..."
          className="min-h-[80px]"
          maxLength={200}
        />
        <div className="text-right text-sm text-gray-500">
          {description.length}/200
        </div>
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-secondary">
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    </form>
  );
};
