'use client'

// page.tsx
import React from 'react';
import Leaderboard from '../components/leaderboard';
import Tools from '../components/tools';

interface Team {
  id: number;
  name: string;
  elo: number;
  wins: number;
  losses: number;
  cupDifferential: number;
}

const teamsData: Team[] = [
  // Sample team data
  { id: 1, name: 'Team A', elo: 1500, wins: 5, losses: 2, cupDifferential: 10 },
  { id: 2, name: 'Team B', elo: 1400, wins: 4, losses: 3, cupDifferential: 5 },
  { id: 3, name: 'Team C', elo: 1500, wins: 5, losses: 2, cupDifferential: 10 },
  { id: 4, name: 'Team D', elo: 1400, wins: 4, losses: 3, cupDifferential: 5 },
  { id: 5, name: 'Team E', elo: 1500, wins: 5, losses: 2, cupDifferential: 10 },
  { id: 6, name: 'Team F', elo: 1400, wins: 4, losses: 3, cupDifferential: 5 },
  { id: 1, name: 'Team A', elo: 1500, wins: 5, losses: 2, cupDifferential: 10 },
  { id: 2, name: 'Team B', elo: 1400, wins: 4, losses: 3, cupDifferential: 5 },
  { id: 3, name: 'Team C', elo: 1500, wins: 5, losses: 2, cupDifferential: 10 },
  { id: 4, name: 'Team D', elo: 1400, wins: 4, losses: 3, cupDifferential: 5 },
  { id: 5, name: 'Team E', elo: 1500, wins: 5, losses: 2, cupDifferential: 10 },
  { id: 6, name: 'Team F', elo: 1400, wins: 4, losses: 3, cupDifferential: 5 },
  // Add more teams as needed
];

const DashboardPage: React.FC = () => {
  const handleScoreGame = () => {
    // Implement scoring game logic
    console.log('Scoring a game');
  };

  const handleNavigateToScheduler = () => {
    // Implement navigation to scheduler logic
    console.log('Navigating to scheduler');
  };

  const handlePlaceholderClick = () => {
    // Implement placeholder logic
    console.log('Placeholder clicked');
  };

  return (
    <div className="flex">
      <Leaderboard teams={teamsData} />
      <Tools
        onScoreGame={handleScoreGame}
        onNavigateToScheduler={handleNavigateToScheduler}
        onPlaceholderClick={handlePlaceholderClick}
      />
    </div>
  );
};

export default DashboardPage;
