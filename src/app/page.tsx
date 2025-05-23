"use client";

import Link from "next/link";


export default function Welcome() {
  return (
    <>
      <div className="relative bg-[#0f0c1d] min-h-screen w-full overflow-hidden text-white font-sans">
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-0 w-60 h-60 bg-violet-800 opacity-30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-violet-800 opacity-30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        {/* Hero Section */}
        <div className="relative z-10 flex flex-col items-center justify-center h-screen text-center px-4">
          <h1 className="text-5xl font-bold mb-4">Welcome to Task Manager</h1>
          <p className="text-lg mb-8">
            Stay productive and organized. Manage your tasks efficiently with ease.
          </p>

          <Link href="/pages/tasks">
            <button className="bg-violet-600 hover:bg-violet-700 transition px-8 py-4 rounded-full text-lg font-medium">
              Start
            </button>
          </Link>

        </div>

      </div>

    </>
  )
}







// "use client";

// import { api } from "~/trpc/react";

// export default function Home() {
//   const updateTask = api.task.create.useMutation({
//     onSuccess: (data) => {
//       console.log("Task Updated:", data);
//     },
//     onError: (error) => {
//       console.error("Error creating task:", error);
//     },
//   });

//   const handleCreateTask = () => {
//     updateTask.mutate({
//       title: "New Task",
//       description: "This is a new task",
//       status: "pending",
//       imgUrl: "https://example.com/image.jpg",
//     });
//   };

//   const deleteTask = api.task.delete.useMutation({
//     onSuccess: (data) => {
//       console.log('Deleted Task ', data)
//     },
//     onError: (error) => {
//       console.log('Error deleting task', error)
//     }
//   });

//   const handleDelete = () => {

//     deleteTask.mutate({ id: "352bf305-f1cc-4dd6-aca8-c00bf4078421" });
//   }

//   const { data: tasks } = api.task.getById.useQuery({ id: "352bf305-f1cc-4dd6-aca8-c00bf4078421" })

//   console.log('data  got it by id', tasks)

//   return (
//     <div>
//       <h1>Task Manager</h1>
//       <button
//         onClick={handleCreateTask}
//         disabled={updateTask.isPending}
//         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//       >
//         {updateTask.isPending ? "Creating..." : "Create Test Task"}
//       </button>

//       {/* Delete Button */}
//       <button
//         onClick={handleDelete}
//         disabled={deleteTask.isPending}
//         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-3"
//       >
//         {deleteTask.isPending ? "Deleting..." : "Delete Task"}
//       </button>

//       {updateTask.error && (
//         <p className="text-red-500">Error: {updateTask.error.message}</p>
//       )}

//       {deleteTask.error && (
//         <p className="text-red-500">Error: {deleteTask.error.message}</p>
//       )}
//     </div>
//   );
// }
