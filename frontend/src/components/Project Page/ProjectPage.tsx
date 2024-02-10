import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProjectPage() {
  const { id, name } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function getProjectDetails(id: string) {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/getprojecttasks/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token") || "",
          },
        }
      );
      const json = await response.json();
      console.log(json);
      if (json.success == true) {
        setTasks(json.project);
      } else {
        alert(json.error);
      }
    }
    getProjectDetails(id);
  }, []);

  return (
    <div className="min-h-screen w-screen bg-slate-300 p-3">
      <h1 className="text-center text-3xl font-bold">{name}</h1>
      <p>Remaining Tasks for project with Project ID: {id}</p>
      {tasks.map((task: any) => {
        return (
          <div key={task.tId} className="bg-slate-200 p-2 m-2 rounded-lg">
            <p>Task Name: {task.title}</p>
            <p>Task Priority: {task.priority}</p>
            <p>Assigned User: {task.assignedUser}</p>
          </div>
        );
        }
        )}
    </div>
  );
}

export default ProjectPage;
