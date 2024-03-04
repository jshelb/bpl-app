// Leaderboard.tsx
import React from 'react';

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

interface LeaderboardProps {
  teams: Team[];
}

const Leaderboard = ({ teams }: LeaderboardProps) => {
  return (
    <div className="w-2/3 p-4">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-black-200">
            <th className="p-2">#</th>
            <th className="p-2">Team Name</th>
            <th className="p-2">Points</th>
            <th className="p-2">ELO</th>
            <th className="p-2">Wins</th>
            <th className="p-2">Losses</th>
            <th className="p-2">OT Losses</th>
            <th className="p-2">Cup Differential</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={team.id}>
                <td className="p-2 text-center">{index + 1}</td>
                <td className="p-2 text-center">{team.name}</td>
                <td className="p-2 text-center">{team.points}</td>
                <td className="p-2 text-center">{Math.round(team.elo)}</td>
                <td className="p-2 text-center">{team.wins}</td>
                <td className="p-2 text-center">{team.losses}</td>
                <td className="p-2 text-center">{team.ot_losses}</td>
                <td className="p-2 text-center">{team.cupDifferential}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
