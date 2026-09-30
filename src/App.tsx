import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import RoleSelector from "./components/RoleSelector";
import SummonerList from "./components/SummonerList";
import { fetchSummonerDetails } from "./utils/api";
import { Oval } from "react-loader-spinner";
import DivisionTable from "./components/DivisionTable";
import CoachCard from "./components/CoachCard";

const REGION = "euw1";
const SUMMONERS = [
  { gameName: "Good Boy", tagLine: "BONE", role: "Top"},
  { gameName: "bofah", tagLine: "0000", role: "Jungle"},
  { gameName: "VES DragonShrek", tagLine: "EUW", role: "Middle"},
  { gameName: "Wilhelmsen", tagLine: "4200", role: "Bottom"},
  { gameName: "Nolife", tagLine: "LFT", role: "Support"},
];

const ROLES = [
  { name: "All Roles", icon: "/RolesPictures/All_roles_icon.png" },
  { name: "Top", icon: "/RolesPictures/Top_icon.png" },
  { name: "Jungle", icon: "/RolesPictures/Jungle_icon.png" },
  { name: "Middle", icon: "/RolesPictures/Middle_icon.png" },
  { name: "Bottom", icon: "/RolesPictures/Bottom_icon.png" },
  { name: "Support", icon: "/RolesPictures/Support_icon.png" },
];

const App: React.FC = () => {
  const [summonerData, setSummonerData] = useState<any[]>([]);
  const [divisionData, setDivisionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [view, setView] = useState("Players");

  useEffect(() => {
    const cachedData = localStorage.getItem("summonerData");
    if (cachedData) {
      setSummonerData(JSON.parse(cachedData));
    } else {
      updateData();
    }
  }, []);

  const updateData = async () => {
    setLoading(true);
    try {
      const data = await fetchSummonerDetails(SUMMONERS);
      setSummonerData(data);
      localStorage.setItem("summonerData", JSON.stringify(data));
    } catch (err) {
      console.error("Error updating summoner data:", err);
    } finally {
      setLoading(false);
    }
  };

  const sortByRank = () => {
    console.log("Sorting by rank...");
    const rankOrder = [
      "Challenger",
      "Grandmaster",
      "Master",
      "Diamond",
      "Emerald",
      "Platinum",
      "Gold",
      "Silver",
      "Bronze",
      "Iron",
    ];

    const sortedData = [...summonerData].sort((a, b) => {
      const [rankA = "", divisionA = ""] = a.rank.split(" ");
      const [rankB = "", divisionB = ""] = b.rank.split(" ");

      const rankIndexA = rankOrder.indexOf(rankA);
      const rankIndexB = rankOrder.indexOf(rankB);

      if (rankIndexA !== rankIndexB) {
        return rankIndexA - rankIndexB;
      }

      const divisionValueA = parseInt(divisionA, 10);
      const divisionValueB = parseInt(divisionB, 10);

      if (divisionValueA !== divisionValueB) {
        return divisionValueA - divisionValueB;
      }

      return b.leaguePoints - a.leaguePoints;
    });

    console.log("Sorted Data:", sortedData);
    setSummonerData(sortedData);
  };

  const fetchDivisionData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/division/12074");
      const data = await response.json();

      if (data && Array.isArray(data)) {
        setDivisionData(
          data.map((entry: any) => ({
            id: entry.id,
            name: entry.team?.name || "Unknown Team",
            points: entry.points || 0,
            wins: entry.wins || 0,
            losses: entry.losses || 0,
            draws: entry.draws || 0,
            score_for: entry.score_for || 0,
            score_against: entry.score_against || 0,
            logo: entry.team?.logo || { url: "" },
          }))
        );
      } else {
        console.error("Unexpected data structure:", data);
      }
    } catch (error) {
      console.error("Error fetching division data:", error);
    }
  };

  useEffect(() => {
    fetchDivisionData();
  }, []);

  return (
    <div className="flex">
      <Sidebar onSelectView={setView} selectedView={view} />
      <div className="flex-1 min-h-screen bg-gray-900 text-gray-200 p-4">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          <div className="flex items-center justify-center">
            <img src="/VoldaIcon.png" alt="Volda Icon" className="h-12 w-12 mr-4" />
            <span>Volda E-Sport</span>
          </div>
        </h1>
        {view === "Players" && (
          <>
            <RoleSelector roles={ROLES} selectedRole={selectedRole} onSelectRole={setSelectedRole} />
            {loading ? (
              <div className="flex flex-col items-center justify-center mt-8">
                <Oval
                  height={80}
                  width={80}
                  color="#FFD700"
                  secondaryColor="#E5E7EB"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
                <p className="text-yellow-300 text-xl font-semibold mt-4">Fetching Data</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <button
                    onClick={sortByRank}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-blue-400/50 hover:scale-105 transition transform duration-200 font-bold"
                  >
                    Sort by Rank
                  </button>
                </div>
                <SummonerList summoners={summonerData} selectedRole={selectedRole} />
              </>
            )}
          </>
        )}
        {view === "Standings" && (
          <DivisionTable teams={divisionData} highlightTeam="Volda E-Sport" />
        )}
        {view === "Coach" && (
          <CoachCard
            coach={{
              tagLine: "000",
              role: "Coach",
              picture: "Coach.png",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default App;
