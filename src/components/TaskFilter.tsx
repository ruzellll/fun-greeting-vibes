import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface TaskFilterProps {
  filter: "all" | "completed" | "uncompleted";
  setFilter: (value: "all" | "completed" | "uncompleted") => void;
}

export const TaskFilter = ({ filter, setFilter }: TaskFilterProps) => {
  return (
    <div className="my-4">
      <ToggleGroup
        type="single"
        value={filter}
        onValueChange={(value: "all" | "completed" | "uncompleted") =>
          setFilter(value || "all")
        }
      >
        <ToggleGroupItem value="all" aria-label="Show all tasks">
          All
        </ToggleGroupItem>
        <ToggleGroupItem value="completed" aria-label="Show completed tasks">
          Completed
        </ToggleGroupItem>
        <ToggleGroupItem value="uncompleted" aria-label="Show uncompleted tasks">
          Uncompleted
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};