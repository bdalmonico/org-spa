// src/services/tareaService.js
import api from './api';

export default {
  // Buscar tarefa por ID
  async getTareaById(id) {
    const response = await api.get(`/tarea/${id}`);
    return response.data;
  },

  // Buscar tarefas por critérios
  async getTareas(filtros = {}) {
    const response = await api.get('/tarea', { params: filtros });
    return response.data;
  },

  // Criar uma nova tarefa
  async createTarea(tareaData) {
    const params = {
      nombre: tareaData.nombre,
      descripcion: tareaData.descripcion,
      estadoId: tareaData.estadoId,
      proyectoId: tareaData.proyectoId,
      fechaEstimadaInicio: tareaData.fechaEstimadaInicio,
      fechaEstimadaFin: tareaData.fechaEstimadaFin,
      fechaRealInicio: tareaData.fechaRealInicio || null,
      fechaRealFin: tareaData.fechaRealFin || null,
    };
    const response = await api.post('/tarea/crear', null, { params });
    return response.data;
  },

  // Atualizar uma tarefa existente
  async updateTarea(tareaData) {
    const params = {
      nombre: tareaData.nombre,
      descripcion: tareaData.descripcion,
      estadoId: tareaData.estadoId,
      proyectoId: tareaData.proyectoId,
      fechaEstimadaInicio: tareaData.fechaEstimadaInicio,
      fechaEstimadaFin: tareaData.fechaEstimadaFin,
      fechaRealInicio: tareaData.fechaRealInicio || null,
      fechaRealFin: tareaData.fechaRealFin || null,
    };
    const response = await api.put(`/tarea/${tareaData.id}`, null, { params });
    return response.data;
  },

  // Excluir uma tarefa
  async deleteTarea(id) {
    await api.delete(`/tarea/${id}`);
  },
};