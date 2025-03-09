// src/services/proyectoService.js
import api from './api';

export default {
  // Listar projetos com filtros
  async getProyectos(filtros = {}) {
    const response = await api.get('/proyecto', { params: filtros });
    return response.data;
  },

  // Obter detalhes de um projeto por ID
  async getProyectoById(id) {
    const response = await api.get(`/proyecto/${id}`);
    return response.data;
  },

  // Criar um projeto
  async createProyecto(proyectoData) {
    const formData = new URLSearchParams();
    formData.append('nombre', proyectoData.nombre.trim());
    formData.append('descripcion', proyectoData.descripcion.trim());
    formData.append('clienteNombre', proyectoData.clienteNombre.trim());
    formData.append('estadoId', proyectoData.estadoId.toString());
    formData.append('clienteId', proyectoData.clienteId !== null ? proyectoData.clienteId.toString() : '');
    formData.append('importe', proyectoData.importe);
    formData.append('fechaEstimadaInicio', proyectoData.fechaEstimadaInicio);
    formData.append('fechaEstimadaFin', proyectoData.fechaEstimadaFin);
    if (proyectoData.fechaRealInicio) formData.append('fechaRealInicio', proyectoData.fechaRealInicio);
    if (proyectoData.fechaRealFin) formData.append('fechaRealFin', proyectoData.fechaRealFin);

    const response = await api.post('/proyecto/crear', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  },

  // Atualizar um projeto
  async updateProyecto(proyectoData) {
    const formData = new URLSearchParams();
    formData.append('id', proyectoData.id.toString());
    formData.append('nombre', proyectoData.nombre.trim());
    formData.append('descripcion', proyectoData.descripcion.trim());
    formData.append('clienteNombre', proyectoData.clienteNombre.trim());
    formData.append('estadoId', proyectoData.estadoId.toString());
    formData.append('clienteId', proyectoData.clienteId !== null ? proyectoData.clienteId.toString() : '');
    formData.append('importe', proyectoData.importe);
    formData.append('fechaEstimadaInicio', proyectoData.fechaEstimadaInicio);
    formData.append('fechaEstimadaFin', proyectoData.fechaEstimadaFin);
    if (proyectoData.fechaRealInicio) formData.append('fechaRealInicio', proyectoData.fechaRealInicio);
    if (proyectoData.fechaRealFin) formData.append('fechaRealFin', proyectoData.fechaRealFin);

    const response = await api.put(`/proyecto/actualizar/${proyectoData.id}`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  },

  // Excluir um projeto
  async deleteProyecto(id) {
    const response = await api.delete(`/proyecto/del/${id}`);
    return response.data;
  },

  // Listar tarefas relacionadas a um projeto
  async getTareasByProyectoId(proyectoId) {
    const response = await api.get('/tarea', { params: { proyectoId } });
    return response.data;
  },

  // Listar comentários de um projeto
  async getComentariosByProyectoId(proyectoId) {
    const response = await api.get(`/comentarioproyecto/proyecto/${proyectoId}`);
    return response.data;
  },

  // Criar um comentário
  async createComentario(comentarioData) {
    const response = await api.post('/comentarioproyecto', null, { params: comentarioData });
    return response.data;
  },

  // Atualizar um comentário
  async updateComentario(comentarioData) {
    const response = await api.put('/comentarioproyecto', null, { params: comentarioData });
    return response.data;
  },

  // Excluir um comentário
  async deleteComentario(id) {
    const response = await api.delete(`/comentarioproyecto/${id}`);
    return response.data;
  },

  // Obter total de horas imputadas
  async getTotalHorasImputadas(proyectoId) {
    const response = await api.get('/imputacion/search/total', { params: { proyectoId } });
    return response.data;
  },

  // Obter nome do empregado por ID
  async getEmpleadoNombre(id) {
    const response = await api.get(`/empleado/${id}`);
    return response.data.nombre;
  },
};