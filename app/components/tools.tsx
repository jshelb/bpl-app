// Tools.tsx
import React, { useState } from 'react';
import NewSeasonOverlay from './newSeasonOverlay';
import ScoreGameOverlay from './scoreGameOverlay';

interface ToolsProps {
  onTeamsUpdate: () => void;
  onNavigateToScheduler: () => void;
}

const Tools: React.FC<ToolsProps> = ({ onTeamsUpdate, onNavigateToScheduler }) => {
  const [isNewSeasonOverlayVisible, setNewSeasonOverlayVisible] = useState(false);
  const [isScoreGameOverlayVisible, setScoreGameOverlayVisible] = useState(false); // Add state for ScoreGameOverlay


  const handleNewSeasonClick = () => {
    setNewSeasonOverlayVisible(true);
  };

  const handleScoreGameClick = () => {
    setScoreGameOverlayVisible(true);
  };

  const closeNewSeasonOverlay = () => {
    setNewSeasonOverlayVisible(false);
    onTeamsUpdate();
  };

  const closeScoreGameOverlay = () => {
    setScoreGameOverlayVisible(false);
    onTeamsUpdate();
  };

  return (
    <div className="w-1/3 p-4">
      <h2 className="text-2xl font-bold mb-4">Tools</h2>
      <div className="space-y-4">
        <button onClick={handleScoreGameClick} className="w-full bg-blue-500 text-white p-4 rounded shadow">Score Game</button>
        <button onClick={onNavigateToScheduler} className="w-full bg-green-500 text-white p-4 rounded shadow">Scheduling Tool</button>
        <button onClick={handleNewSeasonClick} className="w-full bg-gray-300 text-gray-700 p-4 rounded shadow">Create New Season</button>
      </div>

      {isNewSeasonOverlayVisible && (
        <NewSeasonOverlay
          onClose={closeNewSeasonOverlay}
        />
      )}

      {isScoreGameOverlayVisible && (
              <ScoreGameOverlay
                onClose={closeScoreGameOverlay}
              />
      )}
    </div>
  );
};

export default Tools;
