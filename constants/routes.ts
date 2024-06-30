const ROUTES = {
  HOME: "/",
  TASK_LIST: "/(tabs)/task-list",
  TASK_FORM: "/(tabs)/task-form",
  BIN: "/(tabs)/bin",
  TASK_DETAILS: (id: number | string) => `/task/${id}`,
};

export default ROUTES;
