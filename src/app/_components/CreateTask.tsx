"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { api } from "~/trpc/react";
import { ToastContainer, Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";

type CreateTask = {
    title: string;
    description: string;
    image?: FileList
}

export default function CreateTask() {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CreateTask>()


    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload-file', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (res.ok) {

            // this returning were store to db
            const filePath = `${data.bucketName}/${data.fileName}`;

            return filePath;
        } else {
            console.error('Upload failed:', data.error);
        }
    };


    const createTask = api.task.create.useMutation({
        onSuccess: (data) => {
            console.log('Task Created Successfully', data);
        },
        onError: (error) => {
            console.log('Error on creating task', error);
        }
    });





    const submitForm: SubmitHandler<CreateTask> = async (data) => {
        try {
            const file = data.image?.[0];
            console.log('data ', data)
            console.log('file ', file)
            if (file) {
                const filePath = await handleUpload(file)
                console.log('url ', filePath)

                createTask.mutate({
                    title: data.title,
                    description: data.description,
                    imgUrl: filePath
                })
                toast.success('Task Created')
                setTimeout(() => {
                    router.push('/pages/tasks')
                }, 2000)
            } else {
                createTask.mutate({
                    title: data.title,
                    description: data.description
                })
                toast.success('Task Created')
                setTimeout(() => {
                    router.push('/pages/tasks')
                }, 2000)
            }
        } catch (error: unknown) {
            console.log('form submit error: ', error)
        }
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
                    <p className="text-3xl font-bold">Create Task</p>

                    {/* Form Card */}
                    <form
                        className="w-full max-w-md space-y-6 bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 text-left"
                        onSubmit={handleSubmit(submitForm)}
                        encType="multipart/form-data"
                    >
                        <div>
                            <label className="block mb-2 text-sm text-white/80">Title</label>
                            <input
                                id="title"
                                type="text"
                                placeholder="Enter task title"
                                className="w-full p-3 bg-white/10 text-white border border-white/20 rounded-md placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                {...register("title", {
                                    required: "Title is required",
                                    pattern: {
                                        value: /^[A-Za-z][A-Za-z0-9]*(?:\s[A-Za-z][A-Za-z0-9]*)*$/,
                                        message: 'Title must start with a letter and contain only single spaces'
                                    }
                                })}
                            />
                            <p className="text-red-600">{errors.title?.message}</p>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-white/80">Description</label>
                            <textarea
                                id="description"
                                rows={4}
                                placeholder="Describe the task..."
                                className="w-full p-3 bg-white/10 text-white border border-white/20 rounded-md placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                {...register("description", {
                                    required: "Description is required",
                                    pattern: {
                                        value: /^[A-Za-z][A-Za-z0-9]*(?:\s[A-Za-z][A-Za-z0-9]*)*$/,
                                        message: 'Description must start with a letter and contain only single spaces'
                                    }
                                })}
                            ></textarea>
                            <p className="text-red-600">{errors.description?.message}</p>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-white/80">Upload Image</label>
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                className="w-full text-white file:bg-violet-600 file:hover:bg-violet-700 file:border-0 file:px-4 file:py-2 file:rounded-md file:text-white file:cursor-pointer bg-white/10 rounded-md border border-white/20"
                                {...register("image")}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-md bg-violet-600 hover:bg-violet-700 transition text-white font-medium"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>

        </>
    )
}

