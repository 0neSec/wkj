import React, { useEffect, useState } from 'react';
import { TaskContent, taskService } from '../../../services/Tentang/task';

const TaskManager = () => {
  const [tasks, setTasks] = useState<TaskContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <p className="text-gray-700 text-lg leading-relaxed">
              {task.description}
            </p>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Tidak ada tugas dan fungsi yang tersedia.
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;