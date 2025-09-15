// components/Terminal.tsx
"use client"; // We need this to use hooks

import { useEffect, useRef } from 'react';

interface TerminalProps {
  output: string[];
}

export default function Terminal({ output }: TerminalProps) {
  // Create a ref to attach to the scrollable div
  const terminalRef = useRef<HTMLDivElement>(null);

  // This effect will run every time the 'output' array changes
  useEffect(() => {
    if (terminalRef.current) {
      // Scroll the div to its maximum scroll height
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div
      ref={terminalRef} // Attach the ref here
      className="bg-black p-4 font-mono overflow-y-auto h-full"
    >
      {output.map((line, index) => (
        <p key={index} className="whitespace-pre-wrap">{line}</p>
      ))}
    </div>
  );
}