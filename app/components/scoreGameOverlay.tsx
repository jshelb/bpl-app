// scoreGameOverlay.tsx
import React, { useEffect, useState } from 'react';
import Select from 'react-select';


interface Team {
  id: number;
  name: string;
  points: number;
  elo: number;
  wins: number;
  losses: number;
  ot_losses: number;
  cupDifferential: number;
}

interface teamOption {
    label: string;
    value: string;
}

interface ScoreGameOverlayProps {
  onClose: () => void;
}

const ScoreGameOverlay: React.FC<ScoreGameOverlayProps> = ({ onClose }) => {
    const [teams, setTeams] = useState([]);
    const [team1, setTeam1] = useState<teamOption | null>(null);
    const [team2, setTeam2] = useState<teamOption | null>(null);
    const [cups1, setCups1] = useState(0);
    const [cups2, setCups2] = useState(0);
    const [error, setError] = useState<string>("");


    useEffect(() => {
        // Fetch teams data from /api/teams when the component mounts
        const fetchTeams = async () => {
          try {
            const response = await fetch('/api/teams');
            if (!response.ok) {
              throw new Error(`Failed to fetch teams. Status: ${response.status}`);
            }
            const teamsData = await response.json();
            const teamsArr = teamsData['teams']
            const teamOptions = teamsArr.map((team: Team) => ({
              value: team.name,
              label: team.name,
            }));
            setTeams(teamOptions);
          } catch (error) {
            console.error('Error fetching teams:', error);
            setError('Failed to fetch teams');
          }
        };
    
        fetchTeams();
      }, []);

  const validateInputs = () => {
    if (!(cups1 >= 10 || cups2 >= 10)) {
      setError('At least one of the cup counts must be greater than or equal to 10.');
      return false;
    }

    if (cups1 < 0 || cups1 > 11 || cups2 < 0 || cups2 > 11) {
      setError('Cup counts must be positive integers between 0 and 11');
      return false;
    }

    if (cups1 == 10 && cups2 == 10) {
      setError('Ties are not allowed');
      return false;
    }

    if (!team1 || !team2) {
        setError('Please select both teams.');
        return false;
    }

    if (team1 == team2) {
        setError('Teams cannot play themselves. Please fix team information');
        return false;
    }

    setError("");
    return true;
  };

  const handleScoreGame = async () => {
    try {
        if (!validateInputs()) {
            throw new Error(error); // Do not proceed with scoring if inputs are invalid}
        }

        const t1 = team1?.value;
        const t2 = team2?.value;
        // Send a POST request to the specified API endpoint using fetch
        const response = await fetch('/api/score_game', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ team1: t1, team2: t2, cups1, cups2 }),
        });

        if (!response.ok) {
            setError(`Failed to score the game. Status: ${response.status}`);
            throw new Error(`Failed to score the game. Status: ${response.status}`);
        }

        // Handle successful scoring, if needed
        console.log('Game scored successfully');
        // Always close the overlay whether successful or not
        onClose();
    } catch (error) {
      console.error('Error scoring the game:', error);
    }
  };

  return (
    <div className="overlay-wrapper h-80vh">
      <div className="overlay-content">
        <h2 className="text-xl font-bold mb-4">Score Game</h2>
        {error && <p className="text-red-500 mb-4">{String(error)}</p>}
        <div className="flex space-x-4">
          <div className="flex flex-col">
            <label className="text-white">Team 1:</label>
            <Select
              value={team1}
              onChange={(selectedOption) => setTeam1(selectedOption)}
              options={teams}
              className="rounded-md text-gray-800 w-64"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Cups 1:</label>
            <input
              type="number"
              value={cups1}
              onChange={(e) => setCups1(parseInt(e.target.value, 10))}
              className="p-2 rounded-md bg-gray-800 text-white w-20"
              min="0"  // Set the bounds
              max="30"
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="flex flex-col">
            <label className="text-white">Team 2:</label>
            <Select
              value={team2}
              onChange={(selectedOption) => setTeam2(selectedOption)}
              options={teams}
              className="rounded-md text-gray-800 w-64"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white">Cups 2:</label>
            <input
              type="number"
              value={cups2}
              onChange={(e) => setCups2(parseInt(e.target.value, 10))}
              className="p-2 rounded-md bg-gray-800 text-white w-20"
              min="0"  // Set the bounds
              max="30"
            />
          </div>
        </div>
        <div className="button-container flex justify-between mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleScoreGame}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md focus:outline-none"
          >
            Score Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreGameOverlay;
