import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // O proxy no vite.config.js redireciona para http://localhost:8080/org-rest-api/v1
  timeout: 50000, // limite de tempo para requisições
});

export default api;