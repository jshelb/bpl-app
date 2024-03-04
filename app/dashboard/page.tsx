'use client'

// page.tsx
import React, { useState, useEffect } from 'react';
import Leaderboard from '../components/leaderboard';
import Tools from '../components/tools';
import { useRouter } from 'next/navigation';

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

const DashboardPage: React.FC = () => {
  const [teamsData, setTeamsData] = useState<Team[]>([]);

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

  useEffect(() => {
    fetchTeamsData();
  }, []); // Empty dependency array to run the effect only once on component mount

  

  const handleTeamsUpdate = () => {
    fetchTeamsData(); // Fetch updated teams data
  };

  const router = useRouter();
  const handleNavigateToScheduler = () => {
    // Implement navigation to scheduler logic
    console.log('Navigating to scheduler');
    router.push('/scheduler');
  };

  return (
    <div className="flex">
      <Leaderboard teams={teamsData} />
      <Tools
        onTeamsUpdate={handleTeamsUpdate}
        onNavigateToScheduler={handleNavigateToScheduler}
      />
    </div>
  );
};

export default DashboardPage;
