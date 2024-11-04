import React, { useEffect, useState } from "react";
import Navbar from "../../../../component/includes/navbar";
import Sidebar from "../../../../component/includes/sidebar";
import { userTaksMessages } from "../../../../types/massage";
import { CreateTaskData, TaskContent, taskService, UpdateTaskData } from "../../../../services/Tentang/task";


const DashboardTask = () => {
  const [tasks, setTasks] = useState<TaskContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<TaskContent | null>(null);
  const [newTask, setNewTask] = useState<CreateTaskData>({ description: "" });
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await taskService.getTasks();
      setTasks(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : userTaksMessages.LOAD_FAILED;
      setError(errorMessage);
      setIsErrorModalOpen(true);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.description.trim()) {
      setError(userTaksMessages.EMPTY_DESCRIPTION);
      setIsErrorModalOpen(true);
      return;
    }

    try {
      await taskService.createTask(newTask);
      await fetchTasks();
      setSuccessMessage(userTaksMessages.CREATE_SUCCESS);
      setIsSuccessModalOpen(true);
      setNewTask({ description: "" });
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : userTaksMessages.CREATE_FAILED;
      setError(errorMessage);
      setIsErrorModalOpen(true);
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;

    try {
      const updatedData: UpdateTaskData = {
        id: editingTask.id,
        description: editingTask.description,
      };
      await taskService.updateTask(updatedData);
      await fetchTasks();
      setSuccessMessage(userTaksMessages.UPDATE_SUCCESS);
      setIsSuccessModalOpen(true);
      setEditingTask(null);
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : userTaksMessages.UPDATE_FAILED;
      setError(errorMessage);
      setIsErrorModalOpen(true);
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      try {
        await taskService.deleteTask(taskId);
        await fetchTasks();
        setSuccessMessage(userTaksMessages.DELETE_SUCCESS);
        setIsSuccessModalOpen(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : userTaksMessages.DELETE_FAILED;
        setError(errorMessage);
        setIsErrorModalOpen(true);
        console.error('Error deleting task:', err);
      }
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 mt-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Task Management</h1>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setEditingTask(null);
                  setNewTask({ description: "" });
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Add New Task
              </button>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-left">Created At</th>
                    <th className="px-4 py-3 text-left">Updated At</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{task.id}</td>
                      <td className="px-4 py-3">{task.description}</td>
                      <td className="px-4 py-3">
                        {new Date(task.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(task.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="ml-4 text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
                  <h2 className="text-2xl font-bold mb-6">
                    {editingTask ? "Edit Task" : "Add New Task"}
                  </h2>
                  <div className="space-y-4">
                    <textarea
                      value={editingTask ? editingTask.description : newTask.description}
                      onChange={(e) => {
                        if (editingTask) {
                          setEditingTask({ ...editingTask, description: e.target.value });
                        } else {
                          setNewTask({ description: e.target.value });
                        }
                      }}
                      placeholder="Enter task description..."
                      className="border px-4 py-3 rounded-lg w-full h-32 resize-y"
                    />
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => {
                        if (editingTask) {
                          handleUpdateTask();
                        } else {
                          handleCreateTask();
                        }
                      }}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {editingTask ? "Update" : "Create"}
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="ml-4 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isSuccessModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Success</h2>
                  <p>{successMessage}</p>
                  <button
                    onClick={() => setIsSuccessModalOpen(false)}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}

            {isErrorModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4">Error</h2>
                  <p>{error}</p>
                  <button
                    onClick={() => setIsErrorModalOpen(false)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTask;