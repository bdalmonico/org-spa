// src/services/rolService.js
import api from './api';

export default {
  // Buscar rol por ID
  async getRolById(id) {
    const response = await api.get(`/rol/${id}`);
    return response.data;
  },
};