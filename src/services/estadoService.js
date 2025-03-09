import api from './api';

export default {
  // Buscar estado por ID
  async getEstadoById(id) {
    const response = await api.get(`/estado/${id}`);
    return response.data;
  },
};