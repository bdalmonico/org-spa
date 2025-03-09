// src/services/comentarioTareaService.js
import api from './api';

export default {
  // Buscar comentários por tarefa
  async getComentariosByTareaId(tareaId) {
    const response = await api.get(`/comentariotarea/tarea/${tareaId}`);
    return response.data;
  },

  // Criar um novo comentário
  async createComentario(comentarioData) {
    const params = {
      comentario: comentarioData.comentario,
      empleadoId: comentarioData.empleadoId,
      fechaHora: comentarioData.fechaHora,
      tareaId: comentarioData.tareaId,
    };
    await api.post('/comentariotarea', null, { params });
  },

  // Atualizar um comentário existente
  async updateComentario(comentarioData) {
    const params = {
      id: comentarioData.id,
      comentario: comentarioData.comentario,
      empleadoId: comentarioData.empleadoId,
      fechaHora: comentarioData.fechaHora,
      tareaId: comentarioData.tareaId,
    };
    await api.put('/comentariotarea', null, { params });
  },

  // Excluir um comentário
  async deleteComentario(id) {
    await api.delete(`/comentariotarea/${id}`);
  },
};