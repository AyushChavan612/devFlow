// components/Terminal.tsx
"use client";
import { useEffect, useRef } from 'react';
// ... (Keep your interface)
interface TerminalProps { output: string[]; }

export default function Terminal({ output }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  useEffect(() => { /* ... (your auto-scroll logic is unchanged) ... */ }, [output]);

  return (
    // Make it fill the panel's height
    <div 
      ref={terminalRef}
      className="bg-black p-4 font-mono overflow-y-auto h-full"
    >
      {output.map((line, index) => (
        <p key={index} className="whitespace-pre-wrap">{line}</p>
      ))}
    </div>
  );
}