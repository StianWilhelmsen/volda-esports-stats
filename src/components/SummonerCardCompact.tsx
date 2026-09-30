import React from "react";

interface SummonerCardCompactProps {
  summoner: any;
}

const SummonerCardCompact: React.FC<SummonerCardCompactProps> = ({ summoner }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 transform transition-transform hover:scale-105">
      <h2 className="text-xl font-bold text-yellow-300 text-center">{summoner.name}</h2>
      <p className="text-center">{summoner.role}</p>
      <p className="text-center">Level: {summoner.level}</p>
      {summoner.rankImage && (
        <div className="text-center">
          <img
            src={summoner.rankImage}
            alt={`${summoner.rank} rank`}
            className="mx-auto my-4 w-16 h-16"
          />
          <p className="text-yellow-300">{summoner.rank}</p>
        </div>
      )}
      <p className="text-center">{summoner.leaguePoints} LP</p>
      <p className="text-center">
        <span className="text-green-500">{summoner.wins}</span> -{" "}
        <span className="text-red-500">{summoner.losses}</span>
      </p>
      <p className="text-blue-400 text-center">{summoner.winRate}% Winrate</p>
    </div>
  );
};

export default SummonerCardCompact;
