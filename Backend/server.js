const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.RIOT_API_KEY;

if (!API_KEY) {
  console.error('Missing RIOT_API_KEY. Add it to a .env file in the project root (see .env.example).');
  process.exit(1);
}

// Endpoint to get PUUID by Riot ID (gameName + tagLine)
app.get('/api/puuid/:gameName/:tagLine', async (req, res) => {
  const { gameName, tagLine } = req.params;

  try {
    const response = await axios.get(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
        gameName
      )}/${encodeURIComponent(tagLine)}`,
      {
        headers: {
          'X-Riot-Token': API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching PUUID:', error.response?.data || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || 'Error');
  }
});

// Endpoint to get summoner details by PUUID
app.get('/api/summoner/by-puuid/:region/:puuid', async (req, res) => {
  const { region, puuid } = req.params;

  try {
    const response = await axios.get(
      `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching summoner details:', error.response?.data || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || 'Error');
  }
});

// Endpoint to get ranked data by summoner ID
app.get('/api/ranked/:region/:summonerId', async (req, res) => {
  const { region, summonerId } = req.params;

  try {
    const response = await axios.get(
      `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
      {
        headers: {
          'X-Riot-Token': API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching ranked data:', error.response?.data || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || 'Error');
  }
});

// Endpoint to get top 5 mastery champions by PUUID
app.get('/api/mastery/:region/:puuid', async (req, res) => {
  const { region, puuid } = req.params;

  try {
    const response = await axios.get(
      `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': API_KEY,
        },
      }
    );

    const topChampions = response.data.slice(0, 5).map((champion) => ({
      championId: champion.championId,
      championPoints: champion.championPoints,
    }));

    // Fetch champion names from the static data API
    const championDataResponse = await axios.get(
      'http://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion.json'
    );
    const championData = championDataResponse.data.data;

    const formattedChampions = topChampions.map((champion) => {
      const championName = Object.values(championData).find(
        (data) => parseInt(data.key, 10) === champion.championId
      )?.id;

      return {
        championId: champion.championId,
        championName: championName || 'Unknown',
        championPoints: champion.championPoints,
      };
    });

    res.json(formattedChampions);
  } catch (error) {
    console.error('Error fetching champion mastery:', error.response?.data || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || 'Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


app.get("/api/division/:divisionId", async (req, res) => {
    const { divisionId } = req.params;
  
    try {
      const response = await axios.get(
        `https://www.gglstats.no/api/gamer-proxy?https://www.gamer.no/api/paradise/v2/division/${divisionId}/tables`
      );
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching division data:", error.response?.data || error.message);
      res.status(error.response?.status || 500).send(error.response?.data || "Error");
    }
  });


  app.get("/api/matches/by-puuid/:region/:puuid", async (req, res) => {
    const { region, puuid } = req.params;
    const { start = 0, count = 5 } = req.query; // Default to fetching 5 matches
  
    try {
      console.log(`Fetching matches for region: ${region}, PUUID: ${puuid}`);
      const response = await axios.get(
        `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`,
        {
          headers: { "X-Riot-Token": API_KEY },
          params: {
            start,
            count,
          },
        }
      );
  
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching match IDs:", error.response?.data || error.message);
      const statusCode = error.response?.status || 500;
      res.status(statusCode).json({
        message: "Failed to fetch match IDs.",
        details: error.response?.data || error.message,
      });
    }
  });
  

  
  app.get("/api/match/:region/:matchId", async (req, res) => {
    const { region, matchId } = req.params;
  
    try {
      const response = await axios.get(
        `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
        {
          headers: { "X-Riot-Token": API_KEY },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching match details:", error.response?.data || error.message);
      res.status(500).send("Error fetching match details");
    }
  });
  