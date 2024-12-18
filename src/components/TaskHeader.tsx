import { Clock } from "./Clock";

export const TaskHeader = () => {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Taskr~</h1>
        <p className="text-gray-500">Organize. Prioritize.</p>
      </div>
      <Clock />
    </div>
  );
};