"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Pagination from "./ui/Pagination";
import { api } from "~/trpc/react";
import { ToastContainer, Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";
import Table from "./ui/Table";

// const statusColors: Record<string, string> = {
//     pending: 'bg-yellow-300/20 text-yellow-200 border border-yellow-400/30',
//     in_progress: 'bg-blue-400/20 text-blue-300 border border-blue-500/30',
//     completed: 'bg-emerald-400/20 text-emerald-300 border border-emerald-500/30',
// };

// const statusFlow: Record<string, string> = {
//     pending: 'in_progress',
//     in_progress: 'completed',
//     completed: 'in_progress',
// };

// in your tRPC backend
type Task = {
    id: string;
    title: string;
    description: string | null;
    status: 'pending' | 'in_progress' | 'completed';
    imgUrl: string | null;
    createdAt: Date;
};

const headers = ["Icon", "Title", "Description", "Status"]


export default function Tasks() {
    const [signedUrls, setSignedUrls] = useState<{ [key: string]: string }>({});
    const [isUpdateModal, setIsUpdateModal] = useState<boolean>(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editStatus, setEditStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');

    const [currentPage, setCurrentPage] = useState<number>(1)

    //Fetch Data
    const { data: tasks } = api.task.getAll.useQuery();
    //Delete Data
    const deleteTask = api.task.delete.useMutation({
        onSuccess: () => {
            toast.success('Task Deleted')
        },
        onError: () => {
            toast.error('Error deleting task')
        }
    });
    //Update Task
    const updateTask = api.task.update.useMutation({
        onSuccess: () => {
            toast.success('Task updated');
            setIsUpdateModal(false);
        },
        onError: () => {
            toast.error('Failed to update task');
        },
    });



    //Pagination
    const TaskPerPage = 2
    const lastIndex = currentPage * TaskPerPage
    const firstIndex = lastIndex - TaskPerPage
    const currentTasks = tasks ? tasks.slice(firstIndex, lastIndex) : []

    const totalPages = tasks ? Math.ceil(tasks.length / TaskPerPage) : 0

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const memoizedTasks = useMemo(() => currentTasks, [JSON.stringify(currentTasks)]);


    useEffect(() => {
        async function fetchAllSignedUrls() {
            const newSignedUrls: { [key: string]: string } = {};

            for (const t of currentTasks) {
                if (t.imgUrl) {
                    const url = await fetchSignedUrl(t.imgUrl);
                    if (url) {
                        console.log('urlllll ', url)
                        newSignedUrls[t.id] = url;
                    }
                }
            }
            setSignedUrls(newSignedUrls);
        }

        if (currentTasks?.length) {
            fetchAllSignedUrls();
        }
    }, [memoizedTasks]);


    // Your existing fetchSignedUrl function
    async function fetchSignedUrl(filePath: string) {
        try {
            const res = await fetch(`/api/signed-url?path=${encodeURIComponent(filePath)}`);
            const data = await res.json();

            if (res.ok) {
                return data.signedUrl;
            } else {
                console.error("Failed to get signed URL", data.error);
                return null;
            }
        } catch (error) {
            console.error("Error fetching signed URL:", error);
            return null;
        }
    }

    const handleDelete = async (id: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "this action is irreversible",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteTask.mutate({ id: id })
                Swal.fire('Deleted!', 'Task has been deleted.', 'success');
            }
        })
    }


    return (
        <>
            <div className="relative bg-[#0f0c1d] min-h-screen w-full overflow-hidden text-white font-sans">
                <ToastContainer
                    autoClose={2000}
                    pauseOnHover={false}
                    transition={Slide}
                    hideProgressBar={false}
                    closeOnClick={false}
                    pauseOnFocusLoss={true}
                />
                {/* Decorative Blobs */}
                <div className="absolute top-0 left-0 w-60 h-60 bg-violet-800 opacity-30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-60 h-60 bg-violet-800 opacity-30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                {/* Hero Section */}
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 space-y-8 text-white">
                    <p className="text-3xl font-bold">Tasks</p>

                    <Link href="/pages/create-task">
                        <button className="bg-violet-600 hover:bg-violet-700 transition px-10 py-3 rounded-xl">
                            Create Task
                        </button>
                    </Link>

                    {/* <div className="w-full max-w-3xl space-y-4">
                        {tasks && currentTasks.map(t => (
                            <div
                                key={t.id} className="flex items-center justify-between border border-white/20 p-4 rounded-lg bg-white/5 backdrop-blur-sm"
                                onClick={() => {
                                    setSelectedTask(t);
                                    setEditTitle(t.title);
                                    setEditDescription(t.description ?? '');
                                    setEditStatus(t.status);
                                    setIsUpdateModal(true);
                                }}
                            >
                                <div className="flex gap-4 text-left">
                                    {signedUrls[t.id] ? (
                                        <Image
                                            src={String(signedUrls[t.id])}
                                            alt={t.title}
                                            width={60}
                                            height={60}
                                            className="rounded-lg object-cover"
                                        />
                                    ) : (
                                        // Placeholder div or a loading spinner or nothing
                                        <div style={{ width: 60, height: 60, background: '#ccc', borderRadius: 8 }} />
                                    )}
                                    <div>
                                        <p className="text-lg font-semibold">{t.title}</p>
                                        <p className="text-sm text-white/70">{t.description}</p>
                                    </div>

                                </div>

                                <div className="flex items-center gap-2">

                                    <p
                                        className={`text-sm text-white px-4 py-2 rounded-full ${statusColors[t.status]}`}
                                    >
                                        {t.status.replace("_", " ")}
                                    </p>

                                    <button
                                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 px-4 py-2 rounded-full text-sm transition"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(t.id)
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div> */}

                    <Table data={currentTasks} headers={headers} signUrls={signedUrls} onDelete={(id) => handleDelete(id)} />

                    {/* Pagination Controll */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />


                    {/* Update Modal */}
                    {isUpdateModal && selectedTask && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                            <div className="bg-[#1a132d] p-6 rounded-lg w-full max-w-md space-y-4 text-white border border-white/10">
                                <h2 className="text-xl font-semibold">Update Task</h2>

                                <div className="space-y-2">
                                    <label className="block text-sm">Title</label>
                                    <input
                                        className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 outline-none"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm">Description</label>
                                    <textarea
                                        className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 outline-none"
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm">Status</label>
                                    <select
                                        className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 outline-none"
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value as Task["status"])}
                                        required
                                    >
                                        <option className="text-black" value="" disabled>Select a status</option>
                                        <option className="text-black" value="pending">Pending</option>
                                        <option className="text-black" value="in_progress">In Progress</option>
                                        <option className="text-black" value="completed">Completed</option>
                                    </select>

                                </div>

                                <div className="flex justify-end gap-4 pt-4">
                                    <button
                                        onClick={() => setIsUpdateModal(false)}
                                        className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (selectedTask) {
                                                updateTask.mutate({
                                                    id: selectedTask.id,
                                                    title: editTitle,
                                                    description: editDescription,
                                                    status: editStatus,
                                                });
                                            }
                                        }}
                                        className="px-4 py-2 rounded bg-violet-600 hover:bg-violet-700"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                </div>

            </div>
        </>
    )
}

