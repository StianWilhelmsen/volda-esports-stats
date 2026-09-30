import React from "react";
import SummonerCardCompact from "./SummonerCardCompact.tsx";
import SummonerCardExpanded from "./SummonerCardExpanded.tsx";

interface SummonerListProps {
  summoners: any[];
  selectedRole: string;
}

const SummonerList: React.FC<SummonerListProps> = ({ summoners, selectedRole }) => {
  return (
    <div
      className={`grid ${
        selectedRole !== "All Roles"
          ? "grid-cols-1"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      } gap-8`}
    >
      {summoners
        .filter((summoner) => selectedRole === "All Roles" || summoner.role === selectedRole)
        .map((summoner, index) =>
          selectedRole === "All Roles" ? (
            <SummonerCardCompact key={index} summoner={summoner} />
          ) : (
            <SummonerCardExpanded key={index} summoner={summoner} />
          )
        )}
    </div>
  );
};

export default SummonerList;
