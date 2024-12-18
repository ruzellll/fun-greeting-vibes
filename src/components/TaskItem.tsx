import { useState } from "react";
import { Check, Trash, Edit, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    pinned?: boolean;
  };
  onDelete: () => void;
  onEdit: (newTitle: string, newDescription: string) => void;
  onToggle: () => void;
  onPin: () => void;
}

export const TaskItem = ({
  task,
  onDelete,
  onEdit,
  onToggle,
  onPin,
}: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const handleSubmit = () => {
    if (editedTitle.trim()) {
      onEdit(editedTitle, editedDescription);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`task-item flex gap-4 bg-white p-4 rounded-lg shadow-sm transition-all ${
        task.pinned
          ? "border-2 border-yellow-400 shadow-md"
          : "border border-gray-100"
      } mb-3`}
    >
      <div className="flex items-start pt-1">
        <Checkbox
          checked={task.completed}
          onCheckedChange={onToggle}
          className="mt-1"
        />
      </div>
      {isEditing ? (
        <div className="flex-1 flex flex-col gap-2">
          <div className="space-y-2">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value.slice(0, 25))}
              className="flex-1"
              autoFocus
              placeholder="Task title..."
              maxLength={25}
            />
            <div className="text-right text-sm text-gray-500">
              {editedTitle.length}/25
            </div>
          </div>
          <div className="space-y-2">
            <Textarea
              value={editedDescription}
              onChange={(e) =>
                setEditedDescription(e.target.value.slice(0, 200))
              }
              placeholder="Add a description..."
              className="min-h-[80px]"
              maxLength={200}
            />
            <div className="text-right text-sm text-gray-500">
              {editedDescription.length}/200
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} size="sm">
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span
              className={`text-left ${
                task.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {task.title}
            </span>
            <div className="flex gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onPin();
                }}
                size="icon"
                variant="ghost"
                className={`text-gray-500 hover:text-yellow-500 ${
                  task.pinned ? "text-yellow-500" : ""
                }`}
              >
                <Pin className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
                size="icon"
                variant="ghost"
                className="text-gray-500 hover:text-primary"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                onClick={onDelete}
                size="icon"
                variant="ghost"
                className="text-gray-500 hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {task.description && (
            <p
              className={`mt-2 text-sm text-gray-500 text-left ${
                task.completed ? "line-through" : ""
              }`}
            >
              {task.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
