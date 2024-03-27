'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GamesTable from '../components/gamesTable';

interface Game {
    id: number;
    team1: string;
    team2: string;
    cups1: number;
    cups2: number;
  }

const GamesPage: React.FC = () => {
    const [gamesData, setGamesData] = useState<Game[]>([]);
    const [gameID, setGameID] = useState<number>(-1);

    // Fetch games data from /api/games
    const fetchGamesData = async () => {
        console.log("fetching all games");
        try {
        const response = await fetch('/api/games');
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
        fetchGamesData(); // get games data after game scored
      }, []); // Empty dependency array to run the effect only once on component mount


    const router = useRouter();
    const navigateToAdminHome = () => {
        console.log('Navigating to admin view');
        router.push('/dashboard');
    };       
    
    const handleDeleteGame = async () => {
        console.log("deleting game with id: " + gameID);
        try {
            const response = await fetch('/api/delete_game', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id: gameID }),
            });
      
            if (!response.ok) {
              throw new Error(`Failed to generate schedule. Status: ${response.status}`);
            }
      
            // Handle successful schedule generation
            const res = await response.json();
            console.log(res);
            fetchGamesData();
          } catch (error) {
            console.error('Error generating schedule:', error);
          }
    };

  return (
    <div className="container mx-auto mt-8 p-4">
      <button onClick={navigateToAdminHome} className=" mb-4 bg-gray-500 text-white p-4 rounded shadow">Return to Dashboard</button>

      <h2 className="text-2xl font-bold mb-4">Game Editor</h2>
      <div className="flex space-x-4 mb-4">
        <div className="flex flex-row items-center">
          <label className="text-white px-4">ID of Game to Delete:</label>
          <input 
            type="number" 
            value={gameID} 
            onChange={(e) => setGameID(parseInt(e.target.value, 10))} 
            className="p-2 rounded-md bg-gray-800 text-white w-20"
            min="0"
          />
        </div>

        <button 
          onClick={handleDeleteGame}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md focus:outline-none">
          Delete Game
        </button> 
        
      </div>
      <div>
        <GamesTable games={ gamesData }></GamesTable>
      </div>
    </div>

  );
};

export default GamesPage;
