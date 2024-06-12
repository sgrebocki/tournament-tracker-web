import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// AUTHENTICATION
const token = localStorage.getItem('token');
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const authenticate = async (username, password) => {
  const response = await apiClient.post('/auth/authenticate', { username, password });
  const token = response.data.accessToken;
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  localStorage.setItem('token', token);
  return token;
};

export const register = (userData) => {
  return apiClient.post('/auth/register', userData);
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

export const updateTournament = (id, tournamentData) => {
  return apiClient.put(`/tournaments/${id}`, tournamentData);
};

export const deleteTournament = (id) => {
  return apiClient.delete(`/tournaments/${id}`);
}

//GAMES
export const fetchGameById = (id) => {
  return apiClient.get(`/games/${id}`);
};

export const addGame = (gameData) => {
  return apiClient.post('/games', gameData);
};

export const editGame = (id, gameData) => {
  return apiClient.put(`/games/${id}`, gameData);
};

export const deleteGame = (id) => {
  return apiClient.delete(`/games/${id}`);
}

export const setGameScore = (id, homeTeamScore, guestTeamScore) => {
  return apiClient.put(`/games/${id}/setFinalScore`, null, {
    params: {
      homeTeamScore,
      guestTeamScore
    }
  });
};

// SPORTS
export const fetchSports = () => {
  return apiClient.get('/sports');
};

// TEAMS
export const fetchTeams = () => {
  return apiClient.get('/teams');
};

export const fetchTeamById = (id) => {
  return apiClient.get(`/teams/${id}`);
};

export const updateTeam = (id, teamData) => {
  return apiClient.put(`/teams/${id}`, teamData);
};

export const createTeam = (teamData) => {
  return apiClient.post('/teams', teamData);
}

export const deleteTeam = (id) => {
  return apiClient.delete(`/teams/${id}`);
}

export const leaveTeam = (id) => {
  return apiClient.put(`/teams/${id}/quit`);
}

export const addUserToTeam = (teamId, userId) => {
  return apiClient.post(`/teams/${teamId}/addUser/${userId}`);
};

// USERS
export const fetchUsers = () => {
  return apiClient.get('/users');
};

export const fetchUserById = (id) => {
  return apiClient.get(`/users/${id}`);
};

// USER ACCOUNT
export const fetchAccount = () => {
  return apiClient.get('/account');
};

export const changeUsername = (newUsername) => {
  return apiClient.put('/account/changeUsername', null, {
    params: { newUsername }
  });
};

export const changePassword = (oldPassword, newPassword) => {
  return apiClient.put('/account/changePassword', null, {
    params: { oldPassword, newPassword }
  });
};