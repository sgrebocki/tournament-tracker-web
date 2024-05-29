import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
});

export const fetchTournaments = () => {
  return apiClient.get('/tournaments');
};

export const fetchSports = () => {
  return apiClient.get('/sports');
};

export const createTournament = (tournamentData) => {
  return apiClient.post('/tournaments', tournamentData);
};