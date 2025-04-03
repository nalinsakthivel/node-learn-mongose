const apiEndpoints = [
  {
    name: "Get All Tasks",
    method: "GET",
    path: "/tasks",
    auth: true,
  },
  {
    name: "Create Task",
    method: "POST",
    path: "/tasks",
    auth: true,
    body: {
      title: "New Task",
      image: "image-url",
    },
  },
  {
    name: "User Login",
    method: "POST",
    path: "/login",
    auth: false,
    body: {
      username: "nalin",
      password: "nalin",
    },
  },
  {
    name: "User Signup",
    method: "POST",
    path: "/signup",
    auth: false,
    body: {
      username: "nalin",
      password: "nalin",
    },
  },
];
