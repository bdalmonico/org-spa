
// import axios from 'axios';

// export const apiService = {
//   async getProyectoById(id) {
//     try {
//       const response = await axios.get(`/api/proyecto/${id}`); // Agora usa o proxy
//       return response.data;
//     } catch (error) {
//       console.error('Erro ao buscar projeto:', error);
//       return null;
//     }
//   },
//   async getTareaById(id) {
//     try {
//       const response = await axios.get(`/api/tarea/${id}`); // Agora usa o proxy
//       return response.data;
//     } catch (error) {
//       console.error('Erro ao buscar tarea:', error);
//       return null;
//     }
//   }
// };

import axios from 'axios';

export const apiService = {
  async getProyectoById(id) {
    try {
      const response = await axios.get(`/api/proyecto/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar projeto:', error);
      return null;
    }
  },
  async getProyectos() {
    try {
      const response = await axios.get('/api/proyecto'); // Ajuste a rota conforme necessário
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      return [];
    }
  }
};