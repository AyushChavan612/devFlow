// components/FileExplorer.tsx
"use client";

import { FormEvent, MouseEvent } from 'react';

interface File {
  name: string;
  content: string;
}

// ---- THIS IS THE FIX ----
// We must add the 'files' prop to this interface
interface FileExplorerProps {
  files: File[]; // <-- THIS IS THE MISSING LINE
  activeFile: string;
  onSelectFile: (fileName: string) => void;
  onFileDelete: (fileName: string) => void;
  onFileCreate: () => void;
  isAddingFile: boolean;
  newFileName: string;
  setNewFileName: (name: string) => void;
  handleCreateFormSubmit: (e: FormEvent) => void;
  onInputBlur: () => void;
}

export default function FileExplorer({
  files, // <-- Now it is correctly received
  activeFile,
  onSelectFile,
  onFileDelete,
  onFileCreate,
  isAddingFile,
  newFileName,
  setNewFileName,
  handleCreateFormSubmit,
  onInputBlur
}: FileExplorerProps) {

  const handleDeleteClick = (e: MouseEvent, fileName: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to permanently delete "${fileName}"?`)) {
      onFileDelete(fileName);
    }
  };

  return (
    // Make it fill the panel's height and scroll if needed
    <div className="bg-gray-800 text-white p-4 flex flex-col h-full overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Files</h2>
        <button
          onClick={onFileCreate}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded text-xs"
        >
          + New
        </button>
      </div>

      <ul className="flex-grow">
        {files.map((file) => {
          const isActive = file.name === activeFile;
          return (
            <li
              key={file.name}
              className={`p-1 rounded flex justify-between items-center cursor-pointer ${isActive ? 'bg-sky-700' : 'hover:bg-gray-700'}`}
              onClick={() => onSelectFile(file.name)}
            >
              <span>📄 {file.name}</span>
              <button
                onClick={(e) => handleDeleteClick(e, file.name)}
                className="text-gray-400 hover:text-white text-xs font-bold px-2"
              >
                X
              </button>
            </li>
          );
        })}

        {isAddingFile && (
          <li className="p-1">
            <form onSubmit={handleCreateFormSubmit}>
              <span>📄 </span>
              <input
                type="text"
                autoFocus
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onBlur={onInputBlur}
                className="bg-gray-900 text-white w-4/5 focus:outline-none"
              />
            </form>
          </li>
        )}
      </ul>
    </div>
  );
}