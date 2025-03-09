// src/services/imputacionService.js
import api from './api';

export default {
  // Buscar imputações por critérios
  async getImputacionesByCriteria(criteria = {}) {
    const response = await api.get('/imputacion/search/criteria', { params: criteria });
    return response.data;
  },

  // Obter total de horas imputadas por critérios
  async getTotalHorasImputadas(criteria = {}) {
    const response = await api.get('/imputacion/search/total', { params: criteria });
    return response.data;
  },

  // Criar uma nova imputação
  async createImputacion(imputacionData) {
    const params = {
      comentario: imputacionData.comentario || '',
      empleadoId: imputacionData.empleadoId,
      fechaHora: imputacionData.fechaHora,
      horasImputadas: imputacionData.horasImputadas,
      proyectoId: imputacionData.proyectoId,
      tareaId: imputacionData.tareaId,
    };
    await api.post('/imputacion', null, { params });
  },

  // Excluir uma imputação
  async deleteImputacion(id) {
    await api.delete('/imputacion', { params: { id } });
  },
};