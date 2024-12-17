import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type FilterType = "all" | "completed" | "uncompleted";

interface TaskFilterProps {
  filter: FilterType;
  onFilterChange: (value: FilterType) => void;
}

export const TaskFilter = ({ filter, onFilterChange }: TaskFilterProps) => (
  <div className="my-4">
    <ToggleGroup 
      type="single" 
      value={filter} 
      onValueChange={(value: FilterType) => onFilterChange(value || "all")}
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