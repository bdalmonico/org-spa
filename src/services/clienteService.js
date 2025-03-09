import api from './api';

export default {
  // Listar clientes com filtros
  async getClientes(filtros = {}) {
    const response = await api.get('/cliente', { params: { ...filtros, size: 10 } });
    return response.data;
  },

  // Buscar um estado por ID
  async getEstadoById(id) {
    const response = await api.get(`/estado/${id}`);
    return response.data;
  },

  // Criar um cliente
  async createCliente(clienteData) {
    const params = new URLSearchParams();
    params.append('nombre', clienteData.nombre.trim());
    params.append('email', clienteData.email.trim());
    if (clienteData.nifCif) params.append('nifCif', clienteData.nifCif.trim());
    if (clienteData.telefone) params.append('telefone', clienteData.telefone.trim());
    if (clienteData.estadoId !== null) params.append('estadoId', clienteData.estadoId.toString());

    const response = await api.post(`/cliente?${params.toString()}`);
    return response.data;
  },

  // Atualizar um cliente
  async updateCliente(clienteData) {
    const params = new URLSearchParams();
    params.append('id', clienteData.id.toString());
    params.append('nombre', clienteData.nombre);
    params.append('email', clienteData.email);
    params.append('nifCif', clienteData.nifCif);
    params.append('telefone', clienteData.telefone);
    params.append('estadoId', clienteData.estadoId !== null ? clienteData.estadoId.toString() : '');

    const response = await api.put(`/cliente?${params.toString()}`);
    return response.data;
  },

  // Excluir um cliente
  async deleteCliente(id) {
    const response = await api.delete(`/cliente/${id}`);
    return response.data;
  },
};