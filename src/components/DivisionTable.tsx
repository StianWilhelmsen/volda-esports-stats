import React from "react";

interface Team {
  id: number;
  name: string;
  points: number;
  wins: number;
  losses: number;
  draws: number;
  score_for: number;
  score_against: number;
  logo: {
    url: string;
  };
}

interface DivisionTableProps {
  teams: Team[];
  highlightTeam: string;
}

const DivisionTable: React.FC<DivisionTableProps> = ({ teams, highlightTeam }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg mt-8">
      <h2 className="text-yellow-400 text-2xl font-bold text-center mb-4">Division Standings</h2>
      <table className="w-full text-gray-200">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="py-2 text-left">Logo</th>
            <th className="py-2 text-left">Team</th>
            <th className="py-2 text-center">Points</th>
            <th className="py-2 text-center">Wins</th>
            <th className="py-2 text-center">Losses</th>
            <th className="py-2 text-center">Draws</th>
            <th className="py-2 text-center">Score (F/A)</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr
              key={team.id}
              className={`${
                team.name === highlightTeam ? "bg-yellow-400 text-gray-900" : "hover:bg-gray-700"
              }`}
            >
              <td className="py-2">
                <img
                  src={team.logo.url}
                  alt={team.name}
                  className="w-10 h-10 mx-auto"
                />
              </td>
              <td className="py-2">{team.name}</td>
              <td className="py-2 text-center">{team.points}</td>
              <td className="py-2 text-center">{team.wins}</td>
              <td className="py-2 text-center">{team.losses}</td>
              <td className="py-2 text-center">{team.draws}</td>
              <td className="py-2 text-center">
                {team.score_for}/{team.score_against}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DivisionTable;
