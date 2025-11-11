// app/page.tsx
"use client";

import { useState, FormEvent } from 'react';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

import FileExplorer from '@/components/FileExplorer';
import Terminal from '@/components/Terminal';
import EditorLoader from '@/components/EditorLoader';
import Header from '@/components/Header';
import Tabs from '@/components/Tabs';

// --- 1. THIS IS THE NEW LINE ---
// This will use the variable from Docker, or default to localhost for local testing
const BACKEND_URL = 'http://13.60.218.112:5000';

interface File {
  name: string;
  content: string;
}

const SUPPORTED_EXTENSIONS = ['js', 'py', 'c', 'cpp', 'java'];

export default function Home() {
  // All your state...
  const [files, setFiles] = useState<File[]>([
    { name: 'index.js', content: 'console.log("Hello, DevFlow!");' },
    { name: 'styles.css', content: '/* Add your styles here */' },
    { name: 'package.json', content: '{ "name": "devflow-ide" }' }
  ]);
  const [openFiles, setOpenFiles] = useState<string[]>(['index.js']);
  const [activeFileName, setActiveFileName] = useState('index.js');
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['> Welcome to the DevFlow terminal!']);
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isTerminalVisible, setIsTerminalVisible] = useState(true);

  // All your handlers...
  const activeFile = files.find(file => file.name === activeFileName);

  const handleSelectFile = (fileName: string) => {
    if (!openFiles.includes(fileName)) {
      setOpenFiles([...openFiles, fileName]);
    }
    setActiveFileName(fileName);
  };

  const handleCloseTab = (fileNameToClose: string) => {
    const remainingTabs = openFiles.filter(file => file !== fileNameToClose);
    setOpenFiles(remainingTabs);
    if (activeFileName === fileNameToClose) {
      setActiveFileName(remainingTabs.length > 0 ? remainingTabs[0] : '');
    }
  };

  const handleEditorChange = (newContent: string | undefined) => {
    if (newContent === undefined) return;
    const updatedFiles = files.map(file =>
      file.name === activeFileName ? { ...file, content: newContent } : file
    );
    setFiles(updatedFiles);
  };

  const handleCreateFile = (e: FormEvent) => {
    e.preventDefault();
    const name = newFileName.trim();
    if (name) {
      const extension = name.split('.').pop()?.toLowerCase();
      if (extension && SUPPORTED_EXTENSIONS.includes(extension)) {
        const newFile = { name, content: `// New file: ${name}\n` };
        setFiles([...files, newFile]);
        if (!openFiles.includes(name)) {
          setOpenFiles([...openFiles, name]);
        }
        setActiveFileName(name);
        setNewFileName('');
        setIsAddingFile(false);
      } else {
        alert(`Error: Unsupported file extension. Please use one of: ${SUPPORTED_EXTENSIONS.join(', ')}`);
      }
    }
  };

  const handleDeleteFile = (fileNameToDelete: string) => {
    handleCloseTab(fileNameToDelete);
    const remainingFiles = files.filter(file => file.name !== fileNameToDelete);
    setFiles(remainingFiles);
  };

  // --- 2. THIS FUNCTION IS NOW UPDATED ---
  const handleRunCode = async () => {
    if (!activeFile) return;
    setTerminalOutput(prev => [...prev, `$ running ${activeFile.name}...`]);
    try {
      // It now uses the BACKEND_URL variable
      const response = await fetch(`${BACKEND_URL}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: activeFile.content,
          filename: activeFile.name
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setTerminalOutput(prev => [...prev, `Error: ${errorText}`, '--------------------']);
      } else {
        const result = await response.json();
        setTerminalOutput(prev => [...prev, result.output, '--------------------']);
      }
    } catch (error) {
      console.error("Failed to run code:", error);
      setTerminalOutput(prev => [...prev, `Error: Failed to connect to backend. Is it running?`, '--------------------']);
    }
  };

  const handleSuggestCode = async () => {
    alert("AI Suggestion feature not implemented yet.");
  };

  const toggleSidebar = () => setIsSidebarVisible(prev => !prev);
  const toggleTerminal = () => setIsTerminalVisible(prev => !prev);
  
  const language = activeFile?.name.split('.').pop() || 'plaintext';

  // Your layout JSX is unchanged...
  return (
    <main className="flex h-screen w-screen bg-gray-900 text-white">
      <PanelGroup direction="horizontal" className="flex-1">
        {isSidebarVisible && (
          <>
            <Panel defaultSize={20} minSize={15}>
              <FileExplorer
                files={files}
                activeFile={activeFileName}
                onSelectFile={handleSelectFile}
                onFileDelete={handleDeleteFile}
                onFileCreate={() => setIsAddingFile(true)}
                isAddingFile={isAddingFile}
                newFileName={newFileName}
                setNewFileName={setNewFileName}
                handleCreateFormSubmit={handleCreateFile}
                onInputBlur={() => setIsAddingFile(false)}
              />
            </Panel>
            <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-sky-600" />
          </>
        )}
        <Panel>
          <PanelGroup direction="vertical">
            <Panel minSize={30}>
              <div className="flex flex-col h-full">
                <Header 
                  onRunClick={handleRunCode} 
                  onSuggestClick={handleSuggestCode}
                  onToggleSidebar={toggleSidebar}
                  onToggleTerminal={toggleTerminal}
                />
                <Tabs
                  openFiles={openFiles}
                  activeFile={activeFileName}
                  onTabClick={setActiveFileName}
                  onTabClose={handleCloseTab}
                />
                <EditorLoader
                  fileContent={activeFile?.content || ''}
                  onContentChange={handleEditorChange}
                  language={language} 
                />
              </div>
            </Panel>
            {isTerminalVisible && (
              <>
                <PanelResizeHandle className="h-1 bg-gray-700 hover:bg-sky-600" />
                <Panel defaultSize={25} minSize={10}>
                  <Terminal output={terminalOutput} />
                </Panel>
              </>
            )}
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </main>
  );
}