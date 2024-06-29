import axios from "axios";

const API_URL = "http://192.168.1.6:3000/api/tasks/";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

export const getAllTasks = async (): Promise<Task[]> => {
  const response = await axios.get<Task[]>(API_URL);
  return response.data;
};

export const getTask = async (id: number): Promise<Task> => {
  const response = await axios.get<Task>(`${API_URL}${id}`);
  return response.data;
};

export const createTask = async (updateData: Partial<Task>): Promise<Task> => {
  const response = await axios.post<Task>(API_URL, updateData);
  return response.data;
};

export const updateTask = async (
  id: number,
  updateData: Partial<Task>
): Promise<Task> => {
  const response = await axios.put<Task>(`${API_URL}${id}`, updateData);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}${id}`);
};
