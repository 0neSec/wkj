import React, { useEffect, useState } from 'react';
import { TaskContent, taskService } from '../../../services/Tentang/task';
import { FunctionContent, functionService } from '../../../services/Tentang/FunctionService';

const CombinedManager = () => {
  const [tasks, setTasks] = useState<TaskContent[]>([]);
  const [functions, setFunctions] = useState<FunctionContent[]>([]);
  const [loading, setLoading] = useState({
    tasks: true,
    functions: true
  });
  const [error, setError] = useState<{
    tasks: string | null;
    functions: string | null;
  }>({
    tasks: null,
    functions: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([
      fetchTasks(),
      fetchFunctions()
    ]);
  };

  const fetchTasks = async () => {
    try {
      setLoading(prev => ({ ...prev, tasks: true }));
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(prev => ({ ...prev, tasks: 'Failed to load tasks' }));
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }));
    }
  };

  const fetchFunctions = async () => {
    try {
      setLoading(prev => ({ ...prev, functions: true }));
      const fetchedFunctions = await functionService.getFunctions();
      setFunctions(fetchedFunctions);
    } catch (err) {
      setError(prev => ({ ...prev, functions: 'Failed to load functions' }));
    } finally {
      setLoading(prev => ({ ...prev, functions: false }));
    }
  };

  const renderContent = (
    items: Array<TaskContent | FunctionContent>,
    type: 'tasks' | 'functions'
  ) => {
    if (loading[type]) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin border-4   rounded-full h-8 w-8"></div>
        </div>
      );
    }

    if (error[type]) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error[type]}
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          {type === 'tasks' 
            ? 'Tidak ada tugas yang tersedia.'
            : 'Tidak ada fungsi yang tersedia.'}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((item) => (
          <div 
            key={item.id}
            className="bg-white border shadow-sm rounded-lg p-6 hover:shadow-md transition-all duration-300 hover:border-green-200"
          >
            <p className="text-black text-lg leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* Tasks Section */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-2">Tugas</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-1 w-12 bg-green-600 rounded-full" />
              <div className="h-1.5 w-1.5 bg-green-600 rounded-full" />
              <div className="h-1 w-12 bg-green-600 rounded-full" />
            </div>
          </div>
          <div className=" bg-opacity-50 rounded-xl p-6">
            {renderContent(tasks, 'tasks')}
          </div>
        </div>

        <div>
          {/* Functions Section */}
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-green-800 mb-2">Fungsi</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-1 w-12 bg-green-600 rounded-full" />
              <div className="h-1.5 w-1.5 bg-green-600 rounded-full" />
              <div className="h-1 w-12 bg-green-600 rounded-full" />
            </div>
          </div>
          <div className=" bg-opacity-50 rounded-xl p-6">
            {renderContent(functions, 'functions')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedManager;