import { useState, useEffect } from "react";
import axios from "axios";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTask,
} from "@/helpers/api"; // Załóżmy, że funkcje te są zdefiniowane w api.ts

const API_URL = "http://192.168.1.6:3000/api/tasks/";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

const useTask = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const data = await getAllTasks();
        setTasks(data);
      } catch (error) {
        throw new Error("Error fetching tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const createNewTask = async (newTaskData: Partial<Task>): Promise<Task> => {
    try {
      const createdTask = await createTask(newTaskData);
      setTasks([...tasks, createdTask]);
      return createdTask;
    } catch (error) {
      throw new Error("Error creating task");
    }
  };

  const updateTaskStatus = async (
    id: number,
    newStatus: string
  ): Promise<Task> => {
    try {
      const updatedTask = await updateTask(id, { status: newStatus });
      const updatedTasks = tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      setTasks(updatedTasks);
      return updatedTask;
    } catch (error) {
      throw new Error("Error updating task");
    }
  };

  const getTaskById = async (id: number): Promise<void> => {
    try {
      await getTask(id);
      const filteredTasks = tasks.filter((task) => task.id !== id);
      setTasks(filteredTasks);
    } catch (error) {
      throw new Error("Error deleting task");
    }
  };

  const deleteTaskById = async (id: number): Promise<void> => {
    try {
      await deleteTask(id);
      const filteredTasks = tasks.filter((task) => task.id !== id);
      setTasks(filteredTasks);
    } catch (error) {
      throw new Error("Error deleting task");
    }
  };

  return {
    tasks,
    loading,
    createNewTask,
    updateTaskStatus,
    deleteTaskById,
  };
};

export default useTask;
