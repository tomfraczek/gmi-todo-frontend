import { useState } from "react";
import axios from "axios";

interface UpdateTaskParams {
  id?: number;
  status?: string;
  title?: string;
  description?: string;
  [key: string]: any;
}

const useTask = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  const updateTask = async ({ id, ...updateData }: UpdateTaskParams) => {
    setLoading(true);
    setError(null);

    try {
      if (id !== undefined) {
        const response = await axios.put(
          `http://192.168.1.6:3000/api/tasks/${id}`,
          updateData
        );
        console.log("Task updated successfully:", response.data);
        setLoading(false);
        return response.data;
      }
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        setError(error.response ? error.response.data : error.message);
      } else {
        setError("Unexpected error occurred");
      }
      throw error;
    }
  };

  const getTasks = async (id?: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = id
        ? await axios.get(`http://192.168.1.6:3000/api/tasks/${id}`)
        : await axios.get(`http://192.168.1.6:3000/api/tasks/`);
      console.log("Fetched tasks successfully:", response.data);
      setTasks(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        setError(error.response ? error.response.data : error.message);
      } else {
        setError("Unexpected error occurred");
      }
      throw error;
    }
  };

  return { updateTask, getTasks, loading, error, tasks };
};

export default useTask;
