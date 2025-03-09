import api from './api';

export default {
  // Listar empregados com filtros
  async getEmpleados(filtros = {}) {
    const response = await api.get('/empleado', { params: filtros });
    return response.data;
  },

  // Criar um empregado
  async createEmpleado(empleadoData) {
    const formData = new URLSearchParams();
    formData.append('nombre', empleadoData.nombre.trim());
    formData.append('apellido', empleadoData.apellido.trim());
    formData.append('email', empleadoData.email.trim());
    if (empleadoData.contrasena) formData.append('contrasena', empleadoData.contrasena);
    formData.append('fechaAlta', empleadoData.fechaAlta);
    formData.append('rolId', empleadoData.rolId.toString());

    const response = await api.post('/empleado', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    });
    return response.data;
  },

  // Atualizar um empregado
  async updateEmpleado(empleadoData) {
    const formData = new URLSearchParams();
    formData.append('nombre', empleadoData.nombre.trim());
    formData.append('apellido', empleadoData.apellido.trim());
    formData.append('email', empleadoData.email.trim());
    if (empleadoData.contrasena) formData.append('contrasena', empleadoData.contrasena);
    formData.append('fechaAlta', empleadoData.fechaAlta);
    formData.append('rolId', empleadoData.rolId.toString());

    const response = await api.put(`/empleado?id=${empleadoData.id}`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    });
    return response.data;
  },

  // Excluir um empregado
  async deleteEmpleado(id) {
    const response = await api.delete(`/empleado/del/${id}`);
    return response.data;
  },

  // Buscar um papel por ID
  async getRolById(id) {
    const response = await api.get(`/rol/${id}`);
    return response.data;
  },
};