// Leaderboard.tsx
import { reverse } from 'dns';
import React from 'react';

interface Game {
  id: number;
  team1: string;
  team2: string;
  cups1: number;
  cups2: number;
}

interface recentGamesProps {
  games: Game[];
}

const RecentGames = ({ games }: recentGamesProps) => {
  return (
    <div className="">
      <h2 className="text-2xl font-bold my-4">Recent Games</h2>
      <table className="w-full border rounded-lg">
        <thead>
          <tr className="bg-black-200 border">
            <th className="p-2">Team 1</th>
            <th className="p-2">Team 2</th>
            <th className="p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id}>
                <td className="p-2 text-center">{game.team1}</td>
                <td className="p-2 text-center">{game.team2}</td>
                <td className="p-2 text-center">{game.cups1 + " - " + game.cups2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentGames;
