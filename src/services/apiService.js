import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/org-rest-api/v1';

export const apiService = {
  getProyecto(id) {
    return axios.get(`${API_BASE_URL}/proyecto/${id}`);
  },
  getProyectos() {
    return axios.get(`${API_BASE_URL}/proyecto`);
  },
  getTareas(proyectoId) {
    return axios.get(`${API_BASE_URL}/tarea?proyectoId=${proyectoId}`);
  }
};
