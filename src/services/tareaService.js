// src/services/tareaService.js
import api from './api';
import comentarioTareaService from './comentarioTareaService';
import imputacionService from './imputacionService';

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

  // Excluir uma tarefa com verificação de dependências
  async deleteTarea(id) {
    try {
      // Verificar e excluir comentários
      const comentariosResponse = await comentarioTareaService.getComentariosByTareaId(id);
      const comentarios = comentariosResponse.page || [];
      if (comentarios.length > 0) {
        console.log(`Excluindo ${comentarios.length} comentários da tarefa ${id}`);
        await Promise.all(
          comentarios.map(comentario =>
            comentarioTareaService.deleteComentario(comentario.id)
          )
        );
      }

      // Verificar e excluir imputações
      const imputacionesResponse = await imputacionService.getImputacionesByCriteria({ tareaId: id });
      const imputaciones = imputacionesResponse.page || [];
      if (imputaciones.length > 0) {
        console.log(`Excluindo ${imputaciones.length} imputações da tarefa ${id}`);
        await Promise.all(
          imputaciones.map(imputacion =>
            imputacionService.deleteImputacion(imputacion.id)
          )
        );
      }

      // Excluir a tarefa após remover dependências
      console.log(`Excluindo tarefa ${id}`);
      await api.delete(`/tarea/${id}`);
    } catch (err) {
      console.error('Erro ao excluir tarefa ou dependências:', err);
      throw new Error('Erro ao excluir tarefa: ' + (err.response?.data?.message || err.message));
    }
  },
};