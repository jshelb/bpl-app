// NewSeasonOverlay.tsx
import React, { useState } from 'react';

interface NewSeasonOverlayProps {
  onClose: () => void;
  apiEndpoint: string;
}

const NewSeasonOverlay: React.FC<NewSeasonOverlayProps> = ({ onClose, apiEndpoint }) => {
  const [textInput, setTextInput] = useState('');

  const handleUpload = async () => {
    try {
      // Split the text into an array of teams (assuming each line is a team)
      const teams = textInput.split('\n').map((team: String) => team.trim());

      console.log(teams);

      // Send a POST request to the specified API endpoint using fetch
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teams }),    // json with teams: ["team1", "team2", ...]
      });

      if (!response.ok) {
        throw new Error(`Failed to upload teams. Status: ${response.status}`);
      }

      // Close the overlay after uploading
      onClose();
    } catch (error) {
      console.error('Error uploading teams:', error);
    }
  };

  return (
    <div className="overlay-wrapper h-80vh">
      <div className="overlay-content">
        <h2 className="text-xl font-bold mb-4">Create New Season</h2>
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter team names (one per line)..."
          className="bg-gray-800 text-white p-2 rounded-md resize-none h-64" // Adjust height and other styles as needed
        />
        <div className="button-container flex justify-between mt-4">
            <button
                onClick={onClose}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md focus:outline-none"
            >
                Cancel
            </button>
            <button
                onClick={handleUpload}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md focus:outline-none"
            >
                Create Season
            </button>
          
        </div>
      </div>
    </div>
  );
};

export default NewSeasonOverlay;
