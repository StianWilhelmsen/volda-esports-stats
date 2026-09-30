import axios from "axios";

const REGION = "euw1";

export const fetchSummonerDetails = async (summoners: any[]) => {
    const results: any[] = [];
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  
    try {
      for (let i = 0; i < summoners.length; i++) {
        const { gameName, tagLine, role } = summoners[i];
  
        try {
          let puuid: string | null = null;
  
          // Check localStorage for existing PUUID
          const cachedSummoner = JSON.parse(localStorage.getItem(`puuid_${gameName}_${tagLine}`) || "null");
          if (cachedSummoner && cachedSummoner.puuid) {
            puuid = cachedSummoner.puuid;
          } else {
            // Fetch PUUID from the API
            const puuidResponse = await axios.get(
              `http://localhost:5000/api/puuid/${gameName}/${tagLine}`
            );
            puuid = puuidResponse.data.puuid;
  
            // Save PUUID in localStorage
            localStorage.setItem(
              `puuid_${gameName}_${tagLine}`,
              JSON.stringify({ puuid })
            );
          }
  
          const summonerResponse = await axios.get(
            `http://localhost:5000/api/summoner/by-puuid/${REGION}/${puuid}`
          );
          const summoner = summonerResponse.data;
  
          const rankedResponse = await axios.get(
            `http://localhost:5000/api/ranked/${REGION}/${summoner.id}`
          );
  
          const rankData = rankedResponse.data.find(
            (queue: any) => queue.queueType === "RANKED_SOLO_5x5"
          );
          const rank = rankData ? `${rankData.tier} ${rankData.rank}` : "Unranked";
          const leaguePoints = rankData?.leaguePoints || 0;
          const wins = rankData?.wins || 0;
          const losses = rankData?.losses || 0;
  
          const totalGames = wins + losses;
          const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : "0.0";
  
          const masteryResponse = await axios.get(
            `http://localhost:5000/api/mastery/${REGION}/${puuid}`
          );
          const topChampions = masteryResponse.data.slice(0, 5);
  
          // Save the current LP to localStorage
          const lpHistory = JSON.parse(localStorage.getItem('lpHistory') || '[]');
          lpHistory.push({ date: new Date().toISOString(), lp: leaguePoints });
          localStorage.setItem('lpHistory', JSON.stringify(lpHistory));

          results.push({
            name: gameName,
            role,
            level: summoner.summonerLevel,
            rank,
            leaguePoints,
            wins,
            losses,
            winRate,
            topChampions,
            rankImage: rankData ? `/rankPNGs/${rankData.tier.toLowerCase()}.png` : null,
            puuid, // Add puuid to the result
          });
  
          if (i < summoners.length - 1) {
            await delay(1200);
          }
        } catch (err) {
          console.error(`Error fetching data for ${gameName}#${tagLine}:`, err);
          results.push({
            name: `${gameName}#${tagLine}`,
            role,
            error: "Failed to fetch data. Please try again later.",
          });
        }
      }
    } catch (err) {
      console.error("Error fetching summoner details:", err);
    }
  
    return results;
};