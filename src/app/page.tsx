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

