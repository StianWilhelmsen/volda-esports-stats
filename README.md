# Volda E-Sport – League of Legends Dashboard

A dashboard for the Volda E-Sport League of Legends team. It shows each player's ranked stats, top champions and recent matches, plus the team's division standings from Gamer.no.

## Features

- **Players**: a card for each rostered player with their Solo/Duo rank, LP, win rate, level and top 5 mastery champions. You can filter by role and sort by rank.
- **Match history**: recent matches for each player, pulled from the Riot Match-V5 API.
- **Standings**: the division table (Gamer.no division `12074`), with Volda E-Sport highlighted.
- **Coach**: a card for the team coach.

## Tech stack

- **Frontend**: React 19 + TypeScript (Create React App), Tailwind CSS, Chart.js (`react-chartjs-2`), `react-loader-spinner`
- **Backend**: Node.js + Express proxy (`Backend/server.js`) that calls the Riot Games API and Gamer.no, so the API key never reaches the browser

## Project structure

```
Backend/
  server.js            Express proxy for the Riot API and Gamer.no (port 5000)
public/
  ChampionIcons/       Champion splash/icon images
  RolesPictures/       Role icons for the role filter
  rankPNGs/            Rank emblems
src/
  App.tsx              Main layout, roster config and views
  components/          UI components (summoner cards, match cards, division table, sidebar, ...)
  utils/api.ts         Fetches and combines player data from the backend
  utils/constants.ts   Shared constants (roles)
```

## Getting started

### Prerequisites

- Node.js (v18 or newer recommended)
- A Riot Games API key from the [Riot Developer Portal](https://developer.riotgames.com/)

### Install

```bash
npm install
```

### Configure the API key

Open `Backend/server.js` and replace the placeholder value of `API_KEY` with your own Riot API key:

```js
const API_KEY = 'RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
```

> Don't commit your real key. Development keys expire every 24 hours, so you'll need to renew them regularly.

### Run

Start the backend and the frontend in two separate terminals:

```bash
# Terminal 1 – backend (http://localhost:5000)
node Backend/server.js

# Terminal 2 – frontend (http://localhost:3000)
npm start
```

## Configuration

- **Roster**: edit the `SUMMONERS` array in `src/App.tsx` (Riot ID `gameName` + `tagLine`, and the player's role).
- **Region**: `REGION` in `src/utils/api.ts` (default `euw1`).
- **Division**: the division ID in the `fetchDivisionData` call in `src/App.tsx`.

The app caches player data and PUUIDs in `localStorage`. To force a fresh fetch, clear the site's local storage.

## Backend API

| Endpoint | Description |
| --- | --- |
| `GET /api/puuid/:gameName/:tagLine` | Looks up a player's PUUID from their Riot ID |
| `GET /api/summoner/by-puuid/:region/:puuid` | Summoner details (level, summoner ID) |
| `GET /api/ranked/:region/:summonerId` | Ranked entries |
| `GET /api/mastery/:region/:puuid` | Top 5 mastery champions, with champion names |
| `GET /api/matches/by-puuid/:region/:puuid?start=0&count=5` | Recent match IDs |
| `GET /api/match/:region/:matchId` | Full match details |
| `GET /api/division/:divisionId` | Division standings from Gamer.no |

## Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Starts the frontend dev server |
| `npm run build` | Builds a production bundle into `build/` |
| `npm test` | Runs the test runner in watch mode |
