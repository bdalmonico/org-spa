// src/services/comentarioProyectoService.js
import api from './api';

export default {
  // Buscar comentários por projeto
  async getComentariosByProyectoId(proyectoId) {
    const response = await api.get(`/comentarioproyecto/proyecto/${proyectoId}`);
    return response.data;
  },

  // Criar um novo comentário
  async createComentario(comentarioData) {
    const params = {
      comentario: comentarioData.comentario,
      empleadoId: comentarioData.empleadoId,
      fechaHora: comentarioData.fechaHora,
      proyectoId: comentarioData.proyectoId,
    };
    await api.post('/comentarioproyecto', null, { params });
  },

  // Atualizar um comentário existente
  async updateComentario(comentarioData) {
    const params = {
      id: comentarioData.id,
      comentario: comentarioData.comentario,
      empleadoId: comentarioData.empleadoId,
      fechaHora: comentarioData.fechaHora,
      proyectoId: comentarioData.proyectoId,
    };
    await api.put('/comentarioproyecto', null, { params });
  },

  // Excluir um comentário
  async deleteComentario(id) {
    await api.delete(`/comentarioproyecto/${id}`);
  },
};