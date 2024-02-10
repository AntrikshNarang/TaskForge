import { useEffect, useState } from "react"
import Modal from "../Modal/Modal";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [Tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState<null | string>(null);
    const [Projects, setProjects] = useState([]);
    const [Users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [taskParams, setTaskParams] = useState({
        title: '',
        priority: 1,
    })
    const [projectParams, setprojectParams] = useState({
        name: '',
        description: ''
    })
    const [currentProjectNumber, setcurrentProjectNumber] = useState<null | number>(null)
    async function getTasks() {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/gettasks`,
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
        setTasks(json.tasks);
    }
    useEffect(() => {
      getTasks();
      getProjects();
    }, [])

    async function getProjects(){
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/getprojects`,
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
          setProjects(json.projects);
    }

    function openModalForProject(){
        setShowModal('Add Project')
    }
    async function addProject(){
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/createproject`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
              },
              body: JSON.stringify({name: projectParams.name, description: projectParams.description})
            }
          );
          const json = await response.json();
          console.log(json);
          setShowModal(null);
        getProjects();
    }
    async function getUsers(){
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/getusers`,
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
          setUsers(json.users);
    }
    function openModalForTasks(e, pId: number){
        setShowModal('Add Tasks');
        setcurrentProjectNumber(pId);
        setCurrentUser(null);
        getUsers();
    }
    async function addTask(){
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/createtask`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
              },
              body: JSON.stringify({title: taskParams.title, priority: taskParams.priority, uId: currentUser?.uId, pId: currentProjectNumber})
            }
          );
          const json = await response.json();
          console.log(json);
          setShowModal(null);
          setcurrentProjectNumber(null);
        getProjects();
        getTasks();
    }
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
            getTasks();
      }
      async function removeProject(pId: string) {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/removeproject/${pId}`,
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
            getProjects();
            getTasks();
      }

      function navigateToProjectPage(pId, name){
        navigate(`/project/${pId}/${name}`)
      }

  return (
    <div>
        <div className="min-h-screen bg-slate-300 p-3 w-[100%]">
            <h1 className="text-3xl font-sans font-bold text-center mb-2">
                Admin Dashboard
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-[100%]">
                <div className="bg-slate-400 p-3 rounded-md flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                        <h1 className="text-2xl font-sans font-bold">
                            Project List
                        </h1>
                        <button className="bg-sky-600 px-3 py-2 rounded-md font-sans" onClick={openModalForProject}>
                            Add Project
                        </button>
                    </div>
                       {Projects?.map((project) => {
                            return(
                                <div title="Open Project Page" onClick={() => navigateToProjectPage(project['Project ID'], project['Project Name'])} className="border-[3px] border-slate-500 rounded-lg px-2 py-2 flex flex-col gap-1 hover:cursor-pointer" key={project['Project ID']}>
                                    <p className="text-lg font-sans font-medium">
                                    Project Name: {project["Project Name"]}
                                    </p>
                                    <p className="text-lg font-sans font-medium">
                                    Project Description: {project["Project Description"]}
                                    </p>
                                    <div className="flex gap-2">
                                    <button className="bg-slate-500 px-2 py-1 rounded-md font-sans w-min whitespace-nowrap" title="Add Task to Project" 
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            openModalForTasks(e, project['Project ID'])
                                            }}>
                                        Add Task
                                    </button>
                                    <button className="bg-slate-500 px-2 py-1 rounded-md font-sans w-min whitespace-nowrap" title="Remove Project" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeProject(project['Project ID'])
                                        }}>
                                        Remove Project
                                    </button>
                                    </div>
                                </div>
                            )
                       })}
                </div>
                <div className="bg-slate-400 p-3 rounded-md flex flex-col gap-4">
                    <div className="">
                        <h1 className="text-2xl font-sans font-bold mb-2">
                            Pending Tasks
                        </h1>
                        <div className="flex flex-col gap-2">

                        {Tasks?.map((task) => {
                            return(
                                <div key={task['tId']} className="border-[3px] border-slate-500 rounded-lg px-2 py-2 flex flex-col gap-1" >
                                    <h2 className="text-lg font-sans font-medium">
                                    Task Title: {task["Task Title"]}
                                    </h2>
                                    <p className="text-lg font-sans font-medium">
                                    Task Priority: {task["Priority"]}
                                    </p>
                                    <p className="text-lg font-sans font-medium">
                                    Project Name: {task["Project Name"]}
                                    </p>
                                    <p className="text-lg font-sans font-medium">
                                    Assigned to: {task["Assigned To (User Name)"]}
                                    </p>
                                    <button className="bg-slate-500 px-2 py-1 rounded-md font-sans w-min whitespace-nowrap" onClick={() => taskComplete(task['tId'])}>Remove Task</button>
                                </div>
                            )
                        })}
                        </div>
                    </div>
                </div>
            </div>


            {showModal != null && <Modal title={showModal} setShowModal={setShowModal}>
                {showModal === 'Add Project' ? <>
                    <input type="text" placeholder="Project Name" className="w-full p-2 rounded-md my-2" value={projectParams.name} onChange={e => setprojectParams(prev => ({...prev, name: e.target.value}))} />
                    <input type="text" placeholder="Project Description" className="w-full p-2 rounded-md my-2" value={projectParams.description} onChange={e => setprojectParams(prev => ({...prev, description: e.target.value}))}/>
                    <button className="bg-green-500 px-3 py-2 rounded-md font-sans" onClick={addProject}>Add Project</button>
                </> : <>
                    <input type="text" placeholder="Task Name" className="w-full p-2 rounded-md my-2" value={taskParams.title} onChange={e => setTaskParams(prev => ({...prev, title: e.target.value}))} />
                    <input type="number" placeholder="Priority" className="w-full p-2 rounded-md my-2" value={taskParams.priority} min={1} onChange={e => setTaskParams(prev => ({...prev, priority: e.target.value}))}/>
                    <div className="bg-white p-2 rounded-md my-2">
                       Select User to which the task should be assigned to:
                       <div className="overflow-y-auto max-h-40">
                           {/* // make a table with all available users and their task count */}
                        <table>
                            <tr>
                                <th className="border-r-2 border-r-slate-500">Name of User</th>
                                <th className="pl-1">Assigned Tasks</th>
                            </tr>
                            {Users?.map((user) => {
                                return(
                                    <tr className="border-t border-t-slate-500 py-1 hover:cursor-pointer" onClick={() => setCurrentUser(user)} key={user['uId']}>
                                        <td className="border-r-2 border-r-slate-500">{user['name']}</td>
                                        <td className="pl-1">{user['taskCount']}</td>
                                    </tr>
                                    )
                            })}
                        </table>

                        {/* {Users?.map((user) => {
                            return(
                                // <div className="border-t border-t-slate-500 py-1 hover:cursor-pointer" onClick={() => setCurrentUser(user)} key={user['uId']}>
                                //     <p>{user['name']}</p>
                                // </div>
                                )
                        })} */}
                       </div>
                    </div>
                    {currentUser && <p className="bg-white p-2 rounded-md my-2">Currently Selected User: <b>{currentUser?.name}</b></p>}
                    <button className="bg-green-500 px-3 py-2 rounded-md font-sans" onClick={addTask}>Add Task</button>
                </>}
            </Modal>}
        </div>
    </div>
  )
}

export default AdminDashboard