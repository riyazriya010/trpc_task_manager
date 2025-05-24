"use client";

import React from 'react';

type TaskStatus = 'pending' | 'in_progress' | 'completed';

interface UpdateProps {
  editTitle: string;
  setEditTitle: (value: string) => void;
  editDescription: string;
  setEditDescription: (value: string) => void;
  editStatus: TaskStatus;
  setEditStatus: (value: TaskStatus) => void;
  setIsUpdateModal: (value: boolean) => void;
  selectedTask: { id: string } | null;
  handleUpdate: () => void;
  isUpdating: boolean;
}

export default function Update({
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  editStatus,
  setEditStatus,
  setIsUpdateModal,
  selectedTask,
  handleUpdate,
  isUpdating,
}: UpdateProps) {
  return (
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
            onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
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
            className="bg-violet-600 px-4 py-2 rounded-md text-white disabled:opacity-50"
            disabled={isUpdating}
            onClick={handleUpdate}
          >
            {isUpdating ? "Updating..." : "Update Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
