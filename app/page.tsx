'use client'

// page.tsx
import React, { useState, useEffect } from 'react';
import Leaderboard from './components/leaderboard';
import ScoreGameOverlay from './components/scoreGameOverlay';
import { useRouter } from 'next/navigation';
import RecentGames from './components/recentGames';

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

interface Game {
  id: number;
  team1: string;
  team2: string;
  cups1: number;
  cups2: number;
}

const DashboardPage: React.FC = () => {
  const [teamsData, setTeamsData] = useState<Team[]>([]);
  const [gamesData, setGamesData] = useState<Game[]>([]);

  // Fetch teams data from /api/teams
  const fetchTeamsData = async () => {
    try {
      const response = await fetch('/api/teams');
      if (!response.ok) {
        throw new Error(`Failed to fetch teams data. Status: ${response.status}`);
      }

      const data = await response.json();
      setTeamsData(data.teams);
    } catch (error) {
      console.error('Error fetching teams data:', error);
    }
  };

  // Fetch teams data from /api/teams
  const fetchGamesData = async () => {
    console.log("fetching recent games");
    try {
      const response = await fetch('/api/recent_games');
      if (!response.ok) {
        throw new Error(`Failed to fetch games data. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setGamesData(data.games);
    } catch (error) {
      console.error('Error fetching games data:', error);
    }
  };

  useEffect(() => {
    fetchTeamsData();
    fetchGamesData(); // get games data after game scored
  }, []); // Empty dependency array to run the effect only once on component mount

  const handleTeamsUpdate = () => {
    fetchTeamsData(); // Fetch updated teams data
    fetchGamesData(); // get games data after game scored
  };

  const [isScoreGameOverlayVisible, setScoreGameOverlayVisible] = useState(false); // Add state for ScoreGameOverlay
  const handleScoreGameClick = () => setScoreGameOverlayVisible(true);

  const closeScoreGameOverlay = () => {
    setScoreGameOverlayVisible(false);
    handleTeamsUpdate();
  };

  return (
    <div className="flex">
      <Leaderboard teams={teamsData} />
      <div className="w-1/3 p-4">
        <h2 className="text-2xl font-bold mb-4">Tools</h2>
        <div className="space-y-4">
          <button onClick={handleScoreGameClick} className="w-full bg-blue-500 text-white p-10 rounded shadow">Score Game</button>
        </div>
        <div className="space-y-4">
          <RecentGames games={gamesData} />
        </div>
        {isScoreGameOverlayVisible && (
          <ScoreGameOverlay
            onClose={closeScoreGameOverlay}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
