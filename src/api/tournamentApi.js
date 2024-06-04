import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// AUTHENTICATION
export const authenticate = async (username, password) => {
  const response = await apiClient.post('/auth/authenticate', { username, password });
  const token = response.data.accessToken;
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  localStorage.setItem('token', token);
  return token;
};

// TORURNAMENTS
export const fetchTournaments = () => {
  return apiClient.get('/tournaments');
};

export const fetchTournamentById = (id) => {
  return apiClient.get(`/tournaments/${id}`);
};

export const createTournament = (tournamentData) => {
  return apiClient.post('/tournaments', tournamentData);
};

// SPORTS
export const fetchSports = () => {
  return apiClient.get('/sports');
};

// USERS
export const fetchAccount = () => {
  return apiClient.get('/account');
};