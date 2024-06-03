import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export const authenticate = async (username, password) => {
  const response = await apiClient.post('/auth/authenticate', { username, password });
  const token = response.data.accessToken;
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const fetchTournaments = () => {
  return apiClient.get('/tournaments');
};

export const fetchTournamentsId = () => {
  return apiClient.get('/tournaments/{id}');
};

export const fetchSports = () => {
  return apiClient.get('/sports');
};

export const createTournament = (tournamentData) => {
  return apiClient.post('/tournaments', tournamentData);
};