// Tools.tsx
import React from 'react';

interface ToolsProps {
  onScoreGame: () => void;
  onNavigateToScheduler: () => void;
  onPlaceholderClick: () => void;
}

const Tools = ({ onScoreGame, onNavigateToScheduler, onPlaceholderClick }: ToolsProps) => {
  return (
    <div className="w-1/3 p-4">
      <h2 className="text-2xl font-bold mb-4">Tools</h2>
      <div className="space-y-4">
        <button onClick={onScoreGame} className="w-full bg-blue-500 text-white p-4 rounded shadow">Score Game</button>
        <button onClick={onNavigateToScheduler} className="w-full bg-green-500 text-white p-4 rounded shadow">Scheduling Tool</button>
        <button onClick={onPlaceholderClick} className="w-full bg-gray-300 text-gray-700 p-4 rounded shadow">Placeholder</button>
      </div>
    </div>
  );
};

export default Tools;
