import { Clock } from "./Clock";

export const TaskHeader = () => (
  <div className="flex justify-between items-start mb-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
      <p className="text-gray-500">
        Keep track of your daily tasks and stay organized.
      </p>
    </div>
    <Clock />
  </div>
);