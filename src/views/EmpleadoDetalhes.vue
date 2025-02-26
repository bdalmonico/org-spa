<template>
    <div class="empleado-detalhes">
      <h1>Detalhes do Empleado</h1>
      <div v-if="empleado">
        <p><strong>ID:</strong> {{ empleado.id }}</p>
        <p><strong>Nome:</strong> {{ empleado.nombre }}</p>
        <p><strong>Sobrenome:</strong> {{ empleado.apellido }}</p>
        <p><strong>Email:</strong> {{ empleado.email }}</p>
        <p><strong>Data de Alta:</strong> {{ empleado.fechaAlta }}</p>
        <p><strong>Rol ID:</strong> {{ empleado.rolId }}</p>
      </div>
      <p v-if="loading">Carregando...</p>
      <p v-if="error">{{ error }}</p>
      <button @click="$router.go(-1)">Voltar</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        empleado: null,
        loading: false,
        error: null,
      };
    },
    mounted() {
      this.fetchEmpleado();
    },
    methods: {
      async fetchEmpleado() {
        this.loading = true;
        this.error = null;
        const id = this.$route.params.id;
        try {
          const response = await axios.get(`/api/empleado/${id}`);
          this.empleado = response.data; // Retorna diretamente o EmpleadoDTO
        } catch (err) {
          this.error = 'Erro ao carregar o empleado: ' + err.message;
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .empleado-detalhes {
    padding: 2rem;
  }
  p {
    margin: 0.5rem 0;
  }
  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #555;
  }
  </style>