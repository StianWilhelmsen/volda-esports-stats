import React from "react";

interface MatchCardProps {
  match: any;
  summoner: any;
  itemsData: any;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, summoner, itemsData }) => {
  const participant = match.info.participants.find(
    (p: any) => p.puuid === summoner.puuid
  );

  if (!participant) {
    return (
      <div className="p-2 rounded-lg shadow-md bg-gray-700 text-center text-gray-300">
        Participant details unavailable
      </div>
    );
  }

  return (
    <div
      className={`p-3 rounded-lg shadow-md ${
        participant.win ? "bg-blue-900" : "bg-red-900"
      } flex flex-col mb-4`} 
    >
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-sm font-bold text-white">Ranked Solo/Duo</h3>
          <p className="text-xs text-gray-300">
            {participant.win ? "Victory" : "Defeat"} •{" "}
            {Math.floor(match.info.gameDuration / 60)}m{" "}
            {match.info.gameDuration % 60}s
          </p>
        </div>
        <div className="text-right">
          <h4 className="text-yellow-300 font-bold">{summoner.name}</h4>
          <p className="text-xs text-gray-300">Level {participant.champLevel}</p>
        </div>
      </div>
      <div className="flex items-start mb-3">
        <div className="flex flex-col items-center">
          <img
            src={`/ChampionIcons/${participant.championName}_0.jpg`}
            alt={participant.championName}
            className="w-10 h-10 rounded-lg"
          />
          <div className="grid grid-cols-3 gap-1 mt-2">
            {[participant.item0, participant.item1, participant.item2, participant.item3, participant.item4, participant.item5]
              .filter((item) => item > 0)
              .map((item, idx) => (
                <img
                  key={idx}
                  src={`https://ddragon.leagueoflegends.com/cdn/15.2.1/img/item/${item}.png`}
                  alt={itemsData[item]?.name || `Item ${item}`}
                  className="w-6 h-6 rounded-lg"
                />
              ))}
          </div>
        </div>
        <div className="ml-4">
          <h4 className="text-white font-bold">{participant.championName}</h4>
          <p className="text-sm text-gray-300">
            KDA: {participant.kills}/{participant.deaths}/{participant.assists}
          </p>
          <p className="text-sm text-gray-300">
            P/Kill:{" "}
            {(
              ((participant.kills + participant.assists) /
                match.info.teams.find(
                  (team: any) => team.teamId === participant.teamId
                ).objectives.champion.kills) *
              100
            ).toFixed(1)}
            %
          </p>
          <p className="text-sm text-gray-300">
            Damage Dealt: {participant.totalDamageDealtToChampions}
          </p>
          <p className="text-sm text-gray-300">
            Vision Score: {participant.visionScore}
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <p className="text-xs text-gray-300">
            CS: {participant.totalMinionsKilled} (
            {(participant.totalMinionsKilled / (match.info.gameDuration / 60)).toFixed(1)}{" "}
            per min)
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-300">
            Team: {participant.teamId === 100 ? "Blue" : "Red"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
