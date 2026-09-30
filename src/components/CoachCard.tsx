import React, { useState, useEffect } from "react";
import { Oval } from "react-loader-spinner";
import MatchCard from "./MatchCard.tsx";

interface CoachCardProps {
  coach: {
    tagLine: string;
    role: string;
  };
}

const CoachCard: React.FC<CoachCardProps> = ({ coach }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [puuid, setPuuid] = useState<string | null>(null);
  const [matches, setMatches] = useState<any[]>([]);

  const fetchPuuid = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/puuid/Kombos/${encodeURIComponent}000`
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch PUUID: ${errorText}`);
      }
      const data = await response.json();
      setPuuid(data.puuid);
    } catch (error) {
      console.error("Error fetching PUUID:", error);
      setError("Failed to fetch coach PUUID.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchHistory = async () => {
    if (!puuid) return;

    setLoading(true);
    setError(null);
    try {
      const matchIdsResponse = await fetch(
        `http://localhost:5000/api/matches/by-puuid/EUROPE/${puuid}?start=0&count=5`
      );
      if (!matchIdsResponse.ok) {
        const errorText = await matchIdsResponse.text();
        throw new Error(`Failed to fetch match history: ${errorText}`);
      }

      const matchIds = await matchIdsResponse.json();
      const matchDetails = await Promise.all(
        matchIds.map(async (matchId) => {
          try {
            const res = await fetch(
              `http://localhost:5000/api/match/EUROPE/${matchId}`
            );
            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(`Error fetching match ${matchId}: ${errorText}`);
            }
            return await res.json();
          } catch (err) {
            console.error(`Error fetching details for match ${matchId}:`, err);
            return null;
          }
        })
      );

      setMatches(matchDetails.filter(Boolean));
    } catch (error) {
      console.error("Error fetching match history:", error);
      setError("Failed to fetch match history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPuuid();
  }, [coach.tagLine]);

  useEffect(() => {
    if (puuid) {
      fetchMatchHistory();
    }
  }, [puuid]);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 col-span-full">
      {/* Coach Details */}
      <div className="text-center mb-6">
        <img
          src="Coach.png"
          alt="Kombos"
          className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-yellow-400"
        />
        <h2 className="text-3xl font-bold text-yellow-400">Kombos</h2>
        <p className="text-lg text-gray-300">Role: {coach.role}</p>
        <p className="text-lg text-gray-300">Tagline: {coach.tagLine}</p>
      </div>

      {/* Loading or Error */}
      {loading && (
        <div className="flex flex-col items-center justify-center mt-4">
          <Oval
            height={40}
            width={40}
            color="#FFD700"
            secondaryColor="#E5E7EB"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
          <p className="text-yellow-300 text-lg font-semibold mt-2">
            {puuid ? "Loading Match History..." : "Loading Coach Data..."}
          </p>
        </div>
      )}

      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {/* Match History */}
      {matches.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">Recent Matches</h3>
          <ul className="space-y-4">
            {matches.map((match, index) => (
              <MatchCard key={index} match={match} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CoachCard;
