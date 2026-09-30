import React, { useState, useEffect } from "react";
import MatchCard from "../components/MatchCard.tsx";
import { Oval } from "react-loader-spinner";

interface SummonerCardExpandedProps {
  summoner: any;
}

const SummonerCardExpanded: React.FC<SummonerCardExpandedProps> = ({ summoner }) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemsData, setItemsData] = useState<any>({});

  const cacheKey = `matches_${summoner.puuid}`;

  const fetchWithRetry = async (url: string, retries = 3) => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(url);
        if (response.ok) return await response.json();
        const errorText = await response.text();
        throw new Error(`API returned ${response.status}: ${errorText}`);
      } catch (err) {
        console.warn(`Retry ${attempt + 1}/${retries} failed for ${url}`);
        if (attempt === retries - 1) throw err; // Throw if all retries fail
      }
    }
  };

  const fetchMatchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const matchIdsResponse = await fetch(
        `http://localhost:5000/api/matches/by-puuid/EUROPE/${summoner.puuid}?start=0&count=5`
      );
      if (!matchIdsResponse.ok) {
        const errorText = await matchIdsResponse.text();
        throw new Error(`API returned ${matchIdsResponse.status}: ${errorText}`);
      }

      const matchIds = await matchIdsResponse.json();

      const matchDetails = await Promise.all(
        matchIds.map(async (matchId) => {
          try {
            const res = await fetchWithRetry(`http://localhost:5000/api/match/EUROPE/${matchId}`);
            return res;
          } catch (err) {
            console.error(`Error fetching details for match ${matchId}:`, err);
            return null;
          }
        })
      );

      const filteredMatches = matchDetails.filter(Boolean);
      setMatches(filteredMatches);

      const cacheData = {
        timestamp: Date.now(),
        matches: filteredMatches,
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error fetching match history:", error);
      setError("Failed to fetch match history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchItemsData = async () => {
      try {
        const response = await fetch(
          "https://ddragon.leagueoflegends.com/cdn/15.2.1/data/en_US/item.json"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch item data");
        }
        const data = await response.json();
        setItemsData(data.data);
      } catch (err) {
        console.error("Error fetching item data:", err);
      }
    };

    fetchItemsData();
  }, []);

  useEffect(() => {
    if (!summoner.puuid) {
      console.error(`Summoner PUUID is missing for ${summoner.name}`);
      return;
    }

    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const { timestamp, matches } = JSON.parse(cachedData);
        const cacheAge = Date.now() - timestamp;

        if (cacheAge < 3600000) {
          setMatches(matches);
          return;
        }
      } catch (err) {
        console.warn("Invalid cache data. Fetching fresh data...");
        localStorage.removeItem(cacheKey);
      }
    }

    fetchMatchHistory();
  }, [summoner.puuid]);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 col-span-full">
      {/* Summoner Details */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-yellow-400">{summoner.name}</h2>
        <p className="text-lg text-gray-300">Role: {summoner.role}</p>
        <p className="text-lg text-gray-300">Level: {summoner.level}</p>
        {summoner.rankImage && (
          <div className="flex flex-col items-center mt-4">
            <img
              src={summoner.rankImage}
              alt={`${summoner.rank} rank`}
              className="w-20 h-20"
            />
            <p className="text-yellow-300 mt-2">{summoner.rank}</p>
          </div>
        )}
        <p className="text-lg text-gray-300 mt-2">{summoner.leaguePoints} LP</p>
        <p className="text-lg text-gray-300">
          <span className="text-green-400">{summoner.wins} Wins</span> -{" "}
          <span className="text-red-400">{summoner.losses} Losses</span>
        </p>
        <p className="text-lg text-gray-300">Winrate: {summoner.winRate}%</p>
      </div>

      {/* Button to Refetch Match Data */}
      <div className="text-center mb-4">
        <button
          onClick={fetchMatchHistory}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded hover:bg-yellow-500"
        >
          Refresh Match Data
        </button>
      </div>

      {/* Match History */}
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
          <p className="text-yellow-300 text-xl font-semibold mt-4">Loading Match History...</p>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column: Match Cards */}
          <div>
            {matches.map((match, index) => (
              <MatchCard
                key={index}
                match={match}
                summoner={summoner}
                itemsData={itemsData}
              />
            ))}
          </div>
          {/* Right Column: Additional Content */}
          <div className="bg-gray-700 rounded-lg shadow-md p-4">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Statistics</h3>
            <p className="text-gray-300 text-sm">Add some additional information here, such as:</p>
            <ul className="list-disc list-inside text-gray-400 mt-2">
              <li>Total games played</li>
              <li>Average KDA</li>
              <li>Winrate across recent matches</li>
              <li>More useful stats...</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummonerCardExpanded;
