// Tools.tsx
import React, { useState } from 'react';
import NewSeasonOverlay from './newSeasonOverlay';

interface ToolsProps {
  onScoreGame: () => void;
  onNavigateToScheduler: () => void;
}

const Tools: React.FC<ToolsProps> = ({ onScoreGame, onNavigateToScheduler }) => {
  const [isNewSeasonOverlayVisible, setNewSeasonOverlayVisible] = useState(false);

  const handleNewSeasonClick = () => {
    setNewSeasonOverlayVisible(true);
  };

  const closeNewSeasonOverlay = () => {
    setNewSeasonOverlayVisible(false);
  };

  return (
    <div className="w-1/3 p-4">
      <h2 className="text-2xl font-bold mb-4">Tools</h2>
      <div className="space-y-4">
        <button onClick={onScoreGame} className="w-full bg-blue-500 text-white p-4 rounded shadow">Score Game</button>
        <button onClick={onNavigateToScheduler} className="w-full bg-green-500 text-white p-4 rounded shadow">Scheduling Tool</button>
        <button onClick={handleNewSeasonClick} className="w-full bg-gray-300 text-gray-700 p-4 rounded shadow">Create New Season</button>
      </div>

      {isNewSeasonOverlayVisible && (
        <NewSeasonOverlay
          onClose={closeNewSeasonOverlay}
          // Pass the API endpoint and any other necessary information
          apiEndpoint="/api/upload"
        />
      )}
    </div>
  );
};

export default Tools;
