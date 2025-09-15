// components/CodeEditor.tsx
"use client";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  content: string;
  onChange: (value: string | undefined) => void;
  language: string; // <-- ADD THIS
}

export default function CodeEditor({ content, onChange, language }: CodeEditorProps) {
  // Map our simple extension to Monaco's official language ID if needed
  const getLanguageId = (lang: string) => {
    if (lang === 'js') return 'javascript';
    if (lang === 'py') return 'python';
    // Monaco handles 'cpp', 'c', and 'java' directly
    return lang;
  };

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      language={getLanguageId(language)} // <-- USE THE PROP HERE
      value={content}
      onChange={onChange}
    />
  );
}