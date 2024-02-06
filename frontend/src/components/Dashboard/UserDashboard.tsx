import { useEffect, useState } from "react";

const UserDashboard = () => {
  const [userTasks, setuserTasks] = useState([]);
  async function getUserTasks() {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/gettasks`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    console.log(json);
    setuserTasks(json.tasks);
  }
  useEffect(() => {
    getUserTasks();
  }, []);

  async function taskComplete(tId: string) {
    const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/taskcomplete/${tId}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token") == null ? undefined : localStorage.getItem("token"),
            },
        }
        );
        const json = await response.json();
        console.log(json);
        getUserTasks();
  }

  return (
    <>
      <div className="min-h-screen w-screen bg-slate-300 p-3">
        {userTasks.length === 0 ? (
          <h1 className="text-3xl font-sans font-bold text-center">No Tasks</h1>
        ) : (
          <>
            <h1 className="text-3xl font-sans font-bold text-center mb-2">
              Your Tasks
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userTasks.map((task: any, index: number) => {
                return (
                  <div key={index} className="bg-slate-400 p-3 rounded-md flex justify-between items-start">
                    <div className="">
                    <h1 className="text-2xl font-sans font-bold">
                      {task["Task Title"]}
                    </h1>
                    <p className="text-lg font-sans font-medium">
                      Project: {task["Project Name"]}
                    </p>
                    <p className="text-lg font-sans font-medium">
                      Priority: {task["Priority"]}
                    </p>
                    <p className="text-lg font-sans font-medium">
                      Assigned By: {task["Assigned By (Admin Name)"]}
                    </p>
                    </div>
                    <button className="bg-green-500 px-3 py-2 rounded-md font-sans" onClick={() => taskComplete(task.tId)}>
                        Task Completed
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UserDashboard;
