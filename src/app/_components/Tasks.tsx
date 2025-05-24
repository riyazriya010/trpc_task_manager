"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Pagination from "./ui/Pagination";
import { api } from "~/trpc/react";
import { ToastContainer, Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";
import Table from "./ui/Table";
import Update from "./Update";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  imgUrl: string | null;
  createdAt: Date;
};

const headers = ["Icon", "Title", "Description", "Status"];

export default function Tasks() {
  const [signedUrls, setSignedUrls] = useState<{ [key: string]: string }>({});
  const [isUpdateModal, setIsUpdateModal] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const { data: tasks, refetch } = api.task.getAll.useQuery();

  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => {
      toast.success('Task Deleted');
      refetch();
    },
    onError: () => {
      toast.error('Error deleting task');
    }
  });

  const updateTask = api.task.update.useMutation({
    onSuccess: () => {
      toast.success('Task updated');
      setIsUpdateModal(false);
      refetch();
    },
    onError: () => {
      toast.error('Failed to update task');
    }
  });

  const isUpdating = updateTask.isPending;

  const TaskPerPage = 1;
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    if (statusFilter === 'all') return tasks;
    return tasks.filter(task => task.status === statusFilter);
  }, [tasks, statusFilter]);

  const totalPages = Math.ceil(filteredTasks.length / TaskPerPage);
  const lastIndex = currentPage * TaskPerPage;
  const firstIndex = lastIndex - TaskPerPage;
  const currentTasks = filteredTasks.slice(firstIndex, lastIndex);

  const memoizedTasks = useMemo(() => currentTasks, [JSON.stringify(currentTasks)]);

  useEffect(() => {
    async function fetchAllSignedUrls() {
      const newSignedUrls: { [key: string]: string } = {};
      for (const t of currentTasks) {
        if (t.imgUrl) {
          const url = await fetchSignedUrl(t.imgUrl);
          if (url) {
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action is irreversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      preConfirm: async () => {
        return deleteTask.mutateAsync({ id });
      },
      allowOutsideClick: () => !Swal.isLoading(),
      showLoaderOnConfirm: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Task has been deleted.', 'success');
      }
    });
  };

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
        <div className="absolute top-0 left-0 w-60 h-60 bg-violet-800 opacity-30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-violet-800 opacity-30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 space-y-8 text-white">
          <p className="text-3xl font-bold">Tasks</p>

          <div className="flex justify-between items-center w-full max-w-4xl">
            <Link href="/pages/create-task">
              <button className="bg-violet-600 hover:bg-violet-700 transition px-10 py-3 rounded-xl">
                Create Task
              </button>
            </Link>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setIsFilterDropdownOpen(prev => !prev)}
                className="bg-violet-600 hover:bg-violet-700 transition px-4 py-3 rounded-xl"
              >
                Filter
              </button>

              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
                  {['all', 'pending', 'in_progress', 'completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status as typeof statusFilter);
                        setIsFilterDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-200 ${statusFilter === status ? 'bg-gray-100 font-bold' : ''}`}
                    >
                      {status === 'all' ? 'All' : status.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <Table
            data={currentTasks}
            headers={headers}
            signUrls={signedUrls}
            handlers={(row: any) => [
              {
                handler: () => handleDelete(row.id),
                name: "Delete"
              },
              {
                handler: () => {
                  setSelectedTask(row);
                  setEditTitle(row.title);
                  setEditDescription(row.description ?? '');
                  setEditStatus(row.status);
                  setIsUpdateModal(true);
                },
                name: 'Edit'
              }
            ]}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          {/* Update Modal */}
          {isUpdateModal && selectedTask && (
            <Update
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editDescription={editDescription}
              setEditDescription={setEditDescription}
              editStatus={editStatus}
              setEditStatus={setEditStatus}
              setIsUpdateModal={setIsUpdateModal}
              selectedTask={selectedTask}
              isUpdating={isUpdating}
              handleUpdate={() => {
                if (selectedTask) {
                  updateTask.mutate({
                    id: selectedTask.id,
                    title: editTitle,
                    description: editDescription,
                    status: editStatus,
                  });
                }
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
